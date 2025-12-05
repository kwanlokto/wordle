import { COLORS } from "@/interface/word";
import React from "react";

interface WordleKeyboardProps {
  on_key_press: (key: string) => void;
  used_keys?: { [key: string]: string };
  disabled: boolean;
}

const keyboardRows = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Enter", "Z", "X", "C", "V", "B", "N", "M", "Back"],
];

export const WordleKeyboard: React.FC<WordleKeyboardProps> = ({
  on_key_press,
  used_keys = {},
  disabled,
}) => {
  return (
    <div className="space-y-2 mt-4 w-full max-w-md mx-auto">
      {keyboardRows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className={`flex justify-center gap-1 ${
            rowIndex === 1 ? "px-[4.5%]" : ""
          }`}
        >
          {row.map((key) => {
            const key_color =
              used_keys[key] === "correct"
                ? COLORS.GREEN
                : used_keys[key] === "present"
                ? COLORS.YELLOW
                : used_keys[key] === "absent"
                ? COLORS.GREY
                : "bg-transparent border border-gray-500 text-black dark:text-white";

            const is_special_key = key === "Enter" || key === "Back";
            let display = key;
            if (key === "Back") {
              display = "⌫";
            }

            return (
              <button
                type="button"
                key={key}
                disabled={disabled}
                onClick={() => on_key_press(key)}
                className={`min-w-[9%] max-w-[80px] rounded py-4 text-sm sm:text-base font-semibold transition ${
                  is_special_key ? "flex-[1.5]" : "flex-1"
                } ${
                  disabled
                    ? "bg-gray-600 cursor-not-allowed text-gray-500"
                    : key_color
                } ${!disabled ? "hover:brightness-110 active:scale-95" : ""}`}
              >
                {display}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};
