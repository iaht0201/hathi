"use client";

import React, { useState } from "react";
import { cosmetic_form, product_type, skin_type } from "@prisma/client";
import { Plus, Trash2, Pencil, Search, Images } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type Brand = { id: string; name: string };
type Category = { id: string; name: string };

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  discount: number;
  is_active: boolean;
  images: string[];
  types: product_type[];
  form: cosmetic_form;
  target_skin: skin_type;
  brand_id: string;
  category_id: string;
};

export default function AdminProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [brands, setBrands] = React.useState<Brand[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [query, setQuery] = React.useState("");
  const [formOpen, setFormOpen] = React.useState(false);

  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [url, setUrl] = React.useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);

    try {
      const presignRes = await fetch(
        `/api/r2/presign?filename=${encodeURIComponent(
          file.name
        )}&contentType=${encodeURIComponent(
          file.type || "application/octet-stream"
        )}`
      );
      if (!presignRes.ok) {
        console.error(await presignRes.text());
        alert("Không tạo được presigned URL");
        return;
      }
      const { uploadUrl, publicUrl } = await presignRes.json();

      const putRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file,
      });
      if (!putRes.ok) {
        console.error("PUT failed:", putRes.status, await putRes.text());
        alert("Upload thất bại");
        return;
      }

      setUrl(publicUrl);
      setForm((prev) => ({
        ...prev,
        images: publicUrl,
      }));
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi khi upload");
    } finally {
      setLoading(false);
      if (e.target) e.target.value = "";
    }
  };

  const openEditForm = (p: Product) => {
    setForm({
      name: p.name,
      price: p.price,
      discount: p.discount,
      is_active: p.is_active,
      images: p.images.join(", "),
      form: p.form,
      target_skin: p.target_skin,
      brand_id: p.brand_id,
      category_id: p.category_id,
      types: p.types,
    });
    setEditingId(p.id);
    setFormOpen(true);
    setUrl(null);
  };

  type ProductForm = {
    name: string;
    price: number | string;
    discount: number | string;
    is_active: boolean;
    images: string;
    form: string;
    target_skin: string;
    brand_id: string;
    category_id: string;
    types: string[];
  };

  const [form, setForm] = React.useState<ProductForm>({
    name: "",
    price: 0,
    discount: 0,
    is_active: true,
    images: "",
    form: "OTHER",
    target_skin: "ALL",
    brand_id: "",
    category_id: "",
    types: [],
  });

  React.useEffect(() => {
    (async () => {
      const [p, b, c] = await Promise.all([
        fetch("/api/admin/products").then((r) => r.json()),
        fetch("/api/admin/brands").then((r) => r.json()),
        fetch("/api/admin/categories").then((r) => r.json()),
      ]);
      setItems(p);
      setBrands(b);
      setCategories(c);
      setLoading(false);
    })();
  }, []);

  const reload = async () => {
    const p = await fetch("/api/admin/products").then((r) => r.json());
    setItems(p);
  };

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price) || 0,
      discount: Number(form.discount) || 0,
      images: String(form.images || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      types: form.types,
    };
    const url = editingId
      ? `/api/admin/products/${editingId}`
      : "/api/admin/products";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      alert(editingId ? "Cập nhật thất bại" : "Tạo thất bại");
      return;
    }
    setForm({
      name: "",
      price: 0,
      discount: 0,
      is_active: true,
      images: "",
      form: "OTHER",
      target_skin: "ALL",
      brand_id: "",
      category_id: "",
      types: [],
    });
    setEditingId(null);
    setFormOpen(false);
    await reload();
  };

  const del = async (id: string) => {
    if (!confirm("Xóa sản phẩm?")) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("Xóa thất bại");
      return;
    }
    await reload();
  };

  const filtered = items.filter((p) => {
    const q = query.toLowerCase();
    const brandName = brands.find((b) => b.id === p.brand_id)?.name || "";
    const catName = categories.find((c) => c.id === p.category_id)?.name || "";
    return [p.name, brandName, catName].some((s) =>
      s.toLowerCase().includes(q)
    );
  });

  if (loading) return <p>Loading…</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Products</h1>
        <button
          onClick={() => setFormOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-900 text-white px-3 py-2 hover:opacity-90"
        >
          <Plus size={18} /> Thêm sản phẩm
        </button>
      </div>
      {formOpen && (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Tạo sản phẩm</h2>
            <button
              onClick={() => setFormOpen(false)}
              className="text-gray-500 hover:text-gray-900"
            >
              Đóng
            </button>
          </div>

          <form onSubmit={create} className="grid gap-4">
            <input
              className="input"
              placeholder="Tên"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="number"
                className="input"
                placeholder="Giá"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
              <input
                type="number"
                className="input"
                placeholder="Giảm giá"
                value={form.discount}
                onChange={(e) => setForm({ ...form, discount: e.target.value })}
              />
            </div>
            {url == null ? (
              form.images ? (
                <div>
                  <a href={form.images} target="_blank" rel="noreferrer">
                    <Image
                      src={form.images}
                      width={200}
                      height={200}
                      alt="image"
                    />
                  </a>

                  {/* hidden input để re-upload */}
                  <input
                    type="file"
                    id="fileInput"
                    onChange={handleUpload}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      document.getElementById("fileInput")?.click()
                    }
                    className="ml-2 text-blue-500 underline"
                  >
                    Chỉnh sửa
                  </button>
                </div>
              ) : (
                <input type="file" onChange={handleUpload} className="input" />
              )
            ) : (
              <div>
                <a href={url} target="_blank" rel="noreferrer">
                  <Image src={url} width={200} height={200} alt="url" />
                </a>

                <input
                  type="file"
                  id="fileInput"
                  onChange={handleUpload}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => document.getElementById("fileInput")?.click()}
                  className="ml-2 text-blue-500 underline"
                >
                  Chỉnh sửa
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select
                className="input"
                value={form.form}
                onChange={(e) => setForm({ ...form, form: e.target.value })}
              >
                {Object.keys(cosmetic_form).map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
              <select
                className="input"
                value={form.target_skin}
                onChange={(e) =>
                  setForm({ ...form, target_skin: e.target.value })
                }
              >
                {Object.keys(skin_type).map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <select
                className="input"
                value={form.brand_id}
                onChange={(e) => setForm({ ...form, brand_id: e.target.value })}
                required
              >
                <option value="">-- Brand --</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
              <select
                className="input"
                value={form.category_id}
                onChange={(e) =>
                  setForm({ ...form, category_id: e.target.value })
                }
                required
              >
                <option value="">-- Category --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* <fieldset className="rounded-lg border border-gray-200 p-3">
              <legend className="px-1 text-sm text-gray-500">Types</legend>
              <div className="flex flex-wrap gap-4">
                {Object.keys(product_type).map((k) => (
                  <label
                    key={k}
                    className="inline-flex items-center gap-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={form.types.includes(k)}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...form.types, k]
                          : form.types.filter((x: string) => x !== k);
                        setForm({ ...form, types: next });
                      }}
                    />
                    {k}
                  </label>
                ))}
              </div>
            </fieldset> */}

            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) =>
                  setForm({ ...form, is_active: e.target.checked })
                }
              />{" "}
              Active
            </label>

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-gray-900 text-white px-4 py-2 hover:opacity-90"
              >
                <Plus size={18} /> {editingId ? "Cập nhật" : "Tạo sản phẩm"}
              </button>
            </div>
          </form>
        </div>
      )}
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <input
            className="w-full h-10 rounded-lg border border-gray-300 pl-9 pr-3 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
            placeholder="Tìm theo tên, brand, category…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            size={16}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full min-w-[700px]">
          <thead className="bg-gray-50 text-left text-sm text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Hình ảnh</th>
              <th className="px-4 py-3 font-medium">Tên</th>
              <th className="px-4 py-3 font-medium">Giá</th>
              <th className="px-4 py-3 font-medium">Brand</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Types</th>
              <th className="px-4 py-3 font-medium">Trạng thái</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td>
                  <Image
                    src={p.images[0]}
                    width={200}
                    height={200}
                    alt="image"
                  />
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">
                  {p.name}
                </td>
                <td className="px-4 py-3">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(p.price)}
                </td>
                <td className="px-4 py-3">
                  {brands.find((b) => b.id === p.brand_id)?.name}
                </td>
                <td className="px-4 py-3">
                  {categories.find((c) => c.id === p.category_id)?.name}
                </td>
                <td className="px-4 py-3">{p.types.join(", ")}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      p.is_active
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {p.is_active ? "Active" : "Hidden"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditForm(p)}
                      className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-2 py-1 hover:bg-gray-50"
                    >
                      <Pencil size={16} />
                      Sửa
                    </button>
                    <button
                      onClick={() => del(p.id)}
                      className="inline-flex items-center gap-1 rounded-md border border-red-300 text-red-600 px-2 py-1 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create drawer/card */}

      {/* small utility styles */}
      <style jsx global>{`
        .input {
          @apply h-10 w-full rounded-lg border border-gray-300 px-3 focus:outline-none focus:ring-2 focus:ring-gray-900/10;
        }
      `}</style>
    </div>
  );
}
