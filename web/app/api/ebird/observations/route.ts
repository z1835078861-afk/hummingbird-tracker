import { NextRequest, NextResponse } from 'next/server'

const ALL = ['rthhum', 'bkchum', 'rufhum', 'annhum', 'btlhum', 'calhum', 'allhum', 'coshum', 'bfbhum', 'bblhum']

export async function GET(req: NextRequest) {
  const codes = req.nextUrl.searchParams.get('speciesCode')?.split(',') ?? ALL

  try {
    const results = await Promise.all(
      codes.map(async (code) => {
        const res = await fetch(
          'https://api.ebird.org/v2/data/obs/geo/recent?' +
            new URLSearchParams({
              lat: '39.8',
              lng: '-98.5',
              dist: '800',
              speciesCode: code,
              maxResults: '200',
              fmt: 'json',
            }),
          {
            headers: { 'X-eBirdApiToken': process.env.EBIRD_API_KEY! },
            next: { revalidate: 3600 },
          }
        )
        return res.ok ? res.json() : []
      })
    )

    const features = results.flat().map((obs: Record<string, unknown>) => ({
      type: 'Feature' as const,
      geometry: { type: 'Point' as const, coordinates: [obs.lng, obs.lat] },
      properties: {
        speciesCode: obs.speciesCode,
        comName: obs.comName,
        locName: obs.locName,
        obsDt: obs.obsDt,
        howMany: obs.howMany ?? 1,
      },
    }))

    return NextResponse.json({ type: 'FeatureCollection', features })
  } catch {
    return NextResponse.json({ type: 'FeatureCollection', features: [] })
  }
}
