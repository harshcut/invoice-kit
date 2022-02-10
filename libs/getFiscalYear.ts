const getFiscalYear = (date?: Date): string => {
  const today = date ?? new Date();
  if (today.getMonth() > 3)
    return today.getFullYear().toString() + '-' + (today.getFullYear() + 1).toString().slice(-2);
  return (today.getFullYear() - 1).toString() + '-' + today.getFullYear().toString().slice(-2);
};

export default getFiscalYear;
