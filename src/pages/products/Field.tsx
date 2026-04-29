import type { PriceBlock, ShippingBlock } from "../../utils/ProductSchema";
import { inputCls, selectCls } from "./CreateProduct";

export const Field = ({
  label,
  required,
  hint,
  children,
  className = "",
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={className}>
    <label className="block text-xs font-medium text-gray-500 mb-1">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {children}
    {hint && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
  </div>
);

export const AddBtn = ({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full border border-dashed border-orange-300 rounded-lg text-orange-500 text-sm py-2.5 text-center hover:bg-orange-50 transition mt-3"
  >
    {children}
  </button>
);

export const PriceBlockFields = ({
  value,
  onChange,
}: {
  value: PriceBlock;
  onChange: (v: PriceBlock) => void;
}) => {
  const set =
    (k: keyof PriceBlock) => (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange({ ...value, [k]: e.target.value });
  return (
    <div className="border border-gray-200 rounded-lg p-3 mb-3 bg-white">
      <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
        Price
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(
          [
            ["price", "Selling Price *"],
            ["strikeoutPrice", "Strikeout / MRP"],
            ["wholesalePrice", "Wholesale Price"],
            ["costPrice", "Cost Price"],
          ] as [keyof PriceBlock, string][]
        ).map(([k, lbl]) => (
          <Field key={k} label={lbl}>
            <input
              type="number"
              value={value[k]}
              onChange={set(k)}
              placeholder="0"
              className={inputCls}
            />
          </Field>
        ))}
      </div>
    </div>
  );
};

export const ShippingBlockFields = ({
  value,
  onChange,
}: {
  value: ShippingBlock;
  onChange: (v: ShippingBlock) => void;
}) => {
  const set =
    (k: keyof ShippingBlock) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      onChange({ ...value, [k]: e.target.value });
  return (
    <div className="border border-gray-200 rounded-lg p-3 bg-white">
      <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
        Shipping
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {(
          ["weight", "length", "width", "height"] as (keyof ShippingBlock)[]
        ).map((k) => (
          <Field key={k} label={k.charAt(0).toUpperCase() + k.slice(1)}>
            <input
              type="number"
              value={value[k]}
              onChange={set(k)}
              placeholder="0"
              className={inputCls}
            />
          </Field>
        ))}
        <Field label="Unit">
          <select
            value={value.weightUnit}
            onChange={set("weightUnit")}
            className={selectCls}
          >
            {["kg", "g", "lb", "oz"].map((u) => (
              <option key={u}>{u}</option>
            ))}
          </select>
        </Field>
      </div>
    </div>
  );
};
