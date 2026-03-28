import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'

export const Route = createFileRoute('/')({
  component: ShamanLanding,
})

// ─── Intersection Observer hook for scroll fade-in ───
function useFadeIn() {
  const ref = useRef<HTMLElement | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible')
          observer.unobserve(el)
        }
      },
      { threshold: 0.12 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return ref as React.RefObject<any>
}

// ─── Lightbox ───
function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="lightbox-overlay open"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >
      <div className="relative max-w-3xl w-full mx-4">
        <img
          src={src}
          alt="Gallery full view"
          className="w-full rounded-lg"
          onClick={(e) => e.stopPropagation()}
        />
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white/60 hover:text-white text-3xl leading-none"
          aria-label="Close lightbox"
        >
          ×
        </button>
      </div>
    </div>
  )
}

// ─── Vinyl detail card ───
function VinylCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="vinyl-card bg-white/5 border border-white/10 rounded-xl p-6 text-center">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="font-bold text-gold mb-1">{title}</h3>
      <p className="text-white/60 text-sm">{desc}</p>
    </div>
  )
}

// ─── Audio track row ───
function AudioTrack({ title, src }: { title: string; src: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      <p className="text-gold font-semibold mb-2 text-sm uppercase tracking-widest">{title}</p>
      {/* Native audio with custom CSS inversion for dark theme */}
      <audio controls preload="none" className="w-full">
        <source src={src} type="audio/mpeg" />
        Your browser does not support audio playback.
      </audio>
    </div>
  )
}

// ─── Main Component ───
function ShamanLanding() {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)

  // Hide loader after mount
  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1200)
    return () => clearTimeout(timer)
  }, [])

  // Sticky header on scroll
  useEffect(() => {
    const header = document.getElementById('site-header')
    const onScroll = () => {
      if (!header) return
      header.classList.toggle('scrolled', window.scrollY > 60)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Scroll fade-in for all sections
  useEffect(() => {
    if (!loaded) return
    const els = document.querySelectorAll('.fade-in-on-scroll')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [loaded])

  /* ── Gallery images (placeholders) ── */
  const galleryImages = [
    { src: '/placeholder.png', alt: 'SHAMAN Vinyl Front' },
    { src: '/placeholder.png', alt: 'SHAMAN Vinyl Back' },
    { src: '/placeholder.png', alt: 'Exclusive Artwork Detail' },
    { src: '/placeholder.png', alt: 'Vinyl on Turntable' },
    { src: '/placeholder.png', alt: 'Label Close-up' },
    { src: '/placeholder.png', alt: 'Packaging Detail' },
  ]

  return (
    <>
      {/* ─── Loading Screen ─── */}
      <div className={`loader ${loaded ? 'hidden' : ''}`} aria-hidden={loaded}>
        <div className="text-center">
          <div className="loader-ring mx-auto mb-4" />
          <p className="text-gold text-xs tracking-[0.4em] uppercase">Loading</p>
        </div>
      </div>

      {/* ─── Film grain overlay ─── */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* ─── Sticky Navigation ─── */}
      <header
        id="site-header"
        className="site-header fixed top-0 left-0 right-0 z-50 px-6 py-4"
      >
        <nav className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo / wordmark */}
          <a href="#hero" className="text-gold font-black tracking-widest text-sm uppercase">
            DJ Clairvoyant
          </a>
          {/* Desktop nav */}
          <ul className="hidden md:flex gap-8 text-xs text-white/60 tracking-widest uppercase">
            <li><a href="#experience" className="hover:text-gold transition-colors">Experience</a></li>
            <li><a href="#audio" className="hover:text-gold transition-colors">Listen</a></li>
            <li><a href="#details" className="hover:text-gold transition-colors">Vinyl</a></li>
            <li><a href="#gallery" className="hover:text-gold transition-colors">Gallery</a></li>
            <li><a href="#artist" className="hover:text-gold transition-colors">Artist</a></li>
          </ul>
          {/* CTA */}
          <a
            href="#buy"
            className="bg-gold text-black text-xs font-bold uppercase tracking-widest px-5 py-2 rounded-full hover:bg-amber-400 transition-colors glow-pulse"
          >
            Pre-order
          </a>
        </nav>
      </header>

      <main>
        {/* ══════════════════════════════════════════
            1. HERO SECTION
        ══════════════════════════════════════════ */}
        <section
          id="hero"
          className="hero-bg relative min-h-screen flex items-center justify-center text-center overflow-hidden"
          style={{
            backgroundImage: `
              radial-gradient(ellipse at 50% 60%, rgba(26,77,46,0.35) 0%, transparent 70%),
              linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%),
              url('/placeholder.png')
            `,
          }}
        >
          {/* Dark vignette overlay */}
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.85) 100%)' }}
            aria-hidden="true"
          />

          {/* Green ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 70%, rgba(34,197,94,0.08) 0%, transparent 70%)' }}
            aria-hidden="true"
          />

          <div className="relative z-10 px-6 max-w-3xl mx-auto">
            {/* Label */}
            <p className="text-gold text-xs tracking-[0.5em] uppercase mb-6 fade-in-on-scroll">
              Lucid Visions Label
            </p>

            {/* Title */}
            <h1
              className="text-8xl md:text-[9rem] font-black tracking-tighter leading-none mb-4 fade-in-on-scroll"
              style={{
                fontFamily: "'Inter', sans-serif",
                textShadow: '0 0 80px rgba(201,168,76,0.3), 0 2px 4px rgba(0,0,0,0.8)',
                letterSpacing: '-0.04em',
              }}
            >
              SHAMAN
            </h1>

            {/* Subtitle */}
            <p className="text-white/70 text-lg md:text-xl font-light tracking-[0.2em] mb-10 fade-in-on-scroll">
              A Sonic Ritual by DJ Clairvoyant
            </p>

            {/* CTA */}
            <a
              href="#buy"
              className="inline-block bg-gold text-black font-bold uppercase tracking-widest px-10 py-4 rounded-full text-sm glow-pulse hover:bg-amber-400 transition-colors fade-in-on-scroll"
            >
              Pre-order Vinyl
            </a>

            {/* Scroll indicator */}
            <div className="mt-16 fade-in-on-scroll">
              <div className="w-px h-12 bg-gradient-to-b from-transparent to-gold/60 mx-auto" />
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            2. ABOUT THE EXPERIENCE
        ══════════════════════════════════════════ */}
        <section
          id="experience"
          className="py-28 px-6"
          style={{ background: 'linear-gradient(to bottom, #000 0%, #0a1a0f 50%, #000 100%)' }}
        >
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gold text-xs tracking-[0.5em] uppercase mb-6 fade-in-on-scroll">
              The Experience
            </p>
            <p
              className="text-3xl md:text-4xl font-light leading-relaxed text-white/90 fade-in-on-scroll"
              style={{ letterSpacing: '-0.01em' }}
            >
              SHAMAN is not just a record.
              <br />
              <span className="text-gold font-semibold">It is a ritual.</span>
            </p>
            <p className="mt-8 text-white/50 text-lg leading-loose max-w-2xl mx-auto fade-in-on-scroll">
              Six tracks woven from ancient frequencies and sub-bass ceremony.
              Each groove carved to guide the body into trance — a portal
              between the dancefloor and the unseen. Press play. The spirits answer.
            </p>

            {/* Decorative divider */}
            <div className="flex items-center gap-4 justify-center mt-12 fade-in-on-scroll">
              <div className="h-px flex-1 max-w-24 bg-gradient-to-r from-transparent to-gold/40" />
              <span className="text-gold text-xl">◈</span>
              <div className="h-px flex-1 max-w-24 bg-gradient-to-l from-transparent to-gold/40" />
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            3. AUDIO PREVIEW
        ══════════════════════════════════════════ */}
        <section id="audio" className="py-24 px-6 bg-black">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12 fade-in-on-scroll">
              <p className="text-gold text-xs tracking-[0.5em] uppercase mb-3">Sonic Preview</p>
              <h2 className="text-4xl font-black tracking-tight">Listen</h2>
            </div>

            <div className="space-y-4">
              {/* Replace src values with real audio URLs before launch */}
              <div className="fade-in-on-scroll">
                <AudioTrack title="A1 — Invocation" src="#" />
              </div>
              <div className="fade-in-on-scroll">
                <AudioTrack title="A2 — Serpent Coil" src="#" />
              </div>
              <div className="fade-in-on-scroll">
                <AudioTrack title="B1 — Lucid Descent" src="#" />
              </div>
            </div>

            <p className="text-center text-white/30 text-xs mt-6 fade-in-on-scroll">
              Audio previews — 90 second clips
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            4. VINYL DETAILS
        ══════════════════════════════════════════ */}
        <section
          id="details"
          className="py-24 px-6"
          style={{ background: 'linear-gradient(135deg, #060f08 0%, #0a2e1a 50%, #060f08 100%)' }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14 fade-in-on-scroll">
              <p className="text-gold text-xs tracking-[0.5em] uppercase mb-3">The Object</p>
              <h2 className="text-4xl font-black tracking-tight">Vinyl Details</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="fade-in-on-scroll">
                <VinylCard icon="◉" title="Limited Edition" desc="Only 500 copies pressed worldwide" />
              </div>
              <div className="fade-in-on-scroll">
                <VinylCard icon="⬤" title="180g Pressing" desc="Audiophile-grade heavyweight vinyl" />
              </div>
              <div className="fade-in-on-scroll">
                <VinylCard icon="✦" title="Exclusive Artwork" desc="Original shamanic artwork by Lucid Visions" />
              </div>
              <div className="fade-in-on-scroll">
                <VinylCard icon="◈" title="Gatefold Sleeve" desc="Double-sided inner artwork & liner notes" />
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            5. VISUAL GALLERY
        ══════════════════════════════════════════ */}
        <section id="gallery" className="py-24 px-6 bg-black">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14 fade-in-on-scroll">
              <p className="text-gold text-xs tracking-[0.5em] uppercase mb-3">Visual Archive</p>
              <h2 className="text-4xl font-black tracking-tight">Gallery</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  className="fade-in-on-scroll group relative aspect-square overflow-hidden rounded-lg border border-white/10 hover:border-gold/40 transition-colors cursor-zoom-in"
                  onClick={() => setLightboxSrc(img.src)}
                  aria-label={`Open ${img.alt} in lightbox`}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-gold text-2xl">⊕</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            6. ARTIST SECTION
        ══════════════════════════════════════════ */}
        <section
          id="artist"
          className="py-28 px-6"
          style={{ background: 'linear-gradient(to bottom, #000 0%, #0a1a0f 60%, #000 100%)' }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-14">
              {/* Artist image placeholder */}
              <div className="fade-in-on-scroll flex-shrink-0">
                <div
                  className="w-56 h-56 md:w-72 md:h-72 rounded-full border-2 border-gold/40 overflow-hidden relative"
                  style={{ boxShadow: '0 0 60px rgba(201,168,76,0.12)' }}
                >
                  <img
                    src="/placeholder.png"
                    alt="DJ Clairvoyant"
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  {/* Green tint overlay */}
                  <div
                    className="absolute inset-0"
                    style={{ background: 'radial-gradient(ellipse at 30% 30%, rgba(34,197,94,0.08), transparent 60%)' }}
                    aria-hidden="true"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="fade-in-on-scroll text-center md:text-left">
                <p className="text-gold text-xs tracking-[0.5em] uppercase mb-2">The Artist</p>
                <h2 className="text-5xl font-black tracking-tight mb-2">DJ Clairvoyant</h2>
                <p className="text-gold/60 text-sm tracking-widest uppercase mb-6">Lucid Visions Label</p>
                <p className="text-white/60 leading-relaxed text-lg max-w-lg">
                  Born in the in-between spaces where frequencies meet memory,
                  DJ Clairvoyant navigates the dancefloor as a medicine man navigates the forest.
                  Each set is a ceremony. Each record, a spell cast in wax.
                </p>
                <p className="text-white/40 leading-relaxed mt-4 max-w-lg">
                  SHAMAN marks the debut full-length on Lucid Visions, distilled from
                  years of nocturnal rituals across underground spaces worldwide.
                </p>

                {/* Social placeholder links */}
                <div className="flex gap-4 mt-8 justify-center md:justify-start">
                  {['Soundcloud', 'Instagram', 'Bandcamp'].map((platform) => (
                    <a
                      key={platform}
                      href="#"
                      className="text-xs text-white/40 hover:text-gold uppercase tracking-widest border border-white/10 hover:border-gold/40 px-4 py-2 rounded-full transition-colors"
                    >
                      {platform}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            7. CTA – CONVERSION SECTION
        ══════════════════════════════════════════ */}
        <section
          id="buy"
          className="relative py-32 px-6 text-center overflow-hidden"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(10,46,26,0.7) 0%, #000 70%)',
          }}
        >
          {/* Decorative glow rings */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
            style={{ border: '1px solid rgba(201,168,76,0.08)', transform: 'translate(-50%,-50%) scale(1.6)' }}
            aria-hidden="true"
          />
          <div
            className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full pointer-events-none"
            style={{ border: '1px solid rgba(201,168,76,0.05)', transform: 'translate(-50%,-50%) scale(2.2)' }}
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-2xl mx-auto">
            <p className="fade-in-on-scroll text-gold text-xs tracking-[0.5em] uppercase mb-6">
              Limited Edition
            </p>
            <h2 className="fade-in-on-scroll text-5xl md:text-6xl font-black tracking-tight leading-tight mb-6">
              Own the ritual.
              <br />
              <span className="text-gold">Limited copies</span> available.
            </h2>
            <p className="fade-in-on-scroll text-white/50 text-lg mb-10 leading-relaxed">
              500 pressed. Once they are gone, they are gone.
              <br />
              The ritual does not wait.
            </p>

            <div className="fade-in-on-scroll flex flex-col sm:flex-row gap-4 justify-center">
              {/* Primary CTA */}
              <a
                href="#"
                className="inline-block bg-gold text-black font-bold uppercase tracking-widest px-12 py-5 rounded-full text-base glow-pulse hover:bg-amber-400 transition-colors"
              >
                Buy Now
              </a>
              {/* Secondary */}
              <a
                href="#audio"
                className="inline-block border border-gold/40 text-gold font-semibold uppercase tracking-widest px-10 py-5 rounded-full text-sm hover:bg-gold/10 transition-colors"
              >
                Preview Tracks
              </a>
            </div>

            <p className="fade-in-on-scroll text-white/20 text-xs mt-8 tracking-widest uppercase">
              Free shipping worldwide · Dispatched June 2025
            </p>
          </div>
        </section>
      </main>

      {/* ══════════════════════════════════════════
          8. FOOTER
      ══════════════════════════════════════════ */}
      <footer className="border-t border-white/5 py-12 px-6 bg-black">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Wordmark */}
            <div className="text-center md:text-left">
              <p className="text-gold font-black tracking-widest text-sm uppercase">DJ Clairvoyant</p>
              <p className="text-white/30 text-xs tracking-widest mt-1">Lucid Visions Label</p>
            </div>

            {/* Social links */}
            <ul className="flex gap-6">
              {[
                { label: 'Soundcloud', href: '#' },
                { label: 'Instagram', href: '#' },
                { label: 'Bandcamp', href: '#' },
                { label: 'RA', href: '#' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-white/30 hover:text-gold text-xs tracking-widest uppercase transition-colors"
                    aria-label={label}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-white/20 text-xs tracking-widest">
              © {new Date().getFullYear()} DJ Clairvoyant / Lucid Visions Label. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* ─── Lightbox ─── */}
      {lightboxSrc && (
        <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
      )}
    </>
  )
}
