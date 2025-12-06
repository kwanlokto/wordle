"use client";

import { COLORS, Guess, Letter } from "@/interface/word";
import {
  format_guess,
  get_possible_words,
  is_valid_word,
} from "@/lib/api/words";
import { useCallback, useEffect, useState } from "react";

import { AlertNotification } from "@/ui/alert_notification";
import { ColoredLetter } from "@/ui/letter";
import { CustomModal } from "@/ui/custom_modal";
import { WordleKeyboard } from "@/ui/keyboard";
import { get_random_word } from "@/lib/word_generator";

export default function Home() {
  // -------------------------
  // Game State
  // -------------------------
  const [word_length, set_word_length] = useState(5); // Current difficulty (4/5/6)
  const [word, set_word] = useState<string | null>(null); // The chosen hidden word
  const [guesses, set_guesses] = useState<Guess[]>([]); // All previous guesses
  const [input, set_input] = useState(""); // Active user input for current guess
  const [used_keys, set_used_keys] = useState<{ [key: string]: string }>({});
  const [is_complete, set_is_complete] = useState(false); // Whether game is finished
  const [show_congrats_modal, set_show_congrats_modal] = useState(false);
  const [show_try_again_modal, set_show_try_again_modal] = useState(false);
  const [show_alert_modal, set_show_alert_modal] = useState(false);
  const [alert_text, set_alert_text] = useState("");

  /**
   * Handles the user's guess.
   *
   * Responsibilities:
   * - Validate word length
   * - Validate real dictionary word
   * - Prevent duplicate guesses
   * - Color + format guess results
   * - Update keyboard highlights
   * - Show success modal if correct
   * - Reset input afterwards
   */
  const handle_guess = useCallback(async (): Promise<void> => {
    // Invalid length → ignore
    if (input.length !== word_length) return;

    // Validate dictionary word
    if (!(await is_valid_word(input))) {
      set_alert_text("Word not found");
      set_show_alert_modal(true);
      return;
    }

    // Prevent repeated guesses
    if (guesses.some((guess) => guess.word === input)) {
      set_alert_text("Word already guessed");
      set_show_alert_modal(true);
      return;
    }

    // Format letters & colors (GREEN/YELLOW/GRAY)
    const new_guess = format_guess(input, word ?? "");

    // Update keyboard colors safely
    const local_used_keys = { ...used_keys };

    new_guess.letter_list.forEach((letter: Letter) => {
      // Priority order: correct > present > absent
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

    // Append the guess to the list
    set_guesses([...guesses, new_guess]);

    // Trigger success modal after flip animation
    if (new_guess.word === word) {
      setTimeout(() => set_show_congrats_modal(true), 1500);
    } else if (guesses.length + 1 >= word_length + 1) {
      // Reveal word if max attempts reached
      setTimeout(() => {
        set_show_try_again_modal(true);
      }, 1500);
    }

    // Clear input for next word
    set_input("");
  }, [guesses, input, used_keys, word, word_length]);

  /**
   * Initializes a new game when:
   * - Component loads
   * - Word length changes
   * - Player clicks "Play Again"
   */
  const init_game = async (length: number) => {
    const local_possible_words = await get_possible_words(length);
    const random_word = get_random_word(local_possible_words);
    console.log(random_word);

    set_word(random_word.toUpperCase());
    set_guesses([]);
    set_input("");
    set_show_congrats_modal(false);
    set_show_try_again_modal(false)
    set_used_keys({});
  };

  /**
   * Runs whenever the word length changes (4/5/6)
   * → Fetch new word list
   * → Pick new random word
   */
  useEffect(() => {
    init_game(word_length);
  }, [word_length]);

  /**
   * Handles all user keyboard input:
   * - Enter = submit guess
   * - Backspace = delete character
   * - Letter keys A–Z = add letter
   *
   * Disabled when game is complete
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (is_complete) return;

      const key = e.key.toUpperCase();

      if (key === "ENTER") {
        handle_guess();
      } else if (key === "BACKSPACE") {
        set_input((prev) => prev.slice(0, -1));
      } else if (/^[A-Z]$/.test(key) && input.length < word_length) {
        set_input((prev) => prev + key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [input, word_length, is_complete, handle_guess]);

  /**
   * Checks whether the game is over:
   * - Word has been guessed
   * - OR max attempts reached
   *
   * Uses timeout to allow flip animation before overlay appears
   */
  useEffect(() => {
    if (!word) set_is_complete(false);

    const local_is_complete =
      guesses.some((g) => g.word === word) || guesses.length >= word_length + 1;

    if (local_is_complete) {
      setTimeout(() => set_is_complete(true), 1500);
    } else {
      set_is_complete(false);
    }
  }, [guesses, word, word_length]);

  // -------------------------
  // UI Rendering
  // -------------------------
  return (
    <div className="text-white flex flex-col items-center justify-center p-1 sm:p-4">
      <h1 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-4">Wordle</h1>

      {/* Difficulty Selector */}
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

      {/* Only render board after word is loaded */}
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
          {/* Render previous guesses */}
          {guesses.map((guess, i) => (
            <div key={i} className="flex space-x-2 mb-2">
              {guess.letter_list.map((letter, j) => (
                <ColoredLetter
                  key={j}
                  color={letter.color}
                  letter={letter.value}
                  delay={j * 150}
                />
              ))}
            </div>
          ))}

          {/* Active row (current input) */}
          {guesses.length < word_length + 1 && (
            <div className="flex space-x-2 mb-2">
              {Array.from({ length: word_length }).map((_, i) => {
                const char = input[i] || "";
                return <ColoredLetter key={i} letter={char} />;
              })}
            </div>
          )}

          {/* Empty placeholder rows */}
          {Array.from({ length: word_length - guesses.length }).map((_, i) => (
            <div key={i} className="flex space-x-2 mb-2">
              {Array.from({ length: word_length }).map((_, j) => (
                <ColoredLetter key={j} letter="" />
              ))}
            </div>
          ))}

          {/* Keyboard + Play Again overlay */}
          <div className="relative w-full flex flex-col items-center space-y-4">
            <WordleKeyboard
              on_key_press={(key) => {
                if (key === "Enter") handle_guess();
                else if (key === "Back") set_input(input.slice(0, -1));
                else if (key.length === 1 && input.length < word_length)
                  set_input((prev) => prev + key);
              }}
              used_keys={used_keys}
              disabled={is_complete}
            />

            {/* Play Again button overlay */}
            {is_complete && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <button
                  onClick={() => init_game(word_length)}
                  className="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold shadow-lg hover:bg-blue-700 active:scale-95 transition z-10 pointer-events-auto"
                  style={{ minWidth: "180px" }}
                >
                  Play Again
                </button>
              </div>
            )}
          </div>
        </form>
      )}

      {/* Modals */}
      <CustomModal
        show_modal={show_congrats_modal}
        set_show_modal={(show_modal) => {
          set_show_congrats_modal(show_modal);
          if (!show_modal) init_game(word_length);
        }}
        title="🎉 Congrats!"
        text="You guessed the word correctly!"
      />

      <CustomModal
        show_modal={show_try_again_modal}
        set_show_modal={(show_modal) => {
          set_show_try_again_modal(show_modal);
          if (!show_modal) init_game(word_length);
        }}
        title="Sorry Try Again!"
        text={`The word was: ${word}`}
      />

      <AlertNotification
        show_modal={show_alert_modal}
        set_show_modal={set_show_alert_modal}
        text={alert_text}
      />
    </div>
  );
}
