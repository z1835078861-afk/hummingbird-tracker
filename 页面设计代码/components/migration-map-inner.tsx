'use client'

import { useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

export interface MapPoint {
  lng: number
  lat: number
  color: string
  speciesCode: string
  comName: string
}

interface Props {
  points: MapPoint[]
}

export default function MigrationMapInner({ points }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const readyRef = useRef(false)
  const pointsRef = useRef(points)
  pointsRef.current = points

  /* ---------- build GeoJSON from points ---------- */
  function toGeoJSON(pts: MapPoint[]): GeoJSON.FeatureCollection {
    return {
      type: 'FeatureCollection',
      features: pts.map((p) => ({
        type: 'Feature' as const,
        geometry: { type: 'Point' as const, coordinates: [p.lng, p.lat] },
        properties: { color: p.color, speciesCode: p.speciesCode, comName: p.comName },
      })),
    }
  }

  /* ---------- init map ---------- */
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-95, 38],
      zoom: 3.5,
      minZoom: 3.5,
      maxZoom: 3.5,
      pitch: 0,
      bearing: 0,
      scrollZoom: false,
      doubleClickZoom: false,
      touchZoomRotate: false,
      boxZoom: false,
      dragPan: false,
      dragRotate: false,
      attributionControl: false,
    })

    map.on('load', () => {
      /* --- hide all labels, boundaries, POIs, water labels --- */
      const layersToHide = [
        'country-label', 'state-label', 'settlement-label',
        'settlement-subdivision-label', 'airport-label',
        'poi-label', 'water-point-label', 'water-line-label',
        'natural-point-label', 'natural-line-label',
        'waterway-label', 'road-label', 'road-number-shield',
        'road-exit-shield', 'transit-label',
        'admin-0-boundary', 'admin-0-boundary-bg',
        'admin-0-boundary-disputed',
        'admin-1-boundary', 'admin-1-boundary-bg',
      ]
      for (const id of layersToHide) {
        if (map.getLayer(id)) {
          map.setLayoutProperty(id, 'visibility', 'none')
        }
      }

      /* --- make water white & land light gray --- */
      if (map.getLayer('water')) {
        map.setPaintProperty('water', 'fill-color', '#ffffff')
      }
      if (map.getLayer('land')) {
        map.setPaintProperty('land', 'background-color', '#f0f0f0')
      }
      if (map.getLayer('landcover')) {
        map.setPaintProperty('landcover', 'fill-color', '#f0f0f0')
        map.setPaintProperty('landcover', 'fill-opacity', 1)
      }
      /* hide all road layers */
      for (const layer of map.getStyle().layers) {
        if (layer.id.startsWith('road') || layer.id.startsWith('bridge') || layer.id.startsWith('tunnel')) {
          map.setLayoutProperty(layer.id, 'visibility', 'none')
        }
      }

      map.addSource('migration', {
        type: 'geojson',
        data: toGeoJSON(pointsRef.current),
      })

      map.addLayer({
        id: 'migration-layer',
        type: 'circle',
        source: 'migration',
        paint: {
          'circle-radius': 4,
          'circle-color': ['get', 'color'],
          'circle-opacity': 0.55,
        },
      })

      readyRef.current = true
    })

    mapRef.current = map

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
      readyRef.current = false
    }
  }, [])

  /* ---------- update data ---------- */
  useEffect(() => {
    const map = mapRef.current
    if (!map || !readyRef.current) return
    const src = map.getSource('migration') as mapboxgl.GeoJSONSource | undefined
    if (src) src.setData(toGeoJSON(points))
  }, [points])

  return (
    <div
      ref={containerRef}
      className="w-full h-full [&_.mapboxgl-ctrl-logo]:!hidden [&_.mapboxgl-ctrl-attrib]:!hidden"
    />
  )
}
