import { isValidBrazilianDate } from "./validator";

export const parseBrazilianDate = (date: string): Date => {
  const trimmedDate = date.trim();

  if (!isValidBrazilianDate(trimmedDate)) {
    throw new Error("Data inválida. Use o formato dd/mm/yyyy.");
  }

  const [day, month, year] = trimmedDate.split("/").map(Number);

  return new Date(year, month - 1, day);
};

export const formatBrazilianDate = (date: Date): string => {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};