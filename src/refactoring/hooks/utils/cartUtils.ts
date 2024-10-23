import { CartItem, Coupon, Product } from "../../../types";

/**
 * 주어진 수량에 따라 적용 가능한 최대 할인율을 계산합니다.
 *
 * @param {Array<{ quantity: number, rate: number }>} discounts - 적용 가능한 할인 목록.
 * @param {number} quantity - 제품의 구매 수량.
 * @returns {number} - 적용 가능한 최대 할인율.
 */
export const getMaxDiscountRate = (
  discounts: { quantity: number; rate: number }[],
  quantity: number
): number => {
  return discounts.reduce((maxDiscount, discount) => {
    return quantity >= discount.quantity && discount.rate > maxDiscount
      ? discount.rate
      : maxDiscount;
  }, 0);
};

export const getMaxDiscount = (
  discounts: { quantity: number; rate: number }[]
) => {
  return discounts.reduce((max, discount) => Math.max(max, discount.rate), 0);
};

/**
 * 주어진 장바구니 아이템의 총 가격을 계산합니다.
 * 적용된 할인율을 고려하여 최종 가격을 반환합니다.
 *
 * @param {CartItem} item - 총 가격을 계산할 장바구니 아이템.
 * @returns {number} - 적용된 할인 후의 총 가격.
 */
export const calculateItemTotal = (item: CartItem) => {
  const { price } = item.product;
  const { quantity } = item;

  const discountRate = getMaxDiscountRate(item.product.discounts, quantity);
  const totalBeforeDiscount = price * quantity;
  const totalAfterDiscount = totalBeforeDiscount * (1 - discountRate);

  return totalAfterDiscount;
};

/**
 * 주어진 장바구니 아이템에 대해 적용 가능한 최대 할인율을 계산합니다.
 *
 * @param {CartItem} item - 할인율을 계산할 장바구니 아이템.
 * @returns {number} - 적용 가능한 최대 할인율.
 */
export const getMaxApplicableDiscount = (item: CartItem) => {
  const { discounts } = item.product;
  const { quantity } = item;
  let appliedDiscount = 0;

  for (const discount of discounts) {
    if (quantity >= discount.quantity) {
      appliedDiscount = Math.max(appliedDiscount, discount.rate);
    }
  }

  return appliedDiscount;
};

/**
 * 선택된 쿠폰을 총 가격에 적용합니다.
 *
 * @param {number} totalAfterDiscount - 할인 적용 후의 총 금액.
 * @param {Coupon | null} selectedCoupon - 적용할 쿠폰 (없을 경우 null).
 * @returns {number} - 쿠폰 적용 후의 최종 금액.
 */
export const applyCoupon = (
  totalAfterDiscount: number,
  selectedCoupon: Coupon | null
): number => {
  if (!selectedCoupon) return totalAfterDiscount;

  if (selectedCoupon.discountType === "amount") {
    return Math.max(0, totalAfterDiscount - selectedCoupon.discountValue);
  } else {
    return totalAfterDiscount * (1 - selectedCoupon.discountValue / 100);
  }
};

/**
 * 장바구니의 총 금액을 계산합니다.
 * 선택된 쿠폰이 있는 경우 해당 쿠폰을 적용하여 최종 금액을 계산합니다.
 *
 * @param {CartItem[]} cart - 총 금액을 계산할 장바구니 아이템 배열.
 * @param {Coupon | null} selectedCoupon - 적용할 쿠폰 (없을 경우 null).
 * @returns {{ totalBeforeDiscount: number, totalAfterDiscount: number, totalDiscount: number }} -
 *          총 금액 (할인 전, 할인 후, 할인 금액).
 */
export const calculateCartTotal = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
): {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
  totalDiscount: number;
} => {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  cart.forEach((item) => {
    const { price } = item.product;
    const { quantity } = item;

    const totalItemBeforeDiscount = price * quantity;
    const itemAfterDiscount = calculateItemTotal(item);

    totalBeforeDiscount += totalItemBeforeDiscount;
    totalAfterDiscount += itemAfterDiscount;
  });

  totalAfterDiscount = applyCoupon(totalAfterDiscount, selectedCoupon);
  const totalDiscount = totalBeforeDiscount - totalAfterDiscount;

  return {
    totalBeforeDiscount: Math.round(totalBeforeDiscount),
    totalAfterDiscount: Math.round(totalAfterDiscount),
    totalDiscount: Math.round(totalDiscount),
  };
};

/**
 * 장바구니 아이템의 수량을 업데이트합니다.
 * 주어진 productId에 해당하는 아이템의 수량을 새로운 수량으로 변경합니다.
 *
 * @param {CartItem[]} cart - 수량을 업데이트할 장바구니 아이템 배열.
 * @param {string} productId - 수량을 업데이트할 제품의 ID.
 * @param {number} newQuantity - 새로운 수량.
 * @returns {CartItem[]} - 업데이트된 장바구니 아이템 배열.
 */
export const updateCartItemQuantity = (
  cart: CartItem[],
  productId: string,
  newQuantity: number
): CartItem[] => {
  return cart
    .map((item) => {
      if (item.product.id === productId) {
        const maxQuantity = item.product.stock;
        const updatedQuantity = Math.max(0, Math.min(newQuantity, maxQuantity));
        return updatedQuantity > 0
          ? { ...item, quantity: updatedQuantity }
          : null;
      }
      return item;
    })
    .filter((item): item is CartItem => item !== null);
};

/**
 * 장바구니에 있는 상품을 기준으로 제품의 남은 재고를 계산
 *
 * @param {Product} product - 남은 재고를 계산할 제품
 * @param {CartItem[]} cart - 현재 장바구니에 있는 아이템 목록
 * @returns {number} - 장바구니의 수량을 고려한 제품의 남은 재고
 */
export const getRemainingStock = (product: Product, cart: CartItem[]) => {
  const cartItem = cart.find((item) => item.product.id === product.id);
  return product.stock - (cartItem?.quantity || 0);
};
