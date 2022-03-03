import { ToWords } from 'to-words';

const getCurrencyString = (value: number): string => {
  const toWords = new ToWords();
  return `Rs. ${toWords.convert(value)} Only`;
};

export default getCurrencyString;
