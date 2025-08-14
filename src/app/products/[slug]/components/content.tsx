"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useState } from "react";
interface contentProductProps {
  images: string[];
  name: string;
  discountPercent: number;
}

export const ContentProduct = ({
  images,
  name,
  discountPercent,
}: contentProductProps) => {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <>
      <section className="px-10 mt-10 max-h-[1vh]">
        <div className="grid lg:grid-cols-2  sm:grid-cols-1 gap-10">
          <div className="p-0  w-full ">
            <div className="relative aspect-square">
              <Image
                src={images[activeIdx]}
                alt={name}
                fill
                className="object-cover rounded-3xl "
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              {discountPercent && (
                <Badge className="absolute left-3 top-3 text-lg text-white">
                  -{discountPercent.toFixed(2)}%
                </Badge>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <h1 className="text-3xl font-bold">{name}</h1>
            <div className="mt-3 grid grid-cols-5 gap-2 scroll-auto">
              {(images?.length ? images : ["/placeholder.png"]).map(
                (src, i) => (
                  <button
                    key={`${src}-${i}`}
                    onClick={() => setActiveIdx(i)}
                    className={`relative aspect-square rounded-xl overflow-hidden border transition ${
                      i === activeIdx
                        ? "ring-2 ring-primary"
                        : "hover:opacity-80"
                    }`}
                    aria-label={`Xem ảnh ${i + 1}`}
                  >
                    <Image
                      src={src}
                      alt={`${name} ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="20vw"
                    />
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
