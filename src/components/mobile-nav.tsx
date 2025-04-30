import Link from "next/link";
import { NavItem } from "@/types";
import { siteConfig } from "@/config/site";

interface MobileNavProps {
  items: NavItem[];
}

export const MobileNav = ({ items }: MobileNavProps) => {
  return (
    <div className="fixed top-16 inset-0 z-50 p-6 shadow-md md:hidden animate-in slide-in-from-bottom-80">
      <div className="grid gap-6 bg-popover p-4 text-popover-foreground shadow-md">
        <Link href={"/"} className="font-bold">
          {siteConfig.name}
        </Link>
        <nav className="text-sm flex gap-4">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="p-2 font-medium hover:underline"
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};
