"use client";

import { set, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import React, { useEffect, useState } from "react";
import { ModeToggle } from "./mode-toggle";
import { ProviderToggle } from "./provider-toggle";
import { toast } from "sonner";
import { models } from "./chat/models";
import { CaretSortIcon } from "@radix-ui/react-icons";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  apiUrl: z
    .string()
    .min(5, {
      message: "API URL must be at least 5 characters.",
    })
    .regex(/^https?:\/\/.+/, {
      message: "API URL must start with http:// or https://",
    }),
  apiKey: z.string().min(5, {
    message: "API Key must be at least 5 characters.",
  }),
  repetition_penalty: z.number().min(0.5).max(2.0),
  temperature: z.number().min(0.0).max(1.0),
  max_tokens: z.number().min(1).max(2048),
  top_p: z.number().min(0).max(1),
});

interface EditUsernameFormProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function EditUsernameForm({ setOpen }: EditUsernameFormProps) {
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [apiUrl, setApiUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [open, setOpening] = React.useState(false);

  const [repetitionPenalty, setRepetitionPenalty] = useState(0.9);
  const [temperature, setTemperature] = useState(0.0);
  const [maxTokens, setMaxTokens] = useState(250);
  const [topP, setTopP] = useState(0.9);
  const [currentModel, setCurrentModel] = React.useState<string | null>(null);

  const model = localStorage.getItem("selectedModel");

  useEffect(() => {
    setCurrentModel(model);
  }, [model]);

  useEffect(() => {
    // Fetch values from localStorage if available
    const savedName = localStorage.getItem("ollama_user") || "Anonymous";
    const savedApiUrl = localStorage.getItem("api_url") || "";
    const savedApiKey = localStorage.getItem("api_key") || "";
    const savedRepetitionPenalty = parseFloat(
      localStorage.getItem("repetition_penalty") || "0.9"
    );
    const savedTemperature = parseFloat(
      localStorage.getItem("temperature") || "0"
    );
    const savedMaxTokens = parseInt(
      localStorage.getItem("max_tokens") || "250"
    );
    const savedTopP = parseFloat(localStorage.getItem("top_p") || "0.9");

    setName(savedName);
    setApiUrl(savedApiUrl);
    setApiKey(savedApiKey);
    setRepetitionPenalty(savedRepetitionPenalty);
    setTemperature(savedTemperature);
    setMaxTokens(savedMaxTokens);
    setTopP(savedTopP);
    setLoading(false); // Ensure the form only renders after values are fetched
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: name,
      apiUrl: apiUrl,
      apiKey: apiKey,
      repetition_penalty: repetitionPenalty,
      temperature: temperature,
      max_tokens: maxTokens,
      top_p: topP,
    },
  });

  const provider = localStorage.getItem("selectedProvider");

  useEffect(() => {
    // Fetch updated values from localStorage when provider changes
    const updatedApiUrl = localStorage.getItem("api_url") || "";
    const updatedApiKey = localStorage.getItem("api_key") || "";
    const updatedRepetitionPenalty = parseFloat(
      localStorage.getItem("repetition_penalty") || "0.9"
    );
    const updatedTemperature = parseFloat(
      localStorage.getItem("temperature") || "0"
    );
    const updatedMaxTokens = parseInt(
      localStorage.getItem("max_tokens") || "250"
    );
    const updatedTopP = parseFloat(localStorage.getItem("top_p") || "0.9");

    // Update state with the new values
    setApiUrl(updatedApiUrl);
    setApiKey(updatedApiKey);
    setRepetitionPenalty(updatedRepetitionPenalty);
    setTemperature(updatedTemperature);
    setMaxTokens(updatedMaxTokens);
    setTopP(updatedTopP);

    // Reset form values with the updated state
    form.reset({
      username: name, // Ensure `name` is still correct
      apiUrl: updatedApiUrl,
      apiKey: updatedApiKey,
      repetition_penalty: updatedRepetitionPenalty,
      temperature: updatedTemperature,
      max_tokens: updatedMaxTokens,
      top_p: updatedTopP,
    });
  }, [provider, form, name]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Save values to localStorage and notify the user
    localStorage.setItem("ollama_user", values.username);
    localStorage.setItem("api_url", values.apiUrl);
    localStorage.setItem("api_key", values.apiKey);
    localStorage.setItem(
      "repetition_penalty",
      String(values.repetition_penalty)
    );
    localStorage.setItem("temperature", String(values.temperature));
    localStorage.setItem("max_tokens", String(values.max_tokens));
    localStorage.setItem("top_p", String(values.top_p));

    // Dispatch storage event so other components can react to changes
    window.dispatchEvent(new Event("storage"));

    toast.success("Settings updated successfully");
    setOpen(false);
  }

  const handleModelChange = (modelName: string) => {
    const selectedModel = models.find((model) => model.name === modelName);

    if (selectedModel) {
      setCurrentModel(modelName);
      // setSelectedModel(modelName);

      // Update localStorage with system_message and first_message
      // localStorage.setItem("system_message", selectedModel.system_message);
      // localStorage.setItem("first_message", selectedModel.first_message);
      localStorage.setItem("selectedModel", modelName);

      if (localStorage.getItem("selectedProvider") === "huggingface") {
        localStorage.setItem(
          "api_url",
          `https://api-inference.huggingface.co/models/${modelName}/v1/chat/completions`
        );
      }

      // if(!localStorage.getItem("chat_"+modelName) ) {

      //  if( window.location.pathname==='/'){
      //   window.location.reload();
      //  }
      //  else{
      //   router.push('/');
      //  }
      // }
      // else{
      //   router.push(`/${modelName}`);
      // }
    }

    setOpen(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  // console.log(currentModel)

  return (
    <div
      aria-describedby="form-description"
      className=" overflow-scroll max-h-[400px] p-4 "
    >
      <Form {...form}>
        <div className="w-full flex flex-col gap-4 pt-8">
          <FormLabel>Theme</FormLabel>
          <ModeToggle />
        </div>
        <div className="w-full flex flex-col gap-4 pt-8">
          <FormLabel>Provider</FormLabel>
          <ProviderToggle />
        </div>
        <div className="w-full flex flex-col gap-4 pt-8 overflow-scroll max-h-[300px] p-1">
          <FormLabel>Model</FormLabel>
          <Popover open={open} onOpenChange={setOpening}>
            <PopoverTrigger asChild>
              <Button
                // disabled={isLoading}
                variant="outline"
                role="combobox"
                // aria-expanded={open}
                className="w-full justify-between"
              >
                {currentModel || "Select model"}
                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[400px] p-1 max-h overflow-y-auto"
              align="center"
              side="bottom"
            >
              {models.length > 0 ? (
                models.filter((model) => model.provider === "huggingface") // Filters for 'huggingface' provider
                  .length > 0 ? ( // Check if there are any models after filtering
                  models
                    .filter(
                      (model) =>
                        model.provider ===
                          localStorage.getItem("selectedProvider") ||
                        "huggingface"
                    )
                    .map((model) => (
                      <Button
                        key={model.name}
                        variant="ghost"
                        className="w-full"
                        onClick={() => handleModelChange(model.name)}
                      >
                        {model.name}
                      </Button>
                    ))
                ) : (
                  <Button variant="ghost" disabled className="w-full">
                    No models available for Huggingface provider
                  </Button>
                )
              ) : (
                <Button variant="ghost" disabled className="w-full">
                  No models available
                </Button>
              )}
            </PopoverContent>
          </Popover>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <p id="form-description" className="sr-only">
            Update your chat settings including username, API URL, API Key, and
            sliders.
          </p>

          {/* Username field */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter your name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* API URL field */}
          <FormField
            control={form.control}
            name="apiUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>API URL</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter API URL" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* API Key field */}
          <FormField
            control={form.control}
            name="apiKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>API Key</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      value={apiUrl}
                      type={showApiKey ? "text" : "password"}
                      placeholder="Enter API Key"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                    >
                      {showApiKey ? "Hide" : "Show"}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Sliders */}
          <FormField
            control={form.control}
            name="repetition_penalty"
            render={({ field: { value, onChange } }) => (
              <FormItem>
                <FormLabel>Repetition Penalty - {value}</FormLabel>
                <FormControl>
                  <Slider
                    defaultValue={[value]}
                    onValueChange={(val) => onChange(val[0])}
                    min={0.5}
                    max={2.0}
                    step={0.1}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="temperature"
            render={({ field: { value, onChange } }) => (
              <FormItem>
                <FormLabel>Temperature - {value}</FormLabel>
                <FormControl>
                  <Slider
                    defaultValue={[value]}
                    onValueChange={(val) => onChange(val[0])}
                    min={0}
                    max={1}
                    step={0.01}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="max_tokens"
            render={({ field: { value, onChange } }) => (
              <FormItem>
                <FormLabel>Max Tokens - {value}</FormLabel>
                <FormControl>
                  <Slider
                    defaultValue={[value]}
                    onValueChange={(val) => onChange(val[0])}
                    min={1}
                    max={1000}
                    step={1}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="top_p"
            render={({ field: { value, onChange } }) => (
              <FormItem>
                <FormLabel>Top P - {value}</FormLabel>
                <FormControl>
                  <Slider
                    defaultValue={[value]} // Slider expects an array for defaultValue
                    onValueChange={(val) => onChange(val[0])} // Use the first value
                    min={0}
                    max={1}
                    step={0.01}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit button */}
          <Button className="w-full" type="submit">
            Save Changes
          </Button>
        </form>
      </Form>
    </div>
  );
}
