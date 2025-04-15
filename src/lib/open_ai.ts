// Import OpenAI client using ES Modules import
import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

// Initialize OpenAI client with your API key
const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

// Make a request to OpenAI API
const get_chat_gpt_response = async (message: string): Promise<string> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1",
      store: true,
      messages: [{ role: "user", content: message }],
    });

    return response.choices[0].message.content ?? "";
  } catch (error) {
    console.error("Error:", error);
    return "";
  }
};

export const get_possible_5_letter_words = async () => {
  const words = await get_chat_gpt_response("Give me all the 5 letter words");
  return words.split(" ");
};
