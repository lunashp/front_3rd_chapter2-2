import { useState, useCallback } from "react";
import { CartItem, Coupon } from "../../types";
import { applyCoupon, getMaxDiscountRate } from "./utils/cartUtils";

/**
 * 할인 계산 훅
 * 장바구니 아이템과 선택된 쿠폰을 기반으로 할인 금액과 최종 금액을 계산합니다.
 *
 * @param {CartItem[]} cart - 장바구니 아이템 배열.
 * @param {Coupon | null} selectedCoupon - 적용할 쿠폰 (없을 경우 null).
 * @returns {{ totalBeforeDiscount: number, totalAfterDiscount: number, totalDiscount: number }} -
 *          총 금액 (할인 전, 할인 후, 할인 금액).
 */
const useDiscountCalculator = (
  cart: CartItem[],
  selectedCoupon: Coupon | null
) => {
  const [totalBeforeDiscount, setTotalBeforeDiscount] = useState(0);
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);

  const calculateTotal = useCallback(() => {
    let beforeDiscount = 0;
    let afterDiscount = 0;

    cart.forEach((item) => {
      const discountRate = getMaxDiscountRate(
        item.product.discounts,
        item.quantity
      );
      const itemBeforeDiscount = item.product.price * item.quantity;
      const itemAfterDiscount = itemBeforeDiscount * (1 - discountRate);

      beforeDiscount += itemBeforeDiscount;
      afterDiscount += itemAfterDiscount;
    });

    let afterDiscountWithCoupon = applyCoupon(afterDiscount, selectedCoupon);
    let discountAmount = beforeDiscount - afterDiscountWithCoupon;

    setTotalBeforeDiscount(Math.round(beforeDiscount));
    setTotalAfterDiscount(Math.round(afterDiscountWithCoupon));
    setTotalDiscount(Math.round(discountAmount));
  }, [cart, selectedCoupon]);

  return {
    totalBeforeDiscount,
    totalAfterDiscount,
    totalDiscount,
    calculateTotal,
  };
};

export default useDiscountCalculator;
