export const get_random_word = (possible_words: string[]) => {
  const randomIndex = Math.floor(Math.random() * possible_words.length);
  return possible_words[randomIndex];
};
