'use client'

import { ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

export function VideoShowcase() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <p className="text-sm font-medium tracking-widest text-[#A27F67] uppercase mb-3">
            Real Footage
          </p>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-[#5B6751] mb-4">
            Captured by BirdSnap
          </h2>
          <p className="text-[#5B6751]/70 max-w-2xl mx-auto text-lg">
            Watch hummingbirds in stunning detail with our AI-powered smart feeder camera
          </p>
        </div>

        {/* Video Player */}
        <div className="relative rounded-2xl overflow-hidden shadow-xl">
          <div className="relative aspect-video">
            <video
              src="https://cdn.shopify.com/videos/c/o/v/0b672edff67a40da914e99236f205f02.mp4"
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted
              loop
            />
            {/* Subtle dark gradient overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.1) 100%)',
              }}
            />
          </div>
        </div>

        {/* Description and CTA */}
        <div className="mt-8 text-center">
          <p className="text-[#5B6751]/80 mb-6 text-lg">
            Full HD 1080p with AI-powered tracking — never miss a magical moment
          </p>
          <Button
            asChild
            size="lg"
            className="rounded-full bg-[#5B6751] hover:bg-[#4a5642] text-white px-8 py-6 text-base font-medium transition-all hover:scale-105 gap-2"
          >
            <a 
              href="https://birdsnap.com/products/smart-hummingbird-feeder" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Discover BirdSnap Smart Feeder
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
          <p className="mt-4 text-sm text-[#5B6751]/50">
            Bring the wonder of hummingbirds right to your backyard
          </p>
        </div>
      </div>
    </section>
  )
}
