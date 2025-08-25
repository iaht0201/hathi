import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cosmetic_form, skin_type, product_type } from "@prisma/client";

function toSlug(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function GET() {
  const items = await prisma.product.findMany({
    orderBy: { created_at: "desc" },
    include: { brand: true, category: true },
  });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const body = await req.json();
  const name: string = String(body.name || "").trim();
  const slug: string = String(body.slug || toSlug(name));
  const description: string | null = body.description ?? null;
  const how_to_use: string | null = body.how_to_use ?? null;
  const ingredients: string | null = body.ingredients ?? null;
  const form: cosmetic_form =
    (body.form && cosmetic_form[body.form as keyof typeof cosmetic_form]) ||
    cosmetic_form.OTHER;
  const target_skin: skin_type =
    (body.target_skin &&
      skin_type[body.target_skin as keyof typeof skin_type]) ||
    skin_type.ALL;
  const country_of_origin: string | null = body.country_of_origin ?? null;
  const images: string[] = Array.isArray(body.images)
    ? body.images.map((x: string) => String(x))
    : String(body.images || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
  const category_id: string = String(body.category_id);
  const brand_id: string = String(body.brand_id);
  const is_active: boolean = body.is_active !== false;
  const price: number = Number(body.price ?? 0);
  const discount: number = Number(body.discount ?? 0);
  const types: product_type[] = Array.isArray(body.types)
    ? (body.types
        .map((t: string) => String(t))
        .filter((t: string) => t in product_type) as product_type[])
    : [];

  if (!name || !category_id || !brand_id) {
    return NextResponse.json(
      { error: "Missing name/category_id/brand_id" },
      { status: 400 }
    );
  }

  try {
    const created = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        how_to_use,
        ingredients,
        form,
        target_skin,
        country_of_origin,
        images,
        category_id,
        brand_id,
        is_active,
        price,
        discount,
        types,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e: unknown) {
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
