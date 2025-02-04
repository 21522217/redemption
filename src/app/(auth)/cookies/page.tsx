"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useMemo } from "react";

export default function CookiesPage() {
  const router = useRouter();

  // Sử dụng useMemo để đảm bảo giá trị không thay đổi giữa các lần render
  const currentDate = useMemo(() => {
    return new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-slate-900 py-10">
      <Card className="w-full max-w-4xl p-8 space-y-6 animate-fadeIn shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="space-y-1.5">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">
              Cookies Policy
            </h1>
            <p className="text-sm text-muted-foreground">
              Last updated: {currentDate}
            </p>
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <h2>1. What Are Cookies</h2>
          <p>
            Cookies are small text files stored on your device when you visit
            our website. They help us remember your preferences and improve your
            experience.
          </p>

          <h2>2. How We Use Cookies</h2>
          <p>
            We use cookies for: - Authentication - Preferences - Analytics -
            Security
          </p>

          <h2>3. Types of Cookies We Use</h2>
          <p>
            - Essential cookies: Required for basic site functionality -
            Preference cookies: Remember your settings - Analytics cookies: Help
            us understand how you use our site - Authentication cookies: Keep
            you logged in
          </p>

          <h2>4. Managing Cookies</h2>
          <p>
            You can control cookies through your browser settings. However,
            disabling certain cookies may limit your ability to use some
            features.
          </p>

          <h2>5. Third-Party Cookies</h2>
          <p>
            Some third-party services we use may place cookies on your device.
            We do not control these cookies.
          </p>
        </div>
      </Card>
    </div>
  );
}
