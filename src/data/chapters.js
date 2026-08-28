// Single source of content. One object per chapter: add or substitute a
// project by editing this array only. Sections render only when their data
// exists; demos are looked up in src/demos by `demo.type`.
//
// A chapter with `pending: true` renders as a locked card on the index and
// needs nothing but the card fields. Fill in the rest to make it open.
//
// accent     : large elements only (numerals, rules, borders, big stats)
// accentText : darker variant, safe for small text on white (AA at 11px mono)

export const chapters = [
  {
    id: 'dealfront-ai',
    num: '01',
    client: 'DEALFRONT',
    tag: 'AI / SHIPPED (BETA)',
    still: '/stills/dealfront-ai.png',
    accent: 'oklch(0.55 0.17 300)',
    accentText: 'oklch(0.45 0.16 300)',
    tint: 'oklch(0.55 0.17 300 / 0.1)',
    stripe: 'oklch(0.55 0.17 300 / 0.18)',
    title: 'The model already worked. Nobody had a way to use it.',
    teaser:
      'Question cards instead of an empty chat box. Two rounds, two weeks, both shipped in beta.',
    meta: [
      { k: 'ROLE', v: 'Senior product designer' },
      { k: 'TIMELINE', v: '2 rounds, 2 weeks' },
      { k: 'TEAM', v: 'PM, dev team, CS' },
      { k: 'STATUS', v: 'Shipped, beta' },
    ],
    contextLead:
      'Dealfront already knew which companies visited your website, who worked there, and what they read. Reading it was a research job.',
    contextBody:
      'The Company Profile had two overloaded tabs and a third job with no tab at all. Activity logged every visit and every page, so telling an eight minute session on pricing from a ten second bounce meant reading the whole log by hand. Contacts held hundreds of people, with no column for which one to call. Company research happened in a different browser tab, on Google, and stayed there. The data was all present and all unsorted, and the sorting fell on people hired to sell.',
    roadsIntro:
      'The model, the guardrails and the permission checks were already built and tested elsewhere in the company. The open question was the way in, and the first answer to it was wrong. Round one ran zero to shipped in a week, with research, design and testing side by side, which is the only reason a wrong first design got caught in time. Scroll: the cards stack. Each one says what it was, why it lost, and whose call that was.',
    roads: [
      {
        name: 'One button, one automatic summary',
        why: 'Press Generate, the AI reads the whole activity log, a summary appears, no work for you. Internal users and real users, all booked inside the same week, pushed back on the same thing. It was a fine answer, just not the one they would have asked for. One wants buying signals. The next wants to know who to call.',
        status: 'REJECTED',
        call: 'USERS, SAME WEEK',
      },
      {
        name: 'AI icons on the recommended rows',
        why: 'The AI marked the people it picked, and you hovered the icon to read why. Easy to lose in a table of hundreds, and the reason sat behind a hover, so it never reached keyboard or touch.',
        status: 'REJECTED',
        call: 'MY CALL, ON REACH',
      },
      {
        name: 'Edit a question and run it again',
        why: 'Claude and ChatGPT both do this, and it is the obvious thing to reach for when an answer misses. It needs its own states and its own history, and this was an MVP. Editing a pinned question earned the build, because you reuse a pin many times. A one off you can repeat in one click, so it went to the bottom of the list and stayed there.',
        status: 'CUT FROM MVP',
        call: 'MY CALL, WITH ENG',
      },
      {
        name: 'Question cards, and a switch that filters the table',
        why: 'Questions already written, one click each, with a free field underneath for anyone who wants it. On Contacts the answer names people, and a visible toggle filters the table down to them. Turn it off and everyone comes back.',
        status: 'SHIPPED',
        call: 'MY CALL, PM AGREED',
      },
    ],
    demoIntro:
      'Not a video and not a slideshow. This is the design running, rebuilt from the Figma files and the shipped screens so you can use it instead of reading about it. Ask one of the pinned questions, or type your own, then turn an answer into a filter on the table underneath.',
    demo: {
      type: 'prototype',
      data: {
        title: 'AI IN THE COMPANY PROFILE',
        url: 'https://dealfront-ai-company-profile.netlify.app',
        width: 1400,
        height: 900,
        poster: '/stills/dealfront-ai-prototype.png',
        posterAlt:
          'The Dealfront Company Profile on the Contacts tab, with the AI contact recommendation block open and an answer naming three people',
        runLabel: 'Run the prototype',
        note: 'A guided tour opens on its own. Click outside the prototype, or Close, to come back.',
        caption:
          '↑ NOT THE REAL PRODUCT · A WORKING RECREATION, BUILT FROM THE FIGMA FILES AND THE SHIPPED SCREENS',
      },
    },
    aiNotes: [
      {
        tag: 'THE PROTOTYPE',
        text: 'Section 03 is not a video. It is a working recreation, built with AI from the Figma files and the shipped screens, so the design can be used instead of described.',
      },
      {
        tag: 'THIS PAGE',
        text: 'Designed and built in code, with AI in the loop. The demos are the interactions, not pictures of them.',
      },
      {
        tag: 'WHAT IT DID NOT DO',
        text: 'Decide anything. Every call in the roads above came from interviews and from watching people use the thing. What AI changed is the price of being wrong. The first demo on this page was a from-scratch rebuild of the AI block, and replacing it with the real recreation was cheap enough to just do.',
      },
    ],
    myCalls: [
      'Research, design and testing side by side instead of in sequence. A first draft went in front of people on Tuesday with no text field in it, just enough to test the idea. Interviews ran all week, PMs, CS reps, clients and C-level, and the dev team had it on Friday.',
      'Question cards instead of an empty field, written from what users actually said in the interviews.',
      'A visible toggle over hover icons, because a reason behind a hover never reaches keyboard or touch.',
      'Naming the material under every answer, including when the material is ours. Round one shipped a line saying the AI can make mistakes, so check important info. That hands you the work and no way to do it.',
    ],
    teamCalls: [
      'Joining the company AI house pattern in round two: purple accent, sparkle, lighter surfaces. Three teams were each inventing their own AI language.',
      'AI summary and Filter sharing one slot in the Activity toolbar, so the log stays near the top of the tab.',
    ],
    results: [
      { n: '2 weeks', label: 'Both rounds researched, designed, tested and shipped in beta' },
      { n: 'Pinned', label: 'People saved and reused their questions, the behaviour the whole design was built around' },
      { n: 'Unknown', label: 'Whether the behaviour held over time. I left a few weeks after round two' },
    ],
    hindsight:
      'Round one was wrong, and users said so in the same week we drew it. That is the reason two weeks was enough. The speed came from testing early, not from drawing fast.',
  },

  {
    id: 'dealfront-lists',
    num: '02',
    client: 'DEALFRONT',
    tag: 'PLATFORM / SHIPPED',
    still: '/stills/dealfront-lists.png',
    accent: 'oklch(0.55 0.13 200)',
    accentText: 'oklch(0.42 0.12 200)',
    tint: 'oklch(0.55 0.13 200 / 0.1)',
    stripe: 'oklch(0.55 0.13 200 / 0.18)',
    title: 'They did not want more lists. They wanted more ways to look at one.',
    teaser:
      'Saved filter and column setups layered on a list, so a segment stops being a copy that drifts away from its parent.',
    meta: [
      { k: 'ROLE', v: 'Senior product designer' },
      { k: 'TEAM', v: 'PM, front-end devs' },
      { k: 'STATUS', v: 'Shipped' },
    ],
    contextLead:
      'A dynamic list makes a promise. Set the criteria once and it stays current, updating every hour as new companies match.',
    contextBody:
      'The promise broke one level down. Someone with a MedTech list thinks in smaller groups: the cold ones with a low engagement score, the ones tagged Manufacturing that are ready for a campaign. Making either of those meant building a whole new list that repeated the parent’s criteria and then added its own. Change what MedTech means and the copies do not follow. Each one refreshes on its own schedule, so in time they disagree and nobody can say which is right. The sidebar fills with near identical lists. And lists are not the end of the road at Dealfront: they feed exports, alerts, ad campaigns and LinkedIn audiences, so the drift does not stay in the sidebar.',
    roadsIntro:
      'One question underneath all of it: where does a segment live? Scroll: the cards stack. Each one says what it was, why it lost, and whose call that was.',
    roads: [
      {
        name: 'A new list for every segment',
        why: 'The existing behaviour, and the thing being fixed. Worth stating because it was a real option and people were already living with it. Every segment repeated its parent’s criteria, then drifted away from it on its own refresh.',
        status: 'THE PROBLEM',
        call: 'ALREADY THERE',
      },
      {
        name: 'Views shared across every list',
        why: 'One saved filter, reusable anywhere. It reads as the more powerful idea until you name one. Low engagement only means something next to the list it came from, so sharing a view across lists cuts it loose from the thing that gives it meaning.',
        status: 'REJECTED',
        call: 'MY CALL',
      },
      {
        name: 'A tabbed View options window',
        why: 'Filters and table setup in one surface, a tab each. It kept growing wider every time I drew it. I also tried the controls in the sidebar, in a flyout, in a popup and in a side panel. The window was not the problem. Treating these as two things was.',
        status: 'REJECTED',
        call: 'MY CALL',
      },
      {
        name: 'Views that belong to one list',
        why: 'Saved setups that live inside their own list. The list stays the source of truth and a view just looks at it differently. Filters and columns save together, because together they answer one question: which companies, and what do I see about them.',
        status: 'SHIPPED',
        call: 'MY CALL, TEAM AGREED',
      },
    ],
    demoIntro:
      'The shipped design, running. Filter the list, reorder the columns, save the result as a view, switch between saved views, and change one to watch the modified flag appear.',
    demo: {
      type: 'prototype',
      data: {
        title: 'DYNAMIC LISTS',
        url: 'https://dealfront-dynamic-lists-cd-7c276e015d.netlify.app',
        width: 1400,
        height: 900,
        poster: '/stills/dealfront-lists-prototype.png',
        posterAlt:
          'The MedTech list with the Low engagement view selected, an active filter shown as a removable chip, and the hourly update line in the footer',
        runLabel: 'Run the prototype',
        note: 'A guided tour opens on its own. Click outside the prototype, or Close, to come back.',
        caption:
          '↑ NOT THE REAL PRODUCT · A WORKING RECREATION, BUILT FROM THE FIGMA FILES AND THE SHIPPED SCREENS',
      },
    },
    aiNotes: [
      {
        tag: 'THE PROTOTYPE',
        text: 'Built with AI from the Figma files and the shipped screens, with a few things tightened along the way. A view is awkward to describe and obvious to use, which is the whole argument for putting the real thing on the page.',
      },
      {
        tag: 'NOT IN THE PRODUCT',
        text: 'There is no AI in this one. It touches enrichment data as one filter category among several, and that is the extent of it. The work was structural: where a segment lives, and what it is made of.',
      },
      {
        tag: 'WHAT IT DID NOT DO',
        text: 'Find the reframe. Filters and columns turning out to be one idea rather than two came from watching a window get wider every time I tried to fit both into it. That is something you notice by drawing it badly several times, not by asking for it.',
      },
    ],
    myCalls: [
      'Views scoped to their own list rather than shared across all of them. The narrower option was the right one, because a view cannot outlive the thing it describes.',
      'Filters and columns saved as one object. The save window shows both, each with a count, so what a view is stays visible at the moment you make one.',
      'State that never hides. Applied filters sit under the toolbar as removable chips, a dot marks the filter icon while the window is shut, the view selector flags itself as modified with revert next to it, and Default view always clears back to nothing.',
    ],
    teamCalls: [
      'Views as the shape of the answer. I proposed it, the team agreed, and that set the constraint everything after it had to fit.',
      'Taking views into alerts and workflows. Once a view was a precise thing to point at, notify me when a company enters this view became possible, and the feature outgrew what it was built for.',
    ],
    results: [
      { n: 'One list', label: 'A segment stopped being a copy. A view and its list cannot disagree, because they are the same list seen differently' },
      { n: 'Reused', label: 'Alerts and workflows took views as a target, so the idea travelled past the screen it was designed for' },
      { n: 'Shipped', label: 'The pattern holds on any list, including the ones synced from a CRM and the ones built by hand' },
    ],
    hindsight:
      'The window that kept getting wider was the useful failure. Every attempt to fit filters and columns side by side made the surface grow, and that was the design telling me they were not two things.',
  },

]

export const indexCount = '02 SHIPPED · BOTH PLAYABLE'
