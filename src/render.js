// Pure template functions. Every overlay section renders only when its data
// exists, so chapters with a different shape (added or substituted projects)
// work without touching this file.

const accentVars = (ch) =>
  `--accent: ${ch.accent}; --accent-text: ${ch.accentText}; --tint: ${ch.tint}; --stripe: ${ch.stripe};`

export function renderCard(ch) {
  const body = `
    <span class="card__top">
      <span class="card__num">[${ch.num}]</span>
      <span class="card__tag">${ch.tag}</span>
    </span>
    <span class="card__still">${
      ch.still
        ? `<img src="${ch.still}" alt="" loading="lazy" decoding="async">`
        : '<span>KEY SCREEN / DEMO STILL</span>'
    }</span>
    <span class="card__title">${ch.title}</span>
    <span class="card__teaser">${ch.teaser}</span>`

  if (ch.pending) {
    return `
  <div class="card card--pending" style="${accentVars(ch)}" aria-disabled="true">
    ${body}
    <span class="card__enter">IN PROGRESS</span>
  </div>`
  }

  return `
  <a class="card" href="#${ch.id}" data-chapter="${ch.id}" style="${accentVars(ch)}">
    ${body}
    <span class="card__enter">ENTER &#8981;</span>
  </a>`
}

const section = (label, inner, opts = {}) => `
  <div class="section${opts.cls ? ' ' + opts.cls : ''}" ${opts.reveal ? 'data-reveal' : ''}>
    <div class="section__label">${label}</div>
    <div ${opts.innerCls ? `class="${opts.innerCls}"` : ''}>${inner}</div>
  </div>`

function renderRoads(ch) {
  if (!ch.roads?.length) return ''
  const cards = ch.roads
    .map((r, i) => {
      const shipped = r.status === 'SHIPPED'
      return `
      <div class="road${shipped ? ' road--shipped' : ''}" style="top: ${80 + i * 24}px; z-index: ${i + 1};">
        <span class="road__status">${r.status}</span>
        <div>
          <h4 class="road__name">${r.name}</h4>
          <p class="road__why">${r.why}</p>
        </div>
        <div class="road__call">CALL:<br><span>${r.call}</span></div>
      </div>`
    })
    .join('')
  return `
  <div class="section section--roads">
    <div class="section__head">
      <div class="section__label">02 / ROADS NOT TAKEN</div>
      <p class="body" data-reveal>${ch.roadsIntro ?? ''}</p>
    </div>
    <div class="roads">${cards}</div>
  </div>`
}

function renderDemoSection(ch) {
  if (!ch.demo) return ''
  return section(
    '03 / THE DECISION, LIVE',
    `<p class="body" data-reveal style="margin-bottom: 32px;">${ch.demoIntro ?? ''}</p>
     <div data-demo-slot></div>`
  )
}

function renderAiNotes(ch) {
  if (!ch.aiNotes?.length) return ''
  const rows = ch.aiNotes
    .map(
      (n) => `
      <div class="ai-note" data-reveal>
        <div class="ai-note__tag">${n.tag}</div>
        <p>${n.text}</p>
      </div>`
    )
    .join('')
  return section("04 / WHERE AI FIT AND DIDN'T", rows, { innerCls: 'ai-notes' })
}

function renderCalls(ch) {
  if (!ch.myCalls?.length && !ch.teamCalls?.length) return ''
  const list = (items, cls) =>
    (items ?? []).map((c) => `<p>${c}</p>`).join('')
  const inner = `
    <div>
      <div class="calls__col-label calls__col-label--mine">MY CALLS</div>
      <div class="calls__list">${list(ch.myCalls)}</div>
    </div>
    <div>
      <div class="calls__col-label calls__col-label--team">TEAM DECISIONS</div>
      <div class="calls__list calls__list--team">${list(ch.teamCalls)}</div>
    </div>`
  return section('05 / MY CALL VS TEAM', inner, { innerCls: 'calls', reveal: true })
}

function renderResults(ch) {
  if (!ch.results?.length && !ch.hindsight) return ''
  const stats = (ch.results ?? [])
    .map(
      (s) => `
      <div class="result">
        <div class="result__n">${s.n}</div>
        <div class="result__label">${s.label}</div>
      </div>`
    )
    .join('')
  const inner = `
    ${stats ? `<div class="results">${stats}</div>` : ''}
    ${ch.hindsight ? `<p class="hindsight">“${ch.hindsight}”</p>` : ''}`
  return section('06 / RESULTS & HINDSIGHT', inner, { reveal: true })
}

export function renderChapter(ch, nextCh) {
  const meta = (ch.meta ?? [])
    .map(
      (m) => `
      <div class="chapter__meta-cell">
        <div class="mono-label">${m.k}</div>
        <div>${m.v}</div>
      </div>`
    )
    .join('')

  const context = ch.contextLead || ch.contextBody
    ? section(
        '01 / CONTEXT & GOAL',
        `${ch.contextLead ? `<p class="lead">${ch.contextLead}</p>` : ''}
         ${ch.contextBody ? `<p class="body">${ch.contextBody}</p>` : ''}`,
        { innerCls: 'context-wrap', reveal: true }
      )
    : ''

  return `
  <div class="chapter__scroll">
    <div class="chapter__content">
      <div class="chapter__bar">
        <span class="chapter__bar-id">[${ch.num}] ${ch.client}</span>
        <div class="chapter__progress"></div>
        <button class="chapter__close" data-close>CLOSE ✕ <span class="esc">ESC</span></button>
      </div>

      <div class="chapter__cover">
        <div class="chapter__wash"></div>
        <div class="chapter__ghost" data-parallax="0.25">${ch.num}</div>
        <div class="chapter__cover-inner">
          <h2 class="chapter__title" data-parallax="0.1">${ch.title}</h2>
          <div class="chapter__meta">${meta}</div>
        </div>
      </div>

      <div class="chapter__body">
        ${context}
        ${renderRoads(ch)}
        ${renderDemoSection(ch)}
        ${renderAiNotes(ch)}
        ${renderCalls(ch)}
        ${renderResults(ch)}
        <div class="chapter__footer">
          <button class="chapter__back" data-close>← BACK TO INDEX</button>
          ${nextCh ? `<button class="chapter__next" data-next="${nextCh.id}">NEXT: [${nextCh.num}] ${nextCh.client} →</button>` : ''}
        </div>
      </div>
    </div>
  </div>`
}

export { accentVars }
