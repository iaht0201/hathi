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
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/brands?${qs.toString()}`,
    {
      method: "GET",
    }
  );
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
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/brands`, {
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

export async function fetchBrandBySlug(
  slug: string,
  opts?: {
    take?: number;
    orderBy?: string;
    order?: "asc" | "desc";
  }
) {
  const params = new URLSearchParams();

  if (opts?.take) params.set("take", String(opts.take));
  if (opts?.orderBy) params.set("orderBy", opts.orderBy);
  if (opts?.order) params.set("order", opts.order);

  const query = params.toString();
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/brand/${slug}${
    query ? `?${query}` : ""
  }`;

  const res = await fetch(url, {
    method: "GET",
  });
  if (!res.ok) {
    throw new Error(`Fetch brand failed: ${res.status}`);
  }
  return res.json();
}

export async function fetchMoreBrandBySlug(
  slugs: string[],
  opts?: {
    take?: number;
    orderBy?: string;
    order?: "asc" | "desc";
  }
) {
  const promises = slugs.map((slug) => fetchBrandBySlug(slug, opts));
  return Promise.all(promises);
}
