export const generateSKU = (name: string) => {
  const base = name
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 6);

  const random = Math.floor(1000 + Math.random() * 9000);

  return `${base}-${random}`;
};

export const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

export const generateAltTags = (name: string, count: number) => {
  return Array.from(
    { length: count },
    (_, i) => `${name.toLowerCase()} image ${i + 1}`,
  );
};
