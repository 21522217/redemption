// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ImgurUploadResponse } from "@/lib/utils/upload-image"; // Adjust import path accordingly

export async function POST(req: NextRequest) {
  // Parse the incoming form data
  const formData = await req.formData();
  const file = formData.get("image") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const accessToken = process.env.NEXT_PUBLIC_ACCESS_TOKEN_IMGUR; // Get access token from environment variables
  if (!accessToken) {
    return NextResponse.json(
      { error: "No access token provided" },
      { status: 401 }
    );
  }

  const apiUrl = "https://api.imgur.com/3/upload";
  const form = new FormData();
  form.append("image", file);
  


  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      body: form,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result: ImgurUploadResponse = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error uploading image to Imgur:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
