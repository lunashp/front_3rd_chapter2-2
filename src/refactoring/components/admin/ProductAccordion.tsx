import { useState } from "react";
import { Discount, Product } from "../../../types.ts";
import {
  addDiscountToProduct,
  removeDiscountFromProduct,
  updateProductField,
} from "../../hooks/utils/productUtils.ts";

interface Props {
  product: Product;
  onProductUpdate: (updatedProduct: Product) => void;
  newDiscount: Discount;
  setNewDiscount: (discount: Discount) => void;
}

export const ProductAccordion = ({
  product,
  onProductUpdate,
  newDiscount,
  setNewDiscount,
}: Props) => {
  const DISCOUNT_RATE_MULTIPLIER = 100;
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [openProductIds, setOpenProductIds] = useState<Set<string>>(new Set());

  /**
   * 제품 아코디언의 열림/닫힘 상태를 토글합니다.
   *
   * @param {string} productId - 토글할 제품의 ID
   */
  const toggleProductAccordion = (productId: string) => {
    setOpenProductIds((prev) => {
      const newSet = new Set(prev);
      newSet.has(productId) ? newSet.delete(productId) : newSet.add(productId);
      return newSet;
    });
  };

  /**
   * 제품을 편집할 때 현재 편집 중인 제품을 설정합니다.
   *
   * @param {Product} product - 편집할 제품
   */
  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product });
  };

  /**
   * 현재 편집 중인 제품에 새 할인 정보를 추가합니다.
   */
  const handleAddDiscount = () => {
    if (editingProduct) {
      const updatedProduct = addDiscountToProduct(editingProduct, newDiscount);
      setEditingProduct(updatedProduct);
      onProductUpdate(updatedProduct);
      setNewDiscount({ quantity: 0, rate: 0 }); // 새로운 할인 초기화
    }
  };

  /**
   * 편집 중인 제품에서 특정 인덱스의 할인 정보를 제거합니다.
   *
   * @param {number} index - 제거할 할인 정보의 인덱스
   */
  const handleRemoveDiscount = (index: number) => {
    if (editingProduct) {
      const updatedProduct = removeDiscountFromProduct(editingProduct, index);
      setEditingProduct(updatedProduct);
      onProductUpdate(updatedProduct);
    }
  };

  /**
   * 편집 중인 제품의 특정 필드를 업데이트합니다.
   *
   * @param {keyof Product} field - 업데이트할 필드의 키
   * @param {string | number} value - 업데이트할 값
   */
  const handleUpdateProductField = (
    field: keyof Product,
    value: string | number
  ) => {
    if (editingProduct) {
      const newProduct = updateProductField(editingProduct, field, value);
      setEditingProduct(newProduct);
      onProductUpdate(newProduct);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <button
        data-testid="toggle-button"
        onClick={() => toggleProductAccordion(product.id)}
        className="w-full text-left font-semibold"
      >
        {product.name} - {product.price}원 (재고: {product.stock})
      </button>
      {openProductIds.has(product.id) && (
        <div className="mt-2">
          {editingProduct ? (
            <div>
              <div className="mb-4">
                <label className="block mb-1">상품명:</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) =>
                    handleUpdateProductField("name", e.target.value)
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">가격:</label>
                <input
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) =>
                    handleUpdateProductField("price", parseInt(e.target.value))
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">재고:</label>
                <input
                  type="number"
                  value={editingProduct.stock}
                  onChange={(e) =>
                    handleUpdateProductField("stock", parseInt(e.target.value))
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-2">할인 정보</h4>
                {editingProduct.discounts.map((discount, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center mb-2"
                  >
                    <span>
                      {discount.quantity}개 이상 구매 시 {discount.rate * 100}%
                      할인
                    </span>
                    <button
                      onClick={() => handleRemoveDiscount(index)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      삭제
                    </button>
                  </div>
                ))}
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="수량"
                    value={newDiscount.quantity}
                    onChange={(e) =>
                      setNewDiscount({
                        ...newDiscount,
                        quantity: parseInt(e.target.value),
                      })
                    }
                    className="w-1/3 p-2 border rounded"
                  />
                  <input
                    type="number"
                    placeholder="할인율 (%)"
                    value={newDiscount.rate * 100}
                    onChange={(e) =>
                      setNewDiscount({
                        ...newDiscount,
                        rate: parseInt(e.target.value) / 100,
                      })
                    }
                    className="w-1/3 p-2 border rounded"
                  />
                  <button
                    onClick={handleAddDiscount}
                    className="w-1/3 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                  >
                    할인 추가
                  </button>
                </div>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mt-2"
              >
                수정 완료
              </button>
            </div>
          ) : (
            <div>
              {product.discounts.map((discount, index) => (
                <div key={index} className="mb-2">
                  <span>
                    {discount.quantity}개 이상 구매 시{" "}
                    {discount.rate * DISCOUNT_RATE_MULTIPLIER}% 할인
                  </span>
                </div>
              ))}
              <button
                data-testid="modify-button"
                onClick={() => handleEditProduct(product)}
                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mt-2"
              >
                수정
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
