# HummingbirdWatch.org — 完整项目规格文档 v2.0

> 最后更新：2026-03-24  ·  当前阶段：阶段 1 — 功能实现中

---

## 1. 项目概述

### 1.1 商业背景

本站由 **BirdSnap** 品牌主导，以公益性质的蜂鸟迁徙追踪网站为切入点，核心目的是：

1. 通过提供真实、精准的蜂鸟迁徙数据，吸引北美蜂鸟爱好者群体
2. 以"到达提醒"为钩子，收集用户邮箱 + ZIP Code
3. 通过 Omnisend 把邮箱导入营销自动化流程，引导购买 **BirdSnap H53 智能蜂鸟喂食器**

> **产品链接**：https://birdsnap.com/products/smart-hummingbird-feeder

### 1.2 用户价值主张

对用户来说，这是一个免费、无广告感的迁徙追踪工具：
- 实时查看蜂鸟在北美各地的最新目击记录
- 3D 地形地图直观展示迁徙路线
- 输入 ZIP Code，蜂鸟到达附近时收到邮件提醒

### 1.3 网站标识

| 项目 | 内容 |
|------|------|
| 域名 | `hummingbirdwatch.org` |
| 站点标题 | `HummingbirdWatch — Real-Time Hummingbird Migration Tracker` |
| 描述 | `Track real-time hummingbird migration across North America. Get alerts when they arrive near you.` |
| 品牌归属 | "By BirdSnap"（Navbar 右侧 + Footer，链接至 birdsnap.com） |
| 页面语言 | `lang="en"`（当前代码错误设置为 `zh-CN`，**必须修正**） |
| 版权 | `© 2026 HummingbirdWatch.org — A BirdSnap Project` |

---

## 2. 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 15 (App Router) |
| 语言 | TypeScript |
| 样式 | Tailwind CSS v4 |
| 地图 | Mapbox GL JS + react-map-gl（3D 地形） |
| 动画 | CSS `transition` / `@keyframes` 仅此（**禁止 framer-motion**） |
| 邮件营销 | Omnisend REST API v3（服务端调用） |
| 字体 | Playfair Display（serif 标题）+ Inter（正文） |
| 图片 | `next/image`，宽度 ≤ 1200px，文件 < 300KB |
| 部署 | Vercel |
| 分析 | `@vercel/analytics` |

---

## 3. 环境变量（`.env.local`）

```bash
# eBird API — 服务端专用，不加 NEXT_PUBLIC_ 前缀
EBIRD_API_KEY=your_ebird_api_key_here

# Mapbox — 客户端地图渲染需要 NEXT_PUBLIC_
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here

# Omnisend — 服务端专用，绝不暴露给前端
OMNISEND_API_KEY=your_omnisend_api_key_here
```

> ⚠️ **安全**：`OMNISEND_API_KEY` 和 `EBIRD_API_KEY` 绝不能加 `NEXT_PUBLIC_` 前缀，
> 只能在 `app/api/` Route Handler 中通过 `process.env` 访问。
> 旧 Omnisend Key 已在对话中曝光，**请立即在 Omnisend 控制台重新生成**。

---

## 4. 页面布局总览（实际渲染顺序）

```
app/page.tsx
├── <Navbar />            固定顶部，滚动变色 + 移动端汉堡菜单
├── <HeroSection />       全屏首屏，背景图 + CTA 按钮
├── <LatestSighting />    顶部跑马灯：eBird 最新目击（实时）
├── <MigrationMap />      3D 地形地图（核心功能）
├── <SubscribeSection />  邮箱 + ZIP 订阅 → Omnisend
├── <CommunitySection />  静态社区目击故事
├── <VideoShowcase />     Shopify CDN MP4 视频
├── <SpeciesSection />    10 种蜂鸟卡片
├── <HowItWorks />        三步说明
└── <Footer />            链接 + 隐私政策弹窗
```

---

## 5. 设计系统

### 5.1 配色

| CSS 变量 | 色值 | 用途 |
|----------|------|------|
| `--reed-green` | `#5B6751` | 主色：按钮、强调文字、地图路线 |
| `--light-ochre` | `#A27F67` | 副色：标签、hover 状态 |
| `--muxing-grey` | `#E3D8C6` | 分隔线、卡片边框 |
| `--warm-white` | `#F7F5F0` | 浅色区块背景 |
| `--text-dark` | `#2C2C2C` | 标题文字 |
| `--text-body` | `#4A4A4A` | 正文文字 |
| `--text-muted` | `#999999` | 辅助信息 |

### 5.2 字体

- **Serif 标题**：`font-serif`（Playfair Display）— `<h1>` `<h2>` 及物种名称
- **正文**：`font-sans`（Inter）— 所有 body 文字和 UI 组件

### 5.3 圆角 / 阴影

- 卡片：`rounded-xl` + `shadow-sm`
- 按钮：`rounded-full`
- 地图容器：`rounded-xl overflow-hidden`

---

## 6. 外部服务规格

### 6.1 eBird API 2.0

- **Base URL**：`https://api.ebird.org`
- **认证**：Header `X-eBirdApiToken: {EBIRD_API_KEY}`
- **调用位置**：仅在服务端 Route Handler 中，前端通过 `/api/ebird/*` 代理
- **缓存**：`next: { revalidate: 3600 }`（每小时更新）
- **失败处理**：返回静态 fallback 数据，不向用户暴露错误细节

#### 10 种蜂鸟物种代码

| # | 英文名 | eBird Code | 地图颜色 | 主要路线 |
|---|--------|-----------|---------|---------|
| 1 | Ruby-throated Hummingbird | `rthhum` | `#5B6751` | 东部 |
| 2 | Black-chinned Hummingbird | `bkchum` | `#A27F67` | 中部/西南 |
| 3 | Rufous Hummingbird | `rufhum` | `#C67D4B` | 西部/太平洋 |
| 4 | Anna's Hummingbird | `annhum` | `#8B5E83` | 太平洋沿岸（常驻） |
| 5 | Broad-tailed Hummingbird | `btlhum` | `#4A7C84` | 落基山脉 |
| 6 | Calliope Hummingbird | `calhum` | `#C4824A` | 西部内陆 |
| 7 | Allen's Hummingbird | `allhum` | `#7B8C3E` | 加州海岸 |
| 8 | Costa's Hummingbird | `coshum` | `#6B5E9E` | 西南沙漠 |
| 9 | Buff-bellied Hummingbird | `bfbhum` | `#A8773A` | 德克萨斯湾岸 |
| 10 | Broad-billed Hummingbird | `bblhum` | `#2E7D5E` | 西南边境/亚利桑那 |

#### 主要接口

```
# 获取最新观测（用于 LatestSighting 跑马灯）
GET /v2/data/obs/geo/recent?lat=39.8&lng=-98.5&dist=800&maxResults=5&fmt=json

# 获取指定物种观测点（用于地图，每种物种独立请求）
GET /v2/data/obs/geo/recent?lat=39.8&lng=-98.5&dist=800&speciesCode={code}&maxResults=200&fmt=json
```

---

### 6.2 Mapbox GL JS

- **安装**：`pnpm add mapbox-gl react-map-gl @types/mapbox-gl`
- **Token**：`process.env.NEXT_PUBLIC_MAPBOX_TOKEN`（客户端使用，必须加 `NEXT_PUBLIC_`）
- **必须在地图组件顶部引入 CSS**：
  ```ts
  import 'mapbox-gl/dist/mapbox-gl.css'
  ```
- **地图样式**：`mapbox://styles/mapbox/outdoors-v12`（山脉、河流、森林可见）
- **3D 地形源**：`mapbox://mapbox.mapbox-terrain-dem-v1`
- **地图动态导入**（必须，否则 SSR 崩溃）：
  ```ts
  const MapInner = dynamic(() => import('./migration-map-inner'), { ssr: false })
  ```
- **Geocoding API**（订阅时 ZIP 转坐标，在服务端调用）：
  ```
  GET https://api.mapbox.com/geocoding/v5/mapbox.places/{zip}.json
    ?types=postcode&country=US&access_token={NEXT_PUBLIC_MAPBOX_TOKEN}
  ```
  取 `features[0].center` → `[longitude, latitude]`

---

### 6.3 Omnisend REST API v3

- **Base URL**：`https://api.omnisend.com/v3`
- **认证**：Header `X-API-KEY: {OMNISEND_API_KEY}`
- **调用位置**：仅在 `/api/subscribe` Route Handler 中
- **接口**：`POST /v3/contacts`

**请求体结构**：

```json
{
  "email": "user@example.com",
  "status": "subscribed",
  "statusDate": "2026-03-24T00:00:00Z",
  "tags": ["hummingbird-tracker"],
  "customProperties": {
    "zipCode": "78701",
    "latitude": 30.2672,
    "longitude": -97.7431,
    "signupSource": "hummingbirdwatch.org"
  }
}
```

**Omnisend 后续营销流程（控制台配置，不在代码中实现）**：
1. 针对 tag `hummingbird-tracker` 建立 Segment
2. 迁徙高峰期（3–7 月）每月 1–2 次手动触发定向邮件活动
3. 邮件内容引导购买 BirdSnap H53 智能蜂鸟喂食器

---

## 7. 服务端 API Routes

所有 Route Handler 放在 `app/api/` 下，仅在服务端运行，对外不暴露 API Key。

---

### 7.1 `GET /api/ebird/latest`

**用途**：为 LatestSighting 跑马灯提供最新目击数据，API 失败时返回 fallback

```ts
// app/api/ebird/latest/route.ts
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
```

**响应**：`{ speciesCommonName, locName, obsDt }`

---

### 7.2 `GET /api/ebird/observations`

**用途**：为 3D 地图提供 GeoJSON 格式的观测点数据

**Query 参数**：`speciesCode`（逗号分隔，默认全部 10 种）

```ts
// app/api/ebird/observations/route.ts
import { NextRequest, NextResponse } from 'next/server'

const ALL = ['rthhum','bkchum','rufhum','annhum','btlhum','calhum','allhum','coshum','bfbhum','bblhum']

export async function GET(req: NextRequest) {
  const codes = req.nextUrl.searchParams.get('speciesCode')?.split(',') ?? ALL

  try {
    const results = await Promise.all(
      codes.map(async (code) => {
        const res = await fetch(
          'https://api.ebird.org/v2/data/obs/geo/recent?' +
            new URLSearchParams({ lat: '39.8', lng: '-98.5', dist: '800', speciesCode: code, maxResults: '200', fmt: 'json' }),
          { headers: { 'X-eBirdApiToken': process.env.EBIRD_API_KEY! }, next: { revalidate: 3600 } }
        )
        return res.ok ? res.json() : []
      })
    )

    const features = results.flat().map((obs: any) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [obs.lng, obs.lat] },
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
```

**响应**：GeoJSON FeatureCollection

---

### 7.3 `POST /api/subscribe`

**用途**：接收表单 → ZIP 地理编码 → 写入 Omnisend

**请求体**：`{ "email": "...", "zipCode": "78701" }`

```ts
// app/api/subscribe/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { email, zipCode } = await req.json()

  // 服务端验证（前端校验不可信）
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  if (!zipCode || !/^\d{5}$/.test(zipCode))
    return NextResponse.json({ error: 'Invalid ZIP code' }, { status: 400 })

  // ZIP → 坐标（Mapbox Geocoding）
  let latitude = 0, longitude = 0
  try {
    const geo = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(zipCode)}.json` +
        `?types=postcode&country=US&access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}`
    )
    const geoData = await geo.json()
    if (geoData.features?.length > 0) [longitude, latitude] = geoData.features[0].center
  } catch { /* ZIP 坐标失败不阻塞主流程 */ }

  // 写入 Omnisend
  const omni = await fetch('https://api.omnisend.com/v3/contacts', {
    method: 'POST',
    headers: { 'X-API-KEY': process.env.OMNISEND_API_KEY!, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      status: 'subscribed',
      statusDate: new Date().toISOString(),
      tags: ['hummingbird-tracker'],
      customProperties: { zipCode, latitude, longitude, signupSource: 'hummingbirdwatch.org' },
    }),
  })

  // 409 = 邮箱已存在，对用户展示成功（不泄露注册状态）
  if (!omni.ok && omni.status !== 409)
    return NextResponse.json({ error: 'Subscription failed. Please try again.' }, { status: 500 })

  return NextResponse.json({ success: true })
}
```

---

## 8. Feature 规格详述

---

### F1: `app/layout.tsx` — 全局修正（第一优先）

**必须修正**：

| 问题 | 当前值 | 应改为 |
|------|--------|--------|
| `<html lang>` | `zh-CN` | `en` |
| `metadata.title` | `"BirdSnap - 蜂鸟迁徙追踪"` | `"HummingbirdWatch — Real-Time Hummingbird Migration Tracker"` |
| `metadata.description` | 中文 | `"Track real-time hummingbird migration across North America. Get alerts when they arrive near you."` |

**验收**：DevTools Elements 面板中 `<html lang="en">` ✓

---

### F2: `components/navbar.tsx` — 滚动变色 + 移动端菜单

**需求**：
- 滚动 > 50px 时背景从透明变白（`bg-white shadow-sm`）
- 移动端汉堡菜单展开/折叠导航链接
- Logo 区域显示文字 "HummingbirdWatch"（替代现有色块）
- "By BirdSnap" 链接至 `https://birdsnap.com`，`target="_blank"`

**关键实现**：

```tsx
'use client'
useEffect(() => {
  const handleScroll = () => setScrolled(window.scrollY > 50)
  window.addEventListener('scroll', handleScroll, { passive: true })
  return () => window.removeEventListener('scroll', handleScroll) // cleanup 必须
}, [])
```

移动端菜单展开动画用 CSS `max-height` transition，不用 JS 计算高度，不用 `backdrop-blur`。

**验收**：
- [ ] 滚动后背景变白 + 出现细阴影
- [ ] 移动端菜单展开/折叠流畅
- [ ] useEffect cleanup 存在（代码审查确认）

---

### F3: `components/hero-section.tsx` — 首屏

**阶段 1**：保持现有色块（`backgroundColor: '#3a5a40'`），不动

**阶段 2**（图片替换时）：
- 文件：`public/images/hero.jpg`（来自 `hummingbird image/hero.jpg`）
- 使用 `next/image fill priority={true} quality={85} sizes="100vw"`

---

### F4: `components/latest-sighting.tsx` — 实时目击跑马灯

**实现**：Server Component，直接 fetch，不需要 `'use client'`

```tsx
// 无客户端 JS，ISR 每小时刷新
async function getData() {
  try {
    const base = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'
    const res = await fetch(`${base}/api/ebird/latest`, { next: { revalidate: 3600 } })
    if (!res.ok) throw new Error()
    return res.json()
  } catch {
    return { speciesCommonName: 'Ruby-throated Hummingbird', locName: 'Austin, TX', obsDt: '2h ago' }
  }
}

export async function LatestSighting() {
  const data = await getData()
  // 渲染：● Latest sighting: {comName} · {locName} · {obsDt}
}
```

**验收**：
- [ ] 正常时显示 eBird 实时数据
- [ ] API 失败时 fallback 无感知切换
- [ ] 绿色脉冲圆点 `animate-pulse` 可见

---

### F5: `components/migration-map.tsx` — 3D 地图（核心）

拆分为两个文件避免 SSR 问题：

```
components/
├── migration-map.tsx        外壳：动态导入 + 时间轴 UI + 物种筛选 UI
└── migration-map-inner.tsx  内部：Mapbox 核心逻辑（新建文件）
```

#### 5.1 外壳组件

```tsx
'use client'
import dynamic from 'next/dynamic'

const MapInner = dynamic(() => import('./migration-map-inner'), {
  ssr: false,
  loading: () => <div className="w-full rounded-xl bg-[#E8E4DC]" style={{ height: '75vh', minHeight: '500px' }} />,
})

export function MigrationMap() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [activeSpecies, setActiveSpecies] = useState<string[]>(ALL_SPECIES_CODES)
  return (
    <section id="map">
      <SpeciesFilterBar activeSpecies={activeSpecies} onChange={setActiveSpecies} />
      <MapInner selectedMonth={selectedMonth} activeSpecies={activeSpecies} />
      <TimelineSlider value={selectedMonth} onChange={setSelectedMonth} />
      <MapLegend />
    </section>
  )
}
```

#### 5.2 地图内部组件（`migration-map-inner.tsx`）

```tsx
'use client'
import { useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!

export default function MigrationMapInner({ selectedMonth, activeSpecies }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: [-98.5, 39.8], zoom: 3.5, pitch: 45, bearing: -10,
    })
    map.on('load', () => {
      map.addSource('terrain', { type: 'raster-dem', url: 'mapbox://mapbox.mapbox-terrain-dem-v1', tileSize: 512 })
      map.setTerrain({ source: 'terrain', exaggeration: 1.5 })
      addMigrationRoutes(map)   // 固定 3 条迁徙路线
      loadObservations(map, activeSpecies)
    })
    mapRef.current = map
    return () => { mapRef.current?.remove(); mapRef.current = null } // cleanup 必须
  }, [])

  useEffect(() => {
    if (!mapRef.current?.isStyleLoaded()) return
    loadObservations(mapRef.current, activeSpecies)
  }, [activeSpecies, selectedMonth])

  return <div ref={containerRef} className="w-full rounded-xl" style={{ height: '75vh', minHeight: '500px' }} />
}
```

#### 5.3 固定迁徙路线坐标

| 路线 | 颜色 | 关键坐标（南 → 北） |
|------|------|------------------|
| 东部（Ruby-throated） | `#5B6751` | (-90.3,20.5) → (-90.1,29.9) → (-84.4,33.7) → (-77.0,38.9) → (-74.0,40.7) → (-73.6,45.5) |
| 中部（Black-chinned） | `#A27F67` | (-106.5,26.5) → (-97.7,30.3) → (-97.5,35.5) → (-98.5,39.8) → (-97.1,49.0) |
| 西部（Rufous/Anna's） | `#C67D4B` | (-106.5,20.0) → (-117.2,32.7) → (-122.4,37.8) → (-122.3,47.6) → (-135.0,57.0) |

路线样式：`line-width: 2.5`，`line-opacity: 0.7`，`line-dasharray: [2, 1]`

#### 5.4 观测点图层（Mapbox Circle Layer）

```js
map.addLayer({
  id: `obs-${speciesCode}`,
  type: 'circle',
  source: `src-${speciesCode}`,
  paint: {
    'circle-radius': ['interpolate', ['linear'], ['zoom'], 3, 4, 8, 10],
    'circle-color': SPECIES_COLORS[speciesCode],
    'circle-opacity': 0.85,
    'circle-stroke-width': 1,
    'circle-stroke-color': '#ffffff',
  },
})
```

#### 5.5 点击 Popup

```ts
map.on('click', `obs-${code}`, (e) => {
  const { comName, locName, obsDt, howMany } = e.features![0].properties!
  new mapboxgl.Popup({ maxWidth: '260px' })
    .setLngLat(e.lngLat)
    .setHTML(`<strong>${comName}</strong><br>📍 ${locName}<br>🗓 ${obsDt}<br>🐦 Count: ${howMany}`)
    .addTo(map)
})
map.on('mouseenter', `obs-${code}`, () => { map.getCanvas().style.cursor = 'pointer' })
map.on('mouseleave', `obs-${code}`, () => { map.getCanvas().style.cursor = '' })
```

#### 5.6 时间轴滑块

- 组件：`@radix-ui/react-slider`（已安装）
- 范围：1（Jan）→ 7（Jul）
- 月份变化时重新 fetch observations 并调用 `source.setData()`

#### 5.7 物种筛选器

- 水平 Toggle 按钮组，按钮颜色与物种颜色一致
- 切换时调用 `map.setLayoutProperty(layerId, 'visibility', 'visible'|'none')`（无需重新 fetch）

#### 5.8 数据加载流程

```
Mount → fetch /api/ebird/observations → GeoJSON 写入 Mapbox source → 渲染观测点
月份改变 → 重新 fetch → 更新 source.setData()
物种 toggle → setLayoutProperty → 即时响应，无网络请求
API 失败 → toast "Using cached data" + 渲染 5 个静态备用观测点
```

**验收**：
- [ ] 3D 地形可见（落基山脉有立体感）
- [ ] 3 条虚线迁徙路线清晰
- [ ] 10 种物种筛选按钮正常工作
- [ ] 时间轴拖动后观测点更新
- [ ] 点击观测点出现 Popup（含物种/地点/日期/数量）
- [ ] 鼠标悬停变手型
- [ ] API 失败不白屏
- [ ] 移动端可缩放拖动
- [ ] useEffect cleanup 销毁 map 实例，无内存泄漏

---

### F6: `components/subscribe-section.tsx` — Omnisend 邮箱订阅

#### 表单字段

1. ZIP Code：`type="text"` `maxLength={5}` `pattern="\d{5}"`
2. Email：`type="email"`
3. 提交按钮："Notify me"

#### 状态机

```ts
type State = 'idle' | 'loading' | 'success' | 'error'
```

#### 提交逻辑

```ts
async function handleSubmit(e: FormEvent) {
  e.preventDefault()
  if (!/^\d{5}$/.test(zipCode)) { setErrorMsg('Please enter a valid 5-digit ZIP code.'); return }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErrorMsg('Please enter a valid email address.'); return }
  setState('loading')
  try {
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, zipCode }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error)
    setState('success')
  } catch (err) {
    setState('error')
    setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.')
  }
}
```

#### 成功状态 UI

```
✓  You're on the list!
   We'll email you when hummingbirds are spotted near [zipCode].
```

#### 表单下方常驻隐私声明

```tsx
<p className="text-xs text-[#999999] mt-3">
  By signing up, you agree to receive migration alerts and occasional product updates from BirdSnap.{' '}
  <button type="button" onClick={() => setPrivacyOpen(true)} className="underline hover:text-[#5B6751]">
    Privacy Policy
  </button>
</p>
```

**验收**：
- [ ] Omnisend 控制台可搜到邮箱，tag 为 `hummingbird-tracker`
- [ ] customProperties 含 zipCode、latitude、longitude
- [ ] 无效邮箱/ZIP 有前端提示
- [ ] 成功后按钮禁用（防重复提交）
- [ ] 加载中按钮有 Spinner 反馈

---

### F7: `components/species-section.tsx` — 10 种蜂鸟展示

扩展到 10 种，点击卡片原地展开详情（单卡片 accordion）

```tsx
const [expandedId, setExpandedId] = useState<number | null>(null)
const toggle = (id: number) => setExpandedId(prev => prev === id ? null : id)
```

每种蜂鸟的详情字段（硬编码）：

```ts
interface Species {
  // ...现有字段...
  range: string          // 分布范围
  migrationRoute: string // 迁徙路线描述
  size: string           // 体型特征
  peakMonth: string      // 最佳观测月份
  feedingTip: string     // 喂食建议（软植入：提及智能喂食器）
}
```

**展开区域**：卡片底部 CSS `max-height` transition，显示 5 个字段 + "See on Map →"（`<a href="#map">`）

**Ruby-throated 示例数据**：
```ts
{
  range: "Eastern North America, Florida to southern Canada",
  migrationRoute: "Crosses the Gulf of Mexico in a single 500-mile non-stop flight",
  size: "3.2 in, 0.1 oz — smallest bird in eastern North America",
  peakMonth: "May in the Northeast, April in the Southeast",
  feedingTip: "Prefers 1:4 sugar-water ratio. A smart feeder with arrival alerts means you'll never miss them.",
}
```

**验收**：
- [ ] 10 种卡片在 3 列网格中显示
- [ ] 点击展开，再次点击收起；同时只有一张展开
- [ ] 展开/收起无 layout shift

---

### F8: `components/community-section.tsx` — 静态社区内容

仅做两处微调：
- `totalSightings` 改为 `14230`
- "Share Your Sighting" 链接改为 `#subscribe`

---

### F9: `components/video-showcase.tsx` — 视频播放器

**视频源**（Shopify CDN mp4，非 YouTube iframe）：
```
https://cdn.shopify.com/videos/c/o/v/0b672edff67a40da914e99236f205f02.mp4
```

```tsx
'use client'
const [playing, setPlaying] = useState(false)
const videoRef = useRef<HTMLVideoElement>(null)
```

```tsx
<video
  ref={videoRef}
  src="https://cdn.shopify.com/videos/c/o/v/0b672edff67a40da914e99236f205f02.mp4"
  className="w-full aspect-video object-cover"
  playsInline muted loop
  preload="none"
/>
{!playing && <PlayButton onClick={() => { videoRef.current?.play(); setPlaying(true) }} />}
```

> ⚠️ **必须修正**：原代码 CTA 链接到 `mybirdbuddy.com`（竞品 Bird Buddy），
> 改为：`https://birdsnap.com/products/smart-hummingbird-feeder`

**验收**：
- [ ] 点击播放后视频正常播放
- [ ] `preload="none"` — 页面加载时不预下载视频
- [ ] CTA 按钮指向 BirdSnap 产品页
- [ ] 移动端 `playsInline` 正常

---

### F10: `components/how-it-works.tsx` — 工作原理说明

仅更新三步文案：

| 步骤 | 新标题 | 新描述 |
|------|--------|--------|
| 1 | eBird + Community Data | Thousands of birders report sightings daily to eBird. We aggregate this data in real time. |
| 2 | Smart Analysis | We filter 10 hummingbird species across North America and plot their northward journey on a live 3D map. |
| 3 | Your Personal Alert | Enter your ZIP once. We'll email you the moment hummingbirds are reported within 150 miles of your home. |

---

### F11: `components/footer.tsx` — Footer + 隐私政策弹窗

```tsx
'use client'
export function Footer() {
  const [privacyOpen, setPrivacyOpen] = useState(false)
  return (
    <footer className="bg-[#5B6751]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-white/60">
            © 2026 HummingbirdWatch.org — A{' '}
            <a href="https://birdsnap.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
              BirdSnap
            </a>{' '}Project
          </p>
          <div className="flex gap-4 text-[13px] text-white/50">
            <span>Migration data: eBird</span>
            <span>·</span>
            <button onClick={() => setPrivacyOpen(true)} className="underline hover:text-white/80">
              Privacy Policy
            </button>
          </div>
        </div>
      </div>
      <PrivacyPolicyDialog open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </footer>
  )
}
```

#### 隐私政策正文（英文，Omnisend 合规要求）

使用现有 `ui/dialog.tsx` 弹窗展示：

```
Privacy Policy — HummingbirdWatch.org
Last updated: March 2026

1. Information We Collect
When you sign up for alerts, we collect your email address and ZIP code only.

2. How We Use Your Information
- To send hummingbird arrival alerts when birds are spotted near your ZIP code.
- To send occasional product updates from BirdSnap (unsubscribe anytime).

3. Third Parties
Your data is processed by Omnisend (email marketing).
We do not sell or share your data with any other parties.
Omnisend privacy policy: https://www.omnisend.com/privacy-policy/

4. Your Rights
Unsubscribe anytime via the link in any email. Data removed immediately upon request.

5. Contact: privacy@birdsnap.com
Site operated by BirdSnap · birdsnap.com
```

**验收**：
- [ ] Footer "Privacy Policy" 点击后弹窗打开
- [ ] SubscribeSection 的隐私链接触发同一弹窗
- [ ] 弹窗可用键盘关闭（Dialog 组件已支持）
- [ ] BirdSnap 链接正确

---

## 9. 数据流总览

```
用户访问页面
│
├── [Server] LatestSighting
│   └── fetch /api/ebird/latest → eBird API（ISR, 缓存 1h）
│       → 返回最新目击 → 跑马灯渲染
│
├── [Client] MigrationMap mount
│   ├── 初始化 Mapbox 3D（outdoors-v12 + terrain exaggeration 1.5）
│   ├── fetch /api/ebird/observations → eBird API 并发 10 种（缓存 1h）
│   └── GeoJSON 写入 Mapbox source → 渲染观测圆点
│
├── 用户拖动时间轴
│   └── 重新 fetch /api/ebird/observations?month={m} → source.setData()
│
├── 用户切换物种筛选
│   └── setLayoutProperty visibility（即时，无网络请求）
│
├── 用户点击观测点
│   └── 显示 Mapbox Popup（无网络请求）
│
└── 用户提交订阅表单
    ├── 前端格式验证（ZIP 5位数字 + 邮箱格式）
    ├── POST /api/subscribe
    │   ├── 服务端二次验证
    │   ├── Mapbox Geocoding: ZIP → [lng, lat]
    │   └── Omnisend POST /v3/contacts（带 tag + customProperties）
    └── 前端显示 success / error 状态
```

---

## 10. 推荐文件结构

```
页面设计代码/
├── .env.local                          # 3 个 Key（不提交 Git）
├── .env.example                        # 占位符模板（新建，提交 Git）
├── app/
│   ├── layout.tsx                      # ⚠️ 修正 lang="en" + 英文 metadata
│   ├── page.tsx                        # 无改动
│   ├── globals.css                     # 无改动
│   └── api/
│       ├── ebird/
│       │   ├── latest/route.ts         # 新建
│       │   └── observations/route.ts   # 新建
│       └── subscribe/route.ts          # 新建
├── components/
│   ├── navbar.tsx                      # 改：滚动变色 + 移动端菜单
│   ├── hero-section.tsx                # 阶段 1 不动
│   ├── latest-sighting.tsx             # 改：Server Component + eBird fetch
│   ├── migration-map.tsx               # 改：外壳 + 动态导入
│   ├── migration-map-inner.tsx         # 新建：Mapbox 核心逻辑
│   ├── subscribe-section.tsx           # 改：表单逻辑 + /api/subscribe
│   ├── species-section.tsx             # 改：10 种 + 展开详情
│   ├── community-section.tsx           # 微调文案
│   ├── video-showcase.tsx              # 改：原生 video + 修正 CTA 链接
│   ├── how-it-works.tsx                # 改：文案更新
│   ├── footer.tsx                      # 改：隐私政策弹窗
│   └── ui/                             # Radix UI（不改动）
└── public/
    └── images/                         # 阶段 2 添加图片
        ├── hero.jpg                    # 来自 hummingbird image/hero.jpg
        └── subscribe-bg.jpg            # 来自 hummingbird image/邮箱订阅板块.jpg
```

**阶段 1 需新建的文件**（共 5 个）：
1. `app/api/ebird/latest/route.ts`
2. `app/api/ebird/observations/route.ts`
3. `app/api/subscribe/route.ts`
4. `components/migration-map-inner.tsx`
5. `.env.example`

---

## 11. 验收标准汇总

| Feature | 关键验收测试 |
|---------|------------|
| F1 layout | `<html lang="en">` ✓，title/description 为英文 ✓ |
| F2 Navbar | 滚动变白 ✓，移动端菜单可用 ✓，useEffect cleanup 存在 ✓ |
| F3 Hero | 色块占位，CTA 滚动到 #map ✓ |
| F4 LatestSighting | 显示 eBird 实时数据 ✓，API 失败 fallback ✓ |
| F5 Map | 3D 地形 ✓，3 条路线 ✓，10 种筛选 ✓，时间轴 ✓，Popup ✓，失败不白屏 ✓ |
| F6 Subscribe | Omnisend 收到邮箱 ✓，tag+坐标正确 ✓，隐私声明可见 ✓ |
| F7 Species | 10 卡片 ✓，展开/收起 ✓，无 layout shift ✓ |
| F8 Community | 文案微调 ✓ |
| F9 Video | mp4 正常播放 ✓，CTA 指向 BirdSnap（不是 Bird Buddy）✓ |
| F10 HowItWorks | 文案更新 ✓ |
| F11 Footer | 隐私弹窗 ✓，BirdSnap 链接正确 ✓ |

---

## 12. ⚠️ 全局约束

1. **绝对禁止 `framer-motion`** — 已从 `package.json` 移除，会导致浏览器崩溃（错误码 5）
2. **所有 `useEffect` 必须有 cleanup** — 无 cleanup 导致内存泄漏和无限循环
3. **禁止大面积 `backdrop-blur`** — GPU 过载
4. **图片必须用 `next/image`** — 宽度 ≤ 1200px，文件 < 300KB
5. **动画只用 CSS `transition` / `@keyframes`**
6. **Mapbox 组件必须动态导入（`ssr: false`）** — Mapbox GL JS 不支持 SSR
7. **`OMNISEND_API_KEY` 和 `EBIRD_API_KEY` 绝不加 `NEXT_PUBLIC_` 前缀**
8. **所有 API 请求必须有 `try/catch` + 用户友好的错误提示**
9. **服务端 fetch 设置 `next: { revalidate: 3600 }`** — 减少 eBird API 调用

---

## 13. 开发阶段规划

### 阶段 1：功能实现（⬅️ 当前阶段）

按优先级顺序，每次只实现一个 Feature，验收通过后再进行下一个：

| 顺序 | Feature | 原因 |
|------|---------|------|
| 1 | F1: layout 修正 | 全局基础，影响 SEO |
| 2 | F2: Navbar | 全页面可见，先修好 |
| 3 | F11: Footer 隐私弹窗 | Omnisend 合规要求，Subscribe 之前必须有 |
| 4 | F6: Subscribe + Omnisend | 最核心的商业目标 |
| 5 | F5: MigrationMap | 最核心的技术功能 |
| 6 | F4: LatestSighting | 小功能，依赖 eBird API |
| 7 | F7: SpeciesSection | 中等复杂度 |
| 8 | F9: VideoShowcase | 修正竞品链接 + 实现播放 |
| 9 | F8: CommunitySection | 仅微调，最简单 |
| 10 | F10: HowItWorks | 仅文案微调 |

### 阶段 2：内容填充（所有功能验收通过后）

- `hummingbird image/hero.jpg` → `public/images/hero.jpg` → HeroSection 替换色块
- `hummingbird image/邮箱订阅板块.jpg` → `public/images/subscribe-bg.jpg` → SubscribeSection 替换色块
- 补充 10 种蜂鸟照片（建议 Unsplash 或 iNaturalist CC 授权图片）

### 阶段 3：优化 + 部署

- Lighthouse 性能目标 ≥ 85
- 移动端 3D 地图性能测试（可能需降低 `exaggeration` + 限制 `maxResults`）
- 配置 Vercel 环境变量（三个 Key）
- 绑定域名 `hummingbirdwatch.org`

---

## 14. 安全备注

| 风险 | 措施 |
|------|------|
| Omnisend Key 泄漏 | 仅服务端使用，无 `NEXT_PUBLIC_`。**旧 Key 已曝光，立即在 Omnisend 控制台重新生成** |
| eBird Key 滥用 | 仅服务端使用，1h 缓存，不超速率限制 |
| 表单 Spam | 服务端二次验证格式；Omnisend 自带重复邮箱保护（409 不暴露给用户） |
| XSS（Mapbox Popup） | Popup 内容仅使用 eBird API 结构化字段，不拼接用户输入 |
| 环境变量泄漏 | `.env.local` 在 `.gitignore` 中；仅提交 `.env.example`（含占位符） |
| CSRF | `/api/subscribe` 只接受 `Content-Type: application/json`，浏览器 CORS 保护同源 |
