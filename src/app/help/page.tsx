import Head from "next/head";
import React from "react";

const HowToPlay = () => {
  return (
    <>
      <Head>
        <title>How to Play Wordle</title>
      </Head>
      <main className="min-h-screen px-6 text-gray-800 dark:text-gray-100">
        <div className="max-w-3xl mx-auto bg-white dark:bg-gray-600 rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-4 text-center">
            How to Play Wordle
          </h1>
          <p className="mb-4">
            Wordle is a word guessing game where you have six tries to guess a
            secret five-letter word.
          </p>

          <ol className="list-decimal list-inside space-y-2">
            <li>Type a valid five-letter word and press Enter.</li>
            <li>
              The game will give feedback using colored tiles:
              <ul className="list-disc list-inside ml-5 mt-1 space-y-1">
                <li>
                  <span className="font-bold text-green-600 dark:text-green-400">
                    Green
                  </span>
                  : Letter is correct and in the right position.
                </li>
                <li>
                  <span className="font-bold text-yellow-500 dark:text-yellow-400">
                    Yellow
                  </span>
                  : Letter is in the word but in the wrong position.
                </li>
                <li>
                  <span className="font-bold text-gray-500 dark:text-gray-400">
                    Gray
                  </span>
                  : Letter is not in the word.
                </li>
              </ul>
            </li>
            <li>Use the clues to narrow down your guesses.</li>
            <li>Guess the word correctly within six tries to win!</li>
          </ol>

          <p className="mt-6 italic text-center text-sm text-gray-500 dark:text-gray-400">
            Good luck and have fun!
          </p>
        </div>
      </main>
    </>
  );
};

export default HowToPlay;
