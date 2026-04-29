import { useEffect, useState } from "react";
import { getProductBySlug } from "../../store/slice/productSlice";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Image from "../../components/Container/Image/Image";
import { Skeleton } from "./Animation";

interface PriceInfo {
  price: number;
  strikeoutPrice?: number | null;
  wholesalePrice?: number | null;
  costPrice?: number | null;
}

interface StockInfo {
  quantity: number;
  stockStatus: "IN_STOCK" | "OUT_OF_STOCK" | "LOW_STOCK";
  sku?: string;
  barcode?: string;
}

interface ShippingInfo {
  weight?: number | null;
  weightUnit?: string;
  length?: number | null;
  width?: number | null;
  height?: number | null;
}

interface ColorVariant {
  _id: string;
  colorName: string;
  colorCode: string;
  images: string[];
  imageAltTags: string[];
  price: PriceInfo;
  stock: StockInfo;
}

interface SizeVariant {
  _id: string;
  size: string;
  price: PriceInfo;
  stock: StockInfo;
  shipping?: ShippingInfo;
}

interface UnitVariant {
  _id: string;
  unitLabel: string;
  unitCount: number;
  price: PriceInfo;
  stock: StockInfo;
}

interface WeightVariant {
  _id: string;
  weightValue: number;
  weightUnit: string;
  label: string;
  price: PriceInfo;
  stock: StockInfo;
}

interface VolumeVariant {
  _id: string;
  volumeValue: number;
  volumeUnit: string;
  label: string;
  price: PriceInfo;
  stock: StockInfo;
}

interface CustomVariant {
  _id: string;
  label: string;
  attributes: { key: string; value: string }[];
  images: string[];
  price: PriceInfo;
  stock: StockInfo;
  shipping?: ShippingInfo;
}

interface BulkDiscount {
  minQuantity: number;
  maxQuantity: number | null;
  discountPercentage: number;
}

interface Specification {
  key: string;
  value: string;
}

function fmt(n: number) {
  return "₹" + Number(n).toLocaleString("en-IN");
}

function discountPct(price: number, strike: number) {
  return Math.round(((strike - price) / strike) * 100);
}

function Badge({
  children,
  color,
}: {
  children: React.ReactNode;
  color: string;
}) {
  return (
    <span
      className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${color}`}
    >
      {children}
    </span>
  );
}

function ColorSelector({
  variants,
  selected,
  onSelect,
}: {
  variants: ColorVariant[];
  selected: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-widest font-medium text-neutral-400 mb-2.5">
        Color —{" "}
        <span className="normal-case tracking-normal font-normal text-neutral-700 capitalize">
          {variants[selected]?.colorName}
        </span>
      </p>
      <div className="flex gap-3 flex-wrap">
        {variants.map((v, i) => (
          <button
            key={v._id}
            onClick={() => onSelect(i)}
            title={v.colorName}
            className={`w-8 h-8 rounded-full border-2 transition-all duration-150 ${
              i === selected
                ? "border-neutral-900 scale-110 shadow-sm"
                : "border-transparent hover:border-neutral-300"
            }`}
            style={{ background: v.colorCode || "#ccc" }}
          />
        ))}
      </div>
    </div>
  );
}

function ChipSelector({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: { id: string; label: string; stock: number }[];
  selected: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-widest font-medium text-neutral-400 mb-2.5">
        {label}
      </p>
      <div className="flex gap-2 flex-wrap">
        {options.map((opt, i) => {
          const outOfStock = opt.stock === 0;
          return (
            <button
              key={opt.id}
              onClick={() => !outOfStock && onSelect(i)}
              disabled={outOfStock}
              className={`px-4 py-2 rounded-lg text-[13px] border transition-all duration-150 font-medium
                ${outOfStock ? "opacity-35 line-through cursor-not-allowed border-neutral-200 text-neutral-400" : ""}
                ${i === selected && !outOfStock ? "bg-neutral-900 text-white border-neutral-900" : ""}
                ${i !== selected && !outOfStock ? "bg-white text-neutral-800 border-neutral-200 hover:border-neutral-400" : ""}
              `}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

type TabId = "details" | "specs" | "policy";

function Tabs({
  active,
  onChange,
  tabs,
}: {
  active: TabId;
  onChange: (t: TabId) => void;
  tabs: { id: TabId; label: string }[];
}) {
  return (
    <div className="flex border-b border-neutral-100">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`px-4 py-2.5 text-[13px] border-b-2 transition-all duration-150 -mb-px font-medium
            ${
              active === t.id
                ? "border-neutral-900 text-neutral-900"
                : "border-transparent text-neutral-400 hover:text-neutral-600"
            }
          `}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

function Gallery({
  images,
  activeIdx,
  onSelect,
}: {
  images: string[];
  activeIdx: number;
  onSelect: (i: number) => void;
}) {
  const main = images[activeIdx] || images[0];
  return (
    <div className="flex flex-col gap-3">
      <div className="aspect-square rounded-2xl bg-neutral-50 border border-neutral-100 overflow-hidden flex items-center justify-center">
        {main ? (
          <Image
            src={main}
            alt="product"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-6xl opacity-10">📦</span>
        )}
      </div>
      <div className="flex justify-center">
        {images.length > 1 && (
          <div className="flex gap-2 flex-wrap">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => onSelect(i)}
                className={`w-14 h-14 rounded-xl overflow-hidden border-[1.5px] transition-all duration-150 flex-shrink-0 ${
                  i === activeIdx
                    ? "border-neutral-900"
                    : "border-neutral-100 hover:border-neutral-300"
                }`}
              >
                <Image
                  src={img}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { product, loading, error } = useSelector(
    (state: any) => state.product ?? {},
  );

  const highlights: string[] = (product?.highlights ?? [])
    .join(",")
    .replace(/^\[|\]$/g, "")
    .split(",")
    .map((h: string) => h.replace(/["\\]/g, "").trim())
    .filter((h: string) => h.length > 0);

  const tags: string[] = (product?.tags ?? [])
    .flatMap((t: any) => {
      try {
        return typeof t === "string" ? JSON.parse(t) : t;
      } catch {
        return [t];
      }
    })
    .map((t: string) => t.replace(/["\\]/g, ""))
    .filter((t: string) => t && t.length > 1);

  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<TabId>("details");

  useEffect(() => {
    if (slug) {
      dispatch(getProductBySlug(slug) as any);
    }
  }, [dispatch, slug]);

  useEffect(() => {
    setSelectedVariantIdx(0);
    setSelectedImageIdx(0);
    setActiveTab("details");
  }, [product?._id]);

  if (loading || !product) return <Skeleton />;

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-400 text-sm mb-1">
            Failed to load product
          </p>
          <p className="text-neutral-300 text-xs">{String(error)}</p>
        </div>
      </div>
    );
  }

  const colorVariants: ColorVariant[] = product.colorVariants ?? [];
  const sizeVariants: SizeVariant[] = product.sizeVariants ?? [];
  const unitVariants: UnitVariant[] = product.unitVariants ?? [];
  const weightVariants: WeightVariant[] = product.weightVariants ?? [];
  const volumeVariants: VolumeVariant[] = product.volumeVariants ?? [];
  const customVariants: CustomVariant[] = product.customVariants ?? [];
  const bulkDiscounts: BulkDiscount[] = product.bulkDiscounts ?? [];
  const specifications: Specification[] = product.specifications ?? [];

  const getActiveVariantData = () => {
    const rootImage = product.images?.[0];
    switch (product.variantType) {
      case "NONE":
        return {
          price: product.price?.price ?? 0,
          strikeout: product.price?.strikeoutPrice ?? null,
          wholesale: product.price?.wholesalePrice ?? null,
          stock: product.stock?.quantity ?? 0,
          image: rootImage,
          attrs: [] as { key: string; value: string }[],
        };
      case "COLOR": {
        const v = colorVariants[selectedVariantIdx];
        return {
          price: v?.price?.price ?? 0,
          strikeout: v?.price?.strikeoutPrice ?? null,
          wholesale: v?.price?.wholesalePrice ?? null,
          stock: v?.stock?.quantity ?? 0,
          image: v?.images?.[0] ?? rootImage,
          attrs: [],
        };
      }
      case "SIZE": {
        const v = sizeVariants[selectedVariantIdx];
        return {
          price: v?.price?.price ?? 0,
          strikeout: v?.price?.strikeoutPrice ?? null,
          wholesale: null,
          stock: v?.stock?.quantity ?? 0,
          image: rootImage,
          attrs: [],
        };
      }
      case "UNIT": {
        const v = unitVariants[selectedVariantIdx];
        return {
          price: v?.price?.price ?? 0,
          strikeout: v?.price?.strikeoutPrice ?? null,
          wholesale: null,
          stock: v?.stock?.quantity ?? 0,
          image: rootImage,
          attrs: [],
        };
      }
      case "WEIGHT": {
        const v = weightVariants[selectedVariantIdx];
        return {
          price: v?.price?.price ?? 0,
          strikeout: v?.price?.strikeoutPrice ?? null,
          wholesale: null,
          stock: v?.stock?.quantity ?? 0,
          image: rootImage,
          attrs: [],
        };
      }
      case "VOLUME": {
        const v = volumeVariants[selectedVariantIdx];
        return {
          price: v?.price?.price ?? 0,
          strikeout: v?.price?.strikeoutPrice ?? null,
          wholesale: null,
          stock: v?.stock?.quantity ?? 0,
          image: rootImage,
          attrs: [],
        };
      }
      case "CUSTOM": {
        const v = customVariants[selectedVariantIdx];
        return {
          price: v?.price?.price ?? 0,
          strikeout: v?.price?.strikeoutPrice ?? null,
          wholesale: v?.price?.wholesalePrice ?? null,
          stock: v?.stock?.quantity ?? 0,
          image: v?.images?.[0] ?? rootImage,
          attrs: v?.attributes ?? [],
        };
      }
      default:
        return {
          price: 0,
          strikeout: null,
          wholesale: null,
          stock: 0,
          image: rootImage,
          attrs: [],
        };
    }
  };

  const active = getActiveVariantData();
  const disc = active.strikeout
    ? discountPct(active.price, active.strikeout)
    : 0;

  const galleryImages: string[] = (() => {
    if (product.variantType === "COLOR") {
      const v = colorVariants[selectedVariantIdx];
      if (v?.images?.length) return v.images;
    }
    if (product.variantType === "CUSTOM") {
      const v = customVariants[selectedVariantIdx];
      if (v?.images?.length) return v.images;
    }
    return product.images ?? [];
  })();

  const tabs: { id: TabId; label: string }[] = [
    { id: "details", label: "Details" },
    ...(specifications.length
      ? [{ id: "specs" as TabId, label: "Specifications" }]
      : []),
    ...(product.returnPolicy || product.warrantyInfo
      ? [{ id: "policy" as TabId, label: "Returns & Warranty" }]
      : []),
  ];

  const handleVariantChange = (i: number) => {
    setSelectedVariantIdx(i);
    setSelectedImageIdx(0);
  };

  const renderVariantSelector = () => {
    switch (product.variantType) {
      case "COLOR":
        return (
          <ColorSelector
            variants={colorVariants}
            selected={selectedVariantIdx}
            onSelect={handleVariantChange}
          />
        );
      case "SIZE":
        return (
          <ChipSelector
            label="Size"
            options={sizeVariants.map((v) => ({
              id: v._id,
              label: v.size,
              stock: v.stock?.quantity ?? 0,
            }))}
            selected={selectedVariantIdx}
            onSelect={handleVariantChange}
          />
        );
      case "UNIT":
        return (
          <ChipSelector
            label="Pack size"
            options={unitVariants.map((v) => ({
              id: v._id,
              label: v.unitLabel,
              stock: v.stock?.quantity ?? 0,
            }))}
            selected={selectedVariantIdx}
            onSelect={handleVariantChange}
          />
        );
      case "WEIGHT":
        return (
          <ChipSelector
            label="Weight"
            options={weightVariants.map((v) => ({
              id: v._id,
              label: v.label,
              stock: v.stock?.quantity ?? 0,
            }))}
            selected={selectedVariantIdx}
            onSelect={handleVariantChange}
          />
        );
      case "VOLUME":
        return (
          <ChipSelector
            label="Volume"
            options={volumeVariants.map((v) => ({
              id: v._id,
              label: v.label,
              stock: v.stock?.quantity ?? 0,
            }))}
            selected={selectedVariantIdx}
            onSelect={handleVariantChange}
          />
        );
      case "CUSTOM":
        return (
          <ChipSelector
            label="Variant"
            options={customVariants.map((v) => ({
              id: v._id,
              label: v.label,
              stock: v.stock?.quantity ?? 0,
            }))}
            selected={selectedVariantIdx}
            onSelect={handleVariantChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <nav className="flex items-center gap-1.5 text-xs text-neutral-400 mb-6">
          <span
            onClick={() => navigate("/products")}
            className="hover:text-neutral-700 cursor-pointer"
          >
            Home
          </span>
          <span>/</span>
          <span>{product.category?.name}</span>
          {product.subCategory && (
            <>
              <span>/</span>
              <span>{product.subCategory.subCategory}</span>
            </>
          )}
          <span>/</span>
          <span className="text-neutral-700">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <Gallery
            images={galleryImages}
            activeIdx={selectedImageIdx}
            onSelect={setSelectedImageIdx}
          />

          <div className="flex flex-col gap-3">
            <div className="flex gap-2 flex-wrap">
              {product.isNewArrival && (
                <Badge color="bg-emerald-50 text-emerald-700">
                  New arrival
                </Badge>
              )}
              {product.trending && (
                <Badge color="bg-amber-50 text-amber-700">Trending</Badge>
              )}
              {product.isFeatured && (
                <Badge color="bg-violet-50 text-violet-700">Featured</Badge>
              )}
              {product.bestSelling && (
                <Badge color="bg-sky-50 text-sky-700">Best seller</Badge>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-neutral-900 leading-tight mb-1">
                {product.name}
              </h1>
              <p className="text-sm text-neutral-400">
                by{" "}
                <span className="text-neutral-700 font-medium">
                  {product.brand}
                </span>
                {" · "}
                <span className="text-neutral-400">{product.productId}</span>
              </p>
            </div>
            <div>
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-3xl font-semibold text-neutral-900">
                  {fmt(active.price)}
                </span>
                {active.strikeout && (
                  <span className="text-base text-neutral-400 line-through">
                    {fmt(active.strikeout)}
                  </span>
                )}
                {disc > 0 && (
                  <span className="text-xs font-medium bg-red-50 text-red-600 px-2.5 py-0.5 rounded-full">
                    {disc}% off
                  </span>
                )}
              </div>
              {active.wholesale && (
                <p className="text-xs text-neutral-400">
                  Wholesale:{" "}
                  <span className="text-neutral-600 font-medium">
                    {fmt(active.wholesale)}
                  </span>
                </p>
              )}
              {product.isWholesale && product.wholesaleMinQuantity && (
                <p className="text-xs text-neutral-400 mt-0.5">
                  Min. wholesale order:{" "}
                  <span className="text-neutral-600 font-medium">
                    {product.wholesaleMinQuantity} units
                  </span>
                </p>
              )}
            </div>

            <div className="border-t border-neutral-100" />
            {renderVariantSelector()}
            {active.attrs?.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {active.attrs.map((a) => (
                  <span
                    key={a.key}
                    className="text-xs px-3 py-1.5 bg-neutral-100 text-neutral-700 rounded-full"
                  >
                    <span className="font-medium">{a.key}:</span> {a.value}
                  </span>
                ))}
              </div>
            )}

            <div className="border-t border-neutral-100" />
            {product.isBulkDiscount && bulkDiscounts.length > 0 && (
              <div className="bg-white rounded-xl border border-neutral-100 p-4">
                <p className="text-[11px] uppercase tracking-widest font-medium text-neutral-400 mb-3">
                  Bulk discounts
                </p>
                <div className="flex flex-col gap-2">
                  {bulkDiscounts.map((b, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-neutral-600">
                        {b.minQuantity}
                        {b.maxQuantity ? `–${b.maxQuantity}` : "+"} units
                      </span>
                      <span className="font-medium text-emerald-700">
                        {b.discountPercentage}% off
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-neutral-100" />
            <div>
              <Tabs active={activeTab} onChange={setActiveTab} tabs={tabs} />
              <div className="pt-4">
                {activeTab === "details" && (
                  <div className="flex flex-col gap-4">
                    {highlights.length > 0 && (
                      <ul className="flex flex-col gap-2">
                        {highlights.map((h, i) => (
                          <li
                            key={i}
                            className="flex gap-2 items-start text-sm text-neutral-700"
                          >
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-neutral-900 flex-shrink-0" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    )}
                    {product.shortDescription && (
                      <p className="text-sm text-neutral-500 leading-relaxed">
                        {product.shortDescription}
                      </p>
                    )}

                    {tags.length > 0 && (
                      <div className="flex gap-2 flex-wrap mt-1">
                        {tags.map((t, i) => (
                          <span
                            key={i}
                            className="text-[11px] px-2.5 py-1 bg-neutral-100 text-neutral-500 rounded-full"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "specs" && (
                  <table className="w-full text-sm">
                    <tbody>
                      {specifications.map((s) => (
                        <tr key={s.key} className="border-b border-neutral-50">
                          <td className="py-2.5 text-neutral-400 w-2/5">
                            {s.key}
                          </td>
                          <td className="py-2.5 text-neutral-800 font-medium">
                            {s.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {activeTab === "policy" && (
                  <div className="flex flex-col gap-5">
                    {product.returnPolicy && (
                      <div>
                        <p className="text-[11px] uppercase tracking-widest font-medium text-neutral-400 mb-1.5">
                          Return policy
                        </p>
                        <p className="text-sm text-neutral-600 leading-relaxed">
                          {product.returnPolicy}
                        </p>
                      </div>
                    )}
                    {product.warrantyInfo && (
                      <div>
                        <p className="text-[11px] uppercase tracking-widest font-medium text-neutral-400 mb-1.5">
                          Warranty
                        </p>
                        <p className="text-sm text-neutral-600 leading-relaxed">
                          {product.warrantyInfo}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
