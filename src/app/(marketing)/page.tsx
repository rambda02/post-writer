import { getGitHubStars } from "@/lib/github";
import { HeroSection } from "@/components/marketing/hero-section";
import { FeaturesSection } from "@/components/marketing/features-section";
import { OpenSourceSection } from "@/components/marketing/open-source-section";

export default async function IndexPage() {
  // GitHub リポジトリのスター数を取得する
  const stars = await getGitHubStars();

  return (
    <div>
      {/* Hero セクション */}
      <HeroSection />

      {/* Features セクション */}
      <FeaturesSection />

      {/* Open Source セクション */}
      <OpenSourceSection stars={stars} />
    </div>
  );
}
