"use client";

import { ColoredLetter, Letter } from "@/ui/letter";
import {
  get_five_letter_words,
  is_valid_five_letter_word,
} from "@/lib/api/five_letter_words";
import { useEffect, useState } from "react";

import { get_random_word } from "@/lib/word_generator";

interface Guess {
  letter_list: Letter[];
  word: string;
}

const COLORS = {
  GREEN: "bg-green-500",
  YELLOW: "bg-yellow-400",
  GREY: "bg-gray-400",
};

export default function Home() {
  const [five_letter_words, set_five_letter_words] = useState<string[]>([]);
  const [word, set_word] = useState<string | null>(null);
  const [guesses, set_guesses] = useState<Guess[]>([]);
  const [input, set_input] = useState("");

  const handle_guess = async () => {
    if (input.length !== 5) return;
    else if (!(await is_valid_five_letter_word(input))) {
      alert("Word is not in the system");
      return;
    }
    else if (guesses.filter((guess) => guess.word === input).length > 0) {
      alert("Word already guessed");
      return;
    }
    set_guesses([...guesses, format_guess(input)]);
    set_input("");
  };

  /**
   * Determines the background color class for a guessed letter in a word-guessing game.
   *
   * - Returns green if the letter is in the correct position.
   * - Returns yellow if the letter exists in the word but in the wrong position.
   * - Returns gray if the letter does not exist in the word.
   *
   * @param {string} input - The guessed word (must be the same length as the actual word).
   * @returns {Guess} A Tailwind CSS background color class representing the letter's correctness.
   */
  const format_guess = (input: string): Guess => {
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
            {guess.letter_list.map((letter, j) => (
              <ColoredLetter key={j} guess={letter} />
            ))}
          </div>
        ))}
      </div>

      {word !== null && (
        <form
          onSubmit={(e) => {
            e.preventDefault(); // prevent page reload
            if (guesses.length < 5) handle_guess(); // call your submit function
          }}
          className="flex flex-col items-center"
        >
          <input
            value={input}
            disabled={guesses.length >= 5}
            onChange={(e) => set_input(e.target.value.toUpperCase())}
            maxLength={5}
            className="dark:text-white text-black px-3 py-2 rounded mb-2 w-40 text-center"
            placeholder="Guess a word"
          />
          {guesses.length < 5 ? (
            <button className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600">
              Submit
            </button>
          ) : (
            <button
              className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => {
                set_word(get_random_word(five_letter_words));
                set_guesses([]);
              }}
            >
              Retry
            </button>
          )}
        </form>
      )}
    </div>
  );
}
