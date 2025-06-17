"use client";
import AddOpenRouterKeyForm from "./add-openrouter-key-form";

const OpenRouterAddKeyComponent = ({ keyInfo, currentUserId }: { keyInfo: boolean, currentUserId: string }) => {
  return (
    <>
      <div>
        {keyInfo ? (
          <div>
            <p>Key:</p>
          </div>
        ) : (
          <AddOpenRouterKeyForm currentUserId={currentUserId} />
        )}
      </div>
    </>
  );
};

export default OpenRouterAddKeyComponent;
