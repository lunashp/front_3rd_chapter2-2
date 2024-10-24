import { Product } from "../../../types.ts";

export const updateProductField = (
  product: Product,
  field: string,
  value: any
): Product => {
  return { ...product, [field]: value };
};

export const findProductById = (
  products: Product[],
  productId: string
): Product | undefined => {
  return products.find((p) => p.id === productId);
};

export const addDiscountToProduct = (
  product: Product,
  discount: { quantity: number; rate: number }
): Product => {
  return {
    ...product,
    discounts: [...product.discounts, discount],
  };
};

export const removeDiscountFromProduct = (
  product: Product,
  index: number
): Product => {
  return {
    ...product,
    discounts: product.discounts.filter((_, i) => i !== index),
  };
};

export const createProductWithId = (product: Omit<Product, "id">): Product => {
  return { ...product, id: Date.now().toString() };
};
