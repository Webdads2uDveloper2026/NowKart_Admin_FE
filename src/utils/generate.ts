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

export const getStockStatus = (qty: number) => {
  if (qty === 0) return "OUT_OF_STOCK";
  if (qty <= 5) return "LIMITED";
  return "IN_STOCK";
};

export const COLOR_SWATCHES = [
  { name: "Red", hex: "#ff0000" },
  { name: "Green", hex: "#00ff00" },
  { name: "Blue", hex: "#0000ff" },
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#ffffff" },
  { name: "Yellow", hex: "#ffff00" },
  { name: "Orange", hex: "#ffa500" },
  { name: "Purple", hex: "#800080" },
  { name: "Gray", hex: "#808080" },
  { name: "Pink", hex: "#ffc0cb" },
  { name: "Brown", hex: "#8b4513" },
  { name: "Navy Blue", hex: "#000080" },
];


