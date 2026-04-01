import { Search } from "lucide-react";
import { useState } from "react";
import Image from "../../components/Container/Image/Image";
import DotMenu from "../../components/Container/DotMen/DotMenu";

type Product = {
  _id: string;
  name: string;
  image?: string;
  stock: number;
  category?: string;
  price: number;
};

type Props = {
  products: Product[];
  onAdd: () => void;
  onEdit?: (item: Product) => void;
  onDelete?: (item: Product) => void;
};

export const ProductGrid: React.FC<Props> = ({
  products,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const [search, setSearch] = useState<string>("");

  const filteredProducts = products?.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleEdit = (item: Product) => {
    if (onEdit) onEdit(item);
    else console.log("Edit:", item);
  };

  const handleDelete = (item: Product) => {
    if (onDelete) onDelete(item);
    else console.log("Delete:", item);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-72">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm outline-none focus:border-green-500"
          />
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onAdd}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm"
          >
            + Add
          </button>

          <p className="text-gray-500 text-sm hidden sm:block">
            Drag to scroll horizontally
          </p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 min-w-[800px]">
          {filteredProducts?.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow border border-gray-200 p-4 hover:shadow-lg transition"
            >
              <div className="relative">
                <Image
                  src={item?.image}
                  alt={item.name}
                  className="w-full h-40 object-contain rounded-lg"
                />
                <div className="absolute top-2 right-2">
                  <DotMenu
                    onEdit={() => handleEdit(item)}
                    onDelete={() => handleDelete(item)}
                  />
                </div>
              </div>
              <p className="text-orange-600 text-sm mt-3">
                Stock: {item.stock}
              </p>
              {item.category && (
                <span className="inline-block mt-2 px-3 py-1 text-sm border border-orange-500 text-orange-600 rounded-full">
                  {item.category}
                </span>
              )}
              <h3 className="font-semibold mt-3 text-gray-800 line-clamp-3">
                {item.name}
              </h3>
              <p className="font-bold mt-1 text-gray-900">₹ {item.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
