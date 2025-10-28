import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, GenerationConfig } from "@google/generative-ai";

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

if (!process.env.GEMINI_API_KEY) {
  throw new Error("API Key has some issues");
}

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: "No messages provided" },
        { status: 400 }
      );
    }

    const generationConfig: GenerationConfig = {
      maxOutputTokens: 1000,
      temperature: 0.9,
      topP: 1,
    };
    const model = genAi.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    // --- 3. Pass the config as the second argument ---
    const result = await model.generateContent(messages, generationConfig);

    // --- 4. Fix how you get the text response ---
    const response = result.response;
    const text = response.text();

    return NextResponse.json({
      response: text,
      success: true,
    });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate AI response", details: error.message },
      { status: 500 }
    );
  }
}
