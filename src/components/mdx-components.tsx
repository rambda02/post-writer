import { useMDXComponent } from "next-contentlayer2/hooks";
import Image from "next/image";
import { Callout } from "@/components/callout";

const components = {
  Image,
  Callout,
}

export const Mdx = ({ code }: { code: string }) => {
  const Component = useMDXComponent(code);

  return (
    <div className="prose lg:prose-xl max-w-full">
      <Component components={components} />
    </div>
  );
};
