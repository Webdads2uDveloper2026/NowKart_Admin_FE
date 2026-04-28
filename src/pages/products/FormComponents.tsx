import { inputCls } from "./CreateProduct";
import { Field } from "./Field";

export const DarkInput = ({
  label,
  value,
  name,
  onChange,
  placeholder,
  type = "text",
  required,
  hint,
  className = "",
}: {
  name?: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  hint?: string;
  className?: string;
}) => (
  <Field label={label} required={required} hint={hint} className={className}>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={inputCls}
    />
  </Field>
);

export const VariantCard = ({
  title,
  onRemove,
  children,
}: {
  title: string;
  onRemove: () => void;
  children: React.ReactNode;
}) => (
  <div className="border border-gray-200 rounded-xl p-4 mb-3 relative bg-gray-50">
    <div className="text-xs font-semibold text-orange-500 mb-3 tracking-wide uppercase">
      {title}
    </div>
    <button
      type="button"
      onClick={onRemove}
      className="absolute top-3 right-3 text-xs text-red-400 border border-red-200 bg-red-50 hover:bg-red-100 px-2 py-0.5 rounded transition"
    >
      ✕ Remove
    </button>
    {children}
  </div>
);

export const FormSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mb-8">
    <h3 className="text-sm font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">
      {title}
    </h3>
    {children}
  </div>
);
