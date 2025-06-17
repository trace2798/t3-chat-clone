import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AddOpenRouterKeyForm from "./add-openrouter-key-form";

const OpenRouterAddKeyComponent = ({
  keyInfo,
  currentUserId,
}: {
  keyInfo: number | boolean;
  currentUserId: string;
}) => {
  return (
    <>
      <div>
        {keyInfo ? (
          <Card>
            <CardHeader>
              <CardTitle>OpenRouter Key Information</CardTitle>
              <CardDescription>
                You have added an OpenRouter key on{" "}
                {new Date(keyInfo as number).toLocaleString()}
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <AddOpenRouterKeyForm currentUserId={currentUserId} />
        )}
      </div>
    </>
  );
};

export default OpenRouterAddKeyComponent;
