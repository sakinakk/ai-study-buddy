import { NextRequest, NextResponse } from "next/server";
import { STUDY_PLAN_PROMPT } from "@/lib/prompt";
import { StudyInput, StudyPlan } from "@/types/studyPlan";

export async function POST(req: NextRequest) {
  const body: StudyInput = await req.json();

  // Make sure the student has actually typed something
  if (!body.notes?.trim()) {
    return NextResponse.json(
      { error: "Please provide some study notes or a topic to plan." },
      { status: 400 }
    );
  }

  // Build the message to send to Gemini
  const userMessage = `Student input: "${body.notes}"
${body.exam_date ? `Exam date: ${body.exam_date}` : "No exam date provided."}`.trim();

  // Call the Gemini API
  const geminiResponse = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: STUDY_PLAN_PROMPT }] },
        contents: [{ role: "user", parts: [{ text: userMessage }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 8192 },
      }),
    }
  );

  if (!geminiResponse.ok) {
    return NextResponse.json(
      { error: "Failed to reach the AI service. Please try again." },
      { status: 502 }
    );
  }

  // Pull the text out of Gemini's response
  const geminiData = await geminiResponse.json();
  const rawText: string = geminiData.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  if (!rawText) {
    return NextResponse.json(
      { error: "The AI returned an empty response. Please try again." },
      { status: 500 }
    );
  }

  // Gemini sometimes wraps the JSON in markdown so strip it out
  try {
    const jsonStart = rawText.indexOf("{");
    const jsonEnd = rawText.lastIndexOf("}");
    const studyPlan: StudyPlan = JSON.parse(rawText.slice(jsonStart, jsonEnd + 1));
    return NextResponse.json(studyPlan, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "The AI returned an unexpected format. Please try again." },
      { status: 500 }
    );
  }
}