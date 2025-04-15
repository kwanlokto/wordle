export const get_random_word = (five_letter_words: string[]) => {
  const randomIndex = Math.floor(Math.random() * five_letter_words.length);
  return five_letter_words[randomIndex];
};
