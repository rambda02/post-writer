import Link from "next/link";
import { Doc } from "contentlayer/generated";

import { docsConfig } from "@/config/docs";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";

interface DocsPagerProps {
  doc: Doc;
}

export function DocsPager({ doc }: DocsPagerProps) {
  const pager = getPagerForDoc(doc);

  if (!pager) {
    return null;
  }

  return (
    <div className="flex flex-row items-center justify-between">
      {pager.prev?.href ? (
        <Link
          href={pager.prev.href}
          className={cn(buttonVariants({ variant: "ghost" }))}
        >
          <Icons.chevronLeft className="mr-2 h-4 w-4" />
          {pager.prev.title}
        </Link>
      ) : (
        <div /> // または空のdivを表示
      )}
      {pager.next?.href ? (
        <Link
          href={pager.next.href}
          className={cn(buttonVariants({ variant: "ghost" }), "justify-end")}
        >
          {pager.next.title}
          <Icons.chevronRight className="ml-2 h-4 w-4" />
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}

export function getPagerForDoc(doc: Doc) {
  const flattenedLinks = [null, ...flatten(docsConfig.sidebarNav), null];
  const activeIndex = flattenedLinks.findIndex(
    (link) => doc.slug === link?.href
  );
  const prev = activeIndex !== 0 ? flattenedLinks[activeIndex - 1] : null;
  const next =
    activeIndex !== flattenedLinks.length - 1
      ? flattenedLinks[activeIndex + 1]
      : null;
  return {
    prev,
    next,
  };
}

interface NavItem {
  title?: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  items?: NavItem[];
}

export function flatten(links: NavItem[]): NavItem[] {
  return links.reduce((flat, link) => {
    return flat.concat(link.items ? flatten(link.items) : link);
  }, [] as NavItem[]);
}
