import { COLORS, Guess, Letter } from "@/interface/word";

import { axios_get } from "./base";

export const get_possible_words = async (word_length: number) => {
  const data = await axios_get("https://api.datamuse.com/words", {
    sp: "?".repeat(word_length),
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

export const is_valid_word = async (word: string) => {
  const data = await axios_get("https://api.datamuse.com/words", {
    sp: word, // possible word
  });

  return data.length > 0 && data[0].word.toUpperCase() === word.toUpperCase();
};

/**
 * Determines the background color class for a guessed letter in a word-guessing game.
 *
 * - Returns green if the letter is in the correct position.
 * - Returns yellow if the letter exists in the word but in the wrong position.
 * - Returns gray if the letter does not exist in the word.
 *
 * @param {string} input - The guessed word (must be the same length as the actual word).
 * @param {string} word - The actual word
 * @returns {Guess} A Tailwind CSS background color class representing the letter's correctness.
 */

export const format_guess = (input: string, word: string): Guess => {
  if (word === null) return { letter_list: [], word: "" };

  const used_idxs: number[] = [];
  const colored_letters: Letter[] = input.split("").map((letter, index) => {
    if (letter === word[index]) {
      used_idxs.push(index);
      return {
        value: letter,
        color: COLORS.GREEN,
      };
    }
    return {
      value: letter,
      color: COLORS.GREY,
    };
  });

  // Second pass: Check for present but misplaced letters (yellow)
  input.split("").forEach((char, i) => {
    if (colored_letters[i].color === COLORS.GREEN) return;

    word.split("").forEach((w_char, j) => {
      if (
        !used_idxs.includes(j) &&
        char === w_char &&
        colored_letters[i].color !== COLORS.YELLOW
      ) {
        colored_letters[i].color = COLORS.YELLOW;
        used_idxs.push(j);
      }
    });
  });

  return {
    letter_list: colored_letters,
    word: input,
  };
};
