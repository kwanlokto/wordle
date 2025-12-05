import { useEffect, useState } from "react";

interface LetterProps {
  color?: string | null; // color assigned after guess
  letter: string;
  delay?: number; // optional staggered animation
}

export const ColoredLetter = ({
  color = null,
  letter,
  delay = 0,
}: LetterProps) => {
  const [flipped, setFlipped] = useState(false);

  // Trigger flip when color changes from null to a value
  useEffect(() => {
    if (color !== null) {
      const timer = setTimeout(() => setFlipped(true), delay);
      return () => clearTimeout(timer);
    } else {
      setFlipped(false); // reset if color is removed
    }
  }, [color, delay]);

  return (
    <div
      style={{ perspective: 600 }}
      className="w-12 h-12 flex items-center justify-center"
    >
      <div
        style={{
          transformStyle: "preserve-3d",
          transition: "transform 0.5s ease-in-out",
          transform: flipped ? "rotateX(180deg)" : "rotateX(0deg)",
          width: "100%",
          height: "100%",
          position: "relative",
        }}
      >
        {/* Front face */}
        <div
          className="absolute w-full h-full flex items-center justify-center border border-gray-400 rounded font-bold text-xl"
          style={{ backfaceVisibility: "hidden" }}
        >
          {letter}
        </div>

        {/* Back face */}
        <div
          className={`absolute w-full h-full flex items-center justify-center rounded font-bold text-xl
    ${flipped ? color : "bg-transparent border border-gray-400 text-black"}
  `}
          style={{ backfaceVisibility: "hidden", transform: "rotateX(180deg)" }}
        >
          {letter}
        </div>
      </div>
    </div>
  );
};
