const SIZES = ["S", "M", "L", "XL", "XXL", "XXXL"];

type Props = {
  selected: string[];
  onChange: (sizes: string[]) => void;
};

export const SizeSelector = ({ selected, onChange }: Props) => {
  const toggleSize = (size: string) => {
    if (selected.includes(size)) {
      onChange(selected.filter((s) => s !== size));
    } else {
      onChange([...selected, size]);
    }
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {SIZES.map((size) => {
        const active = selected.includes(size);

        return (
          <button
            key={size}
            type="button"
            onClick={() => toggleSize(size)}
            className={`w-12 h-10 rounded border text-sm font-medium transition-colors ${
              active
                ? "border-orange-700 text-orange-700 bg-orange-50"
                : "border-gray-300 text-gray-500 bg-white hover:border-orange-500"
            }`}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
};