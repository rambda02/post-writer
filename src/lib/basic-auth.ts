import { NextResponse } from "next/server";
import { NextRequestWithAuth } from "next-auth/middleware";
import { siteConfig } from "@/config/site";

/**
 * Basic 認証を要求する
 *
 * @param req - NextRequestWithAuth オブジェクト
 * 
 * @returns NextResponse オブジェクト
 */
export function requestBasicAuth(req: NextRequestWithAuth): NextResponse {
  // Basic 認証が有効かどうかを判定する
  const isEnabled = process.env.BASIC_AUTH_ENABLED === "true";

  // Basic 認証が無効な場合
  if (!isEnabled) {
    // スキップする
    return NextResponse.next();
  }

  // 認証情報を取得する
  const username = process.env.BASIC_AUTH_USERNAME;
  const password = process.env.BASIC_AUTH_PASSWORD;

  // 認証情報が取得できない場合
  if (!username || !password) {
    // スキップする
    return NextResponse.next();
  }

  // リクエストヘッダーから Authorization ヘッダーを取得する (例: "Basic dXNlcjpwYXNzd29yZA==")
  const authHeader = req.headers.get("authorization");

  // Authorization ヘッダーが存在する場合
  if (authHeader) {
    // 認証情報を取得する (例: "dXNlcjpwYXNzd29yZA==")
    const authValue = authHeader.split(" ")[1];
    // 認証情報をデコードする (例: "username:password")
    const [authUser, authPass] = atob(authValue).split(":");

    // 認証情報が一致する場合
    if (authUser === username && authPass === password) {
      // スキップする
      return NextResponse.next();
    }
  }

  // 認証失敗時は Basic 認証を再度要求する
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${siteConfig.name}"`,
    },
  });
}
