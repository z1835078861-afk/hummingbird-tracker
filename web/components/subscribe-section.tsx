'use client'

import { useState, type FormEvent } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Loader2, CheckCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type State = 'idle' | 'loading' | 'success' | 'error'

function PrivacyDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Privacy Policy — HummingbirdWatch.org</DialogTitle>
        </DialogHeader>
        <div className="text-sm text-[#4A4A4A] space-y-4 leading-relaxed">
          <p className="text-[#999999]">Last updated: March 2026</p>
          <div>
            <h3 className="font-semibold text-[#2C2C2C] mb-1">1. Information We Collect</h3>
            <p>When you sign up for alerts, we collect your email address and ZIP code only.</p>
          </div>
          <div>
            <h3 className="font-semibold text-[#2C2C2C] mb-1">2. How We Use Your Information</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>To send hummingbird arrival alerts when birds are spotted near your ZIP code.</li>
              <li>To send occasional product updates from BirdSnap (unsubscribe anytime).</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-[#2C2C2C] mb-1">3. Third Parties</h3>
            <p>Your data is processed by Omnisend (email marketing). We do not sell or share your data with any other parties.</p>
          </div>
          <div>
            <h3 className="font-semibold text-[#2C2C2C] mb-1">4. Your Rights</h3>
            <p>Unsubscribe anytime via the link in any email. Data removed immediately upon request.</p>
          </div>
          <div>
            <h3 className="font-semibold text-[#2C2C2C] mb-1">5. Contact</h3>
            <p>support@birdsnap.com · <a href="https://birdsnap.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#5B6751]">birdsnap.com</a></p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function SubscribeSection() {
  const [email, setEmail] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [state, setState] = useState<State>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [privacyOpen, setPrivacyOpen] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErrorMsg('')
    if (!/^\d{5}$/.test(zipCode)) {
      setErrorMsg('Please enter a valid 5-digit ZIP code.')
      setState('error')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg('Please enter a valid email address.')
      setState('error')
      return
    }
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

  const formContent = state === 'success' ? (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <CheckCircle className="w-12 h-12 text-[#5B6751] mb-4" />
      <h3 className="text-xl font-semibold text-[#2C2C2C] mb-2">You&apos;re on the list!</h3>
      <p className="text-[#4A4A4A]">
        We&apos;ll email you when hummingbirds are spotted near {zipCode}.
      </p>
    </div>
  ) : (
    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
      {/* ZIP Code Input */}
      <div className="relative">
        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-[#999999]" />
        <Input
          type="text"
          placeholder="ZIP code"
          maxLength={5}
          pattern="\d{5}"
          value={zipCode}
          onChange={(e) => { setZipCode(e.target.value.replace(/\D/g, '')); if (state === 'error') setState('idle') }}
          className="w-full h-14 bg-white border-0 rounded-full pl-14 pr-6 text-base shadow-sm placeholder:text-[#999999]"
        />
      </div>

      {/* Email Input */}
      <Input
        type="email"
        placeholder="Email address"
        value={email}
        onChange={(e) => { setEmail(e.target.value); if (state === 'error') setState('idle') }}
        className="w-full h-14 bg-white border-0 rounded-full px-6 text-base shadow-sm placeholder:text-[#999999]"
      />

      {/* Error Message */}
      {state === 'error' && errorMsg && (
        <p className="text-red-600 text-sm px-2">{errorMsg}</p>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={state === 'loading'}
        className="w-full h-14 bg-[#1a3a2a] hover:bg-[#143020] text-white font-medium text-base rounded-full disabled:opacity-60"
      >
        {state === 'loading' ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Subscribing...
          </span>
        ) : (
          'Notify me'
        )}
      </Button>

      {/* Privacy notice */}
      <p className="text-xs text-[#999999] mt-3">
        By signing up, you agree to receive migration alerts and occasional product updates from BirdSnap.{' '}
        <button type="button" onClick={() => setPrivacyOpen(true)} className="underline hover:text-[#5B6751]">
          Privacy Policy
        </button>
      </p>
    </form>
  )

  return (
    <section id="subscribe" className="py-0">
      <div style={{ backgroundColor: '#E8E4DF' }}>
        {/* Mobile layout */}
        <div className="flex flex-col lg:hidden px-6 py-10 max-w-7xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-[#1a3a2a] mb-4 leading-tight">
            Know the moment<br />they arrive.
          </h2>
          
          <p className="text-[#2C2C2C] text-base mb-6 leading-relaxed">
            Sign up for migration alerts and we&apos;ll let you know when hummingbirds are spotted near your city so you can have your feeder ready and waiting.
          </p>

          {/* Image */}
          <div className="relative w-full mb-6 rounded-xl overflow-hidden aspect-[16/9]">
            <Image
              src="/images/subscribe.jpg"
              alt="Hummingbird at feeder"
              fill
              className="object-cover"
            />
          </div>

          {formContent}
        </div>

        {/* Desktop layout */}
        <div className="hidden lg:flex relative min-h-[560px] max-w-[1400px] mx-auto">
          {/* Left side - Image (55-60% width) */}
          <div className="relative w-[58%] flex-shrink-0">
            <Image
              src="/images/subscribe.jpg"
              alt="Hummingbird at feeder"
              fill
              className="object-cover"
            />
            {/* Right-side gradient fade */}
            <div
              className="absolute inset-y-0 right-0 w-[40%]"
              style={{
                background: 'linear-gradient(to right, transparent, #E8E4DF)',
              }}
            />
          </div>

          {/* Right side - Form (overlaps gradient area) */}
          <div className="relative flex flex-col justify-center pl-0 pr-12 xl:pr-16 py-16 -ml-[8%]">
            <h2 className="font-serif text-4xl xl:text-5xl font-bold text-[#1a3a2a] mb-6 leading-tight">
              Know the moment<br />they arrive.
            </h2>
            
            <p className="text-[#2C2C2C] text-lg mb-8 max-w-md leading-relaxed">
              Sign up for migration alerts and we&apos;ll let you know when hummingbirds are spotted near your city so you can have your feeder ready and waiting.
            </p>

            <div className="max-w-md">
              {formContent}
            </div>
          </div>
        </div>
      </div>
      <PrivacyDialog open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </section>
  )
}
