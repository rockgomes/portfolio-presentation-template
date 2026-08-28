// Fit the hero headline to its container: the widest line spans exactly the
// content width, so the headline is flush with the strip below at every
// viewport instead of drifting short (or overhanging it on wide screens).
//
// CSS keeps a clamp() fallback; this only ever tightens it to an exact fit.

const REF = 100 // measurement font-size; ratios scale linearly from here

export function fitHeroTitle() {
  const title = document.querySelector('.hero__title')
  const inner = document.querySelector('.hero__inner')
  const lines = title ? [...title.querySelectorAll('.hero__line-inner')] : []
  if (!title || !inner || !lines.length) return

  let lastWidth = 0

  const measure = () => {
    const available = inner.clientWidth
    if (!available) return
    lastWidth = available

    title.style.setProperty('--hero-size', REF + 'px')
    const widest = Math.max(...lines.map((l) => l.getBoundingClientRect().width))
    if (!widest) {
      title.style.removeProperty('--hero-size')
      return
    }

    title.style.setProperty('--hero-size', ((available / widest) * REF).toFixed(2) + 'px')
  }

  measure()

  // re-fit once the real faces land (fallback metrics differ)
  document.fonts?.ready.then(measure)

  // width-only guard: the height changes as a result of our own fit
  const ro = new ResizeObserver(() => {
    if (inner.clientWidth !== lastWidth) measure()
  })
  ro.observe(inner)
}

// resolves when webfonts are ready, or after `cap` ms, so the hero intro
// never animates through a font swap on a fast connection and never stalls
// on a slow one
export function fontsReady(cap = 800) {
  const ready = document.fonts?.ready ?? Promise.resolve()
  return Promise.race([ready, new Promise((r) => setTimeout(r, cap))])
}
