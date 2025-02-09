"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft, Cookie } from "lucide-react";
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
    <Card className="w-full max-w-4xl mx-auto p-8 space-y-8 shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b pb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <Cookie className="h-6 w-6 text-indigo-500" />
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">
                Cookies Policy
              </h1>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Last updated: {currentDate}
            </p>
          </div>
        </div>
      </div>

      <div className="prose dark:prose-invert max-w-none space-y-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
            1. What Are Cookies
          </h2>
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Cookies are small text files that are placed on your device when
              you visit our website. They serve various purposes and help us
              provide you with a better experience:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li>Remember your preferences and settings</li>
              <li>Keep you signed in to your account</li>
              <li>Understand how you use our website</li>
              <li>Improve our services based on your behavior</li>
              <li>Provide personalized content and recommendations</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
            2. How We Use Cookies
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <h3 className="font-medium mb-2">Essential Purposes</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                <li>User authentication</li>
                <li>Security measures</li>
                <li>Basic functionality</li>
                <li>Session management</li>
                <li>Load balancing</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <h3 className="font-medium mb-2">Enhancement Purposes</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                <li>Performance optimization</li>
                <li>User preferences</li>
                <li>Analytics data</li>
                <li>Feature improvements</li>
                <li>Personalization</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
            3. Types of Cookies We Use
          </h2>
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg space-y-6">
            <div>
              <h3 className="font-medium mb-2">Essential Cookies</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Required for the website to function properly. These cannot be
                disabled.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Preference Cookies</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Remember your settings and preferences for a better experience.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Analytics Cookies</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Help us understand how visitors interact with our website.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Marketing Cookies</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Used to track visitors across websites for marketing purposes.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
            4. Managing Cookies
          </h2>
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You have several options to manage or disable cookies:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li>Browser settings adjustment</li>
              <li>Cookie consent preferences</li>
              <li>Third-party opt-out tools</li>
              <li>Private browsing mode</li>
              <li>Regular cookie cleanup</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300 mt-4">
              Note: Disabling certain cookies may impact your experience and the
              functionality of our website.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
            5. Third-Party Cookies
          </h2>
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We use services from these trusted partners that may set cookies:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li>Google Analytics - Usage analysis</li>
              <li>Social Media Platforms - Sharing capabilities</li>
              <li>Payment Processors - Secure transactions</li>
              <li>Content Delivery Networks - Performance optimization</li>
              <li>Authentication Services - Security measures</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300 mt-4">
              These third-party services are carefully selected and monitored,
              but their cookie usage is subject to their own privacy policies.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
            6. Contact Us
          </h2>
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            <p className="text-gray-600 dark:text-gray-300">
              If you have questions about our cookie policy, please contact us:
            </p>
            <div className="mt-4 text-gray-600 dark:text-gray-300">
              <p>Email: privacy@redemption.com</p>
              <p>Address: 123 Cookie Street, Privacy City, 12345</p>
              <p>Phone: +1 (555) 123-4567</p>
            </div>
          </div>
        </section>
      </div>
    </Card>
  );
}
