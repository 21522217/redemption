"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useMemo } from "react";

export default function PrivacyPage() {
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
              Privacy Policy
            </h1>
            <p className="text-sm text-muted-foreground">
              Last updated: {currentDate}
            </p>
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <h2>1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us: - Account
            information (name, email, password) - Profile information - Content
            you post - Communications
          </p>

          <h2>2. How We Use Information</h2>
          <p>
            We use the information we collect to: - Provide and maintain our
            service - Personalize your experience - Send notifications about
            activity - Monitor and analyze trends
          </p>

          <h2>3. Information Sharing</h2>
          <p>
            We do not share your personal information except: - With your
            consent - To comply with laws - To protect rights and safety
          </p>

          <h2>4. Data Security</h2>
          <p>
            We implement reasonable security measures to protect your
            information. However, no method of transmission over the Internet is
            100% secure.
          </p>

          <h2>5. Your Rights</h2>
          <p>
            You have the right to: - Access your data - Correct inaccurate data
            - Request deletion of your data - Export your data
          </p>
        </div>
      </Card>
    </div>
  );
}
