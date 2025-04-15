import { axios_get } from "./base";

export const get_five_letter_words = async () => {
  const data = await axios_get("https://api.datamuse.com/words", {
    sp: "?????", // 5 character words
    max: 1000,
    md: "f", // get the frequency metadata
  });
  const words = data.filter(
    (word: { word: string; score: number; tags: string[] }) => {
      const freq_tag = word.tags.find((tag) => tag.startsWith("f:"));
      if (!freq_tag) return false;

      const frequency = parseFloat(freq_tag.split(":")[1]);
      return frequency > 1;
    }
  );

  return words.map(
    (word: { word: string; score: number; tags: string[] }) => word.word
  );
};

export const is_valid_five_letter_word = async (word: string) => {
  const data = await axios_get("https://api.datamuse.com/words", {
    sp: word, // 5 character words
    max: 1,
  });

  return data.length > 0 && data[0].word.length === 5;
};
