import { Message, useChat } from "ai/react";
import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ChatProps } from "./chat";
import Image from "next/image";
import CodeDisplayBlock from "../code-display-block";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { INITIAL_QUESTIONS } from "@/utils/initial-questions";
import { Button } from "../ui/button";
import useChatStore from "@/app/hooks/useChatStore";
import { FolderSync, Pencil, RefreshCcw, StopCircle, Volume2 } from "lucide-react";
import { toast } from "sonner";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { set } from "lodash";
export default function ChatList({
  chatId,
  messages,
  input,
  avatar,
  handleInputChange,
  handleSubmit,
  isLoading,
  error,
  stop,
  loadingSubmit,
  formRef,
  isMobile,
  setMessages,
}: ChatProps) {

  
  
  
  const isLoadingSubmit = useChatStore((state) => state.isLoadingSubmit);
  const setIsLoadingSubmit = useChatStore((state) => state.setIsLoadingSubmit);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [name, setName] = React.useState<string>("");
  const [localStorageIsLoading, setLocalStorageIsLoading] =
    React.useState(true);
  const [initialQuestions, setInitialQuestions] = React.useState<Message[]>([]);
  const [isSpeaking, setIsSpeaking] = React.useState(false);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const username = localStorage.getItem("ollama_user");
    if (username) {
      setName(username);
      setLocalStorageIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch 4 initial questions
    if (messages.length === 0) {
      const questionCount = isMobile ? 2 : 4;

      setInitialQuestions(
        INITIAL_QUESTIONS.sort(() => Math.random() - 0.5)
          .slice(0, questionCount)
          .map((message) => {
            return {
              id: "1",
              role: "user",
              content: message.content,
            };
          })
      );
    }
  }, [isMobile]);

  const onClickQuestion = (value: string, e: React.MouseEvent) => {
    e.preventDefault();

    handleInputChange({
      target: { value },
    } as React.ChangeEvent<HTMLTextAreaElement>);

    setTimeout(() => {
      formRef.current?.dispatchEvent(
        new Event("submit", {
          cancelable: true,
          bubbles: true,
        })
      );
    }, 1);
  };
    

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
    window.dispatchEvent(new Event("storage"));
  };

  // console.log("chatId  in chatlist",chatId)
  const handleAPICall = async (userMessage: string) => {

    try {
      // Prepare all messages to send, including historical messages
      const allMessages = messages
        .filter((msg) => !msg.content.startsWith("https://"))
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

      // Add the new user message
      allMessages.push({ role: "user", content: userMessage });
      // const response = await fetch("/api/backpro", {
      const response = await fetch( localStorage.getItem('api_url'), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('api_key')}`,
        },
        body: JSON.stringify({
          model: localStorage.getItem('selectedModel'),
          endpoint: "chat", // Pass the endpoint information
          messages: allMessages, // Your other data (in case of chat)
          keep_alive: "5m",
          stream: false,
        }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      const assistantMessage = data?.choices[0]?.message?.content || "No response";
      // const assistantMessage = data?.content || "No response";
      console.log(chatId);
      if (!chatId) {
        console.log("chatId is null in chatlist");
      }

      addMessage({ role: "assistant", content: assistantMessage, id: chatId! });
      // setMessages((prev : ) => [...prev]);
      localStorage.setItem(`chat_${chatId}`, JSON.stringify(messages));
      window.dispatchEvent(new Event("storage"));
      setIsLoadingSubmit(false);
      // setLoadingSubmit  to false   here
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      setIsLoadingSubmit(false);
    }
  };

  const handleRegenrate = (index: number) => {
    setIsLoadingSubmit(true);
    const messagesToKeep = messages.slice(0, index + 1);
    setMessages([...messagesToKeep]);
    console.log("Regenerating from messages:", messagesToKeep);
    handleAPICall(messagesToKeep[messagesToKeep.length - 1].content);
  };  


  const handleTTS = async (index:number,state:boolean) => {
    const sdk = require("microsoft-cognitiveservices-speech-sdk");
    // Subscription configuration
    const speechConfig = sdk.SpeechConfig.fromSubscription("3fe0de3df3c14cbbb5bc1cecc3c78465", "swedencentral");
    speechConfig.speechSynthesisVoiceName = "en-US-DavisNeural";
  
    // Use default speaker output to play audio in the browser
    const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput();
  
    // Create the synthesizer and set it to state for access in handleStopTTS
    const newSynthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);
  
  
    // Start synthesis
    if(state){
      setIsSpeaking(true);

      newSynthesizer.speakTextAsync(
        messages[index+1].content,
        (result) => {
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          console.log("Synthesis finished.");
        } else {
          console.error("Speech synthesis canceled: " + result.errorDetails);
        }
        newSynthesizer.close();
         // Clear synthesizer after synthesis is done
        // setIsSpeaking(false);
        
      },
      (err) => {
          console.trace("Error - " + err);
       
          newSynthesizer.close();
          setIsSpeaking(false);
        
        
      }
    );
    }
    else{
      newSynthesizer.close();

      setIsSpeaking(false);
    }
  
    console.log("Synthesizing to browser output...");

  };
  
  const handleStopTTS = () => {
    // console.log("handleStopTTS");
    // Stop any ongoing synthesis
     // Clear the synthesizer instance
      setIsSpeaking(false); // Set isSpeaking to false as it is stopped
      console.log("Synthesis stopped.");

  };
  // messages.map((m) => console.log(m.experimental_attachments))

  if (messages.length === 0) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="relative flex flex-col gap-4 items-center justify-center w-full h-full">
          <div></div>
          <div className="flex flex-col gap-4 items-center">
            <Image
              src="/ollama.png"
              alt="AI"
              width={60}
              height={60}
              className="h-20 w-14 object-contain dark:invert"
            />
            <p className="text-center text-lg text-muted-foreground">
              How can I help you today?
            </p>
          </div>

          <div className="absolute bottom-0 w-full px-4 sm:max-w-3xl grid gap-2 sm:grid-cols-2 sm:gap-4 text-sm">
            {/* Only display 4 random questions */}
            {initialQuestions.length > 0 &&
              initialQuestions.map((message) => {
                const delay = Math.random() * 0.25;

                return (
                  <motion.div
                    initial={{ opacity: 0, scale: 1, y: 10, x: 0 }}
                    animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                    exit={{ opacity: 0, scale: 1, y: 10, x: 0 }}
                    transition={{
                      opacity: { duration: 0.1, delay },
                      scale: { duration: 0.1, delay },
                      y: { type: "spring", stiffness: 100, damping: 10, delay },
                    }}
                    key={message.content}
                  >
                    <Button
                      key={message.content}
                      type="button"
                      variant="outline"
                      className="sm:text-start px-4 py-8 flex w-full justify-center sm:justify-start items-center text-sm whitespace-pre-wrap"
                      onClick={(e) => onClickQuestion(message.content, e)}
                    >
                      {message.content}
                    </Button>
                  </motion.div>
                );
              })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id="scroller"
      className="w-full overflow-y-scroll overflow-x-hidden h-full justify-end"
    >
      <div className="w-full flex flex-col overflow-x-hidden overflow-y-hidden min-h-full justify-end">
        {messages.map((message, index) => (
          <div key={index}>
            <motion.div
              
              layout
              initial={{ opacity: 0, scale: 1, y: 20, x: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 1, y: 20, x: 0 }}
              transition={{
                opacity: { duration: 0.1 },
                layout: {
                  type: "spring",
                  bounce: 0.3,
                  duration: messages.indexOf(message) * 0.05 + 0.2,
                },
              }}
              className={cn(
                "flex flex-col gap-2 p-4 whitespace-pre-wrap",
                message.role === "user" ? "items-end" : "items-start"
              )}
            >
              <div className="flex gap-3 items-center">
                {message.role === "user" && (
                  <div className="flex items-end gap-3">
                    <div className="flex flex-col gap-2 bg-accent p-3 rounded-md max-w-xs sm:max-w-2xl overflow-x-auto">
                      <div className="flex gap-2">
                        {message.experimental_attachments
                          ?.filter((attachment) =>
                            attachment.contentType?.startsWith("image/")
                          )
                          .map((attachment, index) => (
                            <Image
                              key={`${message.id}-${index}`}
                              src={attachment.url}
                              width={200}
                              height={200}
                              alt="attached image"
                              className="rounded-md object-contain"
                            />
                          ))}
                      </div>
                      <p className="text-end">{message.content}</p>
                    </div>
                    <Avatar className="flex justify-start items-center overflow-hidden">
                      <AvatarImage
                        src="/"
                        alt="user"
                        width={6}
                        height={6}
                        className="object-contain"
                      />
                      <AvatarFallback>
                        {name && name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}
                {message.role === "assistant" && (
                  <div className="flex items-end gap-2">
                    <Avatar className="flex justify-start items-center">
                      <img
                        src={avatar}
                        alt="AI"
                        width={40}
                        height={40}
                        className="object-contain  rounded-full"
                      />
                    </Avatar>
                    <span className="bg-accent p-3 rounded-md max-w-xs sm:max-w-2xl overflow-x-auto">
                      {message.content.split("\n").map((part, index) => {
                        // Check if the part is a base64 image string
                        if (part.startsWith("data:None;base64") || part.startsWith("https://")) {
                          return (
                            <img
                              key={index}
                              src={part}
                              alt="Base64 image"
                              className="max-w-full rounded-md"
                            />
                          );
                        } else if (index % 2 === 0) {
                          return (
                            <Markdown key={index} remarkPlugins={[remarkGfm]}>
                              {part}
                            </Markdown>
                          );
                        } else {
                          return (
                            <pre className="whitespace-pre-wrap" key={index}>
                              {/* <CodeDisplayBlock code={part} lang="" /> */}
                            </pre>
                          );
                        }
                      })}
                      {isLoading &&
                        messages.indexOf(message) === messages.length - 1 && (
                          <span className="animate-pulse" aria-label="Typing">
                            ...
                          </span>
                        )}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {messages[messages.length - 1].role === "assistant" &&
              index === messages.length - 1 &&
              messages.length > 3 && (
                <div className="flex justify-evenly">
                  <Button
                    onClick={() => handleRegenrate(index - 1)}
                    title="Regenerate response"
                    className="bg-transparent hover:bg-accent-200 dark:hover:bg-accent-700 text-accent-700 dark:text-accent-300 font-semibold hover:text-white py-2 px-4 hover:bg-stone-700  rounded-xl"
                  >
                    <RefreshCcw size={18} />
                  </Button>
                    
                     {isSpeaking ? (
                      <Button
                      onClick={() => handleTTS(index-1,false)}
                        title="Stop Text-to-Speech"
                        className="bg-transparent hover:bg-accent-200 dark:hover:bg-accent-700 text-accent-700 dark:text-accent-300 font-semibold hover:text-white py-2 px-4 hover:bg-stone-700 rounded-xl"
                      >
                        <StopCircle size={18} />
                      </Button>
                    ):(
                      <Button
                      className=" bg-transparent hover:bg-accent-200 dark:hover:bg-accent-700 text-accent-700 dark:text-accent-300 font-semibold hover:text-white py-2 px-4 hover:bg-stone-700  rounded-xl"
                    
                      onClick={() => handleTTS(index-1,true)}
                      >
                        <Volume2 size={18} />
                      </Button >
                    )}
                </div>
              )}

            {messages[messages.length - 2].role === "user" &&
              index === messages.length - 2 &&
              messages.length >2 && (
                  <Button className="bg-transparent hover:bg-accent-200 dark:hover:bg-accent-700 text-accent-700 dark:text-accent-300 font-semibold hover:text-white py-2 px-4 hover:bg-stone-700  rounded-xl">
                    <Pencil size={18} />
                  </Button>
              )}
          </div>
        ))}
        {isLoadingSubmit && (
          <div className="flex pl-4 pb-4 gap-2 items-center">
            <Avatar className="flex justify-start items-center">
              <AvatarImage
                src="/ollama.png"
                alt="AI"
                width={6}
                height={6}
                className="object-contain dark:invert"
              />
            </Avatar>
            <div className="bg-accent p-3 rounded-md max-w-xs sm:max-w-2xl overflow-x-auto">
              <div className="flex gap-1">
                <span className="size-1.5 rounded-full bg-slate-700 motion-safe:animate-[bounce_1s_ease-in-out_infinite] dark:bg-slate-300"></span>
                <span className="size-1.5 rounded-full bg-slate-700 motion-safe:animate-[bounce_0.5s_ease-in-out_infinite] dark:bg-slate-300"></span>
                <span className="size-1.5 rounded-full bg-slate-700 motion-safe:animate-[bounce_1s_ease-in-out_infinite] dark:bg-slate-300"></span>
              </div>
            </div>
          </div>
        )}
      </div>
      <div id="anchor" ref={bottomRef}></div>
    </div>
  );
}
