"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
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
import {
  signupFormSchema,
  type SignupFormValues,
} from "@/lib/validations/auth";
import useSignUp from "@/lib/firebase/signup";
import { useLoading } from "@/contexts/LoadingContext";
import Image from "next/image";

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
    <div className="flex min-h-screen flex-col items-center justify-center ">
      <Card className="w-full min-w-[448px] p-8 space-y-6 animate-fadeIn shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div className="flex flex-col items-center space-y-3">
          <Image
            src="/redemption-logo.svg"
            alt="Redemption Logo"
            width={48}
            height={48}
            className="dark:invert"
          />
          <div className="space-y-1.5 text-center">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">
              Create your account
            </h1>
            <p className="text-sm text-muted-foreground">
              Join Redemption today
            </p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="First name"
                        {...field}
                        className="h-12 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Last name"
                        {...field}
                        className="h-12 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {["username", "email", "password", "confirmPassword"].map(
              (name) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name as keyof SignupFormValues}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type={
                            name === "email"
                              ? "email"
                              : name === "password" ||
                                name === "confirmPassword"
                              ? "password"
                              : "text"
                          }
                          placeholder={
                            name === "username"
                              ? "Username"
                              : name === "email"
                              ? "Email address"
                              : name === "password"
                              ? "Password"
                              : "Confirm password"
                          }
                          {...field}
                          className="h-12 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors"
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
              className="w-full h-12 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white transition-all duration-200"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </Form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
          >
            Log in
          </Link>
        </p>
      </Card>
    </div>
  );
}
