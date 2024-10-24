import { Coupon } from "../../../types.ts";

interface CouponListProps {
  coupons: Coupon[];
}

export const CouponList = ({ coupons }: CouponListProps) => {
  return (
    <div>
      <div className="space-y-2">
        {coupons.map((coupon, index) => (
          <div
            key={index}
            data-testid={`coupon-${index + 1}`}
            className="bg-gray-100 p-2 rounded"
          >
            {coupon.name} ({coupon.code}):
            {coupon.discountType === "amount"
              ? `${coupon.discountValue}원`
              : `${coupon.discountValue}%`}{" "}
            할인
          </div>
        ))}
      </div>
    </div>
  );
};
