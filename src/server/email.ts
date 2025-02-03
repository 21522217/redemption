"use server";

import nodemailer from "nodemailer";

export async function sendReportEmail(
  name: string,
  email: string,
  message: string,
  postId: string
): Promise<{ success: boolean; error?: string }> {
  const transporter = nodemailer.createTransport({
    host: process.env.NEXT_PUBLIC_EMAIL_HOST,
    port: Number(process.env.NEXT_PUBLIC_EMAIL_PORT),
    secure: true,
    auth: {
      user: process.env.NEXT_PUBLIC_EMAIL_USER,
      pass: process.env.NEXT_PUBLIC_EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: process.env.NEXT_PUBLIC_EMAIL_USER,
    subject: "New Report from Your Redemption App",
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}\nPost ID: ${postId}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error sending email:", errorMessage);
    return { success: false, error: errorMessage };
  }
}
