import { useState, useEffect, useRef } from "react";
import { ChevronDown, Search, X } from "lucide-react";

interface DropdownOption {
  _id: string;
  [key: string]: any;
}

interface SingleSelectDropdownProps {
  label?: string;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  searchable?: boolean;
  labelKey?: string;
  placeholder?: string;
}

const SingleSelectDropdown: React.FC<SingleSelectDropdownProps> = ({
  label = "",
  options = [],
  value = "",
  onChange,
  searchable = false,
  labelKey = "name",
  placeholder = "Select Option",
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [filteredOptions, setFilteredOptions] = useState<DropdownOption[]>([]);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!Array.isArray(options)) {
      setFilteredOptions([]);
      return;
    }

    const filtered = options.filter((opt) => {
      const name = opt?.[labelKey];
      return (
        typeof name === "string" &&
        name.toLowerCase().includes(search.toLowerCase())
      );
    });

    setFilteredOptions(filtered);
  }, [search, options, labelKey]);

  const handleSelect = (id: string) => {
    onChange(id);
    setOpen(false);
    setSearch("");
  };

  const selectedItem = options.find((o) => o._id === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {label && (
        <label className="block text-sm  mb-2 text-gray-600">{label}</label>
      )}

      <div
        className="w-full p-2 border border-gray-500  rounded-md cursor-pointer  text-sm
        flex items-center justify-between bg-white relative"
        onClick={() => setOpen(!open)}
      >
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {selectedItem ? selectedItem[labelKey] : placeholder}
        </span>

        <div className="flex items-center gap-2">
          {value && (
            <X
              size={16}
              className="text-gray-500 hover:text-red-500 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
                setSearch("");
              }}
            />
          )}
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </div>
      </div>

      {open && (
        <div className="absolute w-full mt-1 bg-white shadow-lg border border-gray-400 rounded-sm z-30 max-h-64 overflow-y-auto">
          {searchable && (
            <div className="p-2 border-b border-gray-300 flex items-center gap-2">
              <Search size={15} className="text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full outline-none text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          )}

          {filteredOptions.map((item) => (
            <div
              key={item._id}
              className={`p-2 cursor-pointer hover:bg-gray-100  
              ${value === item._id ? "bg-gray-200 font-semibold" : ""}`}
              onClick={() => handleSelect(item._id)}
            >
              {item[labelKey]}
            </div>
          ))}

          {filteredOptions.length === 0 && (
            <p className="p-3 text-gray-400 text-sm">No results</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SingleSelectDropdown;
