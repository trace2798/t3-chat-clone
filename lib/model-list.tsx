export interface ChatModel {
  label: string;
  name: string;
  category: string;
  tool: boolean;
}

export const chatModelsList: Array<ChatModel> = [
  {
    label: "Meta: Llama 3.2 11B Vision Instruct Free",
    name: "meta-llama/llama-3.2-11b-vision-instruct:free",
    category: "vision",
    tool: true,
  },
  {
    label: "Meta: Llama 3.2 11B Vision Instruct",
    name: "meta-llama/llama-3.2-11b-vision-instruct",
    category: "vision",
    tool: true,
  },
  {
    label: "Meta: Llama 3.2 90B Vision Instruct",
    name: "meta-llama/llama-3.2-90b-vision-instruct",
    category: "vision",
    tool: true,
  },
  {
    label: "Google: Gemini 2.5 Flash Lite Preview 06-17",
    name: "google/gemini-2.5-flash-lite-preview-06-17",
    category: "file",
    tool: true,
  },
  {
    label: "DeepSeek: R1 0528 (free)",
    name: "deepseek/deepseek-r1-0528:free",
    category: "reasoning",
    tool: false,
  },
  {
    label: "DeepSeek: R1 0528",
    name: "deepseek/deepseek-r1-0528",
    category: "reasoning",
    tool: true,
  },
  {
    label: "DeepSeek: DeepSeek V3 0324",
    name: "deepseek/deepseek-chat-v3-0324",
    category: "reasoning",
    tool: true,
  },
  {
    label: "Meta: Llama 4 Maverick",
    name: "meta-llama/llama-4-maverick",
    category: "reasoning, vision",
    tool: true,
  },
  {
    label: "Meta: Llama 4 Maverick (free)",
    name: "meta-llama/llama-4-maverick-17b-128e-instruct:free",
    category: "reasoning, vision",
    tool: true,
  },
  {
    label: "Meta: Llama 4 Scout",
    name: "meta-llama/llama-4-scout",
    category: "reasoning, vision",
    tool: true,
  },
  {
    label: "Meta: Llama 3.3 70B Instruct",
    name: "meta-llama/llama-3.3-70b-instruct",
    category: "reasoning",
    tool: true,
  },
  {
    label: "Mistral: Mistral Small 3.1 24B",
    name: "mistralai/mistral-small-3.1-24b-instruct",
    category: "vision, reasoning",
    tool: true,
  },
  {
    label: "Anthropic: Claude Sonnet 4",
    name: "anthropic/claude-4-sonnet-20250522",
    category: "reasoning",
    tool: true,
  }
];
