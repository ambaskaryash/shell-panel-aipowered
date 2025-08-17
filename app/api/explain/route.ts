import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

interface CommandPart {
  text: string
  type: "command" | "option" | "argument" | "operator" | "pipe" | "redirect"
  explanation: string
  manPage?: string
}

export async function POST(request: NextRequest) {
  try {
    const { command } = await request.json()

    if (!command || typeof command !== "string") {
      return NextResponse.json({ error: "Command is required" }, { status: 400 })
    }

    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Groq API key not configured" }, { status: 500 })
    }

    const prompt = `Analyze this shell command and provide a detailed breakdown: "${command}"

Please respond with a JSON object containing:
1. "parts" - an array of command parts, each with:
   - "text": the actual text/token
   - "type": one of "command", "option", "argument", "operator", "pipe", "redirect"
   - "explanation": detailed explanation of what this part does
   - "manPage": (optional) the command name for manual page reference

2. "overall_explanation": a comprehensive explanation of what the entire command does
3. "safety_notes": any important safety warnings or considerations
4. "examples": 2-3 similar example commands with brief descriptions

Focus on accuracy and educational value. If the command contains potentially dangerous operations, clearly warn about them.

Respond ONLY with valid JSON, no markdown formatting.`

    const { text: aiResponse } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      system:
        "You are an expert system administrator and shell command educator. Provide accurate, detailed explanations of shell commands with proper safety warnings. Always respond with valid JSON format only.",
      prompt: prompt,
      temperature: 0.1,
    })

    if (!aiResponse) {
      return NextResponse.json({ error: "No response from AI" }, { status: 500 })
    }

    let parsedResponse
    try {
      parsedResponse = JSON.parse(aiResponse)
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError)
      console.error("AI Response:", aiResponse)
      // Fallback: create a simple response
      parsedResponse = {
        parts: [
          {
            text: command,
            type: "command",
            explanation: "Failed to parse detailed explanation. The command appears to be a shell command.",
          },
        ],
        overall_explanation: aiResponse,
        safety_notes: "Please verify command safety before execution.",
        examples: [],
      }
    }

    return NextResponse.json(parsedResponse)
  } catch (error) {
    console.error("Error in explain API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
