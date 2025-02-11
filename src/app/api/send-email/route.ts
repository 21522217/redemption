import { NextResponse } from "next/server";
import { sendReportEmail } from "@/server/email";

export async function POST(req: Request) {
  const { name, email, message, postId } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json(
      { success: false, error: "All fields are required" },
      { status: 400 }
    );
  }

  const result = await sendReportEmail(name, email, message, postId);
  return NextResponse.json(result);
}
