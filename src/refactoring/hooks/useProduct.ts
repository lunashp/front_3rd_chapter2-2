import { useState } from "react";
import { Product } from "../../types.ts";

/**
 * 제품 상태를 관리하는 커스텀 훅입니다.
 * 초기 제품 목록을 설정하고, 제품을 업데이트하거나 추가하는 기능을 제공합니다.
 *
 * @param {Product[]} initialProducts - 초기 제품 목록.
 * @returns {{
 *   products: Product[],
 *   updateProduct: (updatedProduct: Product) => void,
 *   addProduct: (newProduct: Product) => void
 * }} - 현재 제품 목록과 제품 업데이트 및 추가 함수.
 */
export const useProducts = (initialProducts: Product[]) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  /**
   * 제품 정보를 업데이트합니다.
   *
   * @param {Product} updatedProduct - 업데이트할 제품 정보.
   */
  const updateProduct = (updatedProduct: Product) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  /**
   * 새로운 제품을 목록에 추가합니다.
   *
   * @param {Product} newProduct - 추가할 제품 정보.
   */
  const addProduct = (newProduct: Product) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  return { products, updateProduct, addProduct };
};
