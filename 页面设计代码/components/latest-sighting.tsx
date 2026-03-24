async function getData() {
  try {
    const base = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000'
    const res = await fetch(`${base}/api/ebird/latest`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) throw new Error()
    return res.json()
  } catch {
    return {
      speciesCommonName: 'Ruby-throated Hummingbird',
      locName: 'Austin, TX',
      obsDt: '2h ago',
    }
  }
}

export async function LatestSighting() {
  const data = await getData()

  return (
    <div className="bg-[#F7F5F0] py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-1.5 sm:gap-3 text-xs sm:text-sm">
          <span className="flex items-center gap-1 sm:gap-2">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#5B6751] animate-pulse" />
            <span className="text-[#2C2C2C] font-medium whitespace-nowrap">Latest sighting:</span>
          </span>
          <span className="text-[#4A4A4A] whitespace-nowrap">
            {data.speciesCommonName}
          </span>
          <span className="text-[#999999] hidden sm:inline">·</span>
          <span className="text-[#4A4A4A] whitespace-nowrap">{data.locName}</span>
          <span className="text-[#999999]">·</span>
          <span className="text-[#999999] whitespace-nowrap">{data.obsDt}</span>
        </div>
      </div>
    </div>
  )
}
