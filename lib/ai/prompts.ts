const regularPrompt =
  "You are a friendly assistant! Keep your responses concise and helpful.";

const toolInfo = ` You have two tools available:
    • getSearchResultsTool: use this to search the web when the user asks you to look something up online.
    • generateImageTool: use this to create or generate an image when the user explicitly requests an illustration or picture.
    Only invoke **one** `;
export const systemPrompt = ({
  selectedChatModel,
}: {
  selectedChatModel: string;
}) => {
  if (selectedChatModel === "deepseek/deepseek-r1-0528") {
    return `${regularPrompt}`;
  } else {
    return `${regularPrompt}\n\n${toolInfo}`;
  }
};
