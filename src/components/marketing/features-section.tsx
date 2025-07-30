import { featuresCardData } from "@/data/features";

export const FeaturesSection = () => {
  return (
    <section
      id="features"
      className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24"
    >
      {/* 見出し */}
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
          Features
        </h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          This project is an experiment to see how a modern app, with features
          like auth, subscriptions, API routes, and static pages would work in
          Next.js 15 app dir.
        </p>
      </div>

      {/* Features カード */}
      <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
        {featuresCardData.map((featuresCard, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-lg border bg-background p-2"
          >
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <featuresCard.icon />
              <div className="space-y-2">
                <h3 className="font-bold">{featuresCard.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {featuresCard.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 説明 */}
      <div className="mx-auto text-center md:max-w-[58rem]">
        <p className="leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          Taxonomy also includes a blog and a full-featured documentation site
          built using Contentlayer and MDX.
        </p>
      </div>
    </section>
  );
};
