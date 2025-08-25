"use client";

import { fetchMoreBrandBySlug } from "@/app/api/brand/services";
import { ProductCard } from "@/app/components/product_card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brand, ProductWithCategory } from "@/types/product";
import { data } from "framer-motion/client";
import Image from "next/image";
import { useEffect, useState } from "react";

interface contentProductProps {
  product: ProductWithCategory;
}

export const ContentProduct = ({ product }: contentProductProps) => {
  const [datas, setDatas] = useState<Brand[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const respon = await fetchMoreBrandBySlug(["khac", "hathi"]);
        console.log("Fetched products:", respon);
        setDatas(respon);
      } catch (err) {
        console.error("Error fetching brands:", err);
      }
    };

    fetchData();
  }, [product]);

  const [activeIdx, setActiveIdx] = useState(0);

  const images = (
    product.images?.length ? product.images : ["/images/placeholder.png"]
  ) as string[];

  const contentData = [
    { name: "Mô tả", content: product.description?.toString() },
    { name: "Cách sử dụng", content: product.how_to_use?.toString() },
    { name: "Thành phần", content: product.ingredients?.toString() },
  ];

  const [qty, setQty] = useState<number>(1);

  const dec = () => setQty((q) => Math.max(1, q - 1));
  const inc = (max = 99) => setQty((q) => Math.min(max, q + 1));

  const [added, setAdded] = useState(false);
  // const maxQty = Math.max(1, (product)?.stock ?? 99);
  const maxQty = 99;

  const onQtyChange = (v: string) => {
    const n = Number(v);
    if (Number.isNaN(n)) return;
    setQty(Math.min(maxQty, Math.max(1, Math.floor(n))));
  };

  const handleAddToCart = () => {
    console.log("xin chao");
    try {
      const raw = localStorage.getItem("cart");
      const cart = raw ? JSON.parse(raw) : [];
      const productId = product.id ?? product.slug ?? product.name;

      const idx = cart.findIndex(
        (it: ProductWithCategory) => it.id === productId
      );
      if (idx >= 0) {
        cart[idx].qty = Math.min(maxQty, cart[idx].qty + qty);
      } else {
        cart.push({
          productId,
          name: product.name,
          price: product?.price ?? 0,
          image: images[activeIdx],
          qty,
        });
      }
      alert(`Đã thêm ${product.name} số lượng ${qty} vào giỏ hàng`);

      localStorage.setItem("cart", JSON.stringify(cart));

      const data = localStorage.getItem("cart");
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
      console.log(`data : $${data}`);
    } catch (e) {
      console.error(e);
      alert("Không thể thêm vào giỏ. Vui lòng thử lại.");
    }
  };
  return (
    <section className="px-4 sm:px-6 lg:px-10 mt-7 lg:mt-10">
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="order-1 lg:order-1 lg:col-span-5 lg:sticky lg:top-20">
          <div className="relative aspect-square w-full">
            <Image
              src={images[activeIdx]}
              alt={product.name}
              fill
              className="object-cover rounded-3xl"
              sizes="(max-width: 1024px) 100vw, 33vw"
              priority
            />

            {product.discount != null && (
              <Badge className="absolute left-3 top-3 text-lg text-white z-20">
                -{Number(product.discount).toFixed(2)}%
              </Badge>
            )}

            <div className="pointer-events-none absolute right-0 top-0 h-full w-30 bg-gradient-to-l from-black/10 to-transparent rounded-3xl z-10" />

            <div className="absolute inset-y-3 right-3 z-20 flex w-25 flex-col gap-3 overflow-y-auto  pl-1">
              {images.map((src, i) => (
                <button
                  key={`${src}-${i}`}
                  onClick={() => setActiveIdx(i)}
                  className={`relative w-20 aspect-square rounded-xl overflow-hidden border transition ${
                    i === activeIdx ? "ring-2 ring-primary" : "hover:opacity-80"
                  }`}
                  aria-label={`Xem ảnh ${i + 1}`}
                  type="button"
                >
                  <Image
                    src={src}
                    alt={`${product.name} ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-center  gap-4">
            {/* stepper */}
            <div className="inline-flex items-center rounded-2xl border bg-white">
              <button
                type="button"
                onClick={dec}
                className="px-3 py-2 text-xl leading-none hover:bg-gray-50"
                aria-label="Giảm số lượng"
              >
                −
              </button>
              <input
                value={qty}
                onChange={(e) => onQtyChange(e.target.value)}
                className="w-16 text-center outline-none py-3"
              />
              <button
                type="button"
                onClick={() => inc()}
                // onClick={inc}
                className="px-3 py-2 text-xl leading-none hover:bg-gray-50"
                aria-label="Tăng số lượng"
              >
                +
              </button>
            </div>

            {/* nút thêm vào giỏ */}
            <Button
              className="rounded-2xl px-6 py-6 text-base text-white"
              onClick={handleAddToCart}
            >
              Thêm vào giỏ hàng
            </Button>

            {added && (
              <span className="text-sm text-green-600">
                Đã thêm vào giỏ hàng!
              </span>
            )}
          </div>
        </div>
        <div className="order-1 lg:order-1 lg:col-span-7 lg:max-h-[90vh] lg:overflow-y-auto thumbs-rail lg:pr-2">
          <h1 className="text-3xl md:text-3xl lg:text-4xl font-bold text-primary mb-[30px]">
            {product.name}
          </h1>

          {contentData.map((item) =>
            item.name && item.content ? (
              <CardContent
                key={item.name}
                name={item.name}
                content={item.content}
              />
            ) : null
          )}
        </div>
      </div>
      <div>
        {datas.map((data: Brand) => (
          <section className="mx-auto max-w-7xl px-4 py-8" key={data.id}>
            <div className="mb-6 flex items-end justify-between">
              <h3 className="text-xl md:text-2xl font-bold">{data.name}</h3>
              <div className="text-sm text-muted-foreground">
                {data.product.length} sản phẩm
              </div>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {(data.product as ProductWithCategory[]).map((item) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
};

interface cardContentProductProps {
  name: string;
  content: string;
}
export const CardContent = ({ name, content }: cardContentProductProps) => {
  return (
    <Card className="p-4 mt-4 gap-3">
      <h2 className="text-2xl font-bold text-primary">{name}:</h2>
      <p className="text-xl text-gray-500 font-normal py-0">{content}</p>
    </Card>
  );
};
