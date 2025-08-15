import { prisma } from "@/lib/prisma";
import { Brand, ProductType, ProductWithCategory } from "@/types/product";
import { fetchBrands } from "../brand/services";
const BASE = `${process.env.NEXT_PUBLIC_BASE_URL}`;

type SingleResp = {
  products: ProductWithCategory[];
  title?: string;
};

// Nhận 1 brand hoặc nhiều brand:
function buildBrandParam(brand: Brand | Brand[]) {
  return Array.isArray(brand) ? brand.join(",") : brand;
}

export async function fetchSection(
  brand: Brand | Brand[],
  take = 5
): Promise<SingleResp> {
  const params = new URLSearchParams();
  params.set("take", String(take));
  params.set("brand", buildBrandParam(brand).toString());
  const url = `${BASE}/api/products?${params.toString()}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok)
    throw new Error(
      `Fetch ${Array.isArray(brand) ? brand.join(",") : brand} failed`
    );
  return res.json();
}
export async function getProductById(
  id: string
): Promise<ProductWithCategory | null> {
  return prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });
}
