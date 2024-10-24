import { useState } from "react";
import { Coupon, Product } from "../../../types.ts";
import { useForm } from "../../hooks/useForm.ts";
import { createProductWithId } from "../../hooks/utils/productUtils.ts";
import { ProductAccordion } from "./ProductAccordion.tsx";
import { ProductForm } from "./ProductForm.tsx";
import { CouponForm } from "./CouponForm.tsx";
import { CouponList } from "./CouponList.tsx";

interface Props {
  products: Product[];
  coupons: Coupon[];
  onProductUpdate: (updatedProduct: Product) => void;
  onProductAdd: (newProduct: Product) => void;
  onCouponAdd: (newCoupon: Coupon) => void;
}

export const AdminPage = ({
  products,
  coupons,
  onProductUpdate,
  onProductAdd,
  onCouponAdd,
}: Props) => {
  const [showNewProductForm, setShowNewProductForm] = useState(false);

  const {
    newProduct,
    setNewProduct,
    newCoupon,
    setNewCoupon,
    resetNewProduct,
    resetNewCoupon,
    newDiscount,
    setNewDiscount,
  } = useForm({
    initialProduct: {
      name: "",
      price: 0,
      stock: 0,
      discounts: [],
    },
    initialCoupon: {
      name: "",
      code: "",
      discountType: "percentage",
      discountValue: 0,
    },
  });

  const handleAddCoupon = () => {
    onCouponAdd(newCoupon);
    resetNewCoupon();
  };

  const handleAddNewProduct = () => {
    const productWithId = createProductWithId(newProduct);
    onProductAdd(productWithId);
    resetNewProduct();
    setShowNewProductForm(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">관리자 페이지</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">상품 관리</h2>
          <button
            onClick={() => setShowNewProductForm(!showNewProductForm)}
            className="bg-green-500 text-white px-4 py-2 rounded mb-4 hover:bg-green-600"
          >
            {showNewProductForm ? "취소" : "새 상품 추가"}
          </button>

          {showNewProductForm && (
            <ProductForm
              newProduct={newProduct}
              setNewProduct={setNewProduct}
              handleAddNewProduct={handleAddNewProduct}
              showNewProductForm={showNewProductForm}
              setShowNewProductForm={setShowNewProductForm}
              onProductAdd={onProductAdd}
              resetNewProduct={resetNewProduct}
            />
          )}

          <div className="space-y-2">
            {products.map((product, index) => (
              <div key={product.id} data-testid={`product-${index + 1}`}>
                <ProductAccordion
                  key={product.id}
                  product={product}
                  onProductUpdate={onProductUpdate}
                  newDiscount={newDiscount}
                  setNewDiscount={setNewDiscount}
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">쿠폰 관리</h2>
          <div className="bg-white p-4 rounded shadow mb-4">
            <CouponForm
              handleAddCoupon={handleAddCoupon}
              newCoupon={newCoupon}
              setNewCoupon={setNewCoupon}
            />

            <CouponList coupons={coupons} />
          </div>
        </div>
      </div>
    </div>
  );
};
