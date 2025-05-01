import Link from "next/link";
import { siteConfig } from "@/config/site";

export const SiteFooter = () => {
  return (
    <footer>
      <div className="container mx-auto px-8 py-10 md:py-0 md:h-20">
        <p className="text-center text-sm md:text-left">
          Built by{" "}
          <Link
            href={siteConfig.links.x}
            className="underline underline-offset-4 font-medium"
          >
            Lambda878
          </Link>
          . Hosted on{" "}
          <Link
            href="https://vercel.com"
            className="underline underline-offset-4 font-medium"
          >
            Vercel
          </Link>
        </p>
      </div>
    </footer>
  );
};
