import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  ProductType,
  ProductTypeEnum,
  ProductWithCategory,
} from "@/types/product";
const PRODUCT_TYPE_TITLE: Record<ProductType, string> = {
  BESTSELLER: "Best Seller",
  PARTNER: "Sản phẩm đối tác",
  NEW: "Sản phẩm mới",
};
export async function GET(req: Request) {
  const url = new URL(req.url);
  const take = Math.min(
    parseInt(url.searchParams.get("take") ?? "20", 10),
    100
  );
  const skip = parseInt(url.searchParams.get("skip") ?? "0", 10);
  const q = url.searchParams.get("q") ?? undefined;
  const typeParam = url.searchParams.get("type") ?? undefined;

  const where: { [key: string]: unknown } = {};

  // Tìm theo tên
  if (q) {
    where.name = { contains: q, mode: "insensitive" };
  }

  let selectedTypes: ProductType[] | undefined;
  if (typeParam) {
    const tokens = typeParam.split(",").map((t) => t.trim().toUpperCase());
    const valid = Object.values(ProductTypeEnum) as ProductType[];
    selectedTypes = tokens.filter((t): t is ProductType =>
      valid.includes(t as ProductType)
    );

    if (selectedTypes.length === 1) {
      where.types = { has: selectedTypes[0] };
    } else if (selectedTypes.length > 1) {
      where.types = { hasSome: selectedTypes };
    }
    // nếu không có token hợp lệ -> không áp dụng filter (hoặc bạn có thể trả 400)
  }

  const products: ProductWithCategory[] = await prisma.product.findMany({
    take,
    skip,
    orderBy: { created_at: "desc" },
    where,
    include: { category: true },
  });

  const title = selectedTypes?.length
    ? selectedTypes.length === 1
      ? PRODUCT_TYPE_TITLE[selectedTypes[0]]
      : selectedTypes.map((t) => PRODUCT_TYPE_TITLE[t]).join(" • ")
    : undefined;
  return NextResponse.json({
    limit: take,
    offset: skip,
    length: products.length,
    title,
    products,
  });
}

export async function POST(req: Request) {
  const data = await req.json();
  const created = await prisma.product.create({ data });
  return NextResponse.json(created, { status: 201 });
}
const BASE = "http://localhost:3000";
type SingleResp = {
  products: ProductWithCategory[];
  title?: string;
};

async function fetchSection(type: ProductType, take = 5): Promise<SingleResp> {
  const url = `${BASE}/api/products?take=${take}&brand=${type}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Fetch ${type} failed`);
  return res.json();
}

export async function getHomeProducts(take = 5) {
  const types: ProductType[] = ["BESTSELLER", "NEW", "PARTNER"];

  // Chịu lỗi từng phần (khuyên dùng cho trang chủ)
  const settled = await Promise.allSettled(
    types.map((t) => fetchSection(t, take))
  );

  const sections = settled.map((r, i) => {
    const type = types[i];
    const products =
      r.status === "fulfilled"
        ? r.value.products
        : ([] as ProductWithCategory[]);
    return {
      type,
      title: PRODUCT_TYPE_TITLE[type],
      products,
      ok: r.status === "fulfilled",
    };
  });

  const products = sections.flatMap((s) =>
    s.products.map((p) => ({ ...p, _type: s.type }))
  );

  return {
    sections,
    total: products.length,
  };
}

export async function getProductById(
  id: string
): Promise<ProductWithCategory | null> {
  return prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });
}
