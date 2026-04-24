import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { email, zipCode } = await req.json()
  const normalizedEmail = String(email ?? '').trim().toLowerCase()
  const normalizedZipCode = String(zipCode ?? '').trim()
  const subscribedAt = new Date().toISOString()

  // Server-side validation
  if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail))
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  if (!normalizedZipCode || !/^\d{5}$/.test(normalizedZipCode))
    return NextResponse.json({ error: 'Invalid ZIP code' }, { status: 400 })

  if (!process.env.OMNISEND_API_KEY) {
    console.error('OMNISEND_API_KEY is not configured')
    return NextResponse.json({ error: 'Subscription service unavailable.' }, { status: 500 })
  }

  // ZIP → coordinates (Mapbox Geocoding)
  let latitude = 0,
    longitude = 0
  try {
    const geo = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(normalizedZipCode)}.json` +
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
      'X-API-KEY': process.env.OMNISEND_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: normalizedEmail,
      status: 'subscribed',
      statusDate: subscribedAt,
      tags: ['hummingbird-tracker', 'hummingbird-welcome-flow'],
      customProperties: {
        zipCode: normalizedZipCode,
        latitude,
        longitude,
        signupSource: 'hummingbirdwatch.org',
        sourcePath: '/#subscribe',
        subscriptionType: 'migration-alert',
        subscribedAt,
      },
    }),
  })

  // 409 = email already exists — show success to user (don't leak registration status)
  if (!omni.ok && omni.status !== 409) {
    const omniError = await omni.text()
    console.error('Omnisend subscription failed', {
      status: omni.status,
      body: omniError,
      email: normalizedEmail,
    })
    return NextResponse.json({ error: 'Subscription failed. Please try again.' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
