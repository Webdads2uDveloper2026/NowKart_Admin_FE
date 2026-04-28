export const getVariantData = (item: any) => {
  const rootImage = item?.images?.[0];

  switch (item.variantType) {
    case "NONE":
      return {
        price: item?.price?.price || 0,
        stock: item?.stock?.quantity || 0,
        image: rootImage,
      };

    case "COLOR": {
      const v = item?.colorVariants?.[0];
      return {
        price: v?.price?.price || 0,
        stock: v?.stock?.quantity || 0,
        image: v?.images?.[0] || rootImage,
      };
    }

    case "SIZE": {
      const v = item?.sizeVariants?.[0];
      return {
        price: v?.price?.price || 0,
        stock: v?.stock?.quantity || 0,
        image: rootImage,
      };
    }

    case "UNIT": {
      const v = item?.unitVariants?.[0];
      return {
        price: v?.price?.price || 0,
        stock: v?.stock?.quantity || 0,
        image: rootImage,
      };
    }

    case "WEIGHT": {
      const v = item?.weightVariants?.[0];
      return {
        price: v?.price?.price || 0,
        stock: v?.stock?.quantity || 0,
        image: rootImage,
      };
    }

    case "VOLUME": {
      const v = item?.volumeVariants?.[0];
      return {
        price: v?.price?.price || 0,
        stock: v?.stock?.quantity || 0,
        image: rootImage,
      };
    }
    case "CUSTOM": {
      const v = item?.customVariants?.[0];
      return {
        price: v?.price?.price || 0,
        stock: v?.stock?.quantity || 0,
        image: v?.images?.[0] || item?.images?.[0] || "",
      };
    }

    default:
      return { price: 0, stock: 0, image: rootImage };
  }
};
