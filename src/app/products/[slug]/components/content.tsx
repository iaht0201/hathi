"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProductWithCategory } from "@/types/product";
import Image from "next/image";
import { useState } from "react";

interface contentProductProps {
  product: ProductWithCategory;
}

export const ContentProduct = ({ product }: contentProductProps) => {
  const [activeIdx, setActiveIdx] = useState(0);

  const images = (
    product.images?.length ? product.images : ["/images/placeholder.png"]
  ) as string[];

  const contentData = [
    { name: "Mô tả", content: product.description?.toString() },
    { name: "Cách sử dụng", content: product.how_to_use?.toString() },
    { name: "Thành phần", content: product.ingredients?.toString() },
    { name: "Thành phần sd", content: product.ingredients?.toString() },
    { name: "Thành phần  sdsd", content: product.ingredients?.toString() },
  ];

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
          <div className="mt-5 flex flex-wrap items-center gap-4">
            {/* stepper */}
            <div className="inline-flex items-center rounded-2xl border bg-white">
              <button
                type="button"
                // onClick={dec}
                className="px-3 py-2 text-xl leading-none hover:bg-gray-50"
                aria-label="Giảm số lượng"
              >
                −
              </button>
              <input
                type="number"
                min={1}
                className="w-16 text-center outline-none py-2"
              />
              <button
                type="button"
                // onClick={inc}
                className="px-3 py-2 text-xl leading-none hover:bg-gray-50"
                aria-label="Tăng số lượng"
              >
                +
              </button>
            </div>

            {/* nút thêm vào giỏ */}
            <Button className="rounded-2xl px-6 py-5 text-base">
              Thêm vào giỏ hàng
            </Button>

            {/* {added && (
              <span className="text-sm text-green-600">
                Đã thêm vào giỏ hàng!
              </span>
            )} */}
          </div>
        </div>
        <div className="order-1 lg:order-1 lg:col-span-7 lg:max-h-[90vh] lg:overflow-y-auto thumbs-rail lg:pr-2">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-700">
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
