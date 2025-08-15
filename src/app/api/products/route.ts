import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  Brand,
  ProductType,
  ProductTypeEnum,
  ProductWithCategory,
} from "@/types/product";
// const PRODUCT_TYPE_TITLE: Record<ProductType, string> = {
//   BESTSELLER: "Best Seller",
//   PARTNER: "Sản phẩm đối tác",
//   NEW: "Sản phẩm mới",
// };
export async function GET(req: Request) {
  const url = new URL(req.url);
  const take = Math.min(
    parseInt(url.searchParams.get("take") ?? "20", 10),
    100
  );
  const skip = parseInt(url.searchParams.get("skip") ?? "0", 10);
  const q = url.searchParams.get("q") ?? undefined;
  const brandParam = url.searchParams.get("brand") ?? undefined;

  const where: { [key: string]: unknown } = {};

  // Tìm theo tên
  if (q) {
    where.name = { contains: q, mode: "insensitive" };
  }
  if (brandParam) {
    const slugs = brandParam
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    where.brand = {
      is: {
        slug: { in: slugs },
      },
    };
  }
  const products: ProductWithCategory[] = await prisma.product.findMany({
    take,
    skip,
    orderBy: { created_at: "desc" },
    where,
    include: {
      category: true,
      brand: true,
    },
  });

  // const title = selectedTypes?.length
  //   ? selectedTypes.length === 1
  //     ? PRODUCT_TYPE_TITLE[selectedTypes[0]]
  //     : selectedTypes.map((t) => PRODUCT_TYPE_TITLE[t]).join(" • ")
  //   : undefined;
  return NextResponse.json({
    limit: take,
    offset: skip,
    length: products.length,
    // title,
    products,
  });
}

export async function POST(req: Request) {
  const data = await req.json();
  const created = await prisma.product.create({ data });
  return NextResponse.json(created, { status: 201 });
}
