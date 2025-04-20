"use client";

import { COLORS, Guess, Letter } from "@/interface/word";
import {
  format_guess,
  get_possible_words,
  is_valid_word,
} from "@/lib/api/words";
import { useEffect, useState } from "react";

import { AlertModal } from "@/ui/alert_modal";
import { ColoredLetter } from "@/ui/letter";
import { SuccessModal } from "@/ui/success_modal";
import { WordleKeyboard } from "@/ui/keyboard";
import { get_random_word } from "@/lib/word_generator";

export default function Home() {
  const [word_length, set_word_length] = useState(5);
  const [word, set_word] = useState<string | null>(null);
  const [guesses, set_guesses] = useState<Guess[]>([]);
  const [input, set_input] = useState("");
  const [used_keys, set_used_keys] = useState<{ [key: string]: string }>({});

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
    if (input.length !== word_length) return;
    else if (!(await is_valid_word(input))) {
      set_alert_text("Word not found");
      set_show_alert_modal(true);
      return;
    } else if (guesses.filter((guess) => guess.word === input).length > 0) {
      set_alert_text("Word already guessed");
      set_show_alert_modal(true);
      return;
    }

    const new_guess = format_guess(input, word ?? "");
    const local_used_keys = { ...used_keys };

    new_guess.letter_list.forEach((letter: Letter) => {
      if (letter.color === COLORS.GREEN) {
        local_used_keys[letter.value] = "correct";
      } else if (
        local_used_keys[letter.value] !== "correct" &&
        letter.color === COLORS.YELLOW
      ) {
        local_used_keys[letter.value] = "present";
      } else if (
        local_used_keys[letter.value] !== "correct" &&
        local_used_keys[letter.value] !== "present" &&
        letter.color === COLORS.GREY
      ) {
        local_used_keys[letter.value] = "absent";
      }
    });
    set_used_keys(local_used_keys);

    set_guesses([...guesses, new_guess]);

    if (new_guess.word === word) {
      set_show_congrats_modal(true);
    }

    set_input("");
  };

  const init_game = async (length: number) => {
    const local_possible_words = await get_possible_words(length);
    const random_word = get_random_word(local_possible_words);
    set_word(random_word.toUpperCase());
    set_guesses([]);
    set_input("");
    set_show_congrats_modal(false);
    set_used_keys({});
  };

  const is_complete = () => {
    return !(
      guesses.length < word_length + 1 &&
      (guesses.length === 0 || guesses[guesses.length - 1]?.word !== word)
    );
  };
  useEffect(() => {
    init_game(word_length);
  }, [word_length]);

  return (
    <div className="text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-4">Wordle</h1>

      <div className="flex mb-4 bg-gray-200 dark:bg-gray-700 p-1 rounded-full space-x-1">
        {[4, 5, 6].map((len) => (
          <button
            key={len}
            className={`px-4 py-1 rounded-full transition-colors duration-200 text-sm font-medium
        ${
          word_length === len
            ? "bg-gray-500 text-white shadow"
            : "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        }`}
            onClick={() => set_word_length(len)}
          >
            {len}-Letter
          </button>
        ))}
      </div>

      <div className="space-y-2 mb-2">
        {guesses.map((guess, i) => (
          <div key={i} className="flex space-x-2">
            {guess.letter_list.map((letter, j) => (
              <ColoredLetter
                key={j}
                color={letter.color}
                letter={letter.value}
              />
            ))}
          </div>
        ))}
      </div>

      {word !== null && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (guesses.length < word_length + 1) {
              handle_guess();
            }
          }}
          className="flex flex-col items-center w-full"
        >
          <div className="flex space-x-2 mb-8">
            {Array.from({ length: word_length }).map((_, i) => {
              const char = input[i] || "";
              return <ColoredLetter key={i} letter={char} />;
            })}
          </div>
          {is_complete() ? (
            <button
              onClick={() => init_game(word_length)}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-xl font-semibold shadow-md hover:bg-blue-700 active:scale-95 transition"
            >
              Play Again
            </button>
          ) : (
            <input
              value={input}
              onChange={(e) => set_input(e.target.value.toUpperCase())}
              maxLength={word_length}
              className="dark:text-white text-black px-3 py-2 rounded mb-2 w-50 text-center border border-black dark:border-white"
              placeholder={`Guess a ${word_length}-letter word`}
            />
          )}

          <WordleKeyboard
            on_key_press={(key) => {
              if (key === "Enter") handle_guess();
              else if (key === "Back") set_input(input.slice(0, -1));
              else if (key.length === 1 && input.length < word_length)
                set_input((prev) => prev + key);
            }}
            used_keys={used_keys}
            disabled={is_complete()}
          />
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
