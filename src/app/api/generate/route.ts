import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();
const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY, // Secure: only runs on the server
});

/**
 * Handles a POST request to generate a response from the OpenAI Chat API.
 *
 * @param {Request} req - The incoming HTTP request object containing a JSON body with a `prompt` field.
 *
 * @returns {Promise<Response>} A JSON response containing the generated message or an error object with status 500.
 */
export async function POST(req: Request): Promise<Response> {
  const { prompt } = await req.json();

  try {
    const completion = await openai.chat.completions.create({
      model: "omni-moderation-latest",  // TODO: This model doesn't work because its paid
      messages: [{ role: "user", content: prompt }],
    });
    const message = completion.choices[0].message.content;

    return NextResponse.json({ message });
  } catch (err) {
    console.error("OpenAI error:", err);
    return NextResponse.json(
      { error: `Failed to generate response. ${err}` },
      { status: 500 }
    );
  }
}
