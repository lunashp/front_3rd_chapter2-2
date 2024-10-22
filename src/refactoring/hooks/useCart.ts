import { useState, useEffect } from "react";
import { CartItem, Coupon, Product } from "../../types";
import { calculateCartTotal, updateCartItemQuantity } from "./utils/cartUtils";
import useLocalStorage from "./useLocalStorage";

/**
 * 장바구니 상태를 관리하는 커스텀 훅입니다.
 * 장바구니 아이템 추가, 제거, 수량 업데이트, 쿠폰 적용 및 총 금액 계산 기능을 제공합니다.
 *
 * @returns {{
 *   cart: CartItem[],
 *   addToCart: (product: Product) => void,
 *   removeFromCart: (productId: string) => void,
 *   updateQuantity: (productId: string, newQuantity: number) => void,
 *   applyCoupon: (coupon: Coupon) => void,
 *   calculateTotal: () => { totalBeforeDiscount: number, totalAfterDiscount: number, totalDiscount: number },
 *   selectedCoupon: Coupon | null
 * }} - 장바구니 관련 상태와 액션 함수들
 */
export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  // const [cart, setCart] = useLocalStorage<CartItem[]>("cart", []);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  // useEffect(() => {
  //   // 로컬 스토리지에서 가져온 값이 비어있으면, 기본값을 설정
  //   if (cart.length === 0) {
  //     setCart([]);
  //   }
  // }, [cart, setCart]);
  /**
   * 장바구니에 상품을 추가합니다.
   * 이미 존재하는 상품일 경우 수량을 1 증가시킵니다.
   *
   * @param {Product} product - 추가할 상품.
   */
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product.id === product.id
      );
      if (existingItem) {
        // 기존 상품의 수량 업데이트
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item
        );
      }
      // 새 상품 추가
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  /**
   * 장바구니에서 상품을 제거합니다.
   *
   * @param {string} productId - 제거할 상품의 ID.
   */
  const removeFromCart = (productId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.product.id !== productId)
    );
  };

  /**
   * 장바구니 상품의 수량을 업데이트합니다.
   *
   * @param {string} productId - 수량을 업데이트할 상품의 ID.
   * @param {number} newQuantity - 새로운 수량.
   */
  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart((prevCart) =>
      updateCartItemQuantity(prevCart, productId, newQuantity)
    );
  };

  /**
   * 선택된 쿠폰을 적용합니다.
   *
   * @param {Coupon} coupon - 적용할 쿠폰.
   */
  const applyCoupon = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
  };

  /**
   * 장바구니의 총 금액을 계산합니다.
   *
   * @returns {{ totalBeforeDiscount: number, totalAfterDiscount: number, totalDiscount: number }} -
   *          총 금액 (할인 전, 할인 후, 할인 금액).
   */
  const calculateTotal = () => {
    return calculateCartTotal(cart, selectedCoupon);
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    selectedCoupon,
  };
};
