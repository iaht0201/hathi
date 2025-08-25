import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cosmetic_form, skin_type } from "@prisma/client";

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;

  try {
    const body = await req.json();

    const data: Record<string, unknown> = {};

    if (body.name !== undefined) data.name = String(body.name);
    if (body.slug !== undefined) data.slug = String(body.slug);
    if (body.description !== undefined)
      data.description = body.description ?? null;
    if (body.how_to_use !== undefined)
      data.how_to_use = body.how_to_use ?? null;
    if (body.ingredients !== undefined)
      data.ingredients = body.ingredients ?? null;

    if (body.form !== undefined) {
      const f = cosmetic_form[body.form as keyof typeof cosmetic_form];
      if (f !== undefined) data.form = f;
    }

    if (body.target_skin !== undefined) {
      const t = skin_type[body.target_skin as keyof typeof skin_type];
      if (t !== undefined) data.target_skin = t;
    }

    if (body.country_of_origin !== undefined) {
      data.country_of_origin = body.country_of_origin ?? null;
    }

    if (body.images !== undefined) {
      data.images = Array.isArray(body.images)
        ? body.images.map((x: string) => String(x))
        : String(body.images || "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
    }

    if (body.category_id !== undefined)
      data.category_id = String(body.category_id);
    if (body.brand_id !== undefined) data.brand_id = String(body.brand_id);
    if (body.is_active !== undefined) data.is_active = !!body.is_active;
    if (body.price !== undefined) data.price = Number(body.price);
    if (body.discount !== undefined) data.discount = Number(body.discount);

    const updated = await prisma.product.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
