import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/dist/server/web/spec-extension/response";

// / GET /api/products/:id
export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const url = new URL(req.url);

    const take = Math.min(
      parseInt(url.searchParams.get("take") ?? "5", 10),
      100
    );

    const orderField = url.searchParams.get("orderBy") ?? "created_at"; // có thể cho: price, name...
    const orderDir = (url.searchParams.get("order") ?? "desc") as
      | "asc"
      | "desc";

    const brand = await prisma.brand.findUnique({
      where: { slug: slug },
      include: {
        _count: { select: { product: true } },
        product: {
          take,
          include: { category: true },
          orderBy: { [orderField]: orderDir },
        },
      },
    });

    if (!brand) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json(brand);
  } catch (e: unknown) {
    if (e instanceof Error) {
      return NextResponse.json(
        { message: e.message ?? "Server error" },
        { status: 500 }
      );
    }
  }
}
