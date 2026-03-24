import { NextResponse } from 'next/server'

const FALLBACK = {
  speciesCommonName: 'Ruby-throated Hummingbird',
  locName: 'Austin, TX',
  obsDt: '2h ago',
}

export async function GET() {
  try {
    const res = await fetch(
      'https://api.ebird.org/v2/data/obs/geo/recent?' +
        new URLSearchParams({ lat: '39.8', lng: '-98.5', dist: '800', maxResults: '1', fmt: 'json' }),
      {
        headers: { 'X-eBirdApiToken': process.env.EBIRD_API_KEY! },
        next: { revalidate: 3600 },
      }
    )
    if (!res.ok) throw new Error('eBird error')
    const [obs] = await res.json()
    if (!obs) return NextResponse.json(FALLBACK)
    const diffH = Math.floor((Date.now() - new Date(obs.obsDt).getTime()) / 3600000)
    return NextResponse.json({
      speciesCommonName: obs.comName,
      locName: obs.locName,
      obsDt: diffH < 1 ? 'just now' : `${diffH}h ago`,
    })
  } catch {
    return NextResponse.json(FALLBACK)
  }
}
