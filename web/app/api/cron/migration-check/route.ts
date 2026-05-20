import { NextRequest, NextResponse } from 'next/server'

// The 10 hummingbird species tracked by the site
const HUMMINGBIRD_CODES = new Set([
  'rthhum', 'bkchum', 'rufhum', 'annhum', 'btlhum',
  'calhum', 'allhum', 'coshum', 'bfbhum', 'bblhum',
])

// One representative center point per region, 800 km radius
const REGIONS = [
  { id: 'east',    lat: 35,  lng: -80  },
  { id: 'central', lat: 38,  lng: -95  },
  { id: 'west',    lat: 42,  lng: -112 },
] as const

// Minimum unique hummingbird sightings to trigger an alert
const SIGHTING_THRESHOLD = 5

// Tag added to a contact after they receive their one alert for the season.
// Uses the current year so the tag resets automatically next season.
const alertedTag = () => `migration-alerted-${new Date().getFullYear()}`

type RegionId = (typeof REGIONS)[number]['id']

// ── eBird ────────────────────────────────────────────────────────────────────

async function countRegionSightings(lat: number, lng: number): Promise<number> {
  const params = new URLSearchParams({
    lat: String(lat),
    lng: String(lng),
    dist: '800',
    maxResults: '200',
    fmt: 'json',
  })
  const res = await fetch(
    `https://api.ebird.org/v2/data/obs/geo/recent?${params}`,
    { headers: { 'X-eBirdApiToken': process.env.EBIRD_API_KEY! } },
  )
  if (!res.ok) return 0
  const data: Array<{ speciesCode: string }> = await res.json()
  return data.filter((obs) => HUMMINGBIRD_CODES.has(obs.speciesCode)).length
}

// ── Omnisend ─────────────────────────────────────────────────────────────────

interface OmnisendContact {
  email: string
  tags?: string[]
  customProperties?: {
    latitude?: number
    longitude?: number
  }
}

// Fetch all subscribed contacts tagged with hummingbird-tracker
async function fetchSubscribers(): Promise<OmnisendContact[]> {
  const contacts: OmnisendContact[] = []
  let cursor: string | null = null

  do {
    const url = new URL('https://api.omnisend.com/v3/contacts')
    url.searchParams.set('status', 'subscribed')
    url.searchParams.set('tag', 'hummingbird-tracker')
    url.searchParams.set('limit', '250')
    if (cursor) url.searchParams.set('after', cursor)

    const res = await fetch(url.toString(), {
      headers: { 'X-API-KEY': process.env.OMNISEND_API_KEY! },
    })
    if (!res.ok) break

    const data = await res.json()
    contacts.push(...(data.contacts ?? []))
    cursor = data.paging?.next ?? null
  } while (cursor)

  return contacts
}

// Fire a custom Omnisend event — automation in Omnisend triggers on this
async function fireMigrationEvent(email: string, region: RegionId): Promise<void> {
  await fetch('https://api.omnisend.com/v3/events', {
    method: 'POST',
    headers: {
      'X-API-KEY': process.env.OMNISEND_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      eventName: 'migration_alert',
      eventData: { region },
    }),
  })
}

// Add a year-scoped tag so this contact is never alerted again this season
async function markAsAlerted(email: string): Promise<void> {
  await fetch('https://api.omnisend.com/v3/contacts', {
    method: 'POST',
    headers: {
      'X-API-KEY': process.env.OMNISEND_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      tags: [alertedTag()],
    }),
  })
}

// Determine which region a contact belongs to based on stored longitude
function getContactRegion(lng: number): RegionId {
  if (lng >= -90)  return 'east'
  if (lng >= -105) return 'central'
  return 'west'
}

// ── Handler ───────────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  // Vercel Cron sends this header; reject anything else
  const auth = request.headers.get('Authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 1. Check which regions have enough recent sightings
  const activeRegions = new Set<RegionId>()
  await Promise.all(
    REGIONS.map(async (region) => {
      const count = await countRegionSightings(region.lat, region.lng)
      if (count >= SIGHTING_THRESHOLD) activeRegions.add(region.id)
    }),
  )

  if (activeRegions.size === 0) {
    return NextResponse.json({ message: 'No active regions', triggered: 0 })
  }

  // 2. Fire a custom event for each subscriber in an active region,
  //    skipping anyone who already received an alert this season.
  const contacts = await fetchSubscribers()
  const tag = alertedTag()
  let triggered = 0

  await Promise.all(
    contacts.map(async (contact) => {
      const lng = contact.customProperties?.longitude
      if (lng == null) return

      // Already alerted this season — skip
      if (contact.tags?.includes(tag)) return

      const region = getContactRegion(lng)
      if (!activeRegions.has(region)) return

      await fireMigrationEvent(contact.email, region)
      await markAsAlerted(contact.email)
      triggered++
    }),
  )

  return NextResponse.json({
    activeRegions: [...activeRegions],
    triggered,
  })
}
