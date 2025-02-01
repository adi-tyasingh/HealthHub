"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MoreHorizontal, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

export default function HistoryPage() {
  const [localChats, setLocalChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setLocalChats(getLocalChats());
    const handleStorageChange = () => {
      setLocalChats(getLocalChats());
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const getLocalChats = () => {
    const chats = Object.keys(localStorage).filter((key) =>
      key.startsWith("chat_")
    );
    if (!chats.length) setIsLoading(false);

    const chatObjects = chats.map((chat) => {
      const item = localStorage.getItem(chat);
      return item
        ? { chatId: chat, messages: JSON.parse(item) }
        : { chatId: "", messages: [] };
    });

    chatObjects.sort((a, b) => {
      const aDate = new Date(a.messages[0]?.createdAt);
      const bDate = new Date(b.messages[0]?.createdAt);
      return bDate.getTime() - aDate.getTime();
    });

    setIsLoading(false);
    return chatObjects;
  };

  const handleDeleteChat = (chatId: string) => {
    localStorage.removeItem(chatId);
    setLocalChats(getLocalChats());
  };

  const getAvatarUrl = (chatId: string) => {
    const avatarData = localStorage.getItem(chatId);
    if (avatarData) {
      try {
        const parsedData = JSON.parse(avatarData);
        return parsedData.avatar;
      } catch (error) {
        console.error("Error parsing avatar data:", error);
      }
    }
    return undefined;
  };

  const getName = (chatId: string) => {
    const avatarData = localStorage.getItem(chatId);
    if (avatarData) {
      try {
        const parsedData = JSON.parse(avatarData);
        return parsedData.name;
      } catch (error) {
        console.error("Error parsing avatar data:", error);
      }
    }
    return undefined;
  };

  const getLastChat = (chatId: string) => {
    const avatarData = localStorage.getItem(chatId);
    if (avatarData) {
      try {
        const parsedData = JSON.parse(avatarData);
        return parsedData.messages;
      } catch (error) {
        console.error("Error parsing avatar data:", error);
      }
    }
    return undefined;
  };

  return (
    <div className="flex  flex-col items-center">
        <div className="relative w-full flex items-center justify-center mt-4 p-6">
    {/* Left Arrow */}
    <a
      href="/"
      className="absolute left-4 flex items-center"
      aria-label="Go back"
    >
      <ArrowLeft />
    </a>

    {/* Title */}
    <h1 className="text-xl font-bold">Previous Chats</h1>
  </div>
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
      {isLoading ? (
          <p>Loading chats...</p>
        ) : (
            localChats.map(({ chatId, messages }) => (
                <div
                  key={chatId}
                  className="shadow rounded-lg p-4 flex flex-col gap-2 bg-gray-100 dark:bg-gray-800"
                >
                  {/* Link to the chat */}
                  <Link href={`/chat/${chatId.substr(5)}`} className="flex gap-4">
                    {/* Avatar Section */}
                    <Avatar className="flex-shrink-0 w-16 h-16">
                      <AvatarImage src={getAvatarUrl(chatId)} alt="Chat Avatar" />
                    </Avatar>
                    
                    {/* Chat Details */}
                    <div className="flex-1 overflow-hidden">
                      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {getName(chatId)}
                      </h2>
                      <p
                        className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-full"
                        title={
                          getLastChat(chatId)[getLastChat(chatId).length - 1]?.content ||
                          "Start a conversation"
                        }
                      >
                        {getLastChat(chatId)[getLastChat(chatId).length - 1]?.content ||
                          "Start a conversation"}
                      </p>
                    </div>
                  </Link>
              
                  {/* Dropdown for actions */}
                  <div className="flex justify-end mt-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost">
                          <MoreHorizontal size={20} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              className="flex gap-2 items-center text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={16} />
                              Delete Chat
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delete Chat?</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete this chat? This action cannot
                                be undone.
                              </DialogDescription>
                              <div className="flex justify-end gap-2">
                                <Button variant="outline">Cancel</Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => handleDeleteChat(chatId)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </DialogHeader>
                          </DialogContent>
                        </Dialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              )))
            }
              
    </div>
    </div>
  );
}
