import './styles/tokens.css'
import './styles/base.css'
import './styles/chapter.css'
import './styles/demos.css'

import { chapters, indexCount } from './data/chapters.js'
import { renderCard, renderChapter, accentVars } from './render.js'
import { mountDemo } from './demos/index.js'
import { initGridTrail } from './grid.js'
import { fitHeroTitle, fontsReady } from './fit-text.js'
import {
  prefersReduced,
  initSmoothScroll,
  heroIntro,
  zoomIn,
  zoomOut,
  overlayScroll,
  destroyOverlayScroll,
  wireChapterScroll,
} from './motion.js'

const reduced = prefersReduced()
if (!reduced) document.documentElement.classList.add('js-anim')

// ---- hub ----

document.querySelector('.index__count').textContent = indexCount
const cardsHost = document.getElementById('chapter-cards')
cardsHost.innerHTML = chapters.map(renderCard).join('')

initGridTrail({ reduced })
initSmoothScroll()

// fit first, then reveal — so the headline never animates through a resize
fitHeroTitle()
fontsReady().then(heroIntro)

// ---- chapter overlay ----

const overlay = document.getElementById('chapter-overlay')

const state = {
  open: null, // chapter id
  demo: null,
  lenis: null,
  unwire: null,
  returnFocus: null,
  animating: false,
}

const openable = chapters.filter((c) => !c.pending)

const cardFor = (id) => cardsHost.querySelector(`[data-chapter="${id}"]`)

function openChapter(id, { animateFrom = cardFor(id), pushHash = true } = {}) {
  if (state.animating || state.open === id) return
  const idx = openable.findIndex((c) => c.id === id)
  if (idx === -1) return
  const ch = openable[idx]
  const next = openable[idx + 1] ?? null

  state.animating = true
  state.open = id
  state.returnFocus = animateFrom ?? cardFor(id)

  overlay.setAttribute('style', accentVars(ch))
  overlay.setAttribute('aria-label', `Case study ${ch.num}: ${ch.client}`)
  overlay.innerHTML = renderChapter(ch, next)

  const scroller = overlay.querySelector('.chapter__scroll')
  scroller.scrollTop = 0
  document.body.classList.add('is-locked')

  zoomIn(overlay, animateFrom, () => {
    state.animating = false
    // wired after the flight so the parallax initial set can't clobber the title morph
    state.unwire = wireChapterScroll(scroller)
    state.lenis = overlayScroll(scroller)
    overlay.querySelector('.chapter__close')?.focus({ preventScroll: true })
  })

  state.demo = mountDemo(overlay.querySelector('[data-demo-slot]'), ch.demo)

  overlay.addEventListener('click', onOverlayClick)
  if (pushHash) history.replaceState(null, '', `#${id}`)
}

function closeChapter({ animate = true, pushHash = true } = {}) {
  if (!state.open || state.animating) return
  state.animating = true

  state.unwire?.()
  state.demo?.destroy()
  destroyOverlayScroll(state.lenis)
  overlay.removeEventListener('click', onOverlayClick)

  const openedCard = cardFor(state.open)
  const target = animate ? openedCard : null
  const toFocus = state.returnFocus

  zoomOut(overlay, target, () => {
    if (openedCard) openedCard.style.visibility = ''
    overlay.innerHTML = ''
    state.animating = false
    toFocus?.focus({ preventScroll: true })
  })

  state.open = null
  state.demo = null
  state.lenis = null
  state.unwire = null
  document.body.classList.remove('is-locked')
  if (pushHash) history.replaceState(null, '', location.pathname)
}

function onOverlayClick(e) {
  const closeBtn = e.target.closest('[data-close]')
  if (closeBtn) {
    closeChapter()
    return
  }
  const nextBtn = e.target.closest('[data-next]')
  if (nextBtn) {
    const nextId = nextBtn.dataset.next
    closeChapter({ animate: false, pushHash: false })
    setTimeout(() => openChapter(nextId, { animateFrom: null }), reduced ? 0 : 400)
  }
}

// card clicks (anchors: intercept, keep hash for shareability)

cardsHost.addEventListener('click', (e) => {
  const card = e.target.closest('[data-chapter]')
  if (!card) return
  e.preventDefault()
  openChapter(card.dataset.chapter, { animateFrom: card })
})

// keyboard: Esc closes, Tab is trapped inside the overlay

window.addEventListener('keydown', (e) => {
  if (!state.open) return
  // a demo has opened its own layer on top; it owns Esc and Tab until it closes
  if (document.querySelector('[data-modal-layer]')) return

  if (e.key === 'Escape') {
    closeChapter()
    return
  }

  if (e.key === 'Tab') {
    const focusables = overlay.querySelectorAll('button, a[href], [tabindex]:not([tabindex="-1"])')
    if (!focusables.length) return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }
})

// deep link: #pipedrive / #dealfront opens directly (no zoom origin)

const isChapterId = (id) => openable.some((c) => c.id === id)

const initial = location.hash.slice(1)
if (isChapterId(initial)) {
  openChapter(initial, { animateFrom: null, pushHash: false })
}

// hash changes while the app is live (back/forward, pasted links)

window.addEventListener('hashchange', () => {
  const id = location.hash.slice(1)
  if (isChapterId(id)) {
    if (state.open === id) return
    if (state.open) {
      closeChapter({ animate: false, pushHash: false })
      setTimeout(() => openChapter(id, { animateFrom: null, pushHash: false }), reduced ? 0 : 400)
    } else {
      openChapter(id, { pushHash: false })
    }
  } else if (state.open) {
    closeChapter({ pushHash: false })
  }
})
