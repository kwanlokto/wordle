"use client";

import { ColoredLetter, Letter } from "@/ui/letter";
import {
  get_possible_words,
  is_valid_word,
} from "@/lib/api/words";
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
  const WORD_LENGTH = 5
  const [possible_words, set_possible_words] = useState<string[]>([]);
  const [word, set_word] = useState<string | null>(null);
  const [guesses, set_guesses] = useState<Guess[]>([]);
  const [input, set_input] = useState("");
  const [show_modal, set_show_modal] = useState(false); // State to control the modal visibility

  const handle_guess = async () => {
    if (input.length !== WORD_LENGTH) return;
    else if (!(await is_valid_word(input))) {
      alert("Word is not in the system");
      return;
    }
    else if (guesses.filter((guess) => guess.word === input).length > 0) {
      alert("Word already guessed");
      return;
    }

    const newGuess = format_guess(input);
    set_guesses([...guesses, newGuess]);

    // Check if the word is correct
    if (newGuess.word === word) {
      set_show_modal(true); // Show congratulations modal
    }

    set_input("");
  };

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
    const init_possible_words = async () => {
      const local_possible_words = await get_possible_words(WORD_LENGTH);
      set_possible_words(local_possible_words);
      const random_word = get_random_word(local_possible_words); // Change to dynamic word if necessary
      console.log(`WORD: ${random_word}`);
      set_word(random_word);
    };
    init_possible_words();
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
            maxLength={WORD_LENGTH}
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
                set_word(get_random_word(possible_words));
                set_guesses([]);
                set_show_modal(false); // Reset modal visibility
              }}
            >
              Retry
            </button>
          )}
        </form>
      )}

      {/* Congratulations Modal */}
      {show_modal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white text-black p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold">Congratulations!</h2>
            <p>You guessed the word correctly!</p>
            <button
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              onClick={() => set_show_modal(false)} // Hide modal
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
