import { prisma } from "@/lib/prisma";
import { ProductWithCategory } from "@/types/product";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BreadCrumb } from "./components/breadcrumb";
import { ContentProduct } from "./components/content";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

async function getProductBySlug(
  slug: string
): Promise<ProductWithCategory | null> {
  return await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground px-2 mx-8">
      <BreadCrumb
        nameProduct={product.name}
        nameCategory={product.category?.name}
      />
      <ContentProduct product={product} />
    </div>
  );
};

export default ProductPage;
