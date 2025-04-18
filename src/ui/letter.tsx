interface LetterProps {
  color?: string | null;
  letter: string;
}

export const ColoredLetter = ({ color = null, letter }: LetterProps) => {
  return (
    <div className="flex space-x-2">
      <div
        className={`w-12 h-12 flex items-center justify-center text-xl font-bold rounded  ${
          color === null && "border border-gray-400" 
        } ${color}`}
      >
        {letter}
      </div>
    </div>
  );
};
