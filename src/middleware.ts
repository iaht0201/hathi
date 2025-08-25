import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isAdminRoute =
    path.startsWith("/admin") || path.startsWith("/api/admin");

  if (!isAdminRoute) return NextResponse.next();

  const auth = req.headers.get("authorization") || "";
  const expectedUser = process.env.ADMIN_USER || "admin";
  const expectedPass = process.env.ADMIN_PASS || "admin";

  if (!auth.startsWith("Basic ")) {
    return new NextResponse("Auth required", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="admin"' },
    });
  }
  const [, b64] = auth.split(" ");
  const [u, p] = Buffer.from(b64, "base64").toString().split(":");
  if (u !== expectedUser || p !== expectedPass) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
