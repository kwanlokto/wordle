import { Letter } from "@/interface/word";

interface LetterProps {
  guess: Letter;
}

export const ColoredLetter = ({ guess }: LetterProps) => {
  return (
    <div className="flex space-x-2">
      <div
        className={`w-12 h-12 flex items-center justify-center text-xl font-bold rounded ${guess.color}`}
      >
        {guess.value}
      </div>
    </div>
  );
};
