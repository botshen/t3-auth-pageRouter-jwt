import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { useRouter } from "next/router";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});
type FormData = z.infer<typeof formSchema>;

export default function LoginPage() {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    console.log("Submitting form", data);
    const { name, password } = data;
    try {
      const response: any = await signIn("credentials", {
        name,
        password,
        redirect: false,
      });
      console.log({ response });
      if (!response?.error) {
        router.push("/");
      }

      if (!response.ok) {
        alert("Network response was not ok");
        return;
      }
      // Process response here
      console.log("Login Successful", response);
    } catch (error: any) {
      // console.error("Login Failed:", error);
    }
  };

  return (
    <section className="flex h-screen items-center justify-center bg-white">
      <div className="w-[600px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="please type username" {...field} />
                  </FormControl>
                  {/* <FormDescription>
                    This is your public display name.
                  </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="please type password"
                      {...field}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="mr-4">
              Submit
            </Button>
            <Button
              variant="secondary"
              onClick={() => router.push("/register")}
            >
              Register
            </Button>
          </form>
        </Form>
      </div>
    </section>
  );
}
