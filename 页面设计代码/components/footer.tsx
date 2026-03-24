'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

function PrivacyPolicyDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
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
            <p className="mt-1">
              Omnisend privacy policy:{' '}
              <a href="https://www.omnisend.com/privacy-policy/" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#5B6751]">
                omnisend.com/privacy-policy
              </a>
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-[#2C2C2C] mb-1">4. Your Rights</h3>
            <p>Unsubscribe anytime via the link in any email. Data removed immediately upon request.</p>
          </div>

          <div>
            <h3 className="font-semibold text-[#2C2C2C] mb-1">5. Contact</h3>
            <p>privacy@birdsnap.com</p>
            <p>
              Site operated by BirdSnap ·{' '}
              <a href="https://birdsnap.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#5B6751]">
                birdsnap.com
              </a>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

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
            </a>{' '}
            Project
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
