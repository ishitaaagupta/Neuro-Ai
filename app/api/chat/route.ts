import { google } from "@ai-sdk/google"
import { streamText } from "ai"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    console.log("Received messages:", messages)
    console.log("API Key exists:", !!process.env.GOOGLE_GENERATIVE_AI_API_KEY)

    // Check if API key is configured
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error("GOOGLE_GENERATIVE_AI_API_KEY is not configured")
      return new Response(
        JSON.stringify({
          error: "API key not configured. Please add GOOGLE_GENERATIVE_AI_API_KEY to your environment variables.",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    // Add system message to establish NeuroAI identity
    const systemMessage = {
      role: "system" as const,
      content: `You are NeuroAI, a personal AI assistant created by Ishita. You are NOT Gemini or any other AI model. When asked about your identity, always respond that you are NeuroAI, Ishita's personal AI assistant. You are helpful, intelligent, and designed to assist users with various tasks. Never mention being Gemini or any other AI model - you are exclusively NeuroAI, created by Ishita.`,
    }

    const result = await streamText({
      model: google("gemini-1.5-flash"),
      messages: [systemMessage, ...messages],
      system:
        "You are NeuroAI, Ishita's personal AI assistant. Be helpful, conversational, and provide detailed responses when appropriate. Always identify yourself as NeuroAI when asked about your identity.",
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Chat API error:", error)

    // More detailed error logging
    if (error instanceof Error) {
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
    }

    return new Response(
      JSON.stringify({
        error: "Failed to process chat request",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
