"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft, Shield } from "lucide-react";
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
              <Shield className="h-6 w-6 text-indigo-500" />
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">
                Privacy Policy
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
            1. Information We Collect
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <h3 className="font-medium mb-2">Account Information</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                <li>Name and email address</li>
                <li>Password (encrypted)</li>
                <li>Profile information</li>
                <li>Profile picture</li>
                <li>Account preferences</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <h3 className="font-medium mb-2">Usage Data</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                <li>Content you post</li>
                <li>Interactions with other users</li>
                <li>Comments and reactions</li>
                <li>Search history</li>
                <li>Device information</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
            2. How We Use Information
          </h2>
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li>Provide and maintain our services</li>
              <li>Personalize your experience and content</li>
              <li>Send notifications about activity and updates</li>
              <li>Monitor and analyze usage patterns and trends</li>
              <li>Prevent, detect, and address technical issues</li>
              <li>Improve our platform and user experience</li>
              <li>Communicate with you about our services</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
            3. Information Sharing
          </h2>
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We do not sell or rent your personal information. We may share
              your information in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li>With your explicit consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect rights and safety</li>
              <li>With service providers under strict confidentiality</li>
              <li>During a business transaction or merger</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
            4. Data Security
          </h2>
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We implement industry-standard security measures to protect your
              information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments and audits</li>
              <li>Access controls and authentication</li>
              <li>Secure data storage and backup systems</li>
              <li>Employee training on security practices</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
            5. Your Rights
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <h3 className="font-medium mb-2">Access and Control</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your data</li>
                <li>Export your data</li>
                <li>Opt-out of communications</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <h3 className="font-medium mb-2">Additional Rights</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                <li>Object to processing</li>
                <li>Restrict processing</li>
                <li>Data portability</li>
                <li>Withdraw consent</li>
                <li>Lodge complaints</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
            6. Contact Us
          </h2>
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            <p className="text-gray-600 dark:text-gray-300">
              If you have any questions about this Privacy Policy, please
              contact us at:
            </p>
            <div className="mt-4 text-gray-600 dark:text-gray-300">
              <p>Email: privacy@redemption.com</p>
              <p>Address: 123 Privacy Street, Security City, 12345</p>
              <p>Phone: +1 (555) 123-4567</p>
            </div>
          </div>
        </section>
      </div>
    </Card>
  );
}
