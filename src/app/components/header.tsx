"use client";

import React from "react";
import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, Search, Heart, Menu, Sparkles, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import Image from "next/image";
import Link from "next/link";

export const HeaderCustom: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // Close on ESC
  useEffect(() => {
    if (!menuOpen && !mobileSearchOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setMobileSearchOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen, mobileSearchOpen]);

  // Prevent body scroll when overlays are open
  useEffect(() => {
    const anyOpen = menuOpen || mobileSearchOpen;
    document.documentElement.style.overflow = anyOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen, mobileSearchOpen]);

  const closeAll = useCallback(() => {
    setMenuOpen(false);
    setMobileSearchOpen(false);
  }, []);

  return (
    <>
      {/* Top bar */}
      <div className="hidden md:block border-b bg-primary/90 text-white">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-6 justify-between">
          <div className="flex items-center gap-2">
            <span>
              Chào bạn đến với Hathi beauty. Nơi nâng niu sắc đẹp Việt!{" "}
            </span>
          </div>
          <div className="flex items-center gap-4 ">
            <span className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                />
              </svg>
              0888575541
            </span>

            <span className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                />
              </svg>
              contact@hathibeauty.com
            </span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#fff]/90 backdrop-blur border-b">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center gap-4">
          {/* Mobile: menu button */}
          <button
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(true)}
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Brand */}
          <div className="">
            <Image
              src="/images/logo_cover.png"
              alt="Logo"
              width={128} // tương đương w-32
              height={128} // tương đương h-32
              className="w-32 h-10 object-cover"
            />
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex ml-8 items-center gap-6 text-sm">
            <Link href="/" className="hover:text-primary">
              Trang chủ
            </Link>
            {/* <a className="hover:text-primary" href="">
              Trang chủ
            </a> */}
            <a className="hover:text-primary" href="#">
              Blog
            </a>
            <a className="hover:text-primary" href="#">
              Liên lạc
            </a>
          </nav>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-2 md:gap-3">
            {/* Desktop search */}
            <div className="relative hidden md:block">
              <Input
                placeholder="Tìm sản phẩm…"
                className="w-72 rounded-full pl-10"
              />
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>

            {/* Mobile search button */}
            <Button
              variant="outline"
              size="icon"
              className="rounded-xl md:hidden"
              aria-label="Search"
              onClick={() => setMobileSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Wishlist */}
            <Button
              variant="outline"
              size="icon"
              className="rounded-xl relative"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full bg-primary text-[10px] leading-5 text-white text-center px-1">
                2
              </span>
            </Button>

            {/* Cart */}
            <Button
              size="icon"
              className="rounded-xl relative"
              aria-label="Cart"
            >
              <Link href="/cart">
                <ShoppingBag className="h-5 w-5" />
                {/* <span className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full bg-primary text-[10px] leading-5 text-white text-center px-1">
                  3
                </span> */}
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile slide-out menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-50 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAll}
          >
            <motion.aside
              id="mobile-menu"
              role="dialog"
              aria-label="Mobile navigation"
              className="absolute left-0 top-0 h-full w-80 max-w-[85%] bg-white shadow-xl"
              initial={{ x: -320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -320, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-4 py-4 border-b">
                <div className="text-xl font-bold flex items-center gap-2">
                  <Image
                    src="/images/logo_cover.png"
                    alt="Logo"
                    width={128} // tương đương w-32
                    height={128} // tương đương h-32
                    className="w-32 h-10 object-cover"
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-xl"
                  aria-label="Close menu"
                  onClick={() => setMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="px-4 py-3">
                <div className="relative">
                  <Input
                    placeholder="Tìm kiếm…"
                    className="w-full rounded-xl pl-10"
                  />
                  <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <nav className="px-2 py-2">
                <a
                  className="block rounded-xl px-3 py-2 text-base hover:bg-muted"
                  href="#"
                  onClick={closeAll}
                >
                  Trang chủ
                </a>
                <a
                  className="block rounded-xl px-3 py-2 text-base hover:bg-muted"
                  href="#"
                  onClick={closeAll}
                >
                  Blog
                </a>
                <a
                  className="block rounded-xl px-3 py-2 text-base hover:bg-muted"
                  href="#"
                  onClick={closeAll}
                >
                  Liên lạc
                </a>
              </nav>

              <div className="mt-auto px-4 py-4 border-t flex items-center gap-3">
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl"
                  onClick={closeAll}
                >
                  Yêu thích{" "}
                  <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-[10px] leading-5 text-white">
                    2
                  </span>
                </Button>
                <Button className="flex-1 rounded-xl" onClick={closeAll}>
                  Giỏ hàng{" "}
                  <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white text-[10px] leading-5 text-primary">
                    3
                  </span>
                </Button>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile full-screen search */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div
            key="search"
            className="fixed inset-0 z-50 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="mx-auto max-w-7xl px-4 py-4 flex items-center gap-3 border-b">
              <Button
                variant="outline"
                size="icon"
                className="rounded-xl"
                aria-label="Close search"
                onClick={() => setMobileSearchOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
              <div className="relative flex-1">
                <Input
                  autoFocus
                  placeholder="Tìm sản phẩm…"
                  className="w-full rounded-xl pl-10"
                />
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HeaderCustom;
