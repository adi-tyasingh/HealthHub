"use client";

import Link from "next/link";
import { MoreHorizontal, ApertureIcon, Trash2, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";
import SidebarSkeleton from "./sidebar-skeleton";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import UserSettings from "./user-settings";
import { useLocalStorageData } from "@/app/hooks/useLocalStorageData";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ScrollArea } from "./ui/scroll-area";

export function Sidebar({
  messages,
  isCollapsed,
  isMobile,
  chatId,
  setMessages,
  // closeSidebar,
}) {
  const [localChats, setLocalChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (chatId) {
      setSelectedChatId(chatId);
    }
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

  let avatarUrl: string | undefined;
  const avatarData = localStorage.getItem(`chat_${chatId}`);
  if (avatarData) {
    try {
      const parsedAvatarData = JSON.parse(avatarData);
      // console.log("Avatar:", parsedAvatarData.avatar);
      avatarUrl = parsedAvatarData.avatar;
    } catch (error) {
      console.error("Error parsing avatar data:", error);
    }
  }

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
  // console.log(messages[1].role);

  return (
  <div className="relative flex flex-col h-full ">
    {/* Top Section: Back to Home & Reset Chat */}
    <div className="flex flex-col gap-4 p-2 border rounded">
      <Button
        onClick={() => {
          window.location.href = "/";
        }}
        variant="ghost"
        className="flex justify-between w-full h-14 text-sm xl:text-lg font-normal items-center"
      >
        <div className="flex gap-3 items-center">
        <ArrowLeft size={22} />
          {!isCollapsed && !isMobile && <p>Explore characters</p>}
        </div>
      </Button>
    </div>

    {/* Chats Section */}
    <div className="flex-1 overflow-auto pb-20"> {/* Add padding-bottom */}
      <div className="flex flex-col gap-2 overflow-scroll mt-2">
          <p className="px-4 text-xs text-muted-foreground">All chats</p>
          {isLoading && <SidebarSkeleton />}
          {localChats.map(({ chatId, messages }, index) => (
            <Link
              key={index}
              href={`/chat/${chatId.substr(5)}`}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800",
                chatId.substring(5) === selectedChatId &&
                  "bg-gray-200 dark:bg-gray-700"
              )}
            >
              <Avatar className="flex-shrink-0 w-10 h-10">
                <AvatarImage src={getAvatarUrl(chatId)} alt="@shadcn" />
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {getName(chatId)}
                </p>
                <p className="text-xs text-muted-foreground truncate max-w-[105px]">
                  {getLastChat(chatId)[getLastChat(chatId).length - 1]
                    ?.content || "Start a conversation"}
                </p>
              </div>
              <div className="flex-shrink-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex justify-end items-center"
                    >
                      <MoreHorizontal size={15} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full flex gap-2 hover:text-red-500 text-red-500 justify-start items-center"
                        >
                          <Trash2 size={15} />
                          Delete chat
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete chat?</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete this chat? This
                            action cannot be undone.
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
            </Link>
          ))}

      </div>
    </div>

    {/* Bottom Section: User Settings */}
    <div className="sticky bottom-0   border-t ">
      <UserSettings />
    </div>
  </div>
);

}
