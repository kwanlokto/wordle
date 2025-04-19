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
        <div key={rowIndex} className="flex justify-center gap-1">
          {row.map((key) => {
            const key_color =
              used_keys[key] === "correct"
                ? COLORS.GREEN
                : used_keys[key] === "present"
                ? COLORS.YELLOW
                : used_keys[key] === "absent"
                ? COLORS.GREY
                : "bg-gray-700";

            const is_special_key = key === "Enter" || key === "Back";
            let display = key;
            if (key === "Back") {
              display = "⌫";
            } else if (key === "Enter") {
              display = "↵";
            }

            return (
              <button
                type="button"
                key={key}
                disabled={disabled}
                onClick={() => on_key_press(key)}
                className={`flex-1 min-w-[10%] sm:min-w-[40px] max-w-[60px] rounded py-3 text-sm sm:text-base font-semibold transition ${
                  is_special_key ? "flex-[1.5]" : ""
                } ${key_color} ${
                  disabled
                    ? "bg-gray-400 cursor-not-allowed text-gray-200"
                    : "text-white hover:brightness-110 active:scale-95"
                }`}
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
