// Pointer trail over the background grid: grid cells light as the pointer
// passes and decay behind it. The trail is masked to fade out across the hero
// strip (fully visible above its top, gone by its bottom) so it stays a hero
// flourish and never becomes noise behind the reading content below.

const CELL = 80
const PEAK = 0.075 // cell fill alpha at full energy
const EDGE = 0.4 // leading-cell outline alpha
const DECAY = 0.94 // per 60fps frame; scaled by real delta below
const CUTOFF = 0.012

export function initGridTrail({ reduced }) {
  const canvas = document.querySelector('.grid-glow')
  if (!canvas) return

  const fine = window.matchMedia('(pointer: fine)').matches
  if (reduced || !fine) {
    canvas.remove()
    return
  }

  const ctx = canvas.getContext('2d')
  const fadeBand = document.querySelector('.hero__strip')
  const cells = new Map()
  let w = 0
  let h = 0
  let rafId = 0
  let last = 0
  let head = null

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    w = window.innerWidth
    h = window.innerHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }

  // erase progressively across the hero strip; everything below it is cleared
  // (the gradient clamps to its final stop past the band)
  function applyFade() {
    if (!fadeBand) return
    const { top, bottom } = fadeBand.getBoundingClientRect()
    if (bottom <= 0) {
      ctx.clearRect(0, 0, w, h) // strip scrolled past: nothing shows
      return
    }
    if (bottom - top < 1 || top >= h) return

    const from = Math.max(top, 0)
    const g = ctx.createLinearGradient(0, top, 0, bottom)
    g.addColorStop(0, 'rgba(0, 0, 0, 0)')
    g.addColorStop(1, 'rgba(0, 0, 0, 1)')
    ctx.globalCompositeOperation = 'destination-out'
    ctx.fillStyle = g
    ctx.fillRect(0, from, w, h - from)
    ctx.globalCompositeOperation = 'source-over'
  }

  function frame(now) {
    const dt = Math.min(now - last, 100)
    last = now
    const decay = Math.pow(DECAY, dt / 16.667)

    ctx.clearRect(0, 0, w, h)

    // a chapter overlay covers the page: let the trail die rather than idle
    if (document.body.classList.contains('is-locked')) cells.clear()

    for (const [key, c] of cells) {
      c.e *= decay
      if (c.e < CUTOFF) {
        cells.delete(key)
        continue
      }
      ctx.fillStyle = `rgba(13, 17, 23, ${c.e * PEAK})`
      ctx.fillRect(c.x * CELL, c.y * CELL, CELL, CELL)
    }

    if (head && cells.has(head)) {
      const c = cells.get(head)
      ctx.strokeStyle = `rgba(60, 110, 240, ${c.e * EDGE})`
      ctx.lineWidth = 1
      ctx.strokeRect(c.x * CELL + 0.5, c.y * CELL + 0.5, CELL - 1, CELL - 1)
    }

    applyFade()

    rafId = cells.size ? requestAnimationFrame(frame) : 0
  }

  function wake() {
    if (rafId) return
    last = performance.now()
    rafId = requestAnimationFrame(frame)
  }

  window.addEventListener('resize', resize, { passive: true })

  window.addEventListener(
    'pointermove',
    (e) => {
      const x = Math.floor(e.clientX / CELL)
      const y = Math.floor(e.clientY / CELL)
      head = x + ',' + y
      const existing = cells.get(head)
      if (existing) existing.e = 1
      else cells.set(head, { e: 1, x, y })
      wake()
    },
    { passive: true }
  )

  window.addEventListener('pointerleave', () => { head = null }, { passive: true })

  resize()
}
