import { Button } from "@/components/ui/button";
import type { Category } from "@/types/product";

type Props = {
  cat: Category; // phòng trường hợp type chưa có images
};

const getImageUrl = (images?: string | string[]) => {
  if (!images) return "https://picsum.photos/800/600?blur=2";
  return Array.isArray(images)
    ? images[0] || "https://picsum.photos/800/600?blur=2"
    : images || "https://picsum.photos/800/600?blur=2";
};

export const CategoryCardCustom = ({ cat }: Props) => {
  const imgSrc = getImageUrl(
    cat.images ?? "https://picsum.photos/800/600?blur=2"
  );

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-sm flex justify-center bg-gray-100 hover:bg-gray-200 transition-colors duration-300">
      <img
        src={imgSrc}
        alt={cat.name}
        className="h-56 w-full object-cover transition-transform duration-500 hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-transparent" />
      <div className="absolute left-4 bottom-4">
        <h3 className="text-white text-xl font-semibold drop-shadow">
          {cat.name}
        </h3>
        <Button size="sm" className="mt-2 rounded-full text-white">
          Xem ngay
        </Button>
      </div>
    </div>
  );
};

export default CategoryCardCustom;
