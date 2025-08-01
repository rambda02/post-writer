import Link from "next/link";

import { siteConfig } from "@/config/site";
import { Icons } from "@/components/icons";

export const OpenSourceSection = ({ stars }: { stars: string | null }) => {
  return (
    <section id="open-source" className="container py-8 md:py-12 lg:py-24">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
        {/* 見出し */}
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
          Proudly Open Source
        </h2>

        {/* 説明 */}
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          Taxonomy is open source and powered by open source software. <br />{" "}
          The code is available on{" "}
          <Link
            href={siteConfig.github.htmlUrl}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4"
          >
            GitHub
          </Link>
          .{" "}
        </p>

        {/* スター数 */}
        {stars && (
          <Link
            href={siteConfig.github.htmlUrl}
            target="_blank"
            rel="noreferrer"
            className="flex"
          >
            <div className="flex h-10 w-10 items-center justify-center space-x-2 rounded-md border border-muted bg-muted">
              <Icons.github className={"h-5 w-5 text-foreground"} />
            </div>
            <div className="flex items-center">
              <div className="h-4 w-4 border-y-8 border-l-0 border-r-8 border-solid border-muted border-y-transparent"></div>
              <div className="flex h-10 items-center rounded-md border border-muted bg-muted px-4 font-medium">
                {stars} stars on GitHub
              </div>
            </div>
          </Link>
        )}
      </div>
    </section>
  );
};
