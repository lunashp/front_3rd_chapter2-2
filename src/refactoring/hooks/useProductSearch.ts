import { useState, useEffect } from "react";
import { Product } from "../../types";

/**
 * 검색어를 기준으로 상품을 필터링하는 커스텀 훅.
 *
 * @param {Product[]} products - 검색할 상품 배열.
 * @param {string} searchTerm - 상품 이름을 필터링할 검색어.
 *
 * @returns {Object} 필터링된 상품들을 포함하는 객체.
 * @returns {Product[]} filteredProducts - 검색어에 따라 필터링된 상품 목록.
 *
 * @example
 * const { filteredProducts } = useProductSearch(products, searchTerm);
 *
 * @description
 * 이 훅은 검색어를 상품 이름과 비교하여 상품 배열을 필터링합니다.
 * 검색어가 비어 있으면 모든 상품을 반환하며, 검색은 대소문자를 구분하지 않습니다.
 */
const useProductSearch = (products: Product[], searchTerm: string) => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredProducts(products);
      return;
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(lowerCaseSearchTerm)
    );

    setFilteredProducts(filtered);
  }, [products, searchTerm]);

  return { filteredProducts };
};

export default useProductSearch;
