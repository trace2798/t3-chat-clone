import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AddOpenRouterKeyForm from "./add-openrouter-key-form";
import DeleteKeyButton from "./delete-key-button";

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
                You have added an OpenRouter key.
              </CardDescription>
            </CardHeader>
            <CardFooter>

            <DeleteKeyButton currentUserId={currentUserId} />
            </CardFooter>
          </Card>
        ) : (
          <AddOpenRouterKeyForm currentUserId={currentUserId} />
        )}
      </div>
    </>
  );
};

export default OpenRouterAddKeyComponent;
