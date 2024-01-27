const makeFirstLetterUpperCase = (word: string) => {
  const firstLetter = word.charAt(0).toUpperCase();
  return firstLetter + word.slice(1);
};

export const Utils = { makeFirstLetterUpperCase };
