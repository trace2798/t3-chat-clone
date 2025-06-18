// const regularPrompt =
//   "You are a friendly assistant! Keep your responses concise and helpful.";

// const bothToolsInfo = `You have two tools available:
//   • getSearchResultsTool: use this to search the web when the user asks you to look something up online.
//   • generateImageTool: use this to create or generate an image when the user explicitly requests an illustration or picture.
// Only invoke **one** tool per response—do not use both together.`;

// const searchOnlyInfo = `You have one tool available:
//   • getSearchResultsTool: use this to search the web when the user asks you to look something up online.
// If the user does not ask for a search, just answer in plain text.`;

// export const systemPrompt = ({
//   selectedChatModel,
// }: {
//   selectedChatModel: string;
// }) => {
//   switch (selectedChatModel) {
//     case "deepseek/deepseek-r1-0528":
//       return regularPrompt;

//     case "mistralai/mistral-small-3.1-24b-instruct":
//     case "google/gemini-2.5-flash-lite-preview-06-17":
//       return `${regularPrompt}\n\n${bothToolsInfo}`;

//     case "meta-llama/llama-4-maverick":
//     case "meta-llama/llama-4-scout":
//     case "anthropic/claude-4-sonnet-20250522":
//       return `${regularPrompt}\n\n${searchOnlyInfo}`;

//     default:
//       return regularPrompt;
//   }
// };
const regularPrompt =
  "You are a friendly assistant! Keep your responses concise and helpful.";

const bothToolsInfo = `You have two tools available:
  • getSearchResultsTool: use this to search the web when the user asks you to look something up online.
  • generateImageTool: use this to create or generate an image when the user explicitly requests an illustration or picture.
Only invoke **one** tool per response—do not use both together.`;

const searchOnlyInfo = `You have one tool available:
  • getSearchResultsTool: use this to search the web when the user asks you to look something up online.
If the user does not ask for a search, just answer in plain text.`;

const imageOnlyInfo = `You have one tool available:
  • generateImageTool: use this to create or generate an image when the user explicitly requests an illustration or picture.
If the user does not ask for an image, just answer in plain text.`;

export const systemPrompt = ({
  selectedChatModel,
  searchWeb,
  generateImage,
}: {
  selectedChatModel: string;
  searchWeb: boolean;
  generateImage: boolean;
}) => {

  if (selectedChatModel === "deepseek/deepseek-r1-0528") {
    return regularPrompt;
  }

  if (searchWeb && generateImage) {
    return `${regularPrompt}\n\n${bothToolsInfo}`;
  }
  if (searchWeb) {
    return `${regularPrompt}\n\n${searchOnlyInfo}`;
  }
  if (generateImage) {
    return `${regularPrompt}\n\n${imageOnlyInfo}`;
  }

  return regularPrompt;
};
