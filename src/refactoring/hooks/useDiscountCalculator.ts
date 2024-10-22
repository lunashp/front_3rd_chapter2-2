// useDiscountCalculator.ts
import { CartItem, Coupon } from "../../types";

interface DiscountResult {
  totalBeforeDiscount: number;
  totalAfterDiscount: number;
  totalDiscount: number;
}

/**
 * 장바구니의 총 금액을 계산하고, 선택된 쿠폰과 상품의 할인율을 적용하여
 * 할인 전, 할인 후, 할인 금액을 반환하는 커스텀 훅입니다.
 *
 * @param {CartItem[]} cart - 총 금액을 계산할 장바구니 아이템 배열.
 * @param {Coupon | null} selectedCoupon - 적용할 쿠폰 (없을 경우 null).
 * @returns {DiscountResult} - 할인 전, 할인 후, 할인 금액을 포함하는 객체.
 */
export const useDiscountCalculator = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
): DiscountResult => {
  const calculateTotal = (): DiscountResult => {
    let totalBeforeDiscount = 0;
    let totalAfterDiscount = 0;

    cart.forEach((item) => {
      const { price } = item.product;
      const { quantity } = item;
      totalBeforeDiscount += price * quantity;

      // 상품의 최대 할인율을 계산
      const discount = item.product.discounts.reduce((maxDiscount, d) => {
        return quantity >= d.quantity && d.rate > maxDiscount
          ? d.rate
          : maxDiscount;
      }, 0);

      // 할인을 적용한 가격 계산
      totalAfterDiscount += price * quantity * (1 - discount);
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

  return calculateTotal();
};

export const getMaxDiscount = (
  discounts: { quantity: number; rate: number }[]
) => {
  return discounts.reduce((max, discount) => Math.max(max, discount.rate), 0);
};
