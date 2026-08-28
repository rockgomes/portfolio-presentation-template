// Demo component registry. A chapter opts in with `demo: { type, data }`;
// new demo types register here without touching render or chapter code.

import { mount as pipedrive } from './pipedrive.js'
import { mount as prototype } from './prototype.js'

const registry = { pipedrive, prototype }

export function mountDemo(slot, demo) {
  const mount = registry[demo?.type]
  if (!slot || !mount) return null
  return mount(slot, demo.data)
}
