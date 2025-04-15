"use client";

import {
  format_guess,
  get_possible_words,
  is_valid_word,
} from "@/lib/api/words";
import { useEffect, useState } from "react";

import { AlertModal } from "@/ui/alert_modal";
import { ColoredLetter } from "@/ui/letter";
import { Guess } from "@/interface/word";
import { SuccessModal } from "@/ui/success_modal";
import { get_random_word } from "@/lib/word_generator";

export default function Home() {
  const WORD_LENGTH = 5;
  const [possible_words, set_possible_words] = useState<string[]>([]);
  const [word, set_word] = useState<string | null>(null);
  const [guesses, set_guesses] = useState<Guess[]>([]);
  const [input, set_input] = useState("");

  const [show_congrats_modal, set_show_congrats_modal] = useState(false);
  const [show_alert_modal, set_show_alert_modal] = useState(false);
  const [alert_text, set_alert_text] = useState("");

  /**
   * Handles the user's word guess in the Wordle-style game.
   *
   * - Validates the input word's length.
   * - Checks if the word exists in the word list using `is_valid_word`.
   * - Ensures the word hasn't been guessed already.
   * - Formats the guess and updates the guess history.
   * - Displays a congratulatory modal if the guess is correct.
   * - Triggers alert modals for invalid or repeated guesses.
   * - Resets the input field after processing.
   *
   * @async
   * @function
   * @returns {Promise<void>} A promise that resolves when the guess has been processed.
   */
  const handle_guess = async (): Promise<void> => {
    if (input.length !== WORD_LENGTH) return;
    else if (!(await is_valid_word(input))) {
      set_alert_text("Word is not in the system");
      set_show_alert_modal(true);
      return;
    } else if (guesses.filter((guess) => guess.word === input).length > 0) {
      set_alert_text("Word already guessed");
      set_show_alert_modal(true);
      return;
    }

    const new_guess = format_guess(input, word ?? "");
    set_guesses([...guesses, new_guess]);

    // Check if the word is correct
    if (new_guess.word === word) {
      set_show_congrats_modal(true); // Show congratulations modal
    }

    set_input("");
  };

  useEffect(() => {
    /**
     * Inits all possible words
     */
    const init_possible_words = async () => {
      const local_possible_words = await get_possible_words(WORD_LENGTH);
      set_possible_words(local_possible_words);
      const random_word = get_random_word(local_possible_words);
      console.log(`WORD: ${random_word}`);
      set_word(random_word.toUpperCase());
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
          {guesses.length < 5 &&
          (guesses.length === 0 ||
            guesses[guesses.length - 1]?.word !== word) ? (
            <button className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600">
              Submit
            </button>
          ) : (
            <button
              className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => {
                set_word(get_random_word(possible_words).toUpperCase());
                set_guesses([]);
                set_show_congrats_modal(false); // Reset modal visibility
              }}
            >
              Retry
            </button>
          )}
        </form>
      )}

      <SuccessModal
        show_modal={show_congrats_modal}
        set_show_modal={set_show_congrats_modal}
        text="You guessed the word correctly!"
      />
      <AlertModal
        show_modal={show_alert_modal}
        set_show_modal={set_show_alert_modal}
        text={alert_text}
      />
    </div>
  );
}
