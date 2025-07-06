"use client";

import { SidebarNavItem } from "@/types";
import Link from "next/link";
import { Icons } from "@/components/Icons";
import { usePathname } from "next/navigation";

interface DashBoardNavProps {
  items: SidebarNavItem[];
}

export const DashBoardNav = ({ items }: DashBoardNavProps) => {
  const path = usePathname();

  if (!items) return null;

  return (
    <nav>
      {items.map((item, index) => {
        const Icon = Icons[(item.icon as keyof typeof Icons) || "arrowRight"];

        return (
          <Link href={item.href!} key={index}>
            <span
              className={`flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground ${
                path === item.href ? "bg-accent" : "bg-transparent"
              }`}
            >
              <Icon className="mr-2 h-4 w-4" />
              {item.title}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};
