"use client";

import { useForm } from "react-hook-form";
import Link from "next/link";

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
import ThemeSwitcher from "@/components/ThemeToggle";
import useSignIn from "@/lib/firebase/login";

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
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <ThemeSwitcher />
      <div className="w-[400px] space-y-6">
        <div className="flex flex-col items-center space-y-6">
          <h1 className="text-xl font-semibold text-white">
            Log in with your Redemption account
          </h1>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-4"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Username, phone or email"
                        {...field}
                        className="h-12"
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
                        className="h-12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="h-12 w-full bg-white text-black hover:bg-zinc-200"
              >
                Log in
              </Button>
            </form>
          </Form>
          <div className="flex flex-row w-full justify-between items-center text-muted-foreground text-sm">
            <Link href="/forgot-password" className="hover:text-muted">
              Forgot password?
            </Link>
            <Link href="/signup" className="hover:text-muted">
              Don&apos;t have an account?
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Separator className="flex-1 bg-zinc-800" />
          <span className="text-sm text-zinc-400">or</span>
          <Separator className="flex-1 bg-zinc-800" />
        </div>

        <Button className="h-12 w-full">
          <FaGoogle className="mr-2 h-5 w-5" />
          Continue with Google
        </Button>

        <Footer />
      </div>
    </div>
  );
}
