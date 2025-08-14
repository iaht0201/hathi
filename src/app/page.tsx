import {
  ShoppingBag,
  Search,
  Heart,
  Star,
  Menu,
  Sparkles,
  BadgePercent,
  Truck,
  ShieldCheck,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeaderCustom } from "@/app/components/header";
import { SliderHomePage } from "@/app/components/slide";
import { FutureCustom } from "@/app/components/future";
import { ProductCard } from "./components/product_card";
import CategoryCardCustom from "./components/category";
import { Category, ProductWithCategory } from "@/types/product";
import { getHomeProducts } from "./api/products/route";

export default async function LoobekLikeCosmetics() {
  const data = await getHomeProducts(5);
  const sections = data.sections;
  console.log("Fetched products:", data);

  const { categories } = await fetch("http://localhost:3000/api/category", {
    cache: "no-store",
  }).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* <HeaderCustom /> */}
      <SliderHomePage />
      <FutureCustom />
      {sections.map((section) => (
        <section className="mx-auto max-w-7xl px-4 py-8" key={section.type}>
          <div className="mb-6 flex items-end justify-between">
            <h3 className="text-xl md:text-2xl font-bold">{section.title}</h3>
            <div className="text-sm text-muted-foreground">
              {section.products.length} sản phẩm
            </div>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {section.products.map((item: ProductWithCategory) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        </section>
      ))}

      <div className="grid grid-cols-1 mx-6 md:grid-cols-2 lg:grid-cols-4 gap-6 my-8">
        {categories.map((cat: Category) => (
          <CategoryCardCustom key={cat.id} cat={cat} />
        ))}
      </div>

      {/* Promo banner */}
      <section className="mx-auto max-w-7xl px-4 pb-12">
        <div className="relative overflow-hidden rounded-3xl">
          <img
            src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=2000&auto=format&fit=crop"
            alt="Promo"
            className="h-[360px] w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-background/10 to-background/0" />
          <div className="absolute right-8 top-1/2 -translate-y-1/2 max-w-md">
            <p className="text-sm uppercase tracking-widest text-muted-foreground">
              Limited Time
            </p>
            <h3 className="mt-2 text-3xl md:text-4xl font-extrabold">
              Buy 2, get 1 free
            </h3>
            <p className="mt-2 text-sm md:text-base text-muted-foreground">
              Mix & match across makeup, skincare and tools. Auto‑applied at
              checkout.
            </p>
            <div className="mt-5 flex gap-3">
              <Button className="rounded-full">Shop the offer</Button>
              <Button variant="outline" className="rounded-full">
                Learn more
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-t">
        <div className="mx-auto max-w-7xl px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h4 className="text-2xl font-bold">Get 10% off your first order</h4>
            <p className="mt-2 text-muted-foreground">
              Join our newsletter for beauty tips, early access and exclusive
              offers.
            </p>
          </div>
          {/* <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              className="rounded-full"
            />
            <Button className="rounded-full">Subscribe</Button>
          </form> */}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto max-w-7xl px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          <div>
            <div className="text-xl font-black mb-3">
              loobek<span className="text-primary">.</span>
            </div>
            <p className="text-muted-foreground">
              Thoughtfully crafted beauty for every day.
            </p>
          </div>
          <div>
            <p className="font-medium mb-3">Shop</p>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="#">Makeup</a>
              </li>
              <li>
                <a href="#">Skincare</a>
              </li>
              <li>
                <a href="#">Fragrance</a>
              </li>
              <li>
                <a href="#">Tools</a>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-3">Company</p>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="#">About</a>
              </li>
              <li>
                <a href="#">Careers</a>
              </li>
              <li>
                <a href="#">Sustainability</a>
              </li>
              <li>
                <a href="#">Affiliates</a>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-3">Help</p>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a href="#">Support Center</a>
              </li>
              <li>
                <a href="#">Shipping & Returns</a>
              </li>
              <li>
                <a href="#">Track Order</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t">
          <div className="mx-auto max-w-7xl px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
            <p>
              © {new Date().getFullYear()} Loobek Cosmetics — All rights
              reserved.
            </p>
            <div className="flex items-center gap-4">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
