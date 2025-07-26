import { User } from "next-auth";

type UserId = string;

// JWT トークンの型定義の拡張
declare module "next-auth/jwt" {
  interface JWT {
    id: UserId;
  }
}

// セッション情報の型定義の拡張
declare module "next-auth" {
  interface Session {
    user: User;
  }
}
