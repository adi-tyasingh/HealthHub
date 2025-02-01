"use client";

import * as React from "react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ProviderToggle() {
  const [provider, setProvider] = React.useState<string>(
    () => localStorage.getItem("selectedProvider") || "huggingface"
  );

  const selectedModel = localStorage.getItem("selectedModel") || "NousResearch/Hermes-3-Llama-3.1-8B";

  React.useEffect(() => {
    localStorage.setItem("selectedProvider", provider);
    const apiConfigs: Record<string, string> = {
      huggingface: `https://api-inference.huggingface.co/models/${selectedModel}/v1/chat/completions`,
      openrouter_ath: "https://openrouter.ai/api/v1/chat/completions",
      openrouter_adi: "https://openrouter.ai/api/v1/chat/completions",
      openrouter_prachi: "https://openrouter.ai/api/v1/chat/completions",
      openrouter_vd: "https://openrouter.ai/api/v1/chat/completions",
      arliai: "https://api.arliai.com/v1/chat/completions",
    };
    const apiKeys: Record<string, string> = {
      huggingface: process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY,
      openrouter_ath: process.env.NEXT_PUBLIC_OPENROUTER_ATH_API_KEY,
      openrouter_adi: process.env.NEXT_PUBLIC_OPENROUTER_ADI_API_KEY,
      openrouter_prachi: process.env.NEXT_PUBLIC_OPENROUTER_PRACHI_API_KEY,
      openrouter_vd: process.env.NEXT_PUBLIC_OPENROUTER_VD_API_KEY,
      arliai: process.env.NEXT_PUBLIC_ARLIAI_API_KEY,
    };
    localStorage.setItem("api_url", apiConfigs[provider] || "");
    localStorage.setItem("api_key", apiKeys[provider] || "");
    window.dispatchEvent(new Event("storage"));
  }, [selectedModel, provider]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="justify-start">
          <div className="flex justify-between w-full">
            <p>{provider.charAt(0).toUpperCase() + provider.slice(1)}</p>
            <ChevronDownIcon className="w-5 h-5" />
          </div>
          <span className="sr-only">Toggle provider</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52">
        {["huggingface", "openrouter_ath","openrouter_adi","openrouter_prachi","openrouter_vd", "arliai"].map((key) => (
          <DropdownMenuItem
            key={key}
            onClick={() => setProvider(key)}
            className={provider === key ? "font-bold" : ""}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
