interface ModelType {
  name: string;
  provider: string;
  description: string;
}

export const models: ModelType[] = [
    {
      "name": "liquid/lfm-40b:free",
      "provider": "openrouter",
      "description": "A large language model with 40B parameters, optimized for various language tasks."
    },
    {
      "name": "meta-llama/llama-3.2-3b-instruct:free",
      "provider": "openrouter",
      "description": "Meta's Llama 3.2 model with 3B parameters, optimized for instruction-following tasks."
    },
    {
      "name": "meta-llama/llama-3.2-1b-instruct:free",
      "provider": "openrouter",
      "description": "A smaller version of Meta's Llama 3.2 with 1B parameters, suitable for simpler tasks."
    },
    {
      "name": "meta-llama/llama-3.2-90b-vision-instruct:free",
      "provider": "openrouter",
      "description": "Meta's Llama 3.2 model with 90B parameters, optimized for multimodal tasks including vision."
    },
    {
      "name": "meta-llama/llama-3.2-11b-vision-instruct:free",
      "provider": "openrouter",
      "description": "Llama 3.2 with 11B parameters, optimized for instruction-following and multimodal vision tasks."
    },
    {
      "name": "nousresearch/hermes-3-llama-3.1-405b:free",
      "provider": "openrouter",
      "description": "A powerful 405B model from NousResearch, fine-tuned for advanced reasoning and complex tasks."
    },
    {
      "name": "meta-llama/llama-3.1-70b-instruct:free",
      "provider": "openrouter",
      "description": "Meta's Llama 3.1 model with 70B parameters, optimized for instruction-following and general-purpose tasks."
    },
    {
      "name": "meta-llama/llama-3.1-8b-instruct:free",
      "provider": "openrouter",
      "description": "A smaller version of Meta's Llama 3.1 with 8B parameters, good for moderate instruction-following tasks."
    },
    {
      "name": "meta-llama/llama-3.1-405b-instruct:free",
      "provider": "openrouter",
      "description": "Llama 3.1 with 405B parameters, designed for complex, high-level reasoning and large-scale tasks."
    },
    {
      "name": "qwen/qwen-2-7b-instruct:free",
      "provider": "openrouter",
      "description": "Qwen's 2.7B model optimized for general language understanding and task-based instruction following."
    },
    {
      "name": "google/gemma-2-9b-it:free",
      "provider": "openrouter",
      "description": "Google's Gemma 2.9B model for interactive tasks, focused on language generation and task completion."
    },
    {
      "name": "mistralai/mistral-7b-instruct:free",
      "provider": "openrouter",
      "description": "Mistral's 7B model, optimized for instruction-following with a balance between size and performance."
    },
    {
      "name": "microsoft/phi-3-mini-128k-instruct:free",
      "provider": "openrouter",
      "description": "A mini version of Microsoft's Phi-3 model, optimized for quick and efficient task execution."
    },
    {
      "name": "microsoft/phi-3-medium-128k-instruct:free",
      "provider": "openrouter",
      "description": "Medium-sized Phi-3 model from Microsoft, designed for medium complexity instruction-following tasks."
    },
    {
      "name": "meta-llama/llama-3-8b-instruct:free",
      "provider": "openrouter",
      "description": "Meta's Llama 3 model with 8B parameters, ideal for general-purpose language tasks and instruction following."
    },
    {
      "name": "gryphe/mythomist-7b:free",
      "provider": "openrouter",
      "description": "Gryphe's 7B model, optimized for language understanding and commonsense reasoning."
    },
    {
      "name": "openchat/openchat-7b:free",
      "provider": "openrouter",
      "description": "OpenChat's 7B model, focused on conversational interaction and dynamic dialogue systems."
    },
    {
      "name": "undi95/toppy-m-7b:free",
      "provider": "openrouter",
      "description": "A 7B parameter model optimized for natural language understanding and efficient conversation generation."
    },
    {
      "name": "huggingfaceh4/zephyr-7b-beta:free",
      "provider": "openrouter",
      "description": "Huggingface's Zephyr 7B model, in beta, focused on conversational AI and language generation."
    },
    {
      "name": "gryphe/mythomax-l2-13b:free",
      "provider": "openrouter",
      "description": "An advanced 13B model from Gryphe, optimized for complex language tasks and higher-level reasoning."
    },
    {
      "name": "nousresearch/hermes-3-llama-3.1-70b",
      "description": "Nous Research's latest Hermes 3 release in 70B size. Follows instruction closely.",
      "provider": "openrouter"
    },
    {
      "name": "Mistral-Nemo-12B-Instruct-2407",
      "provider": "arliai",
      "description": "Mistral's 12B parameter model, optimized for instruction-following tasks and general language understanding."
    },
    {
      "name": "Meta-Llama-3.1-8B-Instruct",
      "provider": "arliai",
      "description": "Meta's Llama 3.1 with 8B parameters, fine-tuned for instruction-following tasks and general language understanding."
    },
    {
      "name": "Llama-3.1-8B-ArliAI-RPMax-v1.1",
      "provider": "arliai",
      "description": "ArliAI's fine-tuned version of Llama 3.1, optimized for role-playing tasks (RPMax v1.1)."
    },
    {
      "name": "Llama-3.1-8B-ArliAI-RPMax-v1.2",
      "provider": "arliai",
      "description": "Updated version of ArliAI's Llama 3.1, further improved for advanced role-playing (RPMax v1.2)."
    },
    {
      "name": "Llama-3.1-8B-Hermes-3",
      "provider": "arliai",
      "description": "ArliAI's 8B fine-tune of Llama 3.1, merged with Hermes 3 capabilities for enhanced instruction-following and conversation handling."
    },
    {
      "name": "Llama-3.1-8B-Instruct-Abliterated",
      "provider": "arliai",
      "description": "An instruction-following version of Llama 3.1 from ArliAI with an 'Abliterated' fine-tuning for specific tasks."
    },
    {
      "name": "Llama-3.1-8B-Lexi-Uncensored-V2",
      "provider": "arliai",
      "description": "Llama 3.1 fine-tuned by ArliAI with Lexi Uncensored V2, offering more open-ended and flexible conversational capabilities."
    },
    {
      "name": "meta-llama/Meta-Llama-3.1-70B-Instruct",
      "description": "Ideal for everyday use. A fast and extremely capable model matching closed source models' capabilities.",
      "provider": "huggingface"
    },
    {
      "name": "CohereForAI/c4ai-command-r-plus-08-2024",
      "description": "Cohere's largest language model, optimized for conversational interaction and tool use. Now with the 2024 update!",
      "provider": "huggingface"
    },
    {
      "name": "Qwen/Qwen2.5-72B-Instruct",
      "description": "The latest Qwen open model with improved role-playing, long text generation and structured data understanding.",
      "provider": "huggingface"
    },
    {
      "name": "nvidia/Llama-3.1-Nemotron-70B-Instruct-HF",
      "description": "Nvidia's latest Llama fine-tune, topping alignment benchmarks and optimized for instruction following.",
      "provider": "huggingface"
    },
    {
      "name": "Qwen/Qwen2.5-Coder-32B-Instruct",
      "description": "Qwen's latest coding model, in its biggest size yet. SOTA on many coding benchmarks.",
      "provider": "huggingface"
    },
    {
      "name": "meta-llama/Llama-3.2-11B-Vision-Instruct",
      "description": "The latest multimodal model from Meta! Supports image inputs natively.",
      "provider": "huggingface"
    },
    {
      "name": "NousResearch/Hermes-3-Llama-3.1-8B",
      "description": "Nous Research's latest Hermes 3 release in 8B size. Follows instruction closely.",
      "provider": "huggingface"
    },
    {
      "name": "mistralai/Mistral-Nemo-Instruct-2407",
      "description": "A small model with good capabilities in language understanding and commonsense reasoning.",
      "provider": "huggingface"
    },
    {
      "name": "microsoft/Phi-3.5-mini-instruct",
      "description": "One of the best small models (3.8B parameters), super fast for simple tasks.",
      "provider": "huggingface"
    },
    {
      "name": "ArliAI/Llama-3.1-8B-ArliAI-RPMax-v1.3",
      "description": "ArliAI's specialized Llama fine-tune optimized for role-playing tasks.",
      "provider": "huggingface"
    },
    {
      "name": "NousResearch/Hermes-3-Llama-3.1-405B",
      "description": "Nous Research's massive 405B model, designed for complex instruction following and advanced reasoning tasks.",
      "provider": "huggingface"
    },
    {
      "name": "NousResearch/Hermes-3-Llama-3.1-70B",
      "description": "Nous Research's massive 70B model, designed for complex instruction following and advanced reasoning tasks.",
      "provider": "huggingface"
    }
];
