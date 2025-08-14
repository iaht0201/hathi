import Link from "next/link";

interface BreadCrumbProps {
  nameProduct: string;
  nameCategory?: string;
}

export const BreadCrumb = ({ nameProduct, nameCategory }: BreadCrumbProps) => {
  return (
    <nav className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 text-sm text-muted-foreground flex items-center gap-2">
        <Link href="/" className="hover:underline">
          Trang chủ
        </Link>
        <span>/</span>
        {nameCategory ? (
          <Link href={`/category/${nameCategory}`} className="hover:underline">
            {nameCategory}
          </Link>
        ) : (
          <span>{nameCategory}</span>
        )}
        <span>/</span>
        <span className="text-primary">{nameProduct}</span>
      </div>
    </nav>
  );
};
