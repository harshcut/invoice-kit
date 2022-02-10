const getCurrencyFormat = (value: number, symbol?: boolean): string => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })
    .format(value)
    .slice(symbol ? 0 : 1);
};

export default getCurrencyFormat;
