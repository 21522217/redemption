"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Chrome } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  signupFormSchema,
  type SignupFormValues,
} from "@/lib/validations/auth";
import useSignUp from "@/lib/firebase/signup";
import { useLoading } from "@/contexts/LoadingContext";

export default function SignupForm() {
  const { isLoading } = useLoading();
  const { signUp } = useSignUp();
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit: SubmitHandler<SignupFormValues> = async (data) => {
    try {
      await signUp({
        email: data.email,
        password: data.password,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-[400px] space-y-6">
        <div className="flex flex-col items-center space-y-6">
          <h1 className="text-xl font-semibold text-white">
            Create your account
          </h1>

          <Button
            variant="outline"
            className="h-12 w-full bg-transparent text-white"
          >
            <Chrome className="mr-2 h-5 w-5" />
            Continue with Google
          </Button>

          <div className="flex w-full items-center gap-2">
            <Separator className="flex-1" />
            <span className="text-sm text-zinc-400">or</span>
            <Separator className="flex-1" />
          </div>

          <Form {...form}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit(onSubmit)(e);
              }}
              className="w-full space-y-4"
            >
              {(["email", "password", "confirmPassword"] as const).map(
                (name, index) => (
                  <FormField
                    key={index}
                    control={form.control}
                    name={name}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type={name === "email" ? "email" : "password"}
                            placeholder={
                              name === "email"
                                ? "Email address"
                                : name === "password"
                                ? "Password"
                                : "Confirm password"
                            }
                            {...field}
                            className={`h-12 ${
                              name === "email"
                                ? "text-white placeholder:text-zinc-400"
                                : "bg-zinc-800 text-white placeholder:text-zinc-400 focus-visible:ring-zinc-500"
                            }`}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )
              )}
              <Button
                type="submit"
                className="h-12 w-full bg-white text-black hover:bg-zinc-200"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>
          </Form>
        </div>

        <div className="text-center">
          <p className="text-sm text-zinc-400">
            Already have an account?{" "}
            <Button
              variant="link"
              className="text-white hover:text-zinc-200 p-0"
              asChild
            >
              <Link href="/login">Log in</Link>
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
