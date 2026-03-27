'use client'

import { useState, useEffect } from 'react'
import Link from "next/link"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: "#map", label: "Migration Map" },
    { href: "#species", label: "Species Guide" },
    { href: "#subscribe", label: "Set Alert" },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className={`font-serif text-lg font-bold transition-colors duration-300 ${scrolled ? 'text-[#5B6751]' : 'text-white'}`}>
              HummingbirdWatch
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-all duration-300 hover:underline underline-offset-4 ${
                  scrolled ? 'text-[#5B6751]' : 'text-white/90 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side - By BirdSnap + Mobile Menu Button */}
          <div className="flex items-center gap-4">
            <a
              href="https://birdsnap.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden md:block text-xs transition-colors duration-300 hover:underline ${
                scrolled ? 'text-[#A27F67]' : 'text-white/70 hover:text-white'
              }`}
            >
              By BirdSnap
            </a>
            <button
              className="md:hidden p-1"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? (
                <X className={`h-6 w-6 ${scrolled ? 'text-[#5B6751]' : 'text-white'}`} />
              ) : (
                <Menu className={`h-6 w-6 ${scrolled ? 'text-[#5B6751]' : 'text-white'}`} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white"
        style={{ maxHeight: menuOpen ? '300px' : '0px' }}
      >
        <div className="px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-sm font-medium text-[#5B6751] py-2"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://birdsnap.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-xs text-[#A27F67] py-2 hover:underline"
          >
            By BirdSnap
          </a>
        </div>
      </div>
    </nav>
  )
}
