import { siteConfig } from "@/config/site";
import { Icons } from "@/components/og/icons";
import { Logos } from "@/components/og/logos";

interface OgImageProps {
  heading: string;
  type: string;
  mode: "light" | "dark";
  paint: string;
  fontSize: string;
}

export const OgImage = ({
  heading,
  type,
  mode,
  paint,
  fontSize,
}: OgImageProps) => {
  return (
    <div
      tw="flex relative flex-col p-12 w-full h-full items-start"
      style={{
        color: paint,
        background:
          mode === "dark"
            ? "linear-gradient(90deg, #000 0%, #111 100%)"
            : "white",
      }}
    >
      {/* Next.js ロゴ */}
      <Logos.nextjs paint={paint} />

      {/* ヘッディング */}
      <div tw="flex flex-col flex-1 py-10">
        <div
          tw="flex text-xl uppercase font-bold tracking-tight"
          style={{ fontFamily: "Inter", fontWeight: "normal" }}
        >
          {type}
        </div>
        <div
          tw="flex leading-[1.1] text-[80px] font-bold"
          style={{
            fontFamily: "Cal Sans",
            fontWeight: "bold",
            marginLeft: "-3px",
            fontSize,
          }}
        >
          {heading}
        </div>
      </div>

      <div tw="flex items-center w-full justify-between">
        {/* サイト名 */}
        <div
          tw="flex text-xl"
          style={{ fontFamily: "Inter", fontWeight: "normal" }}
        >
          {new URL(siteConfig.url).host}
        </div>

        {/* GitHubリポジトリ */}
        <div
          tw="flex items-center text-xl"
          style={{ fontFamily: "Inter", fontWeight: "normal" }}
        >
          <Icons.github paint={paint} />
          <div tw="flex ml-2">
            {new URL(siteConfig.github.htmlUrl).host +
              new URL(siteConfig.github.htmlUrl).pathname}
          </div>
        </div>
      </div>
    </div>
  );
};
