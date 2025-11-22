"use client";

import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

const tabs = [{ label: "Home", href: "/" }, { label: "How To Play" }];

interface NavButtonProps {
  label: string;
  onClick?: () => void;
}

const NavButton = ({ label, onClick }: NavButtonProps) => (
  <button
    onClick={onClick}
    className="text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition"
  >
    {label}
  </button>
);

export const Navbar = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      {/* NAVBAR */}
      <div className="w-full border-b border-gray-700 flex justify-end gap-4 p-4">
        {tabs.map((tab) =>
          typeof tab.href === "undefined" ? (
            <NavButton
              key={tab.label}
              label={tab.label}
              onClick={() => setShowModal(true)}
            />
          ) : (
            <Link key={tab.href} href={tab.href}>
              <NavButton label={tab.label} />
            </Link>
          )
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            className="bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-100 
                    rounded-2xl shadow-xl max-w-lg w-full p-8 relative"
          >
            {/* Close Button (top-right X) */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white
                   dark:hover:text-gray-200 transition text-xl"
            >
              ×
            </button>

            {/* Title */}
            <h1 className="text-2xl font-bold mb-4 text-center">
              How to Play Wordle
            </h1>

            {/* Content */}
            <p className="mb-4">
              Wordle is a word guessing game where you have six tries to guess a
              secret five-letter word.
            </p>

            <ol className="list-decimal list-inside space-y-3">
              <li>Type a valid five-letter word and press Enter.</li>

              <li>
                Feedback appears using colored tiles:
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>
                    <span className="font-bold text-green-600 dark:text-green-400">
                      Green
                    </span>
                    — Correct letter, correct position.
                  </li>
                  <li>
                    <span className="font-bold text-yellow-500 dark:text-yellow-400">
                      Yellow
                    </span>
                    — Correct letter, wrong position.
                  </li>
                  <li>
                    <span className="font-bold text-gray-600 dark:text-gray-400">
                      Gray
                    </span>
                    — Letter not in the word.
                  </li>
                </ul>
              </li>

              <li>Use the clues to narrow down your guesses.</li>
              <li>Guess the word within six tries to win!</li>
            </ol>

            <p className="mt-6 text-center italic text-sm text-gray-500 dark:text-gray-400">
              Good luck and have fun!
            </p>
          </div>
        </div>
      )}
    </>
  );
};
