// app/cart/page.tsx
"use client";

import * as React from "react";
import {
  computeCart,
  setQty,
  removeItem,
  formatVND,
  CartItem,
} from "@/lib/cart/cart";
import Image from "next/image";

export default function CartPage() {
  const [state, setState] = React.useState(() => computeCart());
  const { cart, totalQty, subtotal } = state;

  React.useEffect(() => setState(computeCart()), []);

  const inc = (id: string) => {
    const current = cart.find((i) => i.productId === id);
    if (!current) return;
    setState(setQty(id, current.qty + 1));
  };

  const dec = (id: string) => {
    const current = cart.find((i) => i.productId === id);
    if (!current) return;
    const nextQty = Math.max(1, current.qty - 1);
    setState(setQty(id, nextQty));
  };

  const remove = (id: string) => setState(removeItem(id));

  if (cart.length === 0) {
    return (
      <main className="p-6">
        <h1 className="text-xl font-semibold">Giỏ hàng</h1>
        <p>Giỏ hàng trống.</p>
      </main>
    );
  }

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">Giỏ hàng</h1>

      <ul className="divide-y">
        {cart.map((it: CartItem) => (
          <li key={it.productId} className="flex items-center gap-4 py-4">
            <Image
              src={it.image}
              alt={it.name}
              className="w-16 h-16 object-cover rounded"
              width={16}
              height={16}
            />
            <div className="flex-1">
              <div className="font-medium">{it.name}</div>
              <div className="text-sm opacity-75">{formatVND(it.price)}</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => dec(it.productId)}
                className="px-2 py-1 border rounded"
              >
                -
              </button>
              <span>{it.qty}</span>
              <button
                onClick={() => inc(it.productId)}
                className="px-2 py-1 border rounded"
              >
                +
              </button>
            </div>
            <div className="w-28 text-right">
              {formatVND(it.price * it.qty)}
            </div>
            <button
              onClick={() => remove(it.productId)}
              className="ml-4 text-red-600"
            >
              Xóa
            </button>
          </li>
        ))}
      </ul>

      <div className="flex justify-between items-center border-t pt-4">
        <div>
          Tổng số lượng: <strong>{totalQty}</strong>
        </div>
        <div className="text-lg font-semibold">
          Tạm tính: {formatVND(subtotal)}
        </div>
      </div>
    </main>
  );
}
