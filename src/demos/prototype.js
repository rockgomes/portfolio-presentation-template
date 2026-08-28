// Demo type "prototype": an interactive replica that lives on its own origin.
// Inline it stays a poster, so opening a chapter costs one image and the
// replica's own intro cannot fire while the zoom is still running. Clicking it
// opens a full-viewport layer, which gives the replica its designed size and
// keeps its scrolling from stealing the chapter's.
//
// The frame is cross-origin, so once the pointer is inside it no key we bind
// here can reach it. That is why the layer carries a visible close control and
// marks itself `data-modal-layer`: the chapter's own Esc and Tab handling
// stands down while it is open.

const FLOOR = 0.75 // below this, stop scaling and let the replica lay itself out
const LOAD_TIMEOUT = 15000

// Padding kept around the frame while it is scaled, so there is somewhere
// outside the prototype to click. In fill mode there is no room for it.
const pad = (w) => (w >= 1100 ? 48 : 24)

export function mount(el, data) {
  const W = data.width ?? 1400
  const H = data.height ?? 900

  let layer = null
  let onResize = null
  let loadTimer = null

  el.innerHTML = `
  <div class="proto">
    <button class="proto__poster" type="button" data-run>
      <img src="${data.poster}" alt="${data.posterAlt ?? ''}" loading="lazy" decoding="async">
      <span class="proto__cta">
        <span class="proto__cta-mark" aria-hidden="true"></span>
        <span>${data.runLabel ?? 'Run the prototype'}</span>
      </span>
    </button>
    <p class="proto__caption">${data.caption ?? ''}</p>
  </div>`

  function fit() {
    if (!layer) return
    const stage = layer.querySelector('[data-stage]')
    const frame = layer.querySelector('[data-frame]')
    const { width, height } = stage.getBoundingClientRect()
    const p = pad(width)
    const scale = Math.min(1, (width - p * 2) / W, (height - p * 2) / H)

    if (scale >= FLOOR) {
      frame.style.width = W + 'px'
      frame.style.height = H + 'px'
      frame.style.transform = `translate(-50%, -50%) scale(${scale})`
      layer.classList.add('has-gutter')
    } else {
      // no room for a gutter: the close button is the only way out here
      frame.style.width = '100%'
      frame.style.height = '100%'
      frame.style.transform = 'translate(-50%, -50%)'
      layer.classList.remove('has-gutter')
    }
  }

  function close() {
    if (!layer) return
    clearTimeout(loadTimer)
    window.removeEventListener('resize', onResize)
    layer.remove()
    layer = null
    el.querySelector('[data-run]')?.focus({ preventScroll: true })
  }

  function open() {
    if (layer) return

    layer = document.createElement('div')
    layer.className = 'proto-layer'
    layer.setAttribute('data-modal-layer', '')
    layer.setAttribute('role', 'dialog')
    layer.setAttribute('aria-modal', 'true')
    layer.setAttribute('aria-label', data.title)
    layer.innerHTML = `
      <div class="proto-layer__bar">
        <span class="proto-layer__id">${data.title}</span>
        <span class="proto-layer__note">${data.note ?? ''}</span>
        <a class="proto-layer__open" href="${data.url}" target="_blank" rel="noopener">NEW TAB ↗</a>
        <button class="proto-layer__close" type="button" data-proto-close>CLOSE <span class="proto-layer__x" aria-hidden="true">✕</span></button>
      </div>
      <div class="proto-layer__stage" data-stage>
        <iframe data-frame src="${data.url}" title="${data.title}" loading="eager" allowfullscreen></iframe>
        <span class="proto-layer__hint" aria-hidden="true">Click anywhere outside to close</span>
        <p class="proto-layer__fallback" data-fallback hidden>
          The prototype is taking longer than usual to load.
          <a href="${data.url}" target="_blank" rel="noopener">Open it in a new tab ↗</a>
        </p>
      </div>`

    document.body.appendChild(layer)

    const frame = layer.querySelector('[data-frame]')
    const fallback = layer.querySelector('[data-fallback]')
    loadTimer = setTimeout(() => { fallback.hidden = false }, LOAD_TIMEOUT)
    frame.addEventListener('load', () => {
      clearTimeout(loadTimer)
      fallback.hidden = true
    })

    layer.addEventListener('click', (e) => {
      if (e.target.closest('[data-proto-close]')) {
        close()
        return
      }
      // the gutter around the frame: anything inside the frame is cross-origin
      // and never reaches us, so this only fires on a real click outside
      if (e.target.hasAttribute('data-stage')) close()
    })

    // Only reaches us while focus is still outside the frame. Once the user
    // clicks into the prototype the keydown goes to its own document, which is
    // cross-origin, so Close and the gutter are what actually get them out.
    layer.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        close()
        return
      }
      if (e.key !== 'Tab') return
      const f = layer.querySelectorAll('a[href], button')
      if (!f.length) return
      const first = f[0]
      const last = f[f.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    })

    onResize = fit
    window.addEventListener('resize', onResize, { passive: true })
    fit()
    layer.querySelector('[data-proto-close]').focus({ preventScroll: true })
  }

  el.addEventListener('click', (e) => {
    if (e.target.closest('[data-run]')) open()
  })

  return {
    destroy() {
      close()
      el.innerHTML = ''
    },
  }
}
