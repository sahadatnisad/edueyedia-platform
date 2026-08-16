import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/landing/Hero";
import { TopicBar } from "@/components/landing/TopicBar";
import { FeaturedKnowledge } from "@/components/landing/FeaturedKnowledge";
import { ResourceFinder } from "@/components/landing/ResourceFinder";
import { PopularResources } from "@/components/landing/PopularResources";
import { ResearchSpotlight } from "@/components/landing/ResearchSpotlight";
import { ScholarshipDiscovery } from "@/components/landing/ScholarshipDiscovery";
import { Collections } from "@/components/landing/Collections";
import { FreeLibrary } from "@/components/landing/FreeLibrary";
import { LatestInsights } from "@/components/landing/LatestInsights";
import { WhyEdueyedia } from "@/components/landing/WhyEdueyedia";
import { Newsletter } from "@/components/landing/Newsletter";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { PageMeta, organizationJsonLd } from "@/components/seo";

export default function Landing() {
  return (
    <div className="min-h-screen bg-ivory dark:bg-navy-deep">
      <PageMeta
        title="Edueyedia — Research. Learn. Advance."
        description="গবেষণা, শিক্ষা ও সুযোগের বিশ্বস্ত ডিজিটাল প্ল্যাটফর্ম — research guides, scholarships, academic writing and study-abroad resources in Bangla."
        path="/"
        jsonLd={organizationJsonLd()}
      />
      <Navbar />
      <main>
        <Hero />
        <TopicBar />
        <FeaturedKnowledge />
        <ResourceFinder />
        <PopularResources />
        <ResearchSpotlight />
        <ScholarshipDiscovery />
        <Collections />
        <FreeLibrary />
        <LatestInsights />
        <WhyEdueyedia />
        <Newsletter />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
