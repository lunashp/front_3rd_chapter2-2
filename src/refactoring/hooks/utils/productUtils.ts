import { Product } from "../../../types.ts";

/**
 * 제품의 특정 필드를 새로운 값으로 업데이트
 * @param {Product} product - 업데이트할 제품 객체.
 * @param {string} field - 업데이트할 제품 필드.
 * @param {string | number} value - 해당 필드에 설정할 새로운 값.
 * @returns {Product} - 업데이트된 제품 객체.
 */
export const updateProductField = (
  product: Product,
  field: string,
  value: string | number
): Product => {
  return { ...product, [field]: value };
};

/**
 * 주어진 제품 목록에서 특정 ID를 가진 제품을 찾습니다.
 * @param {Product[]} products - 제품 객체 배열.
 * @param {string} productId - 찾고자 하는 제품의 ID.
 * @returns {Product | undefined} - 찾은 제품 객체 또는 찾지 못했을 경우 undefined.
 */
export const findProductById = (
  products: Product[],
  productId: string
): Product | undefined => {
  return products.find((p) => p.id === productId);
};

/**
 * 제품의 할인 배열에 새로운 할인을 추가합니다.
 * @param {Product} product - 할인을 추가할 제품 객체.
 * @param {{ quantity: number; rate: number }} discount - 추가할 할인 객체로, 수량과 할인율을 포함합니다.
 * @returns {Product} - 할인이 추가된 제품 객체.
 */
export const addDiscountToProduct = (
  product: Product,
  discount: { quantity: number; rate: number }
): Product => {
  return {
    ...product,
    discounts: [...product.discounts, discount],
  };
};

/**
 * 제품의 할인 배열에서 인덱스에 해당하는 할인을 제거합니다.
 * @param {Product} product - 할인을 제거할 제품 객체.
 * @param {number} index - 제거할 할인 객체의 인덱스.
 * @returns {Product} - 할인이 제거된 제품 객체.
 */
export const removeDiscountFromProduct = (
  product: Product,
  index: number
): Product => {
  return {
    ...product,
    discounts: product.discounts.filter((_, i) => i !== index),
  };
};

/**
 * 새로운 ID를 가진 제품을 생성합니다. 기존 제품 객체에 'id' 필드를 추가합니다.
 * @param {Omit<Product, "id">} product - ID 필드가 없는 제품 객체.
 * @returns {Product} - 새롭게 생성된 ID를 가진 제품 객체.
 */
export const createProductWithId = (product: Omit<Product, "id">): Product => {
  return { ...product, id: Date.now().toString() };
};
