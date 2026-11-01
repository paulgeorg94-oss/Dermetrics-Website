import { StrictMode, type ComponentType } from 'react'
import { createRoot } from 'react-dom/client'
import { T, type Lang, type Strings } from './scenes/i18n'
import { setSignet } from './scenes/signet'
import { AppPhone } from './scenes/AppPhone'
import './scenes/dermetrics.css'

// Mount points are <div data-stageshow="name" data-signet="assets/logo-dermetrics.svg">.
// Their static content stays as the fallback until the scene replaces it.
const SCENES: Record<string, ComponentType<{ t: Strings }>> = {
  app: AppPhone,
}

const lang: Lang = (document.documentElement.lang || '').toLowerCase().startsWith('en') ? 'en' : 'de'

document.querySelectorAll<HTMLElement>('[data-stageshow]').forEach((el) => {
  const Scene = SCENES[el.dataset.stageshow || '']
  if (!Scene) return
  if (el.dataset.signet) setSignet(el.dataset.signet)
  el.textContent = ''
  // The scenes illustrate text that is already on the page next to them
  el.setAttribute('aria-hidden', 'true')
  el.classList.add('dmx-mounted')
  createRoot(el).render(
    <StrictMode>
      <Scene t={T[lang]} />
    </StrictMode>,
  )
})
