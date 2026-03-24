'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Badge } from "@/components/ui/badge"
import { ChevronDown } from "lucide-react"

interface Species {
  id: number
  name: string
  latinName: string
  image: string
  currentLocation: string
  status: string
  statusLabel: string
  bgColor: string
  color: string
  range: string
  migrationRoute: string
  size: string
  peakMonth: string
  feedingTip: string
}

const hummingbirdSpecies: Species[] = [
  {
    id: 1,
    name: "Ruby-throated Hummingbird",
    latinName: "Archilochus colubris",
    image: "/images/species/Ruby-throated-Hummingbird.png",
    currentLocation: "Currently passing through Texas and Louisiana",
    status: "migrating",
    statusLabel: "Migrating Now",
    bgColor: "bg-gradient-to-br from-rose-50 to-emerald-50",
    color: "#5B6751",
    range: "Eastern North America, Florida to southern Canada",
    migrationRoute: "Crosses the Gulf of Mexico in a single 500-mile non-stop flight",
    size: '3.2 in, 0.1 oz — smallest bird in eastern North America',
    peakMonth: "May in the Northeast, April in the Southeast",
    feedingTip: "Prefers 1:4 sugar-water ratio. A smart feeder with arrival alerts means you'll never miss them.",
  },
  {
    id: 2,
    name: "Black-chinned Hummingbird",
    latinName: "Archilochus alexandri",
    image: "/images/species/Black-chinned-Hummingbird.png",
    currentLocation: "Moving into the Southwest US",
    status: "migrating",
    statusLabel: "Migrating Now",
    bgColor: "bg-gradient-to-br from-slate-50 to-violet-50",
    color: "#A27F67",
    range: "Western US, from Texas to British Columbia",
    migrationRoute: "Follows the central flyway through the Great Plains and Rocky Mountain foothills",
    size: '3.5 in, 0.1 oz — identified by purple throat band',
    peakMonth: "April in Arizona, May in Utah and Colorado",
    feedingTip: "Attracted to red and orange flowers. A smart feeder helps track their daily visits.",
  },
  {
    id: 3,
    name: "Rufous Hummingbird",
    latinName: "Selasphorus rufus",
    image: "/images/species/Rufous-Hummingbird.png",
    currentLocation: "Moving up the Pacific Coast",
    status: "migrating",
    statusLabel: "Migrating Now",
    bgColor: "bg-gradient-to-br from-orange-50 to-amber-50",
    color: "#C67D4B",
    range: "Pacific Coast from Mexico to Alaska — longest migration of any hummingbird",
    migrationRoute: "Northward along the coast, southward through the Rockies in a clockwise loop",
    size: '3.1 in, 0.1 oz — fiercely territorial despite small size',
    peakMonth: "March–April on the coast, July–August in the mountains",
    feedingTip: "Very aggressive at feeders. Multiple feeding ports help reduce fights.",
  },
  {
    id: 4,
    name: "Anna's Hummingbird",
    latinName: "Calypte anna",
    image: "/images/species/Anna-s-Hummingbird.png",
    currentLocation: "Year-round resident on the Pacific Coast",
    status: "arrived",
    statusLabel: "Resident",
    bgColor: "bg-gradient-to-br from-pink-50 to-slate-50",
    color: "#8B5E83",
    range: "Pacific Coast year-round, from Baja California to British Columbia",
    migrationRoute: "Non-migratory — stays in range all year, expanding northward",
    size: '4 in, 0.15 oz — one of the larger North American hummingbirds',
    peakMonth: "Year-round, nests as early as December",
    feedingTip: "Keep feeders out all winter for Anna's. A smart feeder captures their stunning courtship dives.",
  },
  {
    id: 5,
    name: "Broad-tailed Hummingbird",
    latinName: "Selasphorus platycercus",
    image: "/images/species/Broad-tailed-Hummingbird.png",
    currentLocation: "Still in Mexico, heading to the Rockies",
    status: "not-departed",
    statusLabel: "Not Yet Departed",
    bgColor: "bg-gradient-to-br from-emerald-50 to-teal-50",
    color: "#4A7C84",
    range: "Rocky Mountain region, from Guatemala to Idaho",
    migrationRoute: "Follows mountain meadow corridors through the Rockies",
    size: '3.5 in, 0.13 oz — males produce a metallic wing trill in flight',
    peakMonth: "May–June at high elevations",
    feedingTip: "Prefers mountain wildflowers. Place feeders at elevation for best results.",
  },
  {
    id: 6,
    name: "Calliope Hummingbird",
    latinName: "Selasphorus calliope",
    image: "/images/species/Calliope-Hummingbird.png",
    currentLocation: "Beginning northward migration",
    status: "migrating",
    statusLabel: "Migrating Now",
    bgColor: "bg-gradient-to-br from-fuchsia-50 to-rose-50",
    color: "#C4824A",
    range: "Western interior mountains, from Mexico to British Columbia",
    migrationRoute: "Inland route through mountain passes — the smallest long-distance migrant bird",
    size: '3.0 in, 0.07 oz — the smallest bird in North America',
    peakMonth: "May–June in mountain meadows",
    feedingTip: "Often overlooked due to tiny size. A smart feeder camera helps confirm their visits.",
  },
  {
    id: 7,
    name: "Allen's Hummingbird",
    latinName: "Selasphorus sasin",
    image: "/images/species/Allen-s-Hummingbird.png",
    currentLocation: "Arriving along the California coast",
    status: "migrating",
    statusLabel: "Migrating Now",
    bgColor: "bg-gradient-to-br from-amber-50 to-green-50",
    color: "#7B8C3E",
    range: "Coastal California and southern Oregon",
    migrationRoute: "One of the earliest spring migrants — arrives in California by January",
    size: '3.5 in, 0.1 oz — nearly identical to Rufous in appearance',
    peakMonth: "February–March along the coast",
    feedingTip: "Arrives very early — have feeders ready by late January in Southern California.",
  },
  {
    id: 8,
    name: "Costa's Hummingbird",
    latinName: "Calypte costae",
    image: "/images/species/Costa-s-Hummingbird.png",
    currentLocation: "Active in desert Southwest",
    status: "arrived",
    statusLabel: "Resident",
    bgColor: "bg-gradient-to-br from-purple-50 to-indigo-50",
    color: "#6B5E9E",
    range: "Southwestern deserts — Arizona, Southern California, Baja",
    migrationRoute: "Short-distance migrant, some populations are year-round residents",
    size: '3.0 in, 0.1 oz — striking purple crown and gorget',
    peakMonth: "March–May in the Sonoran Desert",
    feedingTip: "Desert specialist — keep water fresh and change sugar water frequently in heat.",
  },
  {
    id: 9,
    name: "Buff-bellied Hummingbird",
    latinName: "Amazilia yucatanensis",
    image: "/images/species/Buff-bellied-Hummingbird.png",
    currentLocation: "Present along the Texas Gulf Coast",
    status: "arrived",
    statusLabel: "Resident",
    bgColor: "bg-gradient-to-br from-yellow-50 to-green-50",
    color: "#A8773A",
    range: "Texas Gulf Coast and the Rio Grande Valley",
    migrationRoute: "Mostly sedentary in South Texas, some wander east along the Gulf in winter",
    size: '4.0 in, 0.15 oz — one of few green-bellied species in the US',
    peakMonth: "Year-round in South Texas, October–February wanderers",
    feedingTip: "A reliable feeder visitor in the Rio Grande Valley. Smart feeder data helps track seasonal patterns.",
  },
  {
    id: 10,
    name: "Broad-billed Hummingbird",
    latinName: "Cynanthus latirostris",
    image: "/images/species/Broad-billed-Hummingbird.png",
    currentLocation: "Arriving in southern Arizona canyons",
    status: "migrating",
    statusLabel: "Migrating Now",
    bgColor: "bg-gradient-to-br from-teal-50 to-blue-50",
    color: "#2E7D5E",
    range: "Southwestern border region — Arizona and New Mexico canyons",
    migrationRoute: "Crosses the border from Mexico into Arizona mountain canyons",
    size: '3.5 in, 0.1 oz — brilliant blue-green body with red bill',
    peakMonth: "April–August in Arizona canyons",
    feedingTip: "Often found near water in canyon habitats. A feeder with camera captures their iridescent colors.",
  },
]

const getStatusStyle = (status: string) => {
  switch (status) {
    case "migrating":
      return "bg-[#5B6751] text-white"
    case "not-departed":
      return "bg-[#A27F67] text-white"
    case "arrived":
      return "border border-[#5B6751] text-[#5B6751] bg-transparent"
    default:
      return "bg-[#5B6751] text-white"
  }
}

export function SpeciesSection() {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const toggle = (id: number) => setExpandedId((prev) => (prev === id ? null : id))

  return (
    <section id="species" className="py-24 md:py-32 bg-[#F7F5F0]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2C2C2C] mb-4 text-balance">
            Meet the Hummingbirds
          </h2>
          <p className="text-[#5B6751] max-w-2xl mx-auto text-lg">
            Get to know the species migrating across North America — and when they&apos;ll arrive near you.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {hummingbirdSpecies.map((species) => {
            const isExpanded = expandedId === species.id
            return (
              <div
                key={species.id}
                className="group rounded-[20px] overflow-hidden shadow-sm transition-shadow duration-300 hover:shadow-xl cursor-pointer bg-white"
                onClick={() => toggle(species.id)}
              >
                {/* Image area */}
                <div className="relative aspect-[3/2] overflow-hidden">
                  <Image
                    src={species.image}
                    alt={species.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Status badge - frosted glass */}
                  <Badge
                    className="absolute top-4 right-4 rounded-[20px] px-3 py-1 text-xs font-medium text-white border-0"
                    style={{
                      background: 'rgba(255,255,255,0.25)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                    }}
                  >
                    {species.statusLabel}
                  </Badge>
                </div>

                {/* Text area */}
                <div className="px-6 py-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-serif text-[20px] font-bold text-[#2C2C2C] leading-tight mb-0.5">
                        {species.name}
                      </h3>
                      <p className="text-[14px] italic text-[#999999] mb-2">{species.latinName}</p>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 text-[#999999] transition-transform duration-300 mt-1 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </div>
                  <p className="text-[15px] text-[#5B6751] font-medium leading-relaxed">
                    {species.currentLocation}
                  </p>

                  {/* Expandable Details */}
                  <div
                    className="overflow-hidden transition-all duration-300 ease-in-out"
                    style={{ maxHeight: isExpanded ? '500px' : '0px' }}
                  >
                    <div className="pt-4 mt-4 border-t border-[#E3D8C6] space-y-2.5">
                      <div>
                        <span className="text-xs font-semibold text-[#2C2C2C] uppercase tracking-wide">Range</span>
                        <p className="text-sm text-[#4A4A4A]">{species.range}</p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-[#2C2C2C] uppercase tracking-wide">Migration</span>
                        <p className="text-sm text-[#4A4A4A]">{species.migrationRoute}</p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-[#2C2C2C] uppercase tracking-wide">Size</span>
                        <p className="text-sm text-[#4A4A4A]">{species.size}</p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-[#2C2C2C] uppercase tracking-wide">Peak Month</span>
                        <p className="text-sm text-[#4A4A4A]">{species.peakMonth}</p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-[#2C2C2C] uppercase tracking-wide">Feeding Tip</span>
                        <p className="text-sm text-[#4A4A4A]">{species.feedingTip}</p>
                      </div>
                      <a
                        href="#map"
                        className="inline-block text-sm font-medium text-[#5B6751] hover:underline mt-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        See on Map →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
