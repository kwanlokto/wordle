import { internal_axios_post } from "./base";

export const generate_open_ai_response = async (prompt: string) => {
  const data = await internal_axios_post("/generate", { prompt: prompt });
  return data;
};
