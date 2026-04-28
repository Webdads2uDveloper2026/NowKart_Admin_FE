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
import { ArrowLeft, Trash2 } from "lucide-react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {
  generateAltTags,
  generateSlug,
  getStockStatus,
} from "../../utils/generate";
import { usePopup } from "../../components/Container/Popup/PopupProvider";
import { AddBtn, Field } from "./Field";
import type {
  VariantType,
  PriceBlock,
  StockBlock,
  ShippingBlock,
  ColorVariant,
  SizeEntry,
  SizeVariant,
  UnitVariant,
  WeightVariant,
  VolumeVariant,
  WholesaleField,
  CustomVariant,
  BulkDiscount,
  Subcategory,
} from "../../utils/ProductSchema";
import { getSubcategories } from "../../store/slice/subcategorySlice";
import { DarkInput, FormSection, VariantCard } from "./FormComponents";
import { generateSKU } from "../../utils/generate";

const emptyPrice = (): PriceBlock => ({
  price: "",
  strikeoutPrice: "",
  wholesalePrice: "",
  costPrice: "",
});

const emptyStock = (): StockBlock => ({ quantity: "", sku: "", barcode: "" });

const emptyShipping = (): ShippingBlock => ({
  weight: "",
  weightUnit: "kg",
  length: "",
  width: "",
  height: "",
});

const emptyColorVariant = (): ColorVariant => ({
  colorName: "",
  colorCode: "#c62020",
  images: [],
  price: emptyPrice(),
  stock: emptyStock(),
  sizes: [],
});

const emptySizeEntry = (): SizeEntry => ({
  size: "",
  price: emptyPrice(),
  stock: emptyStock(),
});

const emptySizeVariant = (): SizeVariant => ({
  size: "",
  price: emptyPrice(),
  stock: emptyStock(),
  shipping: emptyShipping(),
});

const emptyUnitVariant = (): UnitVariant => ({
  unitLabel: "",
  unitCount: "",
  price: emptyPrice(),
  stock: emptyStock(),
});

const emptyWeightVariant = (): WeightVariant => ({
  weightValue: "",
  weightUnit: "g",
  label: "",
  price: emptyPrice(),
  stock: emptyStock(),
});

const emptyVolumeVariant = (): VolumeVariant => ({
  volumeValue: "",
  volumeUnit: "ml",
  label: "",
  price: emptyPrice(),
  stock: emptyStock(),
});

const emptyCustomVariant = (): CustomVariant => ({
  label: "",
  attributes: [{ key: "", value: "" }],
  price: emptyPrice(),
  stock: emptyStock(),
  shipping: emptyShipping(),
});

export const inputCls =
  "bg-gray-50 border border-gray-400 rounded-lg text-gray-800 text-sm px-3 py-2.5 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition w-full";

const selectCls =
  "bg-gray-50 border border-gray-400 rounded-lg text-gray-800 text-sm px-3 py-2.5 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition w-full";

const ToggleRow = ({
  label,
  sublabel,
  checked,
  onChange,
}: {
  label: string;
  sublabel?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <div className="flex items-center justify-between border border-gray-400 rounded-lg px-4 py-3 bg-gray-50">
    <div>
      <div className="text-sm font-medium text-gray-700">{label}</div>
      {sublabel && (
        <div className="text-xs text-gray-400 mt-0.5">{sublabel}</div>
      )}
    </div>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 flex-shrink-0 ${
        checked ? "bg-orange-500" : "bg-gray-300"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  </div>
);

const PriceBlockFields = ({
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

const StockBlockFields = ({
  value,
  onChange,
}: {
  value: StockBlock;
  onChange: (v: StockBlock) => void;
}) => {
  const set =
    (k: keyof StockBlock) => (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange({ ...value, [k]: e.target.value });
  return (
    <div className="border border-gray-200 rounded-lg p-3 mb-3 bg-white">
      <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
        Stock
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Field label="Quantity *">
          <input
            type="number"
            value={value.quantity}
            onChange={set("quantity")}
            placeholder="100"
            className={inputCls}
          />
        </Field>
        <Field label="SKU">
          <input
            type="text"
            value={value.sku}
            onChange={set("sku")}
            placeholder="SKU-001"
            className={inputCls}
          />
        </Field>
        <Field label="Barcode">
          <input
            type="text"
            value={value.barcode}
            onChange={set("barcode")}
            placeholder="1234567890"
            className={inputCls}
          />
        </Field>
      </div>
      <div className="flex gap-2 mt-2 flex-wrap">
        <span className="text-[10px] px-2 py-0.5 rounded bg-green-50 border border-green-200 text-green-600">
          AUTO: qty &gt; 5 → IN_STOCK
        </span>
        <span className="text-[10px] px-2 py-0.5 rounded bg-yellow-50 border border-yellow-200 text-yellow-600">
          qty 1–5 → LIMITED
        </span>
        <span className="text-[10px] px-2 py-0.5 rounded bg-red-50 border border-red-200 text-red-500">
          qty 0 → OUT_OF_STOCK
        </span>
      </div>
    </div>
  );
};

const ShippingBlockFields = ({
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

const CreateProduct = ({ onclose, data }: any) => {
  const dispatch = useDispatch();
  const { showPopup } = usePopup();
  const { categories } = useSelector((state: any) => state.category || {});
  const { subcategories } = useSelector(
    (state: any) => state.subcategory || {},
  );
  const { createError, createSuccess, updateSuccess, updateError } =
    useSelector((state: any) => state.product);

  const VARIANT_TYPES: VariantType[] = [
    "NONE",
    "COLOR",
    "SIZE",
    "COLOR_SIZE",
    "UNIT",
    "WEIGHT",
    "VOLUME",
    "CUSTOM",
  ];

  const [variantType, setVariantType] = useState<VariantType>("NONE");
  const [productImage, setProductImage] = useState<File[]>([]);

  const [core, setCore] = useState({
    name: "",
    slug: "",
    shortDescription: "",
    description: "",
    category: "",
    subCategory: "",
    brand: "",
    rootSku: "",
    barcode: "",
  });

  const [rootPrice, setRootPrice] = useState<PriceBlock>(emptyPrice());
  const [rootStock, setRootStock] = useState<StockBlock>(emptyStock());
  const [rootShipping, setRootShipping] =
    useState<ShippingBlock>(emptyShipping());

  const [colorVariants, setColorVariants] = useState<ColorVariant[]>([
    emptyColorVariant(),
  ]);
  const [sizeVariants, setSizeVariants] = useState<SizeVariant[]>([
    emptySizeVariant(),
  ]);
  const [unitVariants, setUnitVariants] = useState<UnitVariant[]>([
    emptyUnitVariant(),
  ]);
  const [weightVariants, setWeightVariants] = useState<WeightVariant[]>([
    emptyWeightVariant(),
  ]);
  const [volumeVariants, setVolumeVariants] = useState<VolumeVariant[]>([
    emptyVolumeVariant(),
  ]);
  const [customVariants, setCustomVariants] = useState<CustomVariant[]>([
    emptyCustomVariant(),
  ]);

  const [flags, setFlags] = useState({
    bestSelling: false,
    trending: false,
    isFeatured: false,
    isNewArrival: false,
    isCustomized: false,
    isInquiry: false,
  });

  const [isWholesale, setIsWholesale] = useState(false);
  const [wholesaleMinQty, setWholesaleMinQty] = useState("");
  const [wholesaleFields, setWholesaleFields] = useState<WholesaleField[]>([]);
  const [isBulkDiscount, setIsBulkDiscount] = useState(false);
  const [bulkDiscounts, setBulkDiscounts] = useState<BulkDiscount[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");

  const [highlights, setHighlights] = useState<string[]>([]);
  const [highlightInput, setHighlightInput] = useState("");
  const [specifications, setSpecifications] = useState([
    { key: "", value: "" },
  ]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const normalizedInput: string = tagInput.toLowerCase();

  const tagSuggestions: string[] =
    (subcategories as Subcategory[] | undefined)
      ?.map((s) => s?.name?.toLowerCase())
      .filter((tag): tag is string => Boolean(tag)) || [];

  const filteredTags: string[] = tagSuggestions.filter(
    (tag: string) => tag.includes(normalizedInput) && !tags.includes(tag),
  );

  const [seo, setSeo] = useState({
    metaTitle: "",
    metaDescription: "",
    canonicalTag: "",
    returnPolicy: "",
    warrantyInfo: "",
  });

  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    dispatch(getCategories() as any);
  }, []);

  useEffect(() => {
    dispatch(getSubcategories() as any);
  }, []);

  useEffect(() => {
    if (!data) return;

    setCore({
      name: data?.name || "",
      slug: data?.slug || "",
      shortDescription: data?.shortDescription || "",
      description: data?.description || "",
      category: data?.category?._id || "",
      subCategory: data?.subCategory?._id || "",
      brand: data?.brand || "",
      rootSku: data?.rootSku || "",
      barcode: data?.barcode || "",
    });

    const cleanTags = (data?.tags || []).map((t: string) =>
      t.replace(/[\[\]\"]/g, "").trim(),
    );
    setTags(cleanTags);

    if (data?.variantType === "COLOR") {
      const mapped = data.colorVariants.map((v: any) => ({
        colorName: v.colorName || "",
        colorCode: v.colorCode || "#000000",
        images: [],
        price: {
          price: v.price?.price || "",
          strikeoutPrice: v.price?.strikeoutPrice || "",
          wholesalePrice: v.price?.wholesalePrice || "",
          costPrice: v.price?.costPrice || "",
        },
        stock: {
          quantity: v.stock?.quantity || "",
          sku: v.stock?.sku || "",
          barcode: v.stock?.barcode || "",
        },
        sizes: [],
      }));
      setColorVariants(mapped);
    }

    setVariantType(data?.variantType || "NONE");

    if (data?.specifications?.length) {
      setSpecifications(
        data.specifications.map((s: any) => ({
          key: s.key || "",
          value: s.value || "",
        })),
      );
    } else {
      setSpecifications([{ key: "", value: "" }]);
    }

    setFlags({
      bestSelling: data?.bestSelling || false,
      trending: data?.trending || false,
      isFeatured: data?.isFeatured || false,
      isNewArrival: data?.isNewArrival || false,
      isCustomized: data?.isCustomized || false,
      isInquiry: data?.isInquiry || false,
    });
    const cleanArray = (arr: any) =>
      Array.isArray(arr)
        ? arr.map((i) => i.replace(/[\[\]\"]/g, "").trim())
        : [];

    setKeywords(cleanArray(data?.keywords));
    setHighlights(cleanArray(data?.highlights));

    setSeo({
      metaTitle: data?.metaTitle || "",
      metaDescription: data?.metaDescription || "",
      returnPolicy: data?.returnPolicy || "",
      warrantyInfo: data?.warrantyInfo || "",
      canonicalTag: data?.canonicalTag || "",
    });

    setVideoUrl(data?.videoUrl || "");
    setIsWholesale(data?.isWholesale || false);
    setWholesaleMinQty(data?.wholesaleMinQuantity || "");
    setWholesaleFields(data?.wholesaleFields || []);
    setIsBulkDiscount(data?.isBulkDiscount || false);
    setBulkDiscounts(data?.bulkDiscounts || []);

    if (data?.price) {
      setRootPrice({
        price: data.price.price || "",
        strikeoutPrice: data.price.strikeoutPrice || "",
        wholesalePrice: data.price.wholesalePrice || "",
        costPrice: data.price.costPrice || "",
      });
    }

    if (data?.stock) {
      setRootStock({
        quantity: data.stock.quantity || "",
        sku: data.stock.sku || "",
        barcode: data.stock.barcode || "",
      });
    }

    if (data?.shipping) {
      setRootShipping({
        weight: data.shipping.weight || "",
        weightUnit: data.shipping.weightUnit || "kg",
        length: data.shipping.length || "",
        width: data.shipping.width || "",
        height: data.shipping.height || "",
      });
    }
  }, [data]);

  const handleCoreChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setCore((prev) => {
      const updated: any = { ...prev, [name]: value };
      if (name === "name") {
        updated.slug = generateSlug(value);
        updated.rootSku = generateSKU(value);
      }
      return updated;
    });
  };

  const updateColorVariant = (idx: number, patch: Partial<ColorVariant>) =>
    setColorVariants((prev) =>
      prev.map((v, i) => (i === idx ? { ...v, ...patch } : v)),
    );

  const addSizeToColor = (colorIdx: number) =>
    setColorVariants((prev) =>
      prev.map((v, i) =>
        i === colorIdx ? { ...v, sizes: [...v.sizes, emptySizeEntry()] } : v,
      ),
    );

  const updateSizeInColor = (
    colorIdx: number,
    sizeIdx: number,
    patch: Partial<SizeEntry>,
  ) =>
    setColorVariants((prev) =>
      prev.map((v, i) =>
        i === colorIdx
          ? {
              ...v,
              sizes: v.sizes.map((s, j) =>
                j === sizeIdx ? { ...s, ...patch } : s,
              ),
            }
          : v,
      ),
    );

  const removeSizeFromColor = (colorIdx: number, sizeIdx: number) =>
    setColorVariants((prev) =>
      prev.map((v, i) =>
        i === colorIdx
          ? { ...v, sizes: v.sizes.filter((_, j) => j !== sizeIdx) }
          : v,
      ),
    );

  const addAttributeToCustom = (idx: number) =>
    setCustomVariants((prev) =>
      prev.map((v, i) =>
        i === idx
          ? { ...v, attributes: [...v.attributes, { key: "", value: "" }] }
          : v,
      ),
    );

  const updateCustomAttribute = (
    varIdx: number,
    attrIdx: number,
    k: "key" | "value",
    val: string,
  ) =>
    setCustomVariants((prev) =>
      prev.map((v, i) =>
        i === varIdx
          ? {
              ...v,
              attributes: v.attributes.map((a, j) =>
                j === attrIdx ? { ...a, [k]: val } : a,
              ),
            }
          : v,
      ),
    );

  const hasValues = (obj: Record<string, any>) =>
    Object.values(obj).some((v) => v !== "");

  const addTag = (value: string) => {
    const normalized = value?.toLowerCase().trim();
    if (!normalized || tags.includes(normalized)) return;
    setTags([...tags, normalized]);
    setTagInput("");
  };

  const addKeyword = (value: string) => {
    const v = value.toLowerCase().trim();
    if (!v || keywords.includes(v)) return;
    setKeywords([...keywords, v]);
    setKeywordInput("");
  };

  const addHighlight = (value: string) => {
    const v = value.toLowerCase().trim();
    if (!v || highlights.includes(v)) return;
    setHighlights([...highlights, v]);
    setHighlightInput("");
  };

  const handleSubmit = () => {
    if (!core.name) return showPopup("error", "Product name required");
    if (!core.category) return showPopup("error", "Category required");
    // if (!core.plan) return showPopup("error", "Plan required");
    if (!productImage.length && !data?.images?.length) {
      return showPopup("error", "At least 1 product image required");
    }

    const fd = new FormData();
    fd.append("variantType", variantType);

    Object.entries(core).forEach(([k, v]) => v && fd.append(k, v));
    fd.append("tags", JSON.stringify(tags));
    Object.entries(flags).forEach(([k, v]) => fd.append(k, String(v)));

    if (seo.metaTitle) fd.append("metaTitle", seo.metaTitle);
    if (seo.metaDescription) fd.append("metaDescription", seo.metaDescription);

    if (keywords.length) {
      fd.append("keywords", JSON.stringify(keywords));
    }

    if (highlights.length) {
      fd.append("highlights", JSON.stringify(highlights));
    }

    if (seo.returnPolicy) fd.append("returnPolicy", seo.returnPolicy);
    if (seo.warrantyInfo) fd.append("warrantyInfo", seo.warrantyInfo);

    const cleanSpecs = specifications.filter(
      (s) => s.key.trim() && s.value.trim(),
    );
    if (cleanSpecs.length)
      fd.append("specifications", JSON.stringify(cleanSpecs));

    if (productImage.length) {
      const altTags = generateAltTags(core.name, productImage.length);
      fd.append("imageAltTags", JSON.stringify(altTags));
    }

    if (videoUrl) fd.append("videoUrl", videoUrl);
    productImage.forEach((f) => fd.append("productImage", f));
    fd.append("isWholesale", JSON.stringify(isWholesale));

    if (isWholesale) {
      if (!wholesaleMinQty) {
        return showPopup("error", "Wholesale minimum quantity required");
      }
      fd.append("wholesaleMinQuantity", wholesaleMinQty);
    }

    fd.append("isBulkDiscount", JSON.stringify(isBulkDiscount));

    if (isBulkDiscount && bulkDiscounts.length)
      fd.append("bulkDiscounts", JSON.stringify(bulkDiscounts));

    if (variantType === "NONE" && !flags.isInquiry) {
      fd.append("price", JSON.stringify(rootPrice));
      const stockPayload = {
        quantity: Number(rootStock.quantity) || 0,
        stockStatus: getStockStatus(Number(rootStock.quantity)),
        sku: rootStock.sku || "",
        barcode: rootStock.barcode || "",
      };
      fd.append("stock", JSON.stringify(stockPayload));

      if (hasValues(rootShipping)) {
        fd.append("shipping", JSON.stringify(rootShipping));
      }
    } else if (variantType === "COLOR" || variantType === "COLOR_SIZE") {
      const payload = colorVariants.map(({ images, ...rest }) => ({
        ...rest,
        imageAltTags: generateAltTags(
          rest.colorName || core.name,
          images.length,
        ),
      }));

      fd.append("colorVariants", JSON.stringify(payload));
      colorVariants.forEach((v, i) =>
        v.images.forEach((img) =>
          fd.append(`colorVariants[${i}][colorImage][]`, img),
        ),
      );
    } else if (variantType === "SIZE") {
      fd.append("sizeVariants", JSON.stringify(sizeVariants));
    } else if (variantType === "UNIT") {
      fd.append("unitVariants", JSON.stringify(unitVariants));
    } else if (variantType === "WEIGHT") {
      fd.append("weightVariants", JSON.stringify(weightVariants));
    } else if (variantType === "VOLUME") {
      fd.append("volumeVariants", JSON.stringify(volumeVariants));
    } else if (variantType === "CUSTOM") {
      fd.append("customVariants", JSON.stringify(customVariants));
    }
    fd.append("vendorPercentage", "10");
    if (seo.canonicalTag) {
      fd.append("canonicalTag", seo.canonicalTag);
    }
    if (data?._id) {
      dispatch(updateProduct({ id: data._id, formData: fd }) as any);
    } else {
      dispatch(createProduct(fd) as any);
    }
  };

  useEffect(() => {
    if (createSuccess) {
      onclose();
      showPopup("success", createSuccess);
      dispatch(getProducts() as any);
      dispatch(clearProductState());
    }
    if (createError) {
      showPopup("error", createError);
      dispatch(clearProductState());
    }
  }, [createSuccess, createError]);

  useEffect(() => {
    if (updateSuccess) {
      onclose();
      showPopup("success", updateSuccess);
      dispatch(getProducts() as any);
      dispatch(clearProductState());
    }
    if (updateError) {
      showPopup("error", updateError);
      dispatch(clearProductState());
    }
  }, [updateSuccess, updateError]);

  return (
    <div className="px-20 py-6  mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          {data ? "Update Product" : "Create New Product"}
        </h2>
        <Button
          icon={<ArrowLeft size={16} />}
          variant="outline"
          onClick={onclose}
        >
          Go Back
        </Button>
      </div>
      <div className="grid gap-5">
        <FormSection title="Core Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <DarkInput
                name="name"
                label="Product Name"
                value={core.name}
                onChange={handleCoreChange}
                placeholder="e.g. Classic Cotton T-Shirt"
                required
                hint="Auto-generates slug on save"
              />
            </div>
            <DarkInput
              name="slug"
              label="Slug (URL Name)"
              value={core.slug}
              onChange={handleCoreChange}
              placeholder="classic-cotton-t-shirt"
              hint="Auto-generated"
            />
            <DarkInput
              name="brand"
              label="Brand"
              value={core.brand}
              onChange={handleCoreChange}
              placeholder="e.g. NaturaCo"
            />

            <Field label="Category" required>
              <SingleSelectDropdown
                label=""
                options={categories || []}
                value={core.category}
                onChange={(val) => setCore((p) => ({ ...p, category: val }))}
                searchable
              />
            </Field>

            <Field label="Sub-Category">
              <SingleSelectDropdown
                label=""
                options={subcategories || []}
                value={core.subCategory}
                onChange={(val) => setCore((p) => ({ ...p, subCategory: val }))}
                searchable
                labelKey="subCategory"
              />
            </Field>

            {/* <Field
              label="Plan"
              required
              hint="Billing = activeProducts × pricePerProduct"
            >

              <select
                value={core.plan}
                onChange={(e) =>
                  setCore((p) => ({ ...p, plan: e.target.value }))
                }
                className={selectCls}
              >
                <option value="">— Select Plan —</option>
                <option value="starter">Starter — ₹50/product</option>
                <option value="PLAN_ID_HERE">Growth — ₹35/product</option>
                <option value="pro">Pro — ₹20/product</option>
              </select>
            </Field> */}

            <div className="md:col-span-2">
              <Field label="Short Description" hint="optional · max 500 chars">
                <textarea
                  value={core.shortDescription}
                  onChange={(e) =>
                    setCore((p) => ({ ...p, shortDescription: e.target.value }))
                  }
                  rows={5}
                  placeholder="One-liner shown on listing cards…"
                  className={inputCls + " resize-y"}
                />
              </Field>
            </div>

            <div className="md:col-span-2">
              <Field label="Full Description">
                <CKEditor
                  editor={ClassicEditor}
                  data={core.description}
                  config={{
                    placeholder:
                      "Detailed product description, features, usage…",
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
                  onChange={(_: any, editor: any) =>
                    setCore((p) => ({ ...p, description: editor.getData() }))
                  }
                />
              </Field>
            </div>
          </div>
        </FormSection>

        <FormSection title="Media">
          <FileUpload
            height="h-[160px]"
            label="Upload Images"
            type="image"
            value={productImage}
            multiple
            setValue={(files) => setProductImage(files as File[])}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 items-center">
            <DarkInput
              label="Video URL"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
            />

            <div>
              <label className="text-sm font-medium text-gray-700">Tags</label>
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag(tagInput);
                  }
                }}
                placeholder="Type and press Enter..."
                className={inputCls}
              />

              {tagInput && filteredTags.length > 0 && (
                <div className="border mt-1 rounded bg-white shadow">
                  {filteredTags.map((tag) => (
                    <div
                      key={tag}
                      onClick={() => {
                        setTags([...tags, tag]);
                        setTagInput("");
                      }}
                      className="px-3 py-1 cursor-pointer hover:bg-gray-100"
                    >
                      {tag}
                    </div>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-orange-100 text-orange-600 rounded flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      className="cursor-pointer"
                      onClick={() => setTags(tags.filter((t) => t !== tag))}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </FormSection>

        <FormSection title="Variant Type">
          <p className="text-xs text-gray-500 mb-3">
            Select the variant type. Only the matching variant array is saved —
            others are cleared. <strong>NONE</strong> = simple product with root
            price/stock.
          </p>

          <div className="flex flex-wrap gap-2 mb-5">
            {VARIANT_TYPES.map((vt) => (
              <button
                key={vt}
                type="button"
                onClick={() => setVariantType(vt)}
                className={`text-xs px-4 py-2 rounded-lg border font-medium transition ${
                  variantType === vt
                    ? "bg-orange-500 border-orange-500 text-white"
                    : "bg-white border-gray-300 text-gray-600 hover:border-orange-400 hover:text-orange-500"
                }`}
              >
                {vt}
              </button>
            ))}
          </div>

          {variantType === "NONE" && (
            <div>
              <PriceBlockFields value={rootPrice} onChange={setRootPrice} />
              <StockBlockFields value={rootStock} onChange={setRootStock} />
              <div className="mt-3">
                <ShippingBlockFields
                  value={rootShipping}
                  onChange={setRootShipping}
                />
              </div>
            </div>
          )}

          {variantType === "COLOR" && (
            <div>
              <p className="text-xs text-gray-400 mb-3">
                Send <code className="text-orange-500">colorVariants</code> as
                JSON. Images via{" "}
                <code className="text-orange-500">
                  colorVariants[0][colorImage][]
                </code>
                , etc.
              </p>
              {colorVariants.map((v, i) => (
                <VariantCard
                  key={i}
                  title={`Color Variant #${i + 1}`}
                  onRemove={() =>
                    setColorVariants((p) => p.filter((_, j) => j !== i))
                  }
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    <DarkInput
                      label="Color Name *"
                      value={v.colorName}
                      onChange={(e) =>
                        updateColorVariant(i, { colorName: e.target.value })
                      }
                      placeholder="Red"
                    />
                    <Field label="Color Code *">
                      <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 gap-2 bg-white hover:border-orange-400 transition">
                        <input
                          type="color"
                          value={v.colorCode}
                          onChange={(e) =>
                            updateColorVariant(i, { colorCode: e.target.value })
                          }
                          className="w-6 h-6 rounded border-0 p-0 bg-transparent cursor-pointer"
                        />
                        <span className="text-sm text-gray-700">
                          {v.colorCode}
                        </span>
                      </div>
                    </Field>
                    <Field label="Images">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) =>
                          updateColorVariant(i, {
                            images: Array.from(e.target.files || []),
                          })
                        }
                        className="bg-white border border-gray-300 rounded-lg text-gray-600 text-xs px-3 py-2 file:mr-2 file:bg-orange-50 file:text-orange-500 file:border-0 file:rounded file:px-2 file:py-0.5 cursor-pointer w-full"
                      />
                    </Field>
                  </div>
                  <PriceBlockFields
                    value={v.price}
                    onChange={(price) => updateColorVariant(i, { price })}
                  />
                  <StockBlockFields
                    value={v.stock}
                    onChange={(stock) => updateColorVariant(i, { stock })}
                  />
                </VariantCard>
              ))}
              <AddBtn
                onClick={() =>
                  setColorVariants((p) => [...p, emptyColorVariant()])
                }
              >
                + Add Color Variant
              </AddBtn>
            </div>
          )}

          {variantType === "SIZE" && (
            <div>
              {sizeVariants?.map((v, i) => (
                <VariantCard
                  key={i}
                  title={`Size Variant #${i + 1}`}
                  onRemove={() =>
                    setSizeVariants((p) => p.filter((_, j) => j !== i))
                  }
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                    <DarkInput
                      label="Size *"
                      value={v.size}
                      onChange={(e) =>
                        setSizeVariants((p) =>
                          p.map((s, j) =>
                            j === i ? { ...s, size: e.target.value } : s,
                          ),
                        )
                      }
                      placeholder="S / 6 / XL"
                    />
                    <DarkInput
                      label="Price *"
                      type="number"
                      value={v.price.price}
                      onChange={(e) =>
                        setSizeVariants((p) =>
                          p.map((s, j) =>
                            j === i
                              ? {
                                  ...s,
                                  price: { ...s.price, price: e.target.value },
                                }
                              : s,
                          ),
                        )
                      }
                      placeholder="999"
                    />
                    <DarkInput
                      label="Quantity *"
                      type="number"
                      value={v.stock.quantity}
                      onChange={(e) =>
                        setSizeVariants((p) =>
                          p.map((s, j) =>
                            j === i
                              ? {
                                  ...s,
                                  stock: {
                                    ...s.stock,
                                    quantity: e.target.value,
                                  },
                                }
                              : s,
                          ),
                        )
                      }
                      placeholder="30"
                    />
                    <DarkInput
                      label="SKU"
                      value={v.stock.sku}
                      onChange={(e) =>
                        setSizeVariants((p) =>
                          p.map((s, j) =>
                            j === i
                              ? {
                                  ...s,
                                  stock: { ...s.stock, sku: e.target.value },
                                }
                              : s,
                          ),
                        )
                      }
                      placeholder="SKU-S"
                    />
                  </div>
                  <ShippingBlockFields
                    value={v.shipping}
                    onChange={(shipping) =>
                      setSizeVariants((p) =>
                        p.map((s, j) => (j === i ? { ...s, shipping } : s)),
                      )
                    }
                  />
                </VariantCard>
              ))}
              <AddBtn
                onClick={() =>
                  setSizeVariants((p) => [...p, emptySizeVariant()])
                }
              >
                + Add Size Variant
              </AddBtn>
            </div>
          )}

          {variantType === "COLOR_SIZE" && (
            <div>
              <p className="text-xs text-gray-400 mb-3">
                Each color has a{" "}
                <code className="text-orange-500">sizes[]</code> array with its
                own price + stock.
              </p>
              {colorVariants.map((v, ci) => (
                <VariantCard
                  key={ci}
                  title={`Color #${ci + 1}`}
                  onRemove={() =>
                    setColorVariants((p) => p.filter((_, j) => j !== ci))
                  }
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <DarkInput
                      label="Color Name *"
                      value={v.colorName}
                      onChange={(e) =>
                        updateColorVariant(ci, { colorName: e.target.value })
                      }
                      placeholder="Red"
                    />
                    <Field label="Color Code *">
                      <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 gap-2 bg-white hover:border-orange-400 transition">
                        <input
                          type="color"
                          value={v.colorCode}
                          onChange={(e) =>
                            updateColorVariant(ci, {
                              colorCode: e.target.value,
                            })
                          }
                          className="w-6 h-6 rounded border-0 p-0 bg-transparent cursor-pointer"
                        />
                        <span className="text-sm text-gray-700">
                          {v.colorCode}
                        </span>
                      </div>
                    </Field>
                  </div>
                  <Field label="Color Images" className="mb-4">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) =>
                        updateColorVariant(ci, {
                          images: Array.from(e.target.files || []),
                        })
                      }
                      className="bg-white border border-gray-300 rounded-lg text-gray-600 text-xs px-3 py-2 file:mr-2 file:bg-orange-50 file:text-orange-500 file:border-0 file:rounded file:px-2 file:py-0.5 cursor-pointer w-full"
                    />
                  </Field>

                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
                    Sizes inside this color
                  </p>
                  {v.sizes.map((sz, si) => (
                    <div
                      key={si}
                      className="border border-gray-200 rounded-lg p-3 mb-2 relative bg-white"
                    >
                      <p className="text-xs font-semibold text-orange-400 mb-2">
                        Size #{si + 1}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeSizeFromColor(ci, si)}
                        className="absolute top-2 right-2 text-red-400 text-[10px]"
                      >
                        ✕
                      </button>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <DarkInput
                          label="Size *"
                          value={sz.size}
                          onChange={(e) =>
                            updateSizeInColor(ci, si, { size: e.target.value })
                          }
                          placeholder="S"
                        />
                        <DarkInput
                          label="Price *"
                          type="number"
                          value={sz.price.price}
                          onChange={(e) =>
                            updateSizeInColor(ci, si, {
                              price: { ...sz.price, price: e.target.value },
                            })
                          }
                          placeholder="499"
                        />
                        <DarkInput
                          label="Quantity *"
                          type="number"
                          value={sz.stock.quantity}
                          onChange={(e) =>
                            updateSizeInColor(ci, si, {
                              stock: { ...sz.stock, quantity: e.target.value },
                            })
                          }
                          placeholder="20"
                        />
                        <DarkInput
                          label="SKU"
                          value={sz.stock.sku}
                          onChange={(e) =>
                            updateSizeInColor(ci, si, {
                              stock: { ...sz.stock, sku: e.target.value },
                            })
                          }
                          placeholder="SKU-RED-S"
                        />
                      </div>
                    </div>
                  ))}
                  <AddBtn onClick={() => addSizeToColor(ci)}>
                    + Add Size to this Color
                  </AddBtn>
                </VariantCard>
              ))}
              <AddBtn
                onClick={() =>
                  setColorVariants((p) => [...p, emptyColorVariant()])
                }
              >
                + Add Color
              </AddBtn>
            </div>
          )}
          {variantType === "UNIT" && (
            <div>
              {unitVariants.map((v, i) => (
                <VariantCard
                  key={i}
                  title={`Unit Variant #${i + 1}`}
                  onRemove={() =>
                    setUnitVariants((p) => p.filter((_, j) => j !== i))
                  }
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <DarkInput
                      label="Label *"
                      value={v.unitLabel}
                      onChange={(e) =>
                        setUnitVariants((p) =>
                          p.map((u, j) =>
                            j === i ? { ...u, unitLabel: e.target.value } : u,
                          ),
                        )
                      }
                      placeholder="Pack of 6"
                    />
                    <DarkInput
                      label="Unit Count *"
                      type="number"
                      value={v.unitCount}
                      onChange={(e) =>
                        setUnitVariants((p) =>
                          p.map((u, j) =>
                            j === i ? { ...u, unitCount: e.target.value } : u,
                          ),
                        )
                      }
                      placeholder="6"
                    />
                    <DarkInput
                      label="Price *"
                      type="number"
                      value={v.price.price}
                      onChange={(e) =>
                        setUnitVariants((p) =>
                          p.map((u, j) =>
                            j === i
                              ? {
                                  ...u,
                                  price: { ...u.price, price: e.target.value },
                                }
                              : u,
                          ),
                        )
                      }
                      placeholder="499"
                    />
                    <DarkInput
                      label="Quantity *"
                      type="number"
                      value={v.stock.quantity}
                      onChange={(e) =>
                        setUnitVariants((p) =>
                          p.map((u, j) =>
                            j === i
                              ? {
                                  ...u,
                                  stock: {
                                    ...u.stock,
                                    quantity: e.target.value,
                                  },
                                }
                              : u,
                          ),
                        )
                      }
                      placeholder="80"
                    />
                  </div>
                </VariantCard>
              ))}
              <AddBtn
                onClick={() =>
                  setUnitVariants((p) => [...p, emptyUnitVariant()])
                }
              >
                + Add Unit Variant
              </AddBtn>
            </div>
          )}

          {variantType === "WEIGHT" && (
            <div>
              {weightVariants.map((v, i) => (
                <VariantCard
                  key={i}
                  title={`Weight Variant #${i + 1}`}
                  onRemove={() =>
                    setWeightVariants((p) => p.filter((_, j) => j !== i))
                  }
                >
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <DarkInput
                      label="Value *"
                      type="number"
                      value={v.weightValue}
                      onChange={(e) =>
                        setWeightVariants((p) =>
                          p.map((w, j) =>
                            j === i ? { ...w, weightValue: e.target.value } : w,
                          ),
                        )
                      }
                      placeholder="500"
                    />
                    <Field label="Unit *">
                      <select
                        value={v.weightUnit}
                        onChange={(e) =>
                          setWeightVariants((p) =>
                            p.map((w, j) =>
                              j === i
                                ? { ...w, weightUnit: e.target.value }
                                : w,
                            ),
                          )
                        }
                        className={selectCls}
                      >
                        {["g", "kg", "lb", "oz"].map((u) => (
                          <option key={u}>{u}</option>
                        ))}
                      </select>
                    </Field>
                    <DarkInput
                      label="Display Label"
                      value={v.label}
                      onChange={(e) =>
                        setWeightVariants((p) =>
                          p.map((w, j) =>
                            j === i ? { ...w, label: e.target.value } : w,
                          ),
                        )
                      }
                      placeholder="500g"
                    />
                    <DarkInput
                      label="Price *"
                      type="number"
                      value={v.price.price}
                      onChange={(e) =>
                        setWeightVariants((p) =>
                          p.map((w, j) =>
                            j === i
                              ? {
                                  ...w,
                                  price: { ...w.price, price: e.target.value },
                                }
                              : w,
                          ),
                        )
                      }
                      placeholder="279"
                    />
                    <DarkInput
                      label="Quantity *"
                      type="number"
                      value={v.stock.quantity}
                      onChange={(e) =>
                        setWeightVariants((p) =>
                          p.map((w, j) =>
                            j === i
                              ? {
                                  ...w,
                                  stock: {
                                    ...w.stock,
                                    quantity: e.target.value,
                                  },
                                }
                              : w,
                          ),
                        )
                      }
                      placeholder="80"
                    />
                  </div>
                </VariantCard>
              ))}
              <AddBtn
                onClick={() =>
                  setWeightVariants((p) => [...p, emptyWeightVariant()])
                }
              >
                + Add Weight Variant
              </AddBtn>
            </div>
          )}

          {variantType === "VOLUME" && (
            <div>
              {volumeVariants.map((v, i) => (
                <VariantCard
                  key={i}
                  title={`Volume Variant #${i + 1}`}
                  onRemove={() =>
                    setVolumeVariants((p) => p.filter((_, j) => j !== i))
                  }
                >
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <DarkInput
                      label="Value *"
                      type="number"
                      value={v.volumeValue}
                      onChange={(e) =>
                        setVolumeVariants((p) =>
                          p.map((w, j) =>
                            j === i ? { ...w, volumeValue: e.target.value } : w,
                          ),
                        )
                      }
                      placeholder="500"
                    />
                    <Field label="Unit *">
                      <select
                        value={v.volumeUnit}
                        onChange={(e) =>
                          setVolumeVariants((p) =>
                            p.map((w, j) =>
                              j === i
                                ? { ...w, volumeUnit: e.target.value }
                                : w,
                            ),
                          )
                        }
                        className={selectCls}
                      >
                        {["ml", "l", "fl_oz"].map((u) => (
                          <option key={u}>{u}</option>
                        ))}
                      </select>
                    </Field>
                    <DarkInput
                      label="Display Label"
                      value={v.label}
                      onChange={(e) =>
                        setVolumeVariants((p) =>
                          p.map((w, j) =>
                            j === i ? { ...w, label: e.target.value } : w,
                          ),
                        )
                      }
                      placeholder="500ml"
                    />
                    <DarkInput
                      label="Price *"
                      type="number"
                      value={v.price.price}
                      onChange={(e) =>
                        setVolumeVariants((p) =>
                          p.map((w, j) =>
                            j === i
                              ? {
                                  ...w,
                                  price: { ...w.price, price: e.target.value },
                                }
                              : w,
                          ),
                        )
                      }
                      placeholder="399"
                    />
                    <DarkInput
                      label="Quantity *"
                      type="number"
                      value={v.stock.quantity}
                      onChange={(e) =>
                        setVolumeVariants((p) =>
                          p.map((w, j) =>
                            j === i
                              ? {
                                  ...w,
                                  stock: {
                                    ...w.stock,
                                    quantity: e.target.value,
                                  },
                                }
                              : w,
                          ),
                        )
                      }
                      placeholder="90"
                    />
                  </div>
                </VariantCard>
              ))}
              <AddBtn
                onClick={() =>
                  setVolumeVariants((p) => [...p, emptyVolumeVariant()])
                }
              >
                + Add Volume Variant
              </AddBtn>
            </div>
          )}

          {variantType === "CUSTOM" && (
            <div>
              {customVariants.map((v, i) => (
                <VariantCard
                  key={i}
                  title={`Custom Variant #${i + 1}`}
                  onRemove={() =>
                    setCustomVariants((p) => p.filter((_, j) => j !== i))
                  }
                >
                  <div className="mb-3">
                    <DarkInput
                      label="Variant Label *"
                      value={v.label}
                      onChange={(e) =>
                        setCustomVariants((p) =>
                          p.map((c, j) =>
                            j === i ? { ...c, label: e.target.value } : c,
                          ),
                        )
                      }
                      placeholder="Silk – Slim Fit"
                    />
                  </div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
                    Attributes (key-value pairs)
                  </p>
                  {v.attributes.map((attr, ai) => (
                    <div key={ai} className="grid grid-cols-2 gap-3 mb-2">
                      <DarkInput
                        label="Key"
                        value={attr.key}
                        onChange={(e) =>
                          updateCustomAttribute(i, ai, "key", e.target.value)
                        }
                        placeholder="Material"
                      />
                      <DarkInput
                        label="Value"
                        value={attr.value}
                        onChange={(e) =>
                          updateCustomAttribute(i, ai, "value", e.target.value)
                        }
                        placeholder="Silk"
                      />
                    </div>
                  ))}
                  <AddBtn onClick={() => addAttributeToCustom(i)}>
                    + Add Attribute
                  </AddBtn>
                  <div className="mt-4">
                    <PriceBlockFields
                      value={v.price}
                      onChange={(price) =>
                        setCustomVariants((p) =>
                          p.map((c, j) => (j === i ? { ...c, price } : c)),
                        )
                      }
                    />
                    <StockBlockFields
                      value={v.stock}
                      onChange={(stock) =>
                        setCustomVariants((p) =>
                          p.map((c, j) => (j === i ? { ...c, stock } : c)),
                        )
                      }
                    />
                    <div className="mt-3">
                      <ShippingBlockFields
                        value={v.shipping}
                        onChange={(shipping) =>
                          setCustomVariants((p) =>
                            p.map((c, j) => (j === i ? { ...c, shipping } : c)),
                          )
                        }
                      />
                    </div>
                  </div>
                </VariantCard>
              ))}
              <AddBtn
                onClick={() =>
                  setCustomVariants((p) => [...p, emptyCustomVariant()])
                }
              >
                + Add Custom Variant
              </AddBtn>
            </div>
          )}
        </FormSection>

        <FormSection title="Product Flags">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <ToggleRow
              label="Best Selling"
              sublabel="Highlights in best-selling section"
              checked={flags.bestSelling}
              onChange={(v) => setFlags((p) => ({ ...p, bestSelling: v }))}
            />
            <ToggleRow
              label="Trending"
              sublabel="Shows in trending carousel"
              checked={flags.trending}
              onChange={(v) => setFlags((p) => ({ ...p, trending: v }))}
            />
            <ToggleRow
              label="Featured"
              sublabel="Requires plan.featuredAllowed"
              checked={flags.isFeatured}
              onChange={(v) => setFlags((p) => ({ ...p, isFeatured: v }))}
            />
            <ToggleRow
              label="New Arrival"
              sublabel="Shown in new arrivals section"
              checked={flags.isNewArrival}
              onChange={(v) => setFlags((p) => ({ ...p, isNewArrival: v }))}
            />
            <ToggleRow
              label="Customizable Product"
              sublabel="Allows buyer customization input"
              checked={flags.isCustomized}
              onChange={(v) => setFlags((p) => ({ ...p, isCustomized: v }))}
            />
            <ToggleRow
              label="Inquiry Mode"
              sublabel='Hides price, shows "Contact Us"'
              checked={flags.isInquiry}
              onChange={(v) => setFlags((p) => ({ ...p, isInquiry: v }))}
            />
          </div>
        </FormSection>

        <FormSection title="Wholesale">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <ToggleRow
              label="Enable Wholesale"
              sublabel="Unlocks B2B pricing fields"
              checked={isWholesale}
              onChange={setIsWholesale}
            />
            {isWholesale && (
              <DarkInput
                label="Min. Wholesale Quantity *"
                type="number"
                value={wholesaleMinQty}
                onChange={(e) => setWholesaleMinQty(e.target.value)}
                placeholder="50"
                required
              />
            )}
          </div>
          {isWholesale && (
            <>
              {wholesaleFields.map((wf, i) => (
                <div
                  key={i}
                  className="border border-gray-200 rounded-lg p-3 mb-2 relative bg-gray-50"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setWholesaleFields((p) => p.filter((_, j) => j !== i))
                    }
                    className="absolute top-2 right-2 text-red-400 text-xs"
                  >
                    ✕
                  </button>
                  <div className="grid grid-cols-3 gap-3">
                    <Field label="Field Type">
                      <select
                        value={wf.type}
                        onChange={(e) =>
                          setWholesaleFields((p) =>
                            p.map((f, j) =>
                              j === i ? { ...f, type: e.target.value } : f,
                            ),
                          )
                        }
                        className={selectCls}
                      >
                        {["text", "number", "image", "file"].map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                    </Field>
                    <DarkInput
                      label="Label"
                      value={wf.label}
                      onChange={(e) =>
                        setWholesaleFields((p) =>
                          p.map((f, j) =>
                            j === i ? { ...f, label: e.target.value } : f,
                          ),
                        )
                      }
                      placeholder="Company Name"
                    />
                    <Field label="Required?">
                      <select
                        value={wf.required ? "true" : "false"}
                        onChange={(e) =>
                          setWholesaleFields((p) =>
                            p.map((f, j) =>
                              j === i
                                ? { ...f, required: e.target.value === "true" }
                                : f,
                            ),
                          )
                        }
                        className={selectCls}
                      >
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                      </select>
                    </Field>
                  </div>
                </div>
              ))}
              <AddBtn
                onClick={() =>
                  setWholesaleFields((p) => [
                    ...p,
                    { type: "text", label: "", required: false },
                  ])
                }
              >
                + Add Wholesale Field
              </AddBtn>
            </>
          )}
        </FormSection>

        <FormSection title="Bulk Discounts">
          <div className="mb-4">
            <ToggleRow
              label="Enable Bulk Discounts"
              sublabel="Qty-based automatic discounts"
              checked={isBulkDiscount}
              onChange={setIsBulkDiscount}
            />
          </div>
          {isBulkDiscount && (
            <>
              {bulkDiscounts.map((bd, i) => (
                <div
                  key={i}
                  className="border border-gray-200 rounded-lg p-3 mb-2 relative bg-gray-50"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setBulkDiscounts((p) => p.filter((_, j) => j !== i))
                    }
                    className="absolute top-2 right-2 text-red-400 text-xs"
                  >
                    ✕
                  </button>
                  <div className="grid grid-cols-3 gap-3">
                    <DarkInput
                      label="Min Qty *"
                      type="number"
                      value={bd.minQuantity}
                      onChange={(e) =>
                        setBulkDiscounts((p) =>
                          p.map((d, j) =>
                            j === i ? { ...d, minQuantity: e.target.value } : d,
                          ),
                        )
                      }
                      placeholder="10"
                      required
                    />
                    <DarkInput
                      label="Max Qty"
                      type="number"
                      value={bd.maxQuantity}
                      onChange={(e) =>
                        setBulkDiscounts((p) =>
                          p.map((d, j) =>
                            j === i ? { ...d, maxQuantity: e.target.value } : d,
                          ),
                        )
                      }
                      placeholder="49"
                    />
                    <DarkInput
                      label="Discount % *"
                      type="number"
                      value={bd.discountPercentage}
                      onChange={(e) =>
                        setBulkDiscounts((p) =>
                          p.map((d, j) =>
                            j === i
                              ? { ...d, discountPercentage: e.target.value }
                              : d,
                          ),
                        )
                      }
                      placeholder="5"
                      required
                    />
                  </div>
                </div>
              ))}
              <AddBtn
                onClick={() =>
                  setBulkDiscounts((p) => [
                    ...p,
                    {
                      minQuantity: "",
                      maxQuantity: "",
                      discountPercentage: "",
                    },
                  ])
                }
              >
                + Add Discount Tier
              </AddBtn>
            </>
          )}
        </FormSection>

        <FormSection title="SEO & Misc">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DarkInput
              label="Meta Title"
              value={seo.metaTitle}
              onChange={(e) =>
                setSeo((p) => ({ ...p, metaTitle: e.target.value }))
              }
              placeholder="Classic Cotton T-Shirt | Buy Online"
              hint="max 160 chars"
            />
            <DarkInput
              label="Canonical Tag"
              value={seo.canonicalTag}
              onChange={(e) =>
                setSeo((p) => ({ ...p, canonicalTag: e.target.value }))
              }
              placeholder="https://..."
            />
            <div className="md:col-span-2">
              <Field label="Meta Description" hint="max 320 chars">
                <textarea
                  value={seo.metaDescription}
                  onChange={(e) =>
                    setSeo((p) => ({ ...p, metaDescription: e.target.value }))
                  }
                  rows={5}
                  placeholder="Premium cotton tee available in multiple colors and sizes…"
                  className={inputCls + " resize-y"}
                />
              </Field>
            </div>
            <div className="md:col-span-2">
              <div>
                <label>Keywords</label>
                <input
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && keywordInput.trim()) {
                      e.preventDefault();
                      addKeyword(keywordInput);
                    }
                  }}
                  placeholder="Type and press Enter..."
                  className={inputCls}
                />

                <div className="flex flex-wrap gap-2 mt-2">
                  {keywords.map((k) => (
                    <span
                      key={k}
                      className="px-2 py-1 bg-blue-100 rounded flex gap-1 capitalize"
                    >
                      {k}
                      <button
                        type="button"
                        onClick={() =>
                          setKeywords(keywords.filter((x) => x !== k))
                        }
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="md:col-span-2">
              <div>
                <label>Highlights</label>
                <input
                  value={highlightInput}
                  onChange={(e) => setHighlightInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && highlightInput.trim()) {
                      e.preventDefault();
                      addHighlight(highlightInput);
                    }
                  }}
                  placeholder="Type and press Enter..."
                  className={inputCls}
                />

                <div className="flex flex-wrap gap-2 mt-2">
                  {highlights.map((h) => (
                    <span
                      key={h}
                      className="px-2 py-1 bg-green-100 rounded flex gap-1 capitalize"
                    >
                      {h}
                      <button
                        type="button"
                        onClick={() =>
                          setHighlights(highlights.filter((x) => x !== h))
                        }
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <Field label="Return Policy">
              <textarea
                value={seo.returnPolicy}
                onChange={(e) =>
                  setSeo((p) => ({ ...p, returnPolicy: e.target.value }))
                }
                rows={5}
                placeholder="7-day return…"
                className={inputCls + " resize-y"}
              />
            </Field>
            <Field label="Warranty Info">
              <textarea
                value={seo.warrantyInfo}
                onChange={(e) =>
                  setSeo((p) => ({ ...p, warrantyInfo: e.target.value }))
                }
                rows={5}
                placeholder="6-month manufacturer warranty…"
                className={inputCls + " resize-y"}
              />
            </Field>
            <div className="md:col-span-2">
              <Field label="Specifications">
                {specifications.map((spec, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input
                      value={spec.key}
                      onChange={(e) => {
                        const updated = [...specifications];
                        updated[i].key = e.target.value;
                        setSpecifications(updated);
                      }}
                      placeholder="Key (e.g. Material)"
                      className="border p-2 w-1/2 border-gray-400 rounded-md"
                    />

                    <input
                      value={spec.value}
                      onChange={(e) => {
                        const updated = [...specifications];
                        updated[i].value = e.target.value;
                        setSpecifications(updated);
                      }}
                      placeholder="Value (e.g. Cotton)"
                      className="border p-2 w-1/2  border-gray-400 rounded-md"
                    />

                    <button
                      type="button"
                      title="Delete"
                      onClick={() =>
                        setSpecifications(
                          specifications.filter((_, idx) => idx !== i),
                        )
                      }
                    >
                      <Trash2 />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    setSpecifications([
                      ...specifications,
                      { key: "", value: "" },
                    ])
                  }
                >
                  + Add Specification
                </button>
              </Field>
            </div>
          </div>
        </FormSection>
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button variant="secondary" onClick={onclose}>
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
