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
  dangerouslyAllowBrowser: true,
});

const ChatComponent: React.FC<{ chatId: String }> = () => {
  const { messages, input, handleInputChange, isLoading, error, stop, setMessages, setInput } = useChat();

  const isLoadingSubmit = useChatStore((state) => state.isLoadingSubmit);
  const setIsLoadingSubmit = useChatStore((state) => state.setIsLoadingSubmit);

  const [chatId, setChatId] = useState<string>("");
  const [patientData, setPatientData] = useState<any>(null);
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
        `You are a doctor's assistant, your task is to collect information about symptoms from a patient.\n` +
        `Use the following series of questions to get the required information. \n` +
        `1. How are you feeling today? \n` +
        `2. What are your symptoms?\n` +
        `3. Ask the severity of each of the symptoms! \n` +
        `4. How long have you been experiencing these symptoms? \n` +
        `5. Have you consumed any substances recently? \n` +
        `6. Ask relevant follow-up questions based on the symptoms described. \n` +
        `If you have extracted the relevant information, return a message with just the text EXTRACTION-COMPLETED.`;
      const firstMessageText = "How are you feeling today?";

      const initialMessages = [
        { id: uuidv4(), role: "system", content: systemMessageText },
        { id: uuidv4(), role: "assistant", content: firstMessageText },
      ];

      if (chatId) {
        localStorage.setItem(
          `chat_${chatId}`,
          JSON.stringify({ messages: initialMessages })
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

  const extractJSON = async () => {
    while (patientData == null) {
      const response = await openai.chat.completions.create({
        model,
        messages: [
          ...messages.map(msg => ({
            role: msg.role as "system" | "assistant" | "user",
            content: msg.content,
          })),
          {
            role: "user",
            content: `Based on the following conversation, extract the patient information in the following JSON structure. Ensure the response contains only JSON and no additional text.\n` +
              `{
                "Symptoms": {
                  "symptom1": "intensity",
                  "symptom2": "intensity"
                },
                "Duration": "string",
                "consumed_substances": false,
                "Notes": [
                  "note1",
                  "note2"
                ]
              }`
          },
        ]
      });

      const jsonResponse = response?.choices?.[0]?.message?.content?.trim();
      console.log(jsonResponse);
      if (jsonResponse) {
        const jsonStartIndex = jsonResponse.indexOf('{');
        const jsonEndIndex = jsonResponse.lastIndexOf('}') + 1;

        if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
          const jsonString = jsonResponse.substring(jsonStartIndex, jsonEndIndex);
          const parsedData = JSON.parse(jsonString);
          setPatientData(parsedData);
          break;
        }
      }
    }
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

      const assistantMessage = response?.choices[0]?.message?.content || "No response";

      if (assistantMessage.includes("EXTRACTION-COMPLETED")) {
        await extractJSON();
        addMessage({ role: "assistant", content: "I have the necessary information!", id: uuidv4() });
      } else {
        addMessage({ role: "assistant", content: assistantMessage, id: uuidv4() });
      }

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

    addMessage({ role: "user", content: input, id: uuidv4() });
    setInput("");

    handleAPICall(input);
    setBase64Images(null);
  };

  if (patientData != null) {
    return (
      <div className="flex h-[calc(100dvh)] flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Book Appointment</h1>
        <div className="p-4 bg-gray-100 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-2">Patient Information</h2>
          <pre>{JSON.stringify(patientData, null, 2)}</pre>
        </div>
      </div>
    );
  } else {
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
  }
};

export default ChatComponent; 
