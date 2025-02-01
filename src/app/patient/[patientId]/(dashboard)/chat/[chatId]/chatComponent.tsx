"use client";

import { ChatLayout } from "@/components/chat/chat-layout";
import { Message, useChat } from "ai/react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import useChatStore from "@/app/hooks/useChatStore";
import { v4 as uuidv4 } from "uuid";
import OpenAI from "openai";

const model = "gpt-4o";
const apiKey = "86fea170c65341bc9efa5b647e210f45";
const openai = new OpenAI({
  apiKey,
  baseURL: `https://viresh-v2.openai.azure.com/openai/deployments/${model}`,
  defaultQuery: { "api-version": "2023-12-01-preview" },
  defaultHeaders: { "api-key": apiKey },
  dangerouslyAllowBrowser: true
});



const ChatComponent: React.FC<{ chatId: String }> = (
) => {
  const { messages, input, handleInputChange, isLoading, error, stop, setMessages, setInput } =
    useChat();


  const isLoadingSubmit = useChatStore((state) => state.isLoadingSubmit);
  const setIsLoadingSubmit = useChatStore((state) => state.setIsLoadingSubmit);

  const [chatId, setChatId] = useState<string>("");
  const formRef = React.useRef<HTMLFormElement>(null);
  const setBase64Images = useChatStore((state) => state.setBase64Images);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedChat = localStorage.getItem(`chat_${chatId}`);
    if (storedChat) {
      const parsedChat = JSON.parse(storedChat);
      setMessages(parsedChat.messages || []);
    } else {
      const systemMessageText =
       "System: Chat initialized";
      const firstMessageText =
       "Hello, how can I assist you today?";

      const initialMessages = [
        { id: uuidv4(), role: "system", content: systemMessageText },
        { id: uuidv4(), role: "assistant", content: firstMessageText },
      ];

      if (chatId) {
        localStorage.setItem(
          `chat_${chatId}`,
          JSON.stringify({
          
            messages: initialMessages,
          })
        );
        window.dispatchEvent(new Event("storage"));
      }
      setMessages(initialMessages);
    }
  }, [chatId, setMessages]);

  const addMessage = (message: Message) => {
    setMessages((prev) => {
      const updatedMessages = [...prev, message];
      if (typeof window !== "undefined") {
        const existingData = JSON.parse(
          localStorage.getItem(`chat_${chatId}`) || "{}"
        );

        localStorage.setItem(
          `chat_${chatId}`,
          JSON.stringify({ ...existingData, messages: updatedMessages })
        );
        window.dispatchEvent(new Event("storage"));
      }
      return updatedMessages;
    });
  };

  const handleAPICall = async (userMessage: string) => {
    try {
      const allMessages = messages.map((msg) => ({
        role: msg.role as "system" | "assistant" | "user",
        content: msg.content,
      }));

      allMessages.push({ role: "user", content: userMessage });

      const response = await openai.chat.completions.create({
        model,
        stream: false,
        messages: allMessages,
      });

      const assistantMessage =
        response?.choices[0]?.message?.content || "No response";

      addMessage({ role: "assistant", content: assistantMessage, id: chatId });
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoadingSubmit(true);
    if (!input) return;

    addMessage({ role: "user", content: input, id: chatId });
    setInput("");

    handleAPICall(input);
    setBase64Images(null);
  };

  // useEffect(() => {
  //   if (!chatId) {
  //     setChatId(characterId);
  //   }
  // }, [characterId, chatId]);

  return (
    <main className="flex h-[calc(100dvh)] flex-col items-center">
      <ChatLayout
        chatId={chatId}
        setSelectedModel={() => {}}
        messages={messages}
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={onSubmit}
        isLoading={isLoading}
        loadingSubmit={loadingSubmit}
        error={error}
        stop={stop}
        navCollapsedSize={10}
        defaultLayout={[30, 160]}
        formRef={formRef}
        setMessages={setMessages}
        setInput={setInput}
      />
    </main>
  );
};

export default ChatComponent;