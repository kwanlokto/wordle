"use client";

import { Letter } from "@/ui/character";
import { useState } from "react";

const WORD = "APPLE";

export default function Home() {
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
    </div>
  );
}
