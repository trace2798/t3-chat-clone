"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { zodResolver } from "@hookform/resolvers/zod";
import { fetchMutation } from "convex/nextjs";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  key: z.string(),
});
const AddOpenRouterKeyForm = ({ currentUserId }: { currentUserId: string }) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      key: "",
    },
  });
  const {
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = form;
  const apiKeyValue = watch("key");
  const addKey = useMutation(api.key.addOpenRouterKey);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await addKey({ userId: currentUserId as Id<"users">, key: values.key });
      form.reset();
      toast.success("Key added successfully.");
      router.refresh();
    } catch (e) {
      console.error(e);
      toast.error(
        "There was an error adding the key. Try again or contact support."
      );
    }
  }
  return (
    <>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>OpenRouter Key Information</CardTitle>
            <CardDescription>
              This key will be safely stored on our server and will be used to
              communicate with OpenRouter endpoints when you chat.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="key"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your API Key</FormLabel>
                      <FormControl>
                        <Input placeholder="sk-or-v1-ee8...319" {...field} />
                      </FormControl>
                      <FormDescription>
                        You can find/create your key at{" "}
                        <a
                          href="https://openrouter.ai/settings/keys"
                          className="hover:cursor-pointer hover:text-primary hover:underline"
                        >
                          https://openrouter.ai/settings/keys
                        </a>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button
                    size={"sm"}
                    type="submit"
                    className="w-full max-w-[200px]"
                    disabled={!apiKeyValue || isSubmitting}
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default AddOpenRouterKeyForm;
