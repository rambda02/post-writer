import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
import { requestBasicAuth } from "@/lib/basic-auth";

export default withAuth(
  async function middleware(req) {
    // Basic 認証を要求する
    const basicAuthResponse = requestBasicAuth(req);

    // Basic 認証に失敗した場合
    if (basicAuthResponse.status === 401) {
      // Basic 認証を再度要求する
      return basicAuthResponse;
    }

    // リクエストされたパスを取得する
    const path = req.nextUrl.pathname;

    // パブリックページの場合
    if (path === "/" || path.startsWith("/blog")) {
      // スキップする
      return NextResponse.next();
    }

    // jwt トークンを取得する
    const token = await getToken({ req });

    // トークンの有無でログイン状態を判定する
    const isAuth = !!token;

    // 認証ページの場合
    if (path.startsWith("/login") || path.startsWith("/register")) {
      // ログインしている場合
      if (isAuth) {
        // ダッシュボードページにリダイレクトする
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      // ログインしていない場合は認証ページを表示する
      return null;
    }

    // ログインしていない場合
    if (!isAuth) {
      // ログインページにリダイレクトする
      return NextResponse.redirect(new URL("/login", req.url));
    }
  },
  {
    callbacks: {
      async authorized() {
        return true; // 内部チェックをスキップする
      },
    },
  }
);

export const config = {
  matcher: [
    "/",            
    "/blog/:path*",
    "/login",
    "/register",
    "/dashboard/:path*",
    "/editor/:path*",
  ],
};
