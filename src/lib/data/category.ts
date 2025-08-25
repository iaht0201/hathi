import "server-only";
import { prisma } from "@/lib/prisma";

export async function listCategories({ take = 4, skip = 0 } = {}) {
  const categories = await prisma.category.findMany({
    take,
    skip,
    orderBy: { created_at: "desc" },
    include: { _count: { select: { product: true } } },
  });
  return {
    limit: take,
    length: categories.length,
    categories,
  };
}
