"use client";

import { ChatLayout } from "@/components/chat/chat-layout";
import { Message, useChat } from "ai/react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import useChatStore from "../../hooks/useChatStore";
import { v4 as uuidv4 } from "uuid";

const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;

interface CharacterData {
  data: {
    name: string;
    description: string;
    personality: string;
    scenario: string;
    system_prompt: string;
    first_mes: string;
    avatar: string;
    tags: string[];
    extensions: {
      chub: {
        full_path: string;
      };
    };
  };
}

const ChatComponent: React.FC<{ characterData: CharacterData }> = ({
  characterData,
}) => {
  const { messages, input, handleInputChange, isLoading, error, stop, setMessages, setInput } =
    useChat();

  const characterId = characterData.data.extensions.chub.full_path;
  const isLoadingSubmit = useChatStore((state) => state.isLoadingSubmit);
  const setIsLoadingSubmit = useChatStore((state) => state.setIsLoadingSubmit);

  const [chatId, setChatId] = React.useState<string>("");
  const formRef = React.useRef<HTMLFormElement>(null);
  const base64Images = useChatStore((state) => state.base64Images);
  const setBase64Images = useChatStore((state) => state.setBase64Images);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedChat = localStorage.getItem(`chat_${chatId}`);
    if (storedChat) {
      const parsedChat = JSON.parse(storedChat);
      setMessages(parsedChat.messages || []);
    } else {
      // Initialize with default messages
      const systemMessageText =
        characterData.data.description || "System: Chat initialized";
      const firstMessageText =
        characterData.data.first_mes || "Hello, how can I assist you today?";

      const initialMessages = [
        { id: uuidv4(), role: "system", content: systemMessageText },
        { id: uuidv4(), role: "assistant", content: firstMessageText },
      ];

      const chatData = {
        name: characterData.data.name,
        avatar: characterData.data.avatar,
        persona:"",
        messages: initialMessages,
      };
      if(chatId){

        localStorage.setItem(`chat_${chatId}`, JSON.stringify(chatData));
        window.dispatchEvent(new Event("storage"));
      }
      setMessages(initialMessages);
    }
  }, [chatId, setMessages, characterData.data]);

  useEffect(() => {
    if (typeof window === "undefined" || !chatId) return;

    const item = localStorage.getItem(`chat_${chatId}`);
    if (item) {
      const parsedItem = JSON.parse(item);
      setMessages(parsedItem.messages || []);
    }
  }, [chatId, setMessages]);

  const addMessage = (message: Message) => {
    setMessages((prev) => {
      const updatedMessages = [...prev, message];
      if (typeof window !== "undefined") {
        const existingData = JSON.parse(localStorage.getItem(`chat_${chatId}`) || "{}");

        const updatedData = {
          ...existingData,
          messages: updatedMessages,
        };

        localStorage.setItem(`chat_${chatId}`, JSON.stringify(updatedData));
        window.dispatchEvent(new Event("storage"));
      }
      return updatedMessages;
    });
  };

  const handleAPICall = async (userMessage: string) => {
    try {
      const allMessages = messages
        .filter((msg) => !msg.content.startsWith("data:image/"))
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

      allMessages.push({ role: "user", content: userMessage });

      const apiUrl = localStorage.getItem("api_url");
      if (!apiUrl) throw new Error("API URL is not set");
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${
            localStorage.getItem("api_key") || process.env.NEXT_PUBLIC_API_KEY
          }`,
        },
        body: JSON.stringify({
          model: localStorage.getItem("selectedModel"),
          messages: allMessages,
          repetition_penalty: parseFloat(
            localStorage.getItem("repetition_penalty") || "0.9"
          ),
          temperature: parseFloat(localStorage.getItem("temperature") || "0"),
          max_tokens: parseInt(localStorage.getItem("max_tokens") || "250"),
          top_p: parseFloat(localStorage.getItem("top_p") || "0.9"),
          keep_alive: "5m",
          stream: false,
        }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      const assistantMessage =
        data?.choices[0]?.message?.content || "No response";

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

  useEffect(() => {
    if (!chatId) {
      setChatId(characterId);
    }
  }, [characterId, chatId]);

  return (
    <main className="flex h-[calc(100dvh)] flex-col items-center">
      <ChatLayout
        chatId={chatId}
        setSelectedModel={() => {}}
        messages={messages}
        name={characterData.data.name}
        avatar={characterData.data.avatar}
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
