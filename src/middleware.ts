import { withAuth } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    // jwt トークンを取得する　（ブラウザの cookie から）
    const token = await getToken({ req });

    // トークンの有無でログイン状態を判定する
    const isAuth = !!token;

    // 認証ページ　（ログイン/登録ページ）　かどうかを判定する
    const isAuthPage =
      req.nextUrl.pathname.startsWith("/login") ||
      req.nextUrl.pathname.startsWith("/register");

    // 認証ページの場合
    if (isAuthPage) {
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
        // withAuth の内部チェックをバイパス （独自のチェックロジックを使用するため）
        return true;
      },
    },
  }
);

export const config = {
  // ミドルウェアを適応するパスを指定する
  matcher: ["/dashboard/:path*", "/editor/:path*", "/login", "/register"],
};
