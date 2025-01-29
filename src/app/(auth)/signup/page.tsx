"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Chrome } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
      firstName: "",
      lastName: "",
      username: "",
    },
  });

  const onSubmit: SubmitHandler<SignupFormValues> = async (data) => {
    try {
      await signUp({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex w-1/4 min-h-screen flex-col items-center justify-center px-4">
      <Card className="flex flex-col w-full items-center p-6 space-y-6">
        <h1 className="text-xl font-semibold ">
          Create your account
        </h1>

        <Button
          variant="outline"
          className="h-12 w-full rounded-2xl text-sm font-semibold"
        >
          <Chrome className="mr-2 h-5 w-5 " />
          Continue with Google
        </Button>

        <div className="flex w-full items-center gap-2">
          <Separator className="flex-1" />
          <span className="text-sm ">OR</span>
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
            {(["firstName", "lastName", "username", "email", "password", "confirmPassword"] as const).map(
              (name, index) => (
                <FormField
                  key={index}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type={
                            name === "email" ? "email" :
                              name === "password" || name === "confirmPassword" ? "password" : "text"
                          }
                          placeholder={
                            name === "firstName" ? "First name" :
                              name === "lastName" ? "Last name" :
                                name === "username" ? "Username" :
                                  name === "email" ? "Email address" :
                                    name === "password" ? "Password" :
                                      "Confirm password"
                          }
                          {...field}
                          className={`h-12 ring-border ring-1 ${name === "email" || name === "firstName" || name === "lastName" || name === "username"
                            ? " placeholder:text-zinc-400"
                            : "bg-zinc-800  placeholder:text-zinc-400 focus-visible:ring-zinc-500"
                            }`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )
            )}
            <Separator className="w-full h-[2px]" />
            <Button
              type="submit"
              variant="default"
              className="h-12 w-full rounded-2xl text-md font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </Form>
      </Card>

      <div className="text-center">
        <p className="text-sm text-zinc-400">
          Already have an account?{" "}
          <Button
            variant="link"
            className=" hover:text-zinc-200 p-0"
            asChild
          >
            <Link href="/login">Log in</Link>
          </Button>
        </p>
      </div>
    </div>
  );
}
