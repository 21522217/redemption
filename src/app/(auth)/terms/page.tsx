"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileText } from "lucide-react";
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
    <Card className="w-full max-w-4xl mx-auto p-8 space-y-8 shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm mt-6 mb-2">
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
              <FileText className="h-6 w-6 text-indigo-500" />
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">
                Terms of Service
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
            1. Acceptance of Terms
          </h2>
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            <p className="text-gray-600 dark:text-gray-300">
              By accessing and using Redemption, you acknowledge that you have
              read, understood, and agree to be bound by these Terms of Service.
              If you do not agree to these terms, please discontinue use of our
              services immediately.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 mt-4">
              <li>These terms apply to all visitors and users of Redemption</li>
              <li>We may update these terms at any time without notice</li>
              <li>
                Continued use after changes constitutes acceptance of new terms
              </li>
              <li>Users must be at least 13 years old to use our services</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
            2. User Accounts
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <h3 className="font-medium mb-2">Account Creation</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                <li>Accurate registration information</li>
                <li>One account per person</li>
                <li>Secure password requirements</li>
                <li>Email verification process</li>
                <li>Age restrictions apply</li>
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
              <h3 className="font-medium mb-2">Account Responsibilities</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                <li>Maintain account security</li>
                <li>Report unauthorized access</li>
                <li>Keep information updated</li>
                <li>No account sharing</li>
                <li>Account recovery options</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
            3. User Content
          </h2>
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Users are responsible for all content they post, share, or upload
              to Redemption. The following content is strictly prohibited:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li>Illegal or unauthorized content</li>
              <li>Hate speech or discriminatory content</li>
              <li>Harassment or bullying</li>
              <li>Spam or deceptive practices</li>
              <li>Malware or harmful code</li>
              <li>Copyright-infringing material</li>
              <li>Private information without consent</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
            4. Intellectual Property
          </h2>
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                All content and materials available on Redemption, including but
                not limited to text, graphics, logos, icons, images, audio
                clips, digital downloads, and software, are the property of
                Redemption or its licensors and are protected by:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                <li>Copyright laws</li>
                <li>Trademark laws</li>
                <li>Patent laws</li>
                <li>Other intellectual property rights</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
            5. Service Modifications
          </h2>
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              We reserve the right to modify, suspend, or discontinue any part
              of our services at any time:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li>With or without notice</li>
              <li>Temporary or permanent changes</li>
              <li>Feature modifications or removals</li>
              <li>Service availability adjustments</li>
              <li>Platform updates and maintenance</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
            6. Limitation of Liability
          </h2>
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Redemption and its affiliates shall not be liable for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li>Direct or indirect damages</li>
              <li>Loss of profits or data</li>
              <li>Service interruptions</li>
              <li>Third-party actions</li>
              <li>Technical malfunctions</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
            7. Contact Information
          </h2>
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
            <p className="text-gray-600 dark:text-gray-300">
              If you have any questions about these Terms of Service, please
              contact us at:
            </p>
            <div className="mt-4 text-gray-600 dark:text-gray-300">
              <p>Email: terms@redemption.com</p>
              <p>Address: 123 Legal Street, Terms City, 12345</p>
              <p>Phone: +1 (555) 123-4567</p>
            </div>
          </div>
        </section>
      </div>
    </Card>
  );
}
