import React from "react";

interface WordleKeyboardProps {
  on_key_press: (key: string) => void;
  used_keys?: { [key: string]: string }; // Optional: track used keys with color status
}

const keyboardRows = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Enter", "Z", "X", "C", "V", "B", "N", "M", "Back"],
];

export const WordleKeyboard: React.FC<WordleKeyboardProps> = ({
  on_key_press,
  used_keys = {},
}) => {
  return (
    <div className="space-y-2 mt-4">
      {keyboardRows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center space-x-1">
          {row.map((key) => {
            const key_color =
              used_keys[key] === "correct"
                ? "bg-green-600"
                : used_keys[key] === "present"
                ? "bg-yellow-500"
                : used_keys[key] === "absent"
                ? "bg-gray-600"
                : "bg-gray-800";

            const is_special_key = key === "Enter" || key === "Back";
            const display = key === "Back" ? "⌫" : key;

            return (
              <button
                key={key}
                onClick={() => on_key_press(key)}
                className={`text-white rounded px-3 py-2 text-sm font-semibold ${key_color} ${
                  is_special_key ? "w-16" : "w-10"
                } hover:brightness-110 active:scale-95 transition`}
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
