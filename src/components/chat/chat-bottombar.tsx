"use client";

import React, { useEffect } from "react";
import { ChatProps } from "./chat";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "../ui/button";
import TextareaAutosize from "react-textarea-autosize";
import { motion, AnimatePresence } from "framer-motion";
import { Cross2Icon, ImageIcon, PaperPlaneIcon, StopIcon } from "@radix-ui/react-icons";
import { Mic, SendHorizonal } from "lucide-react";
import useSpeechToText from "@/app/hooks/useSpeechRecognition";
import { getSelectedModel } from "@/lib/model-helper";
import MultiImagePicker from "../image-embedder";
import useChatStore from "@/app/hooks/useChatStore";
import Image from "next/image";
import { Message, useChat } from "ai/react";
import { v4 as uuidv4 } from "uuid";
import { set } from "zod";
import { toast } from "sonner";

export default function ChatBottombar({
  messages,
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  error,
  stop,
  formRef,
  setInput,
  setMessages
}: ChatProps) {
  const isLoadingSubmit = useChatStore((state) => state.isLoadingSubmit);
  const setIsLoadingSubmit = useChatStore((state) => state.setIsLoadingSubmit);
  const [message, setMessage] = React.useState(input);
  const [isMobile, setIsMobile] = React.useState(false);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const base64Images = useChatStore((state) => state.base64Images);
  const setBase64Images = useChatStore((state) => state.setBase64Images);
  const env = process.env.NODE_ENV;

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkScreenWidth();

    // Event listener for screen width changes
    window.addEventListener("resize", checkScreenWidth);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
    
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  const { isListening, transcript, startListening, stopListening } =
    useSpeechToText({ continuous: true });

  const listen = () => {
    isListening ? stopVoiceInput() : startListening();
  };

  const stopVoiceInput = () => {
    setInput && setInput(transcript.length ? transcript : "");
    stopListening();
  };

  const handleListenClick = () => {
    listen();
  };

  const [selectedModel, setSelectedModel] = React.useState<string>(
    getSelectedModel()
  );

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (isLoading) {
      stopVoiceInput();
    }
  }, [isLoading]);

  // const apiHeaders = JSON.parse(process.env.NEXT_PUBLIC_API_HEADERS || '');

  // API request to the /chat/route POST endpoint
  const addMessage = (Message: any) => {
    messages.push(Message);
    window.dispatchEvent(new Event("storage"));
    setMessages([...messages]);
  };
  const handleImagePromptRequest = async () => {
    setIsLoadingSubmit(true);
    const previousMessages = messages
      .slice(0, -1)
      .map(message => message.content)
      .filter(content => !content.startsWith("https://") && !content.startsWith("data:None;base64,"));

    const messageData = {
      messages: [
        {
          role: "system",
          content: `You are an expert at creating information about medicine.
          `
        },
        {
          role: "user",
          content: `Create a Midjourney-style image prompt based on the following:
                General Background: "${messages[0].content}"
                Previous Messages (for context): "${previousMessages.join(", ")}"

                Target Message - this is the current scene you should represent in the image:
                "${messages[messages.length - 1].content}"
                
               `
        }
      ],
      model: selectedModel,
      keep_alive: "5m",
      stream: false,
    };

    try {
      // const response = await fetch('/api/backpro', {
      const apiUrl = process.env.NEXT_PUBLIC_CHAT_URL; //localStorage.getItem('api_url');
      if (!apiUrl) {
        throw new Error("API URL is not set in localStorage");
      }
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
           "Authorization": `Bearer ${process.env.NEXT_PUBLIC_API_KEY}` //${localStorage.getItem('api_key')}
        },
        body: JSON.stringify({
          model: localStorage.getItem('selectedModel'),// For Openrouter
          endpoint: 'chat',
          messages: messageData.messages,
          keep_alive: "5m",
          stream: false
        }),
      });

       const result = await response.json();
       const imagePrompt = result.choices[0].message.content;
      // // const imagePrompt = result.content;
      // // const imagePrompt = result.content;
      // console.log("AI Response: ", imagePrompt);
      // messages.push({ role: "assistant", content: result.message.content, id: React.useState(chatId) })
     
      // First API Call to generate the prompt
      const promptResponse = await fetch('/api/backpro', {
      // const promptResponse = await fetch('http://20.40.53.64:5000/predictions', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "inputs": imagePrompt
        })
        // body: JSON.stringify({
        //   "input": {
        //     prompt: imagePrompt,
        //     go_fast: true,
        //     num_outputs: 1,
        //     aspect_ratio: "1:1",
        //     output_format: "webp",
        //     output_quality: 80,
        //     disable_safety_checker: true,
        //   },
          
        // }),
      });
    
      if (!promptResponse.ok) {
        throw new Error(`Failed to generate prompt: ${promptResponse.statusText}`);
      }
      
      console.log(promptResponse);
      const promptResult = await promptResponse.json();
      console.log("Generated Prompt: ", promptResult);

        addMessage({ role: "assistant", content: promptResult, id:  uuidv4() })

      // messages.push({ id: uuidv4(), role: "assistant", content:"sdhfsjkfvvcxbcvbgdfgdcvbkjsfd"});
      
      window.dispatchEvent(new Event("storage"));
      setIsLoadingSubmit(false);
    
    } catch (error) {
      console.error("Error fetching image prompt: ", error);
      toast.error("Error occured in generating image ");
      setIsLoadingSubmit(false);
    }
  };

  return (
    <div className="p-4 pb-7 flex justify-between w-full items-center gap-2">
      <AnimatePresence initial={false}>
        <div className="w-full items-center flex relative gap-2">
          <div className="flex flex-col relative w-full bg-accent dark:bg-card rounded-lg">
            <div className="flex w-full">
              <form
                onSubmit={handleSubmit}
                className="w-full items-center flex relative gap-2"
              >
                <div className="absolute flex left-3 z-10">
                  {/* <MultiImagePicker
                    disabled={env === 'production'}
                    onImagesPick={(pickedImages) => {
                      setBase64Images(pickedImages);
                      handleImagePromptRequest(pickedImages); // Trigger API call on image pick
                    }}
                  /> */}
                  <Button
                    className="shrink-0 relative rounded-full hover:bg-blue-400/30 "
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={handleImagePromptRequest}
                  >
                    <ImageIcon className="w-5 h-5" />
                  </Button>
                </div>
                <TextareaAutosize
                  autoComplete="off"
                  value={
                    isListening ? (transcript.length ? transcript : "") : input
                  }
                  ref={inputRef}
                  onKeyDown={handleKeyPress}
                  onChange={handleInputChange}
                  name="message"
                  placeholder={
                    !isListening ? "Enter your prompt here" : "Listening"
                  }
                  className="max-h-24 px-14 bg-accent py-[22px] rounded-lg  text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 w-full flex items-center h-16 resize-none overflow-hidden dark:bg-card"
                />

                {!isLoadingSubmit ? (
                  <div className="flex absolute right-3 items-center">
                    {isListening ? (
                      <div className="flex">
                        <Button
                          className="shrink-0 relative rounded-full bg-blue-500/30 hover:bg-blue-400/30 "
                          variant="ghost"
                          size="icon"
                          type="button"
                          onClick={handleListenClick}
                          disabled={isLoadingSubmit}
                        >
                          <Mic className="w-5 h-5 " />
                          <span className="animate-pulse absolute h-[120%] w-[120%] rounded-full bg-blue-500/30" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        className="shrink-0 rounded-full"
                        variant="ghost"
                        size="icon"
                        type="button"
                        onClick={handleListenClick}
                        disabled={isLoadingSubmit}
                      >
                        <Mic className="w-5 h-5 " />
                      </Button>
                    )}
                    <Button
                      className="shrink-0 rounded-full"
                      variant="ghost"
                      size="icon"
                      type="submit"
                      disabled={isLoadingSubmit || !input.trim() || isListening}
                    >
                      <SendHorizonal className="w-5 h-5 " />
                    </Button>
                  </div>
                ) : (
                  <div className="flex absolute right-3 items-center">
                    <Button
                      className="shrink-0 rounded-full"
                      variant="ghost"
                      size="icon"
                      type="button"
                      disabled={true}
                    >
                      <Mic className="w-5 h-5 " />
                    </Button>
                    <Button
                      className="shrink-0 rounded-full"
                      variant="ghost"
                      size="icon"
                      type="submit"
                      onClick={(e) => {
                        e.preventDefault();
                        stop();
                      }}
                    >
                      <StopIcon className="w-5 h-5  " />
                    </Button>
                  </div>
                )}

              </form>
            </div>
            {base64Images && (
              <div className="flex px-2 pb-2 gap-2 ">
                {base64Images.map((image, index) => {
                  return (
                    <div key={index} className="relative bg-muted-foreground/20 flex w-fit flex-col gap-2 p-1 border-t border-x rounded-md">
                      <div className="flex text-sm">
                        <Image src={image} width={20}
                          height={20}
                          className="h-auto rounded-md w-auto max-w-[100px] max-h-[100px]" alt={""} />
                      </div>
                      <Button
                        onClick={() => {
                          const updatedImages = (prevImages: string[]) => prevImages.filter((_, i) => i !== index);
                          setBase64Images(updatedImages(base64Images));
                        }}
                        size='icon' className="absolute -top-1.5 -right-1.5 text-white cursor-pointer  bg-red-500 hover:bg-red-600 w-4 h-4 rounded-full flex items-center justify-center">
                        <Cross2Icon className="w-3 h-3" />
                      </Button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </AnimatePresence>
    </div>
  );
}
