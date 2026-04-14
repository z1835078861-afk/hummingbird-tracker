/**
 * Simulated hummingbird migration data for 4 species across 12 months.
 * Based on real migration patterns.
 */

export interface MigrationPoint {
  lng: number
  lat: number
}

export interface SpeciesData {
  speciesCode: string
  comName: string
  color: string
  months: Record<number, MigrationPoint[]> // 1–12
}

/* Simple seeded PRNG (mulberry32) for deterministic output */
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function generatePoints(
  rng: () => number,
  count: number,
  latMin: number,
  latMax: number,
  lngMin: number,
  lngMax: number,
): MigrationPoint[] {
  const pts: MigrationPoint[] = []
  for (let i = 0; i < count; i++) {
    pts.push({
      lat: latMin + rng() * (latMax - latMin),
      lng: lngMin + rng() * (lngMax - lngMin),
    })
  }
  return pts
}

/* ---------- Region definitions per species per month ---------- */

interface MonthRegion {
  count: number
  latMin: number
  latMax: number
  lngMin: number
  lngMax: number
}

const rubyThroatedRegions: Record<number, MonthRegion> = {
  1:  { count: 120, latMin: 15, latMax: 23, lngMin: -97,  lngMax: -82 },
  2:  { count: 120, latMin: 15, latMax: 24, lngMin: -97,  lngMax: -82 },
  3:  { count: 150, latMin: 29, latMax: 33, lngMin: -97,  lngMax: -82 },
  4:  { count: 160, latMin: 30, latMax: 38, lngMin: -95,  lngMax: -75 },
  5:  { count: 180, latMin: 35, latMax: 45, lngMin: -90,  lngMax: -70 },
  6:  { count: 200, latMin: 38, latMax: 48, lngMin: -85,  lngMax: -68 },
  7:  { count: 200, latMin: 38, latMax: 48, lngMin: -85,  lngMax: -68 },
  8:  { count: 180, latMin: 36, latMax: 46, lngMin: -88,  lngMax: -70 },
  9:  { count: 150, latMin: 30, latMax: 42, lngMin: -92,  lngMax: -72 },
  10: { count: 130, latMin: 29, latMax: 35, lngMin: -97,  lngMax: -80 },
  11: { count: 110, latMin: 17, latMax: 27, lngMin: -97,  lngMax: -82 },
  12: { count: 110, latMin: 15, latMax: 24, lngMin: -97,  lngMax: -82 },
}

const rufousRegions: Record<number, MonthRegion> = {
  1:  { count: 100, latMin: 18, latMax: 25, lngMin: -112, lngMax: -100 },
  2:  { count: 110, latMin: 22, latMax: 34, lngMin: -117, lngMax: -110 },
  3:  { count: 130, latMin: 30, latMax: 42, lngMin: -124, lngMax: -115 },
  4:  { count: 150, latMin: 38, latMax: 50, lngMin: -124, lngMax: -118 },
  5:  { count: 160, latMin: 45, latMax: 58, lngMin: -135, lngMax: -125 },
  6:  { count: 170, latMin: 57, latMax: 64, lngMin: -155, lngMax: -130 },
  7:  { count: 170, latMin: 57, latMax: 63, lngMin: -155, lngMax: -130 },
  8:  { count: 150, latMin: 40, latMax: 55, lngMin: -120, lngMax: -105 },
  9:  { count: 130, latMin: 30, latMax: 44, lngMin: -118, lngMax: -105 },
  10: { count: 110, latMin: 25, latMax: 36, lngMin: -115, lngMax: -102 },
  11: { count: 100, latMin: 19, latMax: 28, lngMin: -112, lngMax: -100 },
  12: { count: 100, latMin: 18, latMax: 25, lngMin: -112, lngMax: -100 },
}

const blackChinnedRegions: Record<number, MonthRegion> = {
  1:  { count: 90,  latMin: 18, latMax: 25, lngMin: -112, lngMax: -100 },
  2:  { count: 90,  latMin: 18, latMax: 26, lngMin: -112, lngMax: -100 },
  3:  { count: 110, latMin: 25, latMax: 33, lngMin: -115, lngMax: -103 },
  4:  { count: 140, latMin: 30, latMax: 37, lngMin: -118, lngMax: -103 },
  5:  { count: 170, latMin: 32, latMax: 42, lngMin: -120, lngMax: -103 },
  6:  { count: 180, latMin: 33, latMax: 43, lngMin: -120, lngMax: -103 },
  7:  { count: 180, latMin: 33, latMax: 43, lngMin: -120, lngMax: -103 },
  8:  { count: 160, latMin: 32, latMax: 41, lngMin: -118, lngMax: -103 },
  9:  { count: 130, latMin: 28, latMax: 38, lngMin: -118, lngMax: -103 },
  10: { count: 100, latMin: 25, latMax: 33, lngMin: -115, lngMax: -100 },
  11: { count: 90,  latMin: 19, latMax: 27, lngMin: -112, lngMax: -100 },
  12: { count: 90,  latMin: 18, latMax: 25, lngMin: -112, lngMax: -100 },
}

const annasRegions: Record<number, MonthRegion> = {
  1:  { count: 140, latMin: 30, latMax: 40, lngMin: -122, lngMax: -115 },
  2:  { count: 140, latMin: 30, latMax: 41, lngMin: -122, lngMax: -115 },
  3:  { count: 150, latMin: 32, latMax: 44, lngMin: -122, lngMax: -118 },
  4:  { count: 160, latMin: 33, latMax: 46, lngMin: -122, lngMax: -118 },
  5:  { count: 170, latMin: 34, latMax: 48, lngMin: -122, lngMax: -118 },
  6:  { count: 170, latMin: 34, latMax: 48, lngMin: -122, lngMax: -118 },
  7:  { count: 170, latMin: 34, latMax: 48, lngMin: -122, lngMax: -118 },
  8:  { count: 160, latMin: 33, latMax: 47, lngMin: -122, lngMax: -118 },
  9:  { count: 150, latMin: 32, latMax: 46, lngMin: -122, lngMax: -118 },
  10: { count: 150, latMin: 31, latMax: 44, lngMin: -122, lngMax: -117 },
  11: { count: 140, latMin: 30, latMax: 41, lngMin: -122, lngMax: -115 },
  12: { count: 140, latMin: 30, latMax: 40, lngMin: -122, lngMax: -115 },
}

function buildSpecies(
  code: string,
  name: string,
  color: string,
  regions: Record<number, MonthRegion>,
  seed: number,
): SpeciesData {
  const rng = mulberry32(seed)
  const months: Record<number, MigrationPoint[]> = {}
  for (let m = 1; m <= 12; m++) {
    const r = regions[m]
    months[m] = generatePoints(rng, r.count, r.latMin, r.latMax, r.lngMin, r.lngMax)
  }
  return { speciesCode: code, comName: name, color, months }
}

export const SPECIES_LIST: SpeciesData[] = [
  buildSpecies('rthhum', 'Ruby-throated', '#4CAF50', rubyThroatedRegions, 42),
  buildSpecies('rufhum', 'Rufous', '#E91E63', rufousRegions, 137),
  buildSpecies('bkchum', 'Black-chinned', '#00BCD4', blackChinnedRegions, 256),
  buildSpecies('annhum', "Anna's", '#F48FB1', annasRegions, 891),
]

export const MONTH_NAMES = [
  '', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
