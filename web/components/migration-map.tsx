'use client'

import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { Slider } from '@/components/ui/slider'
import { SPECIES_LIST, MONTH_NAMES } from '@/data/migration-data'
import type { MapPoint } from './migration-map-inner'

const MapInner = dynamic(() => import('./migration-map-inner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#E8E4DC] animate-pulse" />
  ),
})

const SPECIES_FILTERS = [
  { key: 'all', label: 'All Hummingbirds', color: '#6B7280' },
  { key: 'rthhum', label: 'Ruby-throated', color: '#4CAF50' },
  { key: 'rufhum', label: 'Rufous', color: '#E91E63' },
  { key: 'bkchum', label: 'Black-chinned', color: '#00BCD4' },
  { key: 'annhum', label: "Anna's", color: '#F48FB1' },
]

export function MigrationMap() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [month, setMonth] = useState(1) // Start from January
  const [playing, setPlaying] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const autoStartedRef = useRef(false)

  /* ---------- auto-play ---------- */
  const stopPlay = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setPlaying(false)
  }, [])

  const startPlay = useCallback(() => {
    stopPlay()
    setPlaying(true)
    timerRef.current = setInterval(() => {
      setMonth((prev) => {
        const next = prev >= 12 ? 1 : prev + 1
        return next
      })
    }, 800)
  }, [stopPlay])

  const togglePlay = useCallback(() => {
    if (playing) {
      stopPlay()
    } else {
      startPlay()
    }
  }, [playing, startPlay, stopPlay])

  // Auto-play on mount
  useEffect(() => {
    if (!autoStartedRef.current) {
      autoStartedRef.current = true
      startPlay()
    }
  }, [startPlay])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  /* ---------- build points for current month & filter ---------- */
  const points: MapPoint[] = useMemo(() => {
    const result: MapPoint[] = []
    const species =
      activeFilter === 'all'
        ? SPECIES_LIST
        : SPECIES_LIST.filter((s) => s.speciesCode === activeFilter)

    for (const sp of species) {
      const monthPoints = sp.months[month] ?? []
      for (const p of monthPoints) {
        result.push({
          lng: p.lng,
          lat: p.lat,
          color: sp.color,
          speciesCode: sp.speciesCode,
          comName: sp.comName,
        })
      }
    }
    return result
  }, [month, activeFilter])

  const sightingCount = points.length

  return (
    <section id="map" className="relative w-screen h-screen">
      {/* Fullscreen map */}
      <MapInner points={points} />

      {/* Floating: Section Header */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-[#2C2C2C] mb-2 text-balance drop-shadow-sm">
          Migration Tracker
        </h2>
        <p className="text-[#5B6751] max-w-2xl mx-auto text-base drop-shadow-sm">
          Watch the migration unfold throughout the year.
        </p>
      </div>

      {/* Floating: Stats — top-right */}
      <div className="absolute top-6 right-6 z-10 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-md">
        <div className="text-lg font-bold text-[#2C2C2C]">
          {sightingCount.toLocaleString()} sightings
        </div>
      </div>

      {/* Floating: Species Filter Bar — top below header */}
      <div className="absolute top-24 md:top-28 left-1/2 -translate-x-1/2 z-10 flex flex-wrap justify-center gap-2">
        {SPECIES_FILTERS.map((filter) => {
          const isActive = activeFilter === filter.key
          return (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 shadow-sm"
              style={{
                backgroundColor: isActive ? filter.color : 'rgba(255,255,255,0.9)',
                color: isActive ? '#fff' : filter.color,
                borderColor: filter.color,
                opacity: isActive ? 1 : 0.8,
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: isActive ? '#fff' : filter.color }}
              />
              {filter.label}
            </button>
          )
        })}
      </div>

      {/* Floating: Timeline Slider — bottom */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 w-[90vw] max-w-2xl bg-white/90 backdrop-blur-sm rounded-xl px-5 py-3 shadow-lg">
        <div className="flex items-center gap-4">
          {/* Play / Pause button */}
          <button
            onClick={togglePlay}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-[#5B6751] text-white hover:bg-[#4a5642] transition-colors shrink-0"
            aria-label={playing ? 'Pause' : 'Play'}
          >
            {playing ? (
              <span className="text-sm leading-none">⏸</span>
            ) : (
              <span className="text-sm leading-none">▶</span>
            )}
          </button>

          <span className="text-sm font-semibold text-[#2C2C2C] w-24 whitespace-nowrap">
            {MONTH_NAMES[month]}
          </span>

          <Slider
            value={[month]}
            onValueChange={(v) => setMonth(v[0])}
            min={1}
            max={12}
            step={1}
            className="flex-1"
            />

          <span className="text-sm font-medium text-[#5B6751] w-8 text-right">Dec</span>
        </div>
      </div>
    </section>
  )
}
