"use client";
import Link from "next/link";
import { ShoppingBag, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProductWithCategory } from "@/types/product";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useState } from "react";
import { storageHelper } from "@/lib/utils/storageHelper";
type CartItem = {
  productId: string;
  name: string;
  price: number;
  image: string;
  qty: number;
};

export function ProductCard({ item }: { item: ProductWithCategory }) {
  const href = `/products/${item.slug}`;
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    try {
      const productId = item.id;
      const cartItem: CartItem = {
        productId,
        name: item.name,
        price: item?.price ?? 0,
        image: item.images[0] ?? "/images/placeholder.png",
        qty: 1,
      };

      storageHelper.push<CartItem>("cart", cartItem);

      alert(`Đã thêm ${item.name} số lượng 1 vào giỏ hàng`);

      setAdded(true);
      setTimeout(() => setAdded(false), 1800);

      console.log("Cart hiện tại:", storageHelper.get<CartItem[]>("cart"));
    } catch (e) {
      console.error(e);
      alert("Không thể thêm vào giỏ. Vui lòng thử lại.");
    }
  };

  return (
    <Card className="group overflow-hidden rounded-2xl border-0 shadow-sm hover:shadow-md transition-shadow pb-1 pt-0">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl ">
        <Badge className="absolute left-3 top-3 z-10 rounded-full px-3 py-1 text-xs capitalize text-white bg-primary">
          {item.category.name}
        </Badge>

        <Link href={href} scroll={false} className="block h-full">
          <Image
            src={item.images[0] ?? "/images/placeholder.png"}
            alt={item.name}
            width={500}
            height={500}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ objectFit: "cover" }}
          />
        </Link>

        <button
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur hover:bg-white"
          aria-label="Wishlist"
          type="button"
        >
          <Heart className="h-4 w-4" />
        </button>

        <div className="absolute inset-x-0 bottom-3 flex justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Button
            className="rounded-full"
            size="sm"
            type="button"
            onClick={handleAddToCart}
          >
            <ShoppingBag className="mr-2 h-4 w-4" /> Thêm vào giỏ hàng
          </Button>
        </div>
      </div>

      <CardContent className="p-2">
        <div className="flex items-center justify-between">
          <Link href={href} className="hover:underline">
            <h3 className="font-medium text-sm md:text-base line-clamp-2">
              {item.name}
            </h3>
          </Link>
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-sm font-semibold">
            {item.price.toFixed(2)} <span>đ</span>
          </span>

          {!!item.discount && (
            <span className="text-[12px] text-muted-foreground line-through">
              {((item.price * (100 + item.discount)) / 100).toFixed(2)}{" "}
              <span>đ</span>
            </span>
          )}
        </div>

        <div className="ml-auto text-sm text-muted-foreground mt-2 line-clamp-1">
          {item.description}
        </div>
      </CardContent>
    </Card>
  );
}
