import { useState } from "react";
import { Coupon, Product } from "../../types.ts";
import { useDiscountCalculator } from "../hooks/useDiscountCalculator.ts";
import { ProductComponent } from "./ProductComponent.tsx";
import { CartItemComponent } from "./CartItemComponent.tsx";
import { CouponComponent } from "./CouponComponent.tsx";
import { OrderSummaryComponent } from "./OrderSummaryComponent.tsx";
import useProductSearch from "../hooks/useProductSearch.ts";
import { useCart } from "../hooks/useCart.ts";

interface Props {
  products: Product[];
  coupons: Coupon[];
}

export const CartPage = ({ products, coupons }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { filteredProducts } = useProductSearch(products, searchTerm);

  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    selectedCoupon,
  } = useCart();

  const { totalBeforeDiscount, totalAfterDiscount, totalDiscount } =
    useDiscountCalculator(cart, selectedCoupon);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">장바구니</h1>

      {/* 검색창 */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="상품명을 입력해주세요"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      {/* 상품 목록 및 장바구니 내역을 2컬럼으로 나누는 grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 상품 목록 */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">상품 목록</h2>
          <div className="space-y-2">
            {filteredProducts.map((product) => (
              <ProductComponent
                key={product.id}
                product={product}
                cart={cart}
                addToCart={addToCart}
              />
            ))}
          </div>
        </div>

        {/* 장바구니 내역 */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">장바구니 내역</h2>
          <div className="space-y-2">
            {cart.map((item) => (
              <CartItemComponent
                key={item.product.id}
                item={item}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
              />
            ))}
          </div>

          {/* 쿠폰 컴포넌트 */}
          <div className="mt-6">
            <CouponComponent
              coupons={coupons}
              applyCoupon={applyCoupon}
              selectedCoupon={selectedCoupon}
            />
          </div>

          {/* 주문 요약 */}
          <div className="mt-6">
            <OrderSummaryComponent
              totalBeforeDiscount={totalBeforeDiscount}
              totalDiscount={totalDiscount}
              totalAfterDiscount={totalAfterDiscount}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
