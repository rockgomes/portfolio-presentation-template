// All choreography lives here: hero intro, smooth scroll, FLIP zoom in/out,
// section reveals, parallax, reading progress. Every effect is gated behind
// prefers-reduced-motion.

import gsap from 'gsap'
import Lenis from 'lenis'

if (import.meta.env.DEV) window.__gsap = gsap

export const prefersReduced = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const EASE_ZOOM = 'expo.inOut'

// ---- smooth scroll (hub) ----

export function initSmoothScroll() {
  if (prefersReduced()) return null
  const lenis = new Lenis({ duration: 1.1 })
  gsap.ticker.add((time) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
  return lenis
}

// ---- staged hero intro ----

export function heroIntro() {
  if (prefersReduced()) return
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  tl.to('[data-hero="chips"] .chip', {
    opacity: 1,
    y: 0,
    duration: 0.5,
    stagger: 0.08,
  })
    .to(
      '[data-hero="line"]',
      { opacity: 1, y: 0, duration: 0.9, ease: 'power4.out', stagger: 0.12 },
      '-=0.25'
    )
    .to('[data-hero="strip"]', { opacity: 1, y: 0, duration: 0.7 }, '-=0.45')
  return tl
}

// ---- chapter overlay zoom ----
//
// The overlay expands as a fully opaque mask from the card's rect while the
// chapter content inside stays pinned at its final viewport position (a
// counter-transform on the scroll container), so nothing reflows mid-flight.
// The chapter title FLIPs from the card title's rect to its cover position.

function setRect(el, r) {
  gsap.set(el, {
    top: r.top,
    left: r.left,
    width: r.width,
    height: r.height,
    right: 'auto',
    bottom: 'auto',
  })
}

const fullRect = () => ({
  top: 0,
  left: 0,
  width: window.innerWidth,
  height: window.innerHeight,
})

const clearZoomProps = (overlay, scroller) => {
  gsap.set(overlay, { clearProps: 'top,left,width,height,right,bottom,opacity,border,borderColor' })
  gsap.set(scroller, { clearProps: 'top,left,width,height,x,y,transform,position' })
}

const TITLE_MORPH_PROPS = 'transform,transformOrigin,opacity,fontSize,lineHeight,letterSpacing,maxWidth'

// style values needed to render the cover title exactly like the card title.
// all values keep px units so GSAP tweens them as lengths (a unitless
// line-height would be read as a multiplier)
const textMorphStyle = (el, maxWidth) => {
  const s = getComputedStyle(el)
  return {
    fontSize: s.fontSize,
    lineHeight: s.lineHeight === 'normal' ? '1.2em' : s.lineHeight,
    letterSpacing: s.letterSpacing === 'normal' ? '0px' : s.letterSpacing,
    maxWidth,
  }
}

const cardTitleStyle = (cardTitle, cR) => textMorphStyle(cardTitle, cR.width)
const coverTitleStyle = (title) =>
  textMorphStyle(title, parseFloat(getComputedStyle(title).maxWidth) || 1050)

export function zoomIn(overlay, fromEl, onDone) {
  const wash = overlay.querySelector('.chapter__wash')
  const scroller = overlay.querySelector('.chapter__scroll')
  overlay.hidden = false

  if (prefersReduced() || !fromEl) {
    setRect(overlay, fullRect())
    if (wash) gsap.set(wash, { opacity: 1 })
    gsap.fromTo(
      overlay,
      { opacity: 0 },
      { opacity: 1, duration: prefersReduced() ? 0.01 : 0.35, onComplete: onDone }
    )
    return
  }

  const r = fromEl.getBoundingClientRect()
  const vw = window.innerWidth
  const vh = window.innerHeight

  // pin the content at its final full-screen position; the overlay is the mask
  gsap.set(scroller, { position: 'absolute', top: 0, left: 0, width: vw, height: vh, x: -r.left, y: -r.top })
  setRect(overlay, r)
  gsap.set(overlay, { opacity: 1 })
  if (wash) gsap.set(wash, { opacity: 0 })

  // the mask itself wears the card's live (hovered) border so the window edge
  // stays visible while it grows, and lets go only on "pass-through"
  const liveStyle = getComputedStyle(fromEl)
  gsap.set(overlay, { border: `1px solid ${liveStyle.borderColor}` })

  // a snapshot of the card rides the mask's top-left corner so the takeover
  // reads continuous (borderless: the mask draws the border now)
  const snapshot = fromEl.cloneNode(true)
  snapshot.style.cssText += `position:absolute;top:0;left:0;width:${r.width}px;height:${r.height}px;margin:0;z-index:30;pointer-events:none;transition:none;transform:none;border:none;box-shadow:${liveStyle.boxShadow};`
  overlay.appendChild(snapshot)
  fromEl.style.visibility = 'hidden'

  // title morph: the cover title starts at the card title's size and wrap
  // width, sitting exactly on its rect, then grows and re-wraps into the
  // cover size while crossfading with the snapshot's title
  const title = overlay.querySelector('.chapter__title')
  const cardTitle = fromEl.querySelector('.card__title')
  const D = 0.72
  const tl = gsap.timeline({
    defaults: { duration: D, ease: EASE_ZOOM },
    onComplete: () => {
      clearZoomProps(overlay, scroller)
      if (title) gsap.set(title, { clearProps: TITLE_MORPH_PROPS })
      onDone?.()
    },
  })
  tl.to(overlay, fullRect(), 0)
    .to(overlay, { borderColor: 'transparent', duration: 0.14, ease: 'power1.out' }, D - 0.16)
    .to(scroller, { x: 0, y: 0 }, 0)
    .to(snapshot, {
      opacity: 0,
      duration: 0.34,
      ease: 'power1.out',
      onComplete: () => snapshot.remove(),
    }, 0.07)
  if (title && cardTitle) {
    const cR = cardTitle.getBoundingClientRect()
    const endStyle = coverTitleStyle(title)
    gsap.set(title, { ...cardTitleStyle(cardTitle, cR), opacity: 0 })
    const tR = title.getBoundingClientRect()
    gsap.set(title, { x: cR.left - tR.left, y: cR.top - tR.top })
    tl.to(title, { x: 0, y: 0, ...endStyle }, 0)
      .to(title, { opacity: 1, duration: 0.22, ease: 'power1.out' }, 0.05)
  }
  // independent, so interactivity unlocks the moment the mask lands
  if (wash) gsap.fromTo(wash, { opacity: 0 }, { opacity: 1, duration: 0.9, ease: 'power2.out', delay: 0.25 })
}

export function zoomOut(overlay, toEl, onDone) {
  const scroller = overlay.querySelector('.chapter__scroll')

  const finish = () => {
    if (toEl) toEl.style.visibility = ''
    overlay.hidden = true
    if (scroller) clearZoomProps(overlay, scroller)
    else gsap.set(overlay, { clearProps: 'all' })
    onDone?.()
  }

  if (prefersReduced() || !toEl || !scroller) {
    gsap.to(overlay, {
      opacity: 0,
      duration: prefersReduced() ? 0.01 : 0.3,
      onComplete: finish,
    })
    return
  }

  // exact reverse of the open: the mask shrinks onto the card while a card
  // snapshot materializes in its corner, and the cover title (when still in
  // view) flies back down into the card title's rect. No global fade: the
  // final frame is pixel-identical to the card, then the real card swaps in.
  const r = toEl.getBoundingClientRect()
  const vw = window.innerWidth
  const vh = window.innerHeight
  const D = 0.6

  gsap.set(scroller, { position: 'absolute', top: 0, left: 0, width: vw, height: vh, x: 0, y: 0 })

  // the shrinking window wears the card's resting border
  gsap.set(overlay, { border: '1px solid #e2e5e9' })

  const snapshot = toEl.cloneNode(true)
  snapshot.style.cssText += `position:absolute;top:0;left:0;width:${r.width}px;height:${r.height}px;margin:0;z-index:30;pointer-events:none;transition:none;transform:none;border:none;box-shadow:none;opacity:0;`
  overlay.appendChild(snapshot)

  const tl = gsap.timeline({ onComplete: finish })
  tl.to(overlay, { top: r.top, left: r.left, width: r.width, height: r.height, duration: D, ease: EASE_ZOOM }, 0)
    .to(scroller, { x: -r.left, y: -r.top, duration: D, ease: EASE_ZOOM }, 0)
    .to(snapshot, { opacity: 1, duration: 0.3, ease: 'power1.in' }, D - 0.32)

  // reverse title morph, only when the cover title is still near the viewport:
  // it shrinks and re-wraps back to the card title's size, landing on its rect.
  // (The scroller counter-translation keeps content viewport-fixed, so targets
  // are computed in plain viewport coordinates.)
  const title = overlay.querySelector('.chapter__title')
  const cardTitle = toEl.querySelector('.card__title')
  if (title && cardTitle) {
    const cur = title.getBoundingClientRect()
    if (cur.bottom > 0 && cur.top < vh) {
      const cR = cardTitle.getBoundingClientRect()
      const startStyle = coverTitleStyle(title)
      const endStyle = cardTitleStyle(cardTitle, cR)
      title.style.transform = 'none' // strip the parallax transform, keep the visual spot via x/y
      const base0 = title.getBoundingClientRect()
      // probe the end-state layout (small title reflows the cover) for an exact landing
      gsap.set(title, endStyle)
      const baseEnd = title.getBoundingClientRect()
      gsap.set(title, startStyle)
      gsap.set(title, { x: cur.left - base0.left, y: cur.top - base0.top })
      tl.to(title, {
        x: cR.left - baseEnd.left,
        y: cR.top - baseEnd.top,
        ...endStyle,
        duration: D,
        ease: EASE_ZOOM,
      }, 0)
        .to(title, { opacity: 0, duration: 0.16, ease: 'power1.in' }, D - 0.18)
    }
  }
}

// ---- overlay smooth scroll ----

export function overlayScroll(scroller) {
  if (prefersReduced()) return null
  const content = scroller.querySelector('.chapter__content')
  const lenis = new Lenis({ wrapper: scroller, content, duration: 1.05 })
  const tick = (time) => lenis.raf(time * 1000)
  gsap.ticker.add(tick)
  lenis._tick = tick
  return lenis
}

export function destroyOverlayScroll(lenis) {
  if (!lenis) return
  gsap.ticker.remove(lenis._tick)
  lenis.destroy()
}

// ---- reveals, parallax, progress (inside overlay) ----

export function wireChapterScroll(scroller) {
  const reduced = prefersReduced()
  const cleanups = []

  // section reveals
  const revealEls = scroller.querySelectorAll('[data-reveal]')
  if (reduced) {
    revealEls.forEach((el) => el.classList.add('is-revealed'))
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('is-revealed')
            io.unobserve(en.target)
          }
        })
      },
      { root: scroller, threshold: 0.1 }
    )
    revealEls.forEach((el) => io.observe(el))
    cleanups.push(() => io.disconnect())
  }

  // parallax + reading progress on one passive listener
  const progress = scroller.querySelector('.chapter__progress')
  const parallaxEls = reduced ? [] : [...scroller.querySelectorAll('[data-parallax]')]
  const factors = parallaxEls.map((el) => parseFloat(el.dataset.parallax))
  let raf = 0

  const onScroll = () => {
    if (raf) return
    raf = requestAnimationFrame(() => {
      raf = 0
      const max = scroller.scrollHeight - scroller.clientHeight
      if (progress && max > 0) {
        progress.style.width = (scroller.scrollTop / max) * 100 + '%'
      }
      parallaxEls.forEach((el, i) => {
        el.style.transform = `translateY(${scroller.scrollTop * factors[i]}px)`
      })
    })
  }

  scroller.addEventListener('scroll', onScroll, { passive: true })
  cleanups.push(() => scroller.removeEventListener('scroll', onScroll))
  onScroll()

  return () => cleanups.forEach((fn) => fn())
}
