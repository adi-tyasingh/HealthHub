import React, { useEffect,useRef } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "../ui/button";
import { CaretSortIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Sidebar } from "../sidebar";
import { Message } from "ai/react";
import { getSelectedModel } from "@/lib/model-helper";
import { models } from "./models"; // Adjust the path according to your structure
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { RotateCcw, Settings, ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { set, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface ChatTopbarProps {
  setSelectedModel: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  chatId?: string;
  avatar?: string;
  name?: string;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
}

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  system_prompt: z.string().min(5, {
    message: "System prompt must be at least 5 characters.",
  }),
  first_msg: z.string().min(5, {
    message: "first message  must be at least 5 characters.",
  }),
  persona: z.string(),
});



export default function ChatTopbar({
  setSelectedModel,
  isLoading,
  chatId,
  name,
  avatar,
  messages,
  setMessages,
}: ChatTopbarProps) {
  const router = useRouter();
  const [currentModel, setCurrentModel] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  const [sheetOpen, setSheetOpen] = React.useState(false);

  const chatData = JSON.parse(localStorage.getItem("chat_" + chatId)) ? JSON.parse(localStorage.getItem("chat_" + chatId)) : null;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: chatData ? chatData.name : "",
      system_prompt: chatData ? chatData.messages[0].content : "",
      first_msg: chatData ? chatData.messages[1].content : "",
      persona: chatData ? chatData.persona : "",
    },
  });


  function onSubmit(values: z.infer<typeof formSchema>) {

    const newChatData = {
      name: values.username,
      avatar: avatar,
      persona: values.persona,
      messages: [
        { id: "1", role: "system", content: values.system_prompt },
        { id: "2", role: "assistant", content: values.first_msg },
      ],
    };
    localStorage.setItem("chat_" + chatId, JSON.stringify(newChatData));

    // Dispatch storage event so other components can react to changes
    window.dispatchEvent(new Event("storage"));

    toast.success("Settings updated successfully");
  }

  useEffect(() => {
    // Set the current model (if any)
    setCurrentModel(getSelectedModel());
  }, []);

  const handleResetChatSettings = () => {
    // Logic to reset chat settings
    console.log("Chat settings reset");
  };

  // useEffect(() => {
  //   const isInitialRender = useRef(true);
  
  //   if (isInitialRender.current) {
  //     // Skip effect on initial render
  //     isInitialRender.current = false;
  //     return;
  //   }
  
    
  //     console.log("msg", messages);
  //     const newChatData = {
  //       name: name,
  //       avatar: avatar,
  //       persona: "",
  //       messages: messages,
  //     };
  //     localStorage.setItem("chat_" + chatId, JSON.stringify(newChatData));
  
  //     // Dispatch storage event so other components can react to changes
  //     window.dispatchEvent(new Event("storage"));
  
  //     toast.success("Chat Reset successfully");
    
  // }, [open]);

 

  // function handleReset() {
  //   const chatMsg = JSON.parse(localStorage.getItem("chat_" + chatId)); 
  //   setMessages(chatMsg.messages.slice(0, 2));

    
  //   setOpen(prev=>!prev);
    
  // }

  
  return (
    <div className="w-full flex px-4 py-6 items-center  lg:justify-center ">
    
      <a href="/" className="md:hidden">
        <ArrowLeft size={24} />
      </a>

      
      <div className="flex justify-between items-center w-full">
        {/* Center-aligned Avatar and Name */}
        <div className="flex items-center px-4">
          <Avatar className="">
            <AvatarImage src={avatar} alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Label className="ml-6" htmlFor="terms">
            {name}
          </Label>
        </div>

        {/* Right-aligned Button */}
        <div className="flex space-x-4 items-center">
          <Button
            onClick={() => {
              setMessages([]);
            }}
            variant="ghost"
            className="flex justify-between w-full h-14 text-sm xl:text-lg font-normal items-center"
          >
            <RotateCcw size={18} className="shrink-0 w-4 h-4" />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings size={18} className="shrink-0 w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[1025px] sm:max-w-md w-full border-2 border-white p-6 overflow-scroll">
            
                <DialogHeader>
                  <DialogTitle>Edit Character</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when you're
                    done.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                  >
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Charcter Name</FormLabel>
                          <FormControl>
                            <Input placeholder="shadcn" {...field} />
                          </FormControl>
                          <FormDescription>Characters Name</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="system_prompt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>System Prompt</FormLabel>
                          <FormControl>
                            <Input placeholder="system_prompt" {...field} />
                          </FormControl>
                          <FormDescription>
                            This is your public display name.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="first_msg"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Message</FormLabel>
                          <FormControl>
                            <Input placeholder="shadcn" {...field} />
                          </FormControl>
                          <FormDescription>
                            This is first msg to be displayed.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  <FormField
                      control={form.control}
                      name="persona"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your</FormLabel>
                          <FormControl>
                            <Input placeholder="shadcn" {...field} />
                          </FormControl>
                          <FormDescription>your persona</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit">Save changes</Button>
                    </DialogFooter>
                  </form>
                </Form>
                {/* <DialogFooter>
                  <Button type="submit">Save changes</Button>
                </DialogFooter> */}
         
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
