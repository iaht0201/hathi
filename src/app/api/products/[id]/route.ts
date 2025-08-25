// app/api/products/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import type { ProductWithCategory } from "@/types/product";

export const dynamic = "force-dynamic";

// GET /api/products/:id
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id: id }, // nếu id là Int thì parse Number(params.id)
      include: { category: true },
    });
    if (!product)
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json(product);
  } catch (e: unknown) {
    if (e instanceof Error) {
      return NextResponse.json(
        { message: e.message ?? "Server error" },
        { status: 500 }
      );
    }
  }
}

// PATCH /api/products/:id
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
    const { id } = await params;
    // map tên client -> đúng cách update Prisma
    const categoryId = body.categoryId ?? body.category_id;

    const data: Prisma.productUpdateInput = {
      ...(body.name !== undefined && { name: body.name }),
      ...(body.slug !== undefined && { slug: body.slug }),
      ...(body.brand !== undefined && { brand: body.brand }),
      ...(body.description !== undefined && { description: body.description }),
      ...(body.how_to_use !== undefined && { how_to_use: body.how_to_use }),
      ...(body.ingredients !== undefined && { ingredients: body.ingredients }),
      ...(body.form !== undefined && { form: body.form }),
      ...(body.target_skin !== undefined && { target_skin: body.target_skin }),
      ...(body.country_of_origin !== undefined && {
        country_of_origin: body.country_of_origin,
      }),
      ...(typeof body.is_active === "boolean" && { is_active: body.is_active }),
      ...(Array.isArray(body.images) && { images: { set: body.images } }),
      ...(categoryId && { category: { connect: { id: categoryId } } }),
    };

    const updated: ProductWithCategory = await prisma.product.update({
      where: { id: id },
      data,
      include: { category: true },
    });

    return NextResponse.json(updated);
  } catch (e: unknown) {
    if (e instanceof Error) {
      return NextResponse.json(
        { message: e.message ?? "Update failed" },
        { status: 400 }
      );
    }
  }
}

// DELETE /api/products/:id
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.product.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (e: unknown) {
    if (e instanceof Error) {
      return NextResponse.json(
        { message: e.message ?? "Delete failed" },
        { status: 400 }
      );
    }
  }
}
