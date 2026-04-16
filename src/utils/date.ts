export const formatDateInput = (value: any): string => {
  if (!value) return "";

  try {
    if (value?.seconds && typeof value.toDate === "function") {
      return value.toDate().toISOString().slice(0, 10);
    }

    const date = new Date(value);
    if (isNaN(date.getTime())) return "";

    return date.toISOString().slice(0, 10);
  } catch {
    return "";
  }
};