import { axios_get } from "./base";

export const get_five_letter_words = async () => {
  const data = await axios_get("https://api.datamuse.com/words", {
    sp: "?????", // 5 character words
    max: 2000,
  });
  const words = data.map((word: { word: string; score: number }) => word.word);
  return words
};
