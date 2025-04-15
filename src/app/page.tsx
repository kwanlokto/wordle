"use client";

import {
  get_five_letter_words,
  is_valid_five_letter_word,
} from "@/lib/api/five_letter_words";
import { useEffect, useState } from "react";

import { Letter } from "@/ui/letter";
import { get_random_word } from "@/lib/word_generator";

export default function Home() {
  const [five_letter_words, set_five_letter_words] = useState<string[]>([]);
  const [word, set_word] = useState<string | null>(null);
  const [guesses, set_guesses] = useState<string[]>([]);
  const [input, set_input] = useState("");

  const handle_guess = async () => {
    if (input.length !== 5) return;
    else if (!(await is_valid_five_letter_word(input))) {
      alert("Word is not in the system");
      return;
    } else if (guesses.includes(input)) {
      alert("Word already guessed");
      return;
    }
    set_guesses([...guesses, input.toUpperCase()]);
    set_input("");
  };

  /**
   * Determines the background color class for a guessed letter in a word-guessing game.
   *
   * - Returns green if the letter is in the correct position.
   * - Returns yellow if the letter exists in the word but in the wrong position.
   * - Returns gray if the letter does not exist in the word.
   *
   * @param {string} guess - The guessed word (must be the same length as the actual word).
   * @param {number} index - The index of the current letter being evaluated.
   * @returns {string} A Tailwind CSS background color class representing the letter's correctness.
   */
  const get_letter_color = (guess: string, index: number): string => {
    if (word === null) return "";

    const used_idxs: number[] = [];
    const colors: ("bg-green-500" | "bg-gray-400" | "bg-yellow-400")[] = word
      .split("")
      .map((letter, index) => {
        if (letter === guess[index]) {
          used_idxs.push(index);
          return "bg-green-500";
        }
        return "bg-gray-400";
      });

    // Second pass: Check for present but misplaced letters (yellow)
    guess.split("").forEach((char, i) => {
      if (colors[i] === "bg-green-500") return;

      word.split("").forEach((w_char, j) => {
        if (
          !used_idxs.includes(j) &&
          char === w_char &&
          colors[i] !== "bg-yellow-400"
        ) {
          colors[i] = "bg-yellow-400";
          used_idxs.push(j);
        }
      });
    });
    //
    const color = colors[index];
    return color;
  };

  useEffect(() => {
    const init_five_letter_words = async () => {
      const local_five_letter_words = await get_five_letter_words();
      set_five_letter_words(local_five_letter_words);
      const random_word = "APPLE";
      console.log(`WORD: ${random_word}`);
      set_word(random_word);
    };
    init_five_letter_words();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-4">Wordle</h1>

      <div className="space-y-2 mb-4">
        {guesses.map((guess, i) => (
          <div key={i} className="flex space-x-2">
            {guess.split("").map((letter, j) => (
              <Letter
                key={j}
                guess={letter}
                letter_color={get_letter_color(guess, j)}
              />
            ))}
          </div>
        ))}
      </div>

      {word !== null && (
        <form
          onSubmit={(e) => {
            e.preventDefault(); // prevent page reload
            handle_guess(); // call your submit function
          }}
          className="flex flex-col items-center"
        >
          <input
            value={input}
            onChange={(e) => set_input(e.target.value.toUpperCase())}
            maxLength={5}
            className="dark:text-white text-black px-3 py-2 rounded mb-2 w-40 text-center"
            placeholder="Guess a word"
          />
          <button
            onClick={handle_guess}
            className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
}
