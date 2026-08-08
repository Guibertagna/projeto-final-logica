const DATE_PATTERN = /^(\d{2})\/(\d{2})\/(\d{4})$/;

export const isValidBrazilianDate = (date: string): boolean => {
  const match = DATE_PATTERN.exec(date.trim());

  if (!match) {
    return false;
  }

  const day = Number(match[1]);
  const month = Number(match[2]);

  return day >= 1 && day <= 31 && month >= 1 && month <= 12;
};

export const isValidPriority = (priority: string): boolean => {
  const number = Number(priority);
  return number >= 1 && number <= 10;
};