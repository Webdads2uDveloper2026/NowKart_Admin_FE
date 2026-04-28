export type VariantType =
  | "NONE"
  | "COLOR"
  | "SIZE"
  | "COLOR_SIZE"
  | "UNIT"
  | "WEIGHT"
  | "VOLUME"
  | "CUSTOM";

export interface PriceBlock {
  price: string;
  strikeoutPrice: string;
  wholesalePrice: string;
  costPrice: string;
}

export interface StockBlock {
  quantity: string;
  sku: string;
  barcode: string;
}

export interface ShippingBlock {
  weight: string;
  weightUnit: string;
  length: string;
  width: string;
  height: string;
}

interface BaseVariant {
  price: PriceBlock;
  stock: StockBlock;
}

export interface SizeEntry extends BaseVariant {
  size: string;
}

export interface SizeVariant extends BaseVariant {
  size: string;
  shipping: ShippingBlock;
}

export interface ColorVariant extends BaseVariant {
  colorName: string;
  colorCode: string;
  images: File[];
  sizes: SizeEntry[];
}

export interface UnitVariant extends BaseVariant {
  unitLabel: string;
  unitCount: string;
}

export interface WeightVariant extends BaseVariant {
  weightValue: string;
  weightUnit: string;
  label: string;
}

export interface VolumeVariant extends BaseVariant {
  volumeValue: string;
  volumeUnit: string;
  label: string;
}

export interface CustomAttribute {
  key: string;
  value: string;
}

export interface CustomVariant extends BaseVariant {
  label: string;
  attributes: CustomAttribute[];
  shipping: ShippingBlock;
}

export interface BulkDiscount {
  minQuantity: string;
  maxQuantity: string;
  discountPercentage: string;
}

export interface WholesaleField {
  type: string;
  label: string;
  required: boolean;
}

export interface CoreState {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: string;
  subCategory: string;
  brand: string;
  plan: string;
  rootSku: string;
  barcode: string;
  tags: string;
}

export type Subcategory = {
  name: string;
  slug: string;
  description?: string;
};

