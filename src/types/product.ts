import { Prisma } from "@prisma/client";
import { product_type as ProductTypeEnum } from "@prisma/client";
import type { product_type as ProductType } from "@prisma/client";

export type ProductWithCategory = Prisma.productGetPayload<{
  include: { category: { select: { name: true } } };
}>;

export type Category = Prisma.categoryGetPayload<{
  include: { product: { select: { name: true } } };
}>;

export type Brand = Prisma.brandGetPayload<{
  include: { product: { select: { name: true } } };
}>;

export type { ProductType };
export { ProductTypeEnum };
