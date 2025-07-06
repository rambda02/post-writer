"use client";

import { useState } from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { NavItem } from "@/types";
import { MobileNav } from "@/components/mobile-nav";
import { siteConfig } from "@/config/site";
import { Icons } from "@/components/Icons";
import { cn } from "@/lib/utils";

interface MainNavProps {
  items: NavItem[];
  children?: React.ReactNode;
}

export const MainNav = ({ items, children }: MainNavProps) => {
  const segment = useSelectedLayoutSegment();
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);

  return (
    <div className="flex items-center md:gap-10">
      {/* ロゴ */}
      <Link href="/" className="hidden items-center space-x-2 md:flex">
        <Icons.logo />
        <span className="hidden font-bold sm:inline-block">
          {siteConfig.name}
        </span>
      </Link>

      {/* デスクトップナビゲーション */}
      {items?.length ? (
        <nav className="md:flex gap-6 hidden">
          {items?.map((item, index) => (
            <Link
              key={index}
              href={item.disabled ? "#" : item.href}
              className={cn(
                "flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm",
                item.href.startsWith(`/${segment}`)
                  ? "text-foreground"
                  : "text-foreground/60",
                item.disabled && "cursor-not-allowed opacity-80"
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      ) : null}

      {/* モバイルナビゲーション */}
      <button
        className="flex items-center space-x-2 md:hidden"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      >
        {showMobileMenu ? <Icons.close /> : <Icons.logo />}
        <span className="font-bold">Menu</span>
      </button>
      {showMobileMenu && items && (
        <MobileNav items={items} onNavigate={() => setShowMobileMenu(false)}>
          {children}
        </MobileNav>
      )}
    </div>
  );
};
