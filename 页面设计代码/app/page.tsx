import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { LatestSighting } from "@/components/latest-sighting"
import { MigrationMap } from "@/components/migration-map"
import { SpeciesSection } from "@/components/species-section"
import { CommunitySection } from "@/components/community-section"
import { SubscribeSection } from "@/components/subscribe-section"
import { HowItWorks } from "@/components/how-it-works"
import { VideoShowcase } from "@/components/video-showcase"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <HeroSection />
        <LatestSighting />
        <MigrationMap />
        <SubscribeSection />
        <CommunitySection />
        <VideoShowcase />
        <SpeciesSection />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  )
}
