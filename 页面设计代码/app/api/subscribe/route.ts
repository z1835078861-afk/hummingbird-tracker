import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { email, zipCode } = await req.json()

  // Server-side validation
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  if (!zipCode || !/^\d{5}$/.test(zipCode))
    return NextResponse.json({ error: 'Invalid ZIP code' }, { status: 400 })

  // ZIP → coordinates (Mapbox Geocoding)
  let latitude = 0,
    longitude = 0
  try {
    const geo = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(zipCode)}.json` +
        `?types=postcode&country=US&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
    )
    const geoData = await geo.json()
    if (geoData.features?.length > 0) [longitude, latitude] = geoData.features[0].center
  } catch {
    /* ZIP geocoding failure should not block the main flow */
  }

  // Write to Omnisend
  const omni = await fetch('https://api.omnisend.com/v3/contacts', {
    method: 'POST',
    headers: {
      'X-API-KEY': process.env.OMNISEND_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      status: 'subscribed',
      statusDate: new Date().toISOString(),
      tags: ['hummingbird-tracker'],
      customProperties: {
        zipCode,
        latitude,
        longitude,
        signupSource: 'hummingbirdwatch.org',
      },
    }),
  })

  // 409 = email already exists — show success to user (don't leak registration status)
  if (!omni.ok && omni.status !== 409)
    return NextResponse.json({ error: 'Subscription failed. Please try again.' }, { status: 500 })

  return NextResponse.json({ success: true })
}
