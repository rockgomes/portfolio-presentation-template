// Demo A, the Pipedrive panel: before/after toggle, single-select row actions,
// header send button. All strings come from chapter data.

export function mount(el, data) {
  const state = { after: true, pinged: false, acted: null }

  el.innerHTML = `
  <div class="demo-shell">
    <div class="pd__toggles" role="group" aria-label="Panel mode">
      <button class="pd__toggle" data-mode="before" aria-pressed="false">BEFORE · PASSIVE</button>
      <button class="pd__toggle" data-mode="after" aria-pressed="true">AFTER · INTERACTIVE</button>
    </div>
    <div class="pd__panel">
      <div class="pd__head">
        <strong>${data.panelTitle}</strong>
        <button class="pd__send" hidden>${data.sendLabel}</button>
      </div>
      ${data.fields
        .map(
          (f, i) => `
        <div class="pd__row">
          <div>
            <div class="pd__row-k">${f.k}</div>
            <div>${f.v}</div>
          </div>
          <button class="pd__act" data-field="${i}" data-done="false" hidden>ACT</button>
        </div>`
        )
        .join('')}
      <div class="pd__footnote" aria-live="polite"></div>
    </div>
    <div class="demo-caption">${data.caption}</div>
  </div>`

  const toggles = el.querySelectorAll('.pd__toggle')
  const send = el.querySelector('.pd__send')
  const acts = el.querySelectorAll('.pd__act')
  const footnote = el.querySelector('.pd__footnote')

  function update() {
    toggles.forEach((t) =>
      t.setAttribute('aria-pressed', String((t.dataset.mode === 'after') === state.after))
    )
    send.hidden = !state.after
    send.textContent = state.pinged ? data.sentLabel : data.sendLabel
    acts.forEach((a, i) => {
      a.hidden = !state.after
      const done = state.acted === i
      a.dataset.done = String(done)
      a.textContent = done ? 'DONE ✓' : 'ACT'
    })
    footnote.textContent = state.after ? data.footnoteAfter : data.footnoteBefore
  }

  toggles.forEach((t) =>
    t.addEventListener('click', () => {
      const after = t.dataset.mode === 'after'
      state.after = after
      if (!after) {
        state.pinged = false
        state.acted = null
      }
      update()
    })
  )

  send.addEventListener('click', () => {
    state.pinged = true
    update()
  })

  acts.forEach((a, i) =>
    a.addEventListener('click', () => {
      state.acted = i // single-select: acting on a row resets the others
      update()
    })
  )

  update()

  return {
    destroy() {
      el.innerHTML = ''
    },
  }
}
