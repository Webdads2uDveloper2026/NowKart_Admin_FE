export const FloatingInput = ({
  name,
  label,
  value,
  onChange,
  type = "text",
  className = "",
}: {
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  className?: string;
}) => (
  <div className={`relative ${className}`}>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder=" "
      className="peer block w-full border border-gray-300 rounded px-3 pt-5 pb-2 text-sm outline-none focus:border-green-700 hover:border-green-700 transition-colors"
    />
    <label
      htmlFor={name}
      className="absolute left-3 top-2 text-xs text-gray-400 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-gray-400 transition-all pointer-events-none"
    >
      {label}
    </label>
  </div>
);
