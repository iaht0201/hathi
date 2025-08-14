import { Brand } from "@/types/product";

export type FetchBrandsParams = {
  take?: number;
  skip?: number;
};

export async function fetchBrands({
  take = 20,
  skip = 0,
}: FetchBrandsParams = {}) {
  const qs = new URLSearchParams({ take: String(take), skip: String(skip) });
  const res = await fetch(`/api/brands?${qs.toString()}`, {
    method: "GET",
  });
  if (!res.ok) {
    throw new Error(`Fetch brands failed: ${res.status}`);
  }
  return res.json() as Promise<{
    limit: number;
    length: number;
    brands: Brand[];
  }>;
}

export type CreateBrandInput = {
  name: string;
  slug: string;
  images?: string[] | null;
};

export async function createBrand(input: CreateBrandInput) {
  const res = await fetch(`/api/brands`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error ?? `Create brand failed: ${res.status}`);
  }
  return res.json();
}
