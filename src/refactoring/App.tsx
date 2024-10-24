import { useState } from "react";
import { CartPage } from "./components/cart/CartPage.tsx";
import { AdminPage } from "./components/admin/AdminPage.tsx";
import { useCoupons, useProducts } from "./hooks";
import { initialCoupons, initialProducts } from "./data/initialData.ts";
import { NavBar } from "./components/NavBar.tsx";

const App = () => {
  const { products, updateProduct, addProduct } = useProducts(initialProducts);
  const { coupons, addCoupon } = useCoupons(initialCoupons);
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar isAdmin={isAdmin} toggleAdmin={() => setIsAdmin(!isAdmin)} />
      <main className="container mx-auto mt-6">
        {isAdmin ? (
          <AdminPage
            products={products}
            coupons={coupons}
            onProductUpdate={updateProduct}
            onProductAdd={addProduct}
            onCouponAdd={addCoupon}
          />
        ) : (
          <CartPage products={products} coupons={coupons} />
        )}
      </main>
    </div>
  );
};

export default App;
