interface LetterProps {
  guess: string;
  letter_color: string;
}
export const Letter = ({ guess, letter_color }: LetterProps) => {
  return (
    <div className="flex space-x-2">
      <div
        className={`w-12 h-12 flex items-center justify-center text-xl font-bold rounded ${letter_color}`}
      >
        {guess}
      </div>
    </div>
  );
};
