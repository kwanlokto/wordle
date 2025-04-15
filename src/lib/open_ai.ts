// Import OpenAI client using ES Modules import
import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

// Initialize OpenAI client with your API key
const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

// Make a request to OpenAI API
export const get_chat_gpt_response = async () => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1",
      store: true,
      messages: [{ role: "user", content: "write a haiku about ai" }],
    });

    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error("Error:", error);
  }
};
