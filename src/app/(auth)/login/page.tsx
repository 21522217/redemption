"use client";

import { useForm } from "react-hook-form";
import Link from "next/link";
import Image from "next/image";

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
import { loginFormSchema, type LoginFormValues } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaGoogle } from "react-icons/fa";
import Footer from "@/components/Footer";
import useSignIn from "@/lib/firebase/login";
import { Card } from "@/components/ui/card";

export default function LoginForm() {
  const { signIn } = useSignIn();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    try {
      await signIn({
        email: data.username,
        password: data.password,
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-slate-900">
      <Card className="w-full min-w-[448px] p-8 space-y-6 animate-fadeIn shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        {/* Logo section */}
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
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Log in to your Redemption account
            </p>
          </div>
        </div>

        {/* Social login */}
        <Button
          variant="outline"
          className="w-full h-12 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200"
        >
          <FaGoogle className="mr-2 h-5 w-5 text-red-500" />
          Continue with Google
        </Button>

        <div className="flex items-center gap-2">
          <Separator className="flex-1 bg-gray-200 dark:bg-gray-600" />
          <span className="text-sm text-muted-foreground">
            or continue with email
          </span>
          <Separator className="flex-1 bg-gray-200 dark:bg-gray-600" />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Email address"
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password"
                      {...field}
                      className="h-12 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between">
              <Link
                href="/forgot-password"
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white transition-all duration-200"
            >
              Sign in
            </Button>
          </form>
        </Form>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
          >
            Sign up
          </Link>
        </p>
      </Card>
    </div>
  );
}
