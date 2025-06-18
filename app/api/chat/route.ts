import { google } from "@ai-sdk/google"
import { streamText } from "ai"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    console.log("Received messages:", messages)

    // Add system message to establish NeuroAI identity
    const systemMessage = {
      role: "system",
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
    return new Response(JSON.stringify({ error: "Failed to process chat request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
