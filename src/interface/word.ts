export interface Guess {
  letter_list: Letter[];
  word: string;
}

export interface Letter {
  value: string;
  color: string;
}

export const COLORS = {
  GREEN: "bg-green-500",
  YELLOW: "bg-yellow-400",
  GREY: "bg-gray-400",
};
