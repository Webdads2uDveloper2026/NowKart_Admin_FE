import { Eye, EyeOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";

type OptionType = {
  label: string;
  value: string | number;
  [key: string]: any;
};

type ReusableFieldsProps = {
  type?: string;
  label?: string;
  name: string;
  value: any;
  onChange: (e: { target: { name: string; value: any } }) => void;
  placeholder?: string;
  options?: OptionType[];
  labelKey?: string;
  valueKey?: string;
  apiEndpoint?: string | null;
  error?: string;
  isActive?: boolean;
  required?: boolean;
  className?: string;
  disabled?: boolean;
  passwordValidation?: boolean;
  searchable?: boolean;
};

const ResuableFields: React.FC<ReusableFieldsProps> = ({
  type = "text",
  label,
  name,
  value,
  onChange,
  placeholder,
  options = [],
  labelKey = "label",
  apiEndpoint = null,
  error: externalError,
  isActive = false,
  required = false,
  className = "",
  disabled = false,
  passwordValidation = false,
  searchable = false,
}) => {
  const [dynamicOptions, setDynamicOptions] = useState<OptionType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { isDarkMode } = useSelector((state: any) => state.darkMode);
  const [internalError, setInternalError] = useState<string>("");
  const error = externalError || internalError;

  useEffect(() => {
    if (apiEndpoint && type === "select") {
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await fetch(apiEndpoint);
          const data = await response.json();
          setDynamicOptions(data);
        } catch (err) {
          console.error("Input API Error:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [apiEndpoint, type]);

  useEffect(() => {
    if (type === "password" && passwordValidation) {
      validatePassword(value);
    } else {
      setInternalError("");
    }
  }, [value, type, passwordValidation]);

  const validatePassword = (pwd: string) => {
    if (!pwd) {
      setInternalError(required ? "Password is required" : "");
      return;
    }

    const minLength = 8;
    const hasLower = /[a-z]/.test(pwd);
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[!@#$%^&*]/.test(pwd);

    if (pwd.length < minLength) {
      setInternalError(`Password must be at least ${minLength} characters`);
    } else if (!hasLower || !hasUpper || !hasNumber || !hasSpecial) {
      setInternalError(
        "Password must contain lowercase, uppercase, number, and special character",
      );
    } else {
      setInternalError("");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isFloating =
    isFocused ||
    (value !== undefined && value !== null && value.toString().length > 0) ||
    type === "date" ||
    type === "select" ||
    isOpen ||
    isActive;

  const labelStyles = `absolute transition-all duration-200 pointer-events-none z-10 left-3 px-1 rounded-sm ${
    isFloating
      ? `-top-2.5 text-[12px] ${
          isDarkMode ? "bg-[#101828] text-white" : "bg-white text-black"
        }`
      : "top-1/2 -translate-y-1/2 text-[14px]"
  } ${
    error
      ? "text-red-500 font-semibold"
      : isFocused || isActive || isOpen
        ? "text-[#0062a0]"
        : "text-gray-500"
  }`;

  const inputBaseStyles = `w-full px-4 py-2.5 rounded-lg border text-sm transition-all duration-300 outline-none bg-[transparent] ${
    error
      ? "border-red-500"
      : isFocused || isActive || isOpen
        ? "border-[#0062a0] shadow-md shadow-blue-900/10 ring-1 ring-[#0062a0]/10"
        : "border-slate-300 hover:border-[#0062a0]/50 focus:border-[#0062a0]"
  } ${disabled ? "bg-gray-50 cursor-not-allowed opacity-70" : ""}`;

  return (
    <div
      className={`relative mt-5 mb-1.5 w-full ${className}`}
      ref={type === "select" && searchable ? dropdownRef : null}
    >
      {label && (
        <label className={labelStyles}>
          {label.toUpperCase()}{" "}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {type === "select" ? (
          <div className="w-full">
            <Select
              options={options}
              value={options.find((opt) => opt.value === value) || null}
              onChange={(selected: OptionType | null) =>
                onChange({
                  target: {
                    name,
                    value: selected ? selected.value : "",
                  },
                })
              }
              isDisabled={disabled || loading}
              isLoading={loading}
              placeholder={placeholder}
              isSearchable
              className="text-sm"
            />
          </div>
        ) : type === "textarea" ? (
          <textarea
            name={name}
            value={value}
            onChange={(e) =>
              onChange({ target: { name, value: e.target.value } })
            }
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled}
            placeholder=" "
            className={`${inputBaseStyles} min-h-[100px] resize-none`}
          />
        ) : (
          <div className="relative w-full">
            <input
              type={
                type === "password"
                  ? showPassword
                    ? "text"
                    : "password"
                  : type
              }
              name={name}
              value={value}
              onChange={(e) =>
                onChange({ target: { name, value: e.target.value } })
              }
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={disabled}
              placeholder=" "
              className={inputBaseStyles}
            />
            {type === "password" && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0062a0]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="text-[10px] text-red-500 font-medium mt-1 ml-2">
          {error}
        </p>
      )}
    </div>
  );
};

export default ResuableFields;
