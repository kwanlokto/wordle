"use client";

import { useEffect, useState } from "react";

import { Letter } from "@/ui/character";
import { get_five_letter_words } from "@/lib/api/five_letter_words";
import { get_random_word } from "@/lib/word_generator";

const WORD = "APPLE";

export default function Home() {
  const [five_letter_words, set_five_letter_words] = useState<string[]>([]);
  const [word, set_word] = useState<string | null>(null);
  const [guesses, set_guesses] = useState<string[]>([]);
  const [input, set_input] = useState("");

  const handleGuess = () => {
    if (input.length !== 5) return;
    set_guesses([...guesses, input.toUpperCase()]);
    set_input("");
  };

  const get_letter_color = (letter: string, index: number) => {
    if (WORD[index] === letter) return "bg-green-500";
    else if (WORD.includes(letter)) return "bg-yellow-400";
    else return "bg-gray-400";
  };

  useEffect(() => {
    const init_five_letter_words = async () => {
      const local_five_letter_words = await get_five_letter_words();
      set_five_letter_words(local_five_letter_words);
      set_word(get_random_word(local_five_letter_words));
    };
    init_five_letter_words();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-4">Wordle</h1>

      <div className="space-y-2 mb-4">
        {guesses.map((guess, i) => (
          <Letter
            key={i}
            guess={guess}
            letter_color={get_letter_color(guess, i)}
          />
        ))}
      </div>

      {word !== null && (
        <>
          <input
            value={input}
            onChange={(e) => set_input(e.target.value.toUpperCase())}
            maxLength={5}
            className="dark:text-white text-black px-3 py-2 rounded mb-2 w-40 text-center"
            placeholder="Guess a word"
          />
          <button
            onClick={handleGuess}
            className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </>
      )}
    </div>
  );
}
