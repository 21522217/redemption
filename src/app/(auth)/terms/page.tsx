"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useMemo } from "react";

export default function TermsPage() {
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
              Terms of Service
            </h1>
            <p className="text-sm text-muted-foreground">
              Last updated: {currentDate}
            </p>
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using Redemption, you agree to be bound by these
            Terms of Service. If you do not agree to these terms, please do not
            use our service.
          </p>

          <h2>2. User Content</h2>
          <p>
            Users are responsible for the content they post. Content must not: -
            Violate any laws - Infringe on intellectual property rights -
            Contain hate speech or harassment - Include spam or malicious
            content
          </p>

          <h2>3. Account Responsibilities</h2>
          <p>
            You are responsible for maintaining the security of your account and
            password. Redemption cannot and will not be liable for any loss or
            damage from your failure to comply with this security obligation.
          </p>

          <h2>4. Content Moderation</h2>
          <p>
            We reserve the right to remove content that violates our terms. This
            includes: - Inappropriate content - Spam - Harmful content - Content
            that violates others&apos; rights
          </p>

          <h2>5. Service Modifications</h2>
          <p>
            We reserve the right to modify or discontinue the service at any
            time, with or without notice.
          </p>

          <h2>6. Limitation of Liability</h2>
          <p>
            Redemption shall not be liable for any indirect, incidental,
            special, consequential or punitive damages resulting from your use
            of the service.
          </p>
        </div>
      </Card>
    </div>
  );
}
