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
  slug: string;
  price: number;
};

type Props = {
  products: Product[];
  onAdd: () => void;
  onEdit?: (item: Product) => void;
  onDelete?: (item: Product) => void;
  navigate?: (path: string) => void;
};

export const ProductGrid: React.FC<Props> = ({
  products,
  onAdd,
  onEdit,
  onDelete,
  navigate,
}) => {
  const [search, setSearch] = useState<string>("");
  const filteredProducts = products?.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  console.log(filteredProducts);

  const handleEdit = (item: Product) => {
    if (onEdit) onEdit(item);
  };

  const handleDelete = (item: Product) => {
    if (onDelete) onDelete(item);
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
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm outline-none "
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts?.map((item) => (
          <div
            key={item._id}
            onClick={() => navigate?.(`/products/${item.slug}`)}
            className="relative rounded-2xl overflow-hidden group cursor-pointer shadow-md"
          >
            <Image
              src={item?.image}
              alt={item.name}
              className="w-full h-64 object-cover group-hover:scale-110 transition duration-500"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 p-4 text-white w-full">
              <h3 className="font-semibold text-sm line-clamp-2">
                {item.name}
              </h3>
              <div className="flex justify-between items-center">
                <p className="font-bold text-lg">₹ {item.price}</p>
                <span className="text-xs bg-white/20 px-2 py-1 rounded">
                  {item.stock > 0 ? "In Stock" : "Out"}
                </span>
              </div>
              {item.category && (
                <div className=" text-xs py- tracking-wide">
                  {item.category}
                </div>
              )}
            </div>
            <div
              className="absolute top-2 right-2   "
              onClick={(e) => e.stopPropagation()}
            >
              <DotMenu
                onEdit={() => handleEdit(item)}
                onDelete={() => handleDelete(item)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
