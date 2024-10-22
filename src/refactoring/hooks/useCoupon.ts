import { Coupon } from "../../types.ts";
import { useState } from "react";

/**
 * 쿠폰 상태를 관리하는 커스텀 훅입니다.
 * 초기 쿠폰 목록을 설정하고, 새로운 쿠폰을 추가하는 기능을 제공합니다.
 *
 * @param {Coupon[]} initialCoupons - 초기 쿠폰 목록.
 * @returns {{
 *   coupons: Coupon[],
 *   addCoupon: (newCoupon: Coupon) => void
 * }} - 현재 쿠폰 목록과 쿠폰 추가 함수.
 */
export const useCoupons = (initialCoupons: Coupon[]) => {
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);

  /**
   * 새로운 쿠폰을 쿠폰 목록에 추가합니다.
   *
   * @param {Coupon} newCoupon - 추가할 쿠폰.
   */
  const addCoupon = (newCoupon: Coupon) => {
    setCoupons((prevCoupons) => [...prevCoupons, newCoupon]);
  };

  return { coupons, addCoupon };
};
