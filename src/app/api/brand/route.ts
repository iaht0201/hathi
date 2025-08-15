import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const take = Math.min(
    parseInt(url.searchParams.get("take") ?? "20", 10),
    100
  );

  const skip = parseInt(url.searchParams.get("skip") ?? "0", 10);

  const brands = await prisma.brand.findMany({
    take,
    skip,
    include: {
      _count: { select: { product: true } },
    },
  });

  return NextResponse.json({
    limit: take,
    length: brands.length,
    brands,
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

  const created = await prisma.brand.create({
    data: {
      name: data.name,
      slug: data.slug,
    },
  });

  return NextResponse.json(created, { status: 201 });
}
