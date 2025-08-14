import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const take = Math.min(
    parseInt(url.searchParams.get("take") ?? "20", 10),
    100
  );

  const skip = parseInt(url.searchParams.get("skip") ?? "0", 10);

  const categories = await prisma.category.findMany({
    take,
    skip,
    orderBy: { created_at: "desc" },
    include: { _count: { select: { product: true } } },
  });

  return NextResponse.json({
    limit: take,
    length: categories.length,
    categories,
  });
}

export async function POST(req: Request) {
  const data = await req.json();

  if (!data.name || !data.slug) {
    return NextResponse.json(
      { error: "name và slug là bắt buộc" },
      { status: 400 }
    );
  }

  const created = await prisma.category.create({
    data: {
      name: data.name,
      slug: data.slug,
      images: data.images ?? null,
    },
  });

  return NextResponse.json(created, { status: 201 });
}
