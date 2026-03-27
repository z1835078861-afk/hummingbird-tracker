import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-end overflow-hidden">
      {/* Background image */}
      <Image
        src="/images/hero.jpg"
        alt="Hummingbird in flight"
        fill
        className="object-cover"
        priority
      />
      
      {/* Gradient overlay */}
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to left, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-right px-8 md:px-16 lg:px-24 max-w-2xl mr-4 md:mr-8 lg:mr-16">
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight text-balance">
          Hummingbirds Are on the Move
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed text-pretty">
          Track real-time migration across North America. Know exactly when they'll arrive in your backyard.
        </p>
        <div className="flex justify-end">
          <Button 
            size="lg"
            className="rounded-full bg-white px-10 py-6 text-lg text-[#5B6751] font-medium transition-all duration-300 hover:bg-[#5B6751] hover:text-white hover:scale-105"
            asChild
          >
            <a href="#map">See the Map</a>
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-8 w-8 text-white/60" />
      </div>
    </section>
  )
}
