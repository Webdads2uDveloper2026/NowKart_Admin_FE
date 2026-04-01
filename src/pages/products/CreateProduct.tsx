import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../../store/slice/categorySlice";
import {
  clearProductState,
  createProduct,
  getProducts,
  updateProduct,
} from "../../store/slice/productSlice";
import SingleSelectDropdown from "../../components/Container/Fields/SingleSelectDropdown";
import FileUpload from "../../components/Container/Fields/FileUpload";
import Button from "../../components/Container/Button/Button";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { generateSlug } from "../../utils/generateSlug";
import { FloatingInput } from "../../components/Container/Fields/FloatingInput";
import { Toggle } from "../../components/Container/Product/Toggle";
import { SizeSelector } from "../../components/Container/Product/SizeSelector";
import { usePopup } from "../../components/Container/Popup/PopupProvider";

const CreateProduct = ({ onclose, data }: any) => {
  const dispatch = useDispatch();
  const { showPopup } = usePopup();
  const { categories } = useSelector((state: any) => state.category || {});
  const { createError, createSuccess } = useSelector(
    (state: any) => state.product,
  );
  const [productImage, setProductImage] = useState<File[]>([]);

  const [form, setForm] = useState<any>({
    name: "",
    slug: "",
    description: "",
    category: "",
    isInquiry: false,
    isstickoutPrice: false,
    strickoutPrice: "",
    price: "",
    quantity: "",
    weight: "",
    weightUnit: "kg",
    isColorVariantAvailable: false,
    colorVariants: [],
    imageAltTag: "",
    bestSelling: false,
    trending: false,
    isWholesale: false,
    wholesaleMinQuantity: "",
    wholesaleFields: [],
    isBulkDiscount: false,
    bulkDiscounts: [],
    isCustomized: false,
    metaTitle: "",
    metaDescription: "",
    keywords: "",
    canonicalTag: "",
  });

  useEffect(() => {
    dispatch(getCategories() as any);
  }, []);

  useEffect(() => {
    if (data) {
      setForm({
        ...data,
        quantity: data.quantity || data.stock,
      });
    }
  }, [data]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm((prev: any) => {
      const updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
      if (name === "name") updated.slug = generateSlug(value);
      return updated;
    });
  };

  const setToggle = (key: string, val: boolean) =>
    setForm((prev: any) => ({ ...prev, [key]: val }));

  const addBulkDiscount = () =>
    setForm((prev: any) => ({
      ...prev,
      bulkDiscounts: [
        ...prev.bulkDiscounts,
        { minQty: "", maxQty: "", discount: "" },
      ],
    }));

  const updateBulkDiscount = (index: number, field: string, value: string) => {
    const updated = [...form.bulkDiscounts];
    updated[index][field] = value;
    setForm((prev: any) => ({ ...prev, bulkDiscounts: updated }));
  };

  const removeBulkDiscount = (index: number) =>
    setForm((prev: any) => ({
      ...prev,
      bulkDiscounts: prev.bulkDiscounts.filter(
        (_: any, i: number) => i !== index,
      ),
    }));

  const addColorVariant = () =>
    setForm((prev: any) => ({
      ...prev,
      colorVariants: [
        ...prev.colorVariants,
        {
          colorName: "",
          colorCode: "#c62020",
          price: "",
          strikoutPrice: "",
          sizes: [] as string[],
          images: [],
        },
      ],
    }));

  const updateColorVariant = (index: number, field: string, value: any) => {
    const updated = [...form.colorVariants];
    updated[index][field] = value;
    setForm((prev: any) => ({ ...prev, colorVariants: updated }));
  };

  const removeColorVariant = (index: number) =>
    setForm((prev: any) => ({
      ...prev,
      colorVariants: prev.colorVariants.filter(
        (_: any, i: number) => i !== index,
      ),
    }));

  const handleSubmit = () => {
    const formData = new FormData();
    Object.keys(form).forEach((key) => {
      if (key === "colorVariants") {
        const formattedVariants = form.colorVariants.map((variant: any) => ({
          ...variant,
          sizes: variant.sizes.map((s: string) => ({ size: s })),
        }));
        formData.append("colorVariants", JSON.stringify(formattedVariants));
      } else if (key === "bulkDiscounts" && form.bulkDiscounts.length > 0) {
        formData.append("bulkDiscounts", JSON.stringify(form.bulkDiscounts));
      } else if (key === "wholesaleFields" && form.wholesaleFields.length > 0) {
        formData.append(
          "wholesaleFields",
          JSON.stringify(form.wholesaleFields),
        );
      } else if (!Array.isArray(form[key])) {
        formData.append(key, form[key]);
      }
    });

    if (productImage.length > 0) {
      productImage.forEach((file) => {
        formData.append("productImage", file);
      });
    }
    if (data?._id) {
      dispatch(updateProduct({ id: data._id, formData: formData }) as any);
    } else {
      dispatch(createProduct(formData) as any);
    }
  };

  useEffect(() => {
    if (createSuccess) {
      showPopup("success", createSuccess);
      dispatch(getProducts() as any);
      dispatch(clearProductState());
    }
    if (createError) {
      showPopup("error", createError);
      dispatch(clearProductState());
    }
  }, [createSuccess, createError, dispatch]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Create New Product</h2>
        <Button
          icon={<ArrowLeft size={16} />}
          variant="outline"
          onClick={onclose}
        >
          Go Back
        </Button>
      </div>
      <div className="grid gap-4">
        <input
          name="name"
          placeholder="Product Name *"
          value={form.name}
          onChange={handleChange}
          className="border border-gray-300 p-3 rounded hover:border-orange-700 focus:border-orange-700 transition outline-none text-sm"
        />
        <input
          name="slug"
          placeholder="URL Name *"
          value={form.slug}
          onChange={handleChange}
          className="border border-gray-300 p-3 rounded hover:border-orange-700 focus:border-orange-700 transition outline-none text-sm"
        />
        <CKEditor
          editor={ClassicEditor}
          data={form.description}
          config={{
            placeholder: "Product Description...",
            licenseKey: "GPL",
            toolbar: [
              "heading",
              "|",
              "bold",
              "italic",
              "underline",
              "|",
              "bulletedList",
              "numberedList",
              "|",
              "link",
              "|",
              "undo",
              "redo",
            ],
          }}
          onChange={(_event: any, editor: any) =>
            setForm((prev: any) => ({ ...prev, description: editor.getData() }))
          }
        />
        <SingleSelectDropdown
          label="Category"
          options={categories || []}
          value={form.category}
          onChange={(val) =>
            setForm((prev: any) => ({ ...prev, category: val }))
          }
          searchable
        />
        <div className="flex gap-6 flex-wrap">
          <Toggle
            checked={form.isInquiry}
            onChange={(val) => setToggle("isInquiry", val)}
            label="Is Enquiry"
          />
          <Toggle
            checked={form.isstickoutPrice}
            onChange={(val) => setToggle("isstickoutPrice", val)}
            label="Strike out price?"
          />
        </div>
        {form.isstickoutPrice && (
          <FloatingInput
            name="strickoutPrice"
            label="Strikeout Price *"
            value={form.strickoutPrice}
            onChange={handleChange}
          />
        )}
        <input
          name="quantity"
          placeholder="Stock"
          value={form.quantity}
          onChange={handleChange}
          className="border border-gray-300 p-3 rounded hover:border-orange-700 focus:border-orange-700 transition outline-none text-sm"
        />
        <div className="flex gap-6 flex-wrap">
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input
              type="checkbox"
              name="bestSelling"
              checked={form.bestSelling}
              onChange={handleChange}
              className="w-4 h-4 accent-orange-700"
            />
            Best Selling
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input
              type="checkbox"
              name="trending"
              checked={form.trending}
              onChange={handleChange}
              className="w-4 h-4 accent-orange-700"
            />
            Trending
          </label>
        </div>
        <div className="flex gap-4">
          <FloatingInput
            name="price"
            label="Product Price"
            value={form.price}
            onChange={handleChange}
            className="flex-1"
          />
          <FloatingInput
            name="weight"
            label="Weight *"
            value={form.weight}
            onChange={handleChange}
            className="flex-1"
          />
          <div className="relative flex-1">
            <select
              name="weightUnit"
              value={form.weightUnit}
              onChange={handleChange}
              className="peer block w-full border border-gray-300 rounded px-3 pt-5 pb-2 text-sm outline-none focus:border-orange-700 hover:border-orange-700 transition-colors appearance-none"
            >
              <option value="kg">kg</option>
              <option value="g">g</option>
            </select>
            <label className="absolute left-3 top-2 text-xs text-gray-400 pointer-events-none">
              Weight Unit *
            </label>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              ▾
            </span>
          </div>
        </div>

        <div className="flex gap-6 flex-wrap">
          <Toggle
            checked={form.isWholesale}
            onChange={(val) => setToggle("isWholesale", val)}
            label="Is Wholesale"
          />
          <Toggle
            checked={form.isBulkDiscount}
            onChange={(val) => setToggle("isBulkDiscount", val)}
            label="Is Bulk Discount"
          />
          <Toggle
            checked={form.isColorVariantAvailable}
            onChange={(val) => setToggle("isColorVariantAvailable", val)}
            label="Is Color Variant Available"
          />
        </div>

        {form.isWholesale && (
          <FloatingInput
            name="wholesaleMinQuantity"
            label="Wholesale Minimum Order Quantity"
            value={form.wholesaleMinQuantity}
            onChange={handleChange}
          />
        )}

        {form.isBulkDiscount && (
          <div className="space-y-2">
            {form.bulkDiscounts.map((item: any, index: number) => (
              <div key={index} className="grid grid-cols-3 gap-3 items-center">
                <FloatingInput
                  name={`minQty_${index}`}
                  label="Minimum Quantity *"
                  value={item.minQty}
                  onChange={(e) =>
                    updateBulkDiscount(index, "minQty", e.target.value)
                  }
                />
                <FloatingInput
                  name={`maxQty_${index}`}
                  label="Maximum Quantity *"
                  value={item.maxQty}
                  onChange={(e) =>
                    updateBulkDiscount(index, "maxQty", e.target.value)
                  }
                />
                <div className="flex gap-2 items-center">
                  <FloatingInput
                    name={`discount_${index}`}
                    label="Discount Percentage *"
                    value={item.discount}
                    onChange={(e) =>
                      updateBulkDiscount(index, "discount", e.target.value)
                    }
                    className="flex-1"
                  />
                  {index === form.bulkDiscounts.length - 1 ? (
                    <button
                      type="button"
                      onClick={addBulkDiscount}
                      className="w-8 h-8 rounded-full bg-orange-700 text-white flex items-center justify-center shrink-0"
                    >
                      <Plus size={16} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => removeBulkDiscount(index)}
                      className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {form.bulkDiscounts.length === 0 && (
              <button
                type="button"
                onClick={addBulkDiscount}
                className="w-8 h-8 rounded-full bg-orange-700 text-white flex items-center justify-center"
              >
                <Plus size={16} />
              </button>
            )}
          </div>
        )}

        {form.isColorVariantAvailable && (
          <div>
            <h3 className="font-bold text-base mb-3">Color Variants</h3>
            <div className="space-y-4">
              {form.colorVariants.map((variant: any, index: number) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 relative">
                  <button
                    type="button"
                    onClick={() => removeColorVariant(index)}
                    className="absolute top-1 right-0 z-10 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <FloatingInput
                      name={`colorName_${index}`}
                      label="Color Name *"
                      value={variant.colorName}
                      onChange={(e) =>
                        updateColorVariant(index, "colorName", e.target.value)
                      }
                    />

                    <div className="relative">
                      <div className="flex items-center border border-gray-300 rounded px-3 pt-5 pb-2 gap-2 hover:border-orange-700 transition-colors">
                        <input
                          type="color"
                          value={variant.colorCode}
                          onChange={(e) =>
                            updateColorVariant(
                              index,
                              "colorCode",
                              e.target.value,
                            )
                          }
                          className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent"
                        />
                        <span className="text-sm text-gray-700">
                          {variant.colorCode}
                        </span>
                      </div>
                      <label className="absolute left-3 top-2 text-xs text-gray-400 pointer-events-none">
                        Color Code *
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <FloatingInput
                      name={`variantPrice_${index}`}
                      label="Price *"
                      value={variant.price}
                      onChange={(e) =>
                        updateColorVariant(index, "price", e.target.value)
                      }
                    />
                    <FloatingInput
                      name={`variantStrikout_${index}`}
                      label="Strikout Price"
                      value={variant.strikoutPrice}
                      onChange={(e) =>
                        updateColorVariant(
                          index,
                          "strikoutPrice",
                          e.target.value,
                        )
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-semibold mb-2">
                        Available Sizes *
                      </p>
                      <SizeSelector
                        selected={variant.sizes}
                        onChange={(sizes) =>
                          updateColorVariant(index, "sizes", sizes)
                        }
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold mb-2">
                        Color Images *
                      </p>
                      <button
                        type="button"
                        className="flex items-center gap-2 border border-orange-700 text-orange-700 rounded px-4 py-2 text-sm hover:bg-orange-50 transition"
                        onClick={() => {}}
                      >
                        <Plus size={16} />
                        Add Images
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addColorVariant}
              className="mt-3 flex items-center gap-2 bg-orange-700 text-white px-4 py-2 rounded text-sm hover:bg-orange-800 transition"
            >
              <Plus size={16} />
              Add Color Variant
            </button>
          </div>
        )}
        <FileUpload
          height="h-[200px]"
          label="Upload Images"
          type="image"
          value={productImage}
          multiple
          setValue={(files) => setProductImage(files as File[])}
        />

        <input
          name="imageAltTag"
          placeholder="Image Alt Tag"
          value={form.imageAltTag}
          onChange={handleChange}
          className="border border-gray-300 p-3 rounded hover:border-orange-700 focus:border-orange-700 transition outline-none text-sm"
        />

        <h3 className="font-semibold mt-2">SEO</h3>
        <div className="grid grid-cols-2 gap-4">
          <FloatingInput
            name="metaTitle"
            label="MetaTitle"
            value={form.metaTitle}
            onChange={handleChange}
          />
          <FloatingInput
            name="metaDescription"
            label="metaDescription"
            value={form.metaDescription}
            onChange={handleChange}
          />
          <FloatingInput
            name="canonicalTag"
            label="canonicalTag"
            value={form.canonicalTag}
            onChange={handleChange}
          />
          <FloatingInput
            name="keywords"
            label="Keywords"
            value={form.keywords}
            onChange={handleChange}
          />
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <Button
            variant="secondary"
            onClick={() => console.log("Cancel clicked")}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {data ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
