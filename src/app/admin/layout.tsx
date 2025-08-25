// app/admin/layout.tsx
import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "220px 1fr",
            minHeight: "100vh",
          }}
        >
          <aside style={{ padding: 16, borderRight: "1px solid #eee" }}>
            <h2 style={{ fontWeight: 700 }}>Admin</h2>
            <nav style={{ display: "grid", gap: 8, marginTop: 12 }}>
              <a href="/admin">Dashboard</a>
              <a href="/admin/products">Products</a>
            </nav>
          </aside>
          <main style={{ padding: 24 }}>{children}</main>
        </div>
      </body>
    </html>
  );
}
