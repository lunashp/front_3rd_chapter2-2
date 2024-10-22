import { CartItem, Coupon } from "../../../types";

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

  // 적용된 할인율을 구하고 총 가격 계산
  const discount = item.product.discounts.reduce((maxDiscount, d) => {
    return quantity >= d.quantity && d.rate > maxDiscount
      ? d.rate
      : maxDiscount;
  }, 0);

  const totalAfterDiscount = price * quantity * (1 - discount);
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
) => {
  let totalBeforeDiscount = 0;
  let totalAfterDiscount = 0;

  cart.forEach((item) => {
    totalBeforeDiscount += item.product.price * item.quantity;
    totalAfterDiscount += calculateItemTotal(item);
  });

  let totalDiscount = totalBeforeDiscount - totalAfterDiscount;

  // 쿠폰 적용
  if (selectedCoupon) {
    if (selectedCoupon.discountType === "amount") {
      totalAfterDiscount = Math.max(
        0,
        totalAfterDiscount - selectedCoupon.discountValue
      );
    } else {
      totalAfterDiscount *= 1 - selectedCoupon.discountValue / 100;
    }
    totalDiscount = totalBeforeDiscount - totalAfterDiscount;
  }

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
