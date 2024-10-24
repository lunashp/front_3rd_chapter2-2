import { useState } from "react";
import { Coupon, Discount, Product } from "../../types";

interface UseFormProps {
  initialProduct: Omit<Product, "id">;
  initialCoupon: Coupon;
}

interface UseFormReturn {
  newProduct: Omit<Product, "id">;
  setNewProduct: (product: Omit<Product, "id">) => void;
  newCoupon: Coupon;
  setNewCoupon: (coupon: Coupon) => void;
  newDiscount: Discount;
  setNewDiscount: (discount: Discount) => void;
  resetNewProduct: () => void;
  resetNewCoupon: () => void;
}

/**
 * 제품 및 쿠폰 폼 관리를 위한 커스텀 훅
 *
 * @param {UseFormProps} initialProduct - 초기 제품 상태 (ID 제외).
 * @param {Coupon} initialCoupon - 초기 쿠폰 상태.
 * @returns {UseFormReturn} 제품 및 쿠폰 상태와 관리 함수들을 포함한 객체입니다.
 */
export const useForm = ({
  initialProduct,
  initialCoupon,
}: UseFormProps): UseFormReturn => {
  const [newProduct, setNewProduct] =
    useState<Omit<Product, "id">>(initialProduct);
  const [newCoupon, setNewCoupon] = useState<Coupon>(initialCoupon);
  const [newDiscount, setNewDiscount] = useState<Discount>({
    quantity: 0,
    rate: 0,
  });

  const resetNewProduct = () => {
    setNewProduct(initialProduct);
  };

  const resetNewCoupon = () => {
    setNewCoupon(initialCoupon);
  };

  return {
    newProduct,
    setNewProduct,
    newCoupon,
    setNewCoupon,
    newDiscount,
    setNewDiscount,
    resetNewProduct,
    resetNewCoupon,
  };
};
