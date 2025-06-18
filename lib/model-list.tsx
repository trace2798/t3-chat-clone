export interface ChatModel {
  label: string;
  name: string;
  category: string;
  tool: boolean;
}

export const chatModelsList: Array<ChatModel> = [
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
  },
  {
    label: "Google: Gemini 2.5 Flash Lite Preview 06-17",
    name: "google/gemini-2.5-flash-lite-preview-06-17",
    category: "file",
    tool: true,
  },
  {
    label: "DeepSeek: R1 0528",
    name: "deepseek/deepseek-r1-0528",
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
    label: "Meta: Llama 4 Scout",
    name: "meta-llama/llama-4-scout",
    category: "reasoning, vision",
    tool: true,
  },
];
