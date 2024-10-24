import { useState } from "react";
import { Product } from "../../../types.ts";
import {
  addDiscountToProduct,
  removeDiscountFromProduct,
  updateProductField,
} from "../../hooks/utils/productUtils.ts";

interface Props {
  product: Product;
  onProductUpdate: (updatedProduct: Product) => void;
  newDiscount: { quantity: number; rate: number };
  setNewDiscount: (discount: { quantity: number; rate: number }) => void;
}

export const ProductAccordion = ({
  product,
  onProductUpdate,
  newDiscount,
  setNewDiscount,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const toggleAccordion = () => {
    setOpen((prev) => !prev);
  };

  const handleEditProduct = () => {
    setEditingProduct({ ...product });
  };

  const handleNameUpdate = (newName: string) => {
    if (editingProduct) {
      const updatedProduct = updateProductField(
        editingProduct,
        "name",
        newName
      );
      setEditingProduct(updatedProduct);
      onProductUpdate(updatedProduct);
    }
  };

  const handlePriceUpdate = (newPrice: number) => {
    if (editingProduct) {
      const updatedProduct = updateProductField(
        editingProduct,
        "price",
        newPrice
      );
      setEditingProduct(updatedProduct);
      onProductUpdate(updatedProduct);
    }
  };

  const handleStockUpdate = (newStock: number) => {
    if (editingProduct) {
      const updatedProduct = updateProductField(
        editingProduct,
        "stock",
        newStock
      );
      setEditingProduct(updatedProduct);
      onProductUpdate(updatedProduct);
    }
  };

  const handleAddDiscount = () => {
    if (editingProduct) {
      const updatedProduct = addDiscountToProduct(editingProduct, newDiscount);
      setEditingProduct(updatedProduct);
      onProductUpdate(updatedProduct);
      setNewDiscount({ quantity: 0, rate: 0 }); // 새로운 할인 초기화
    }
  };

  const handleRemoveDiscount = (index: number) => {
    if (editingProduct) {
      const updatedProduct = removeDiscountFromProduct(editingProduct, index);
      setEditingProduct(updatedProduct);
      onProductUpdate(updatedProduct);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <button
        onClick={toggleAccordion}
        className="w-full text-left font-semibold"
      >
        {product.name} - {product.price}원 (재고: {product.stock})
      </button>
      {open && (
        <div className="mt-2">
          {editingProduct ? (
            <div>
              <div className="mb-4">
                <label className="block mb-1">상품명:</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => handleNameUpdate(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">가격:</label>
                <input
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) => handlePriceUpdate(parseInt(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1">재고:</label>
                <input
                  type="number"
                  value={editingProduct.stock}
                  onChange={(e) => handleStockUpdate(parseInt(e.target.value))}
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
                    {discount.quantity}개 이상 구매 시 {discount.rate * 100}%
                    할인
                  </span>
                </div>
              ))}
              <button
                onClick={handleEditProduct}
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
