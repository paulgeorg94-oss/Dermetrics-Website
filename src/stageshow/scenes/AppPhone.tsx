import { Stage } from '../kit/stage'
import { Phone, Notification } from '../kit/phone'
import { Count } from '../kit/motion/Count'
import { Bar } from '../kit/window'
import type { Act } from '../kit/act'
import type { Strings } from './i18n'
import { SIGNET } from './signet'

// Dermetrics app, overview. Three beats, once in view: the last Haut-Score,
// a new measurement rolls it from 78 to 82 with its change, then the reminder
// for the next check drops in. All values are the site's sample data.
type S = { score: number; delta: boolean; banner: boolean }
const START: S = { score: 78, delta: false, banner: false }
const END: S = { score: 82, delta: true, banner: true }

const script = async (a: Act<S>) => {
  await a.wait(1200)
  a.put({ score: 82 })
  await a.wait(500)
  a.put({ delta: true })
  await a.wait(1600)
  a.put({ banner: true })
  await a.wait(4000)
}

function Signet({ size }: { size: number }) {
  return <img src={SIGNET()} alt="" width={Math.round(size * 0.674)} height={size} className="dmx-signet" />
}

export function AppPhone({ t }: { t: Strings }) {
  return (
    <Stage<S> width={400} height={470} initial={START} poster={END} script={script} play="once" className="dmx dmx-app">
      {(s) => (
        <>
          <div className="dmx-wash" />
          <Phone width={300} className="dmx-phone">
            <div className="dmx-screen">
              <header className="dmx-head">
                <span className="dmx-title">{t.overview}</span>
                <Signet size={30} />
              </header>
              <section className="dmx-score">
                <span className="dmx-kicker">{t.skinScore}</span>
                <span className="dmx-score__row">
                  <span className="dmx-score__value"><Count value={s.score} duration={900} /></span>
                  <span className="dmx-score__max">/100</span>
                  <span className="dmx-delta" data-show={s.delta || undefined}>{t.since}</span>
                </span>
                <span className="dmx-trend">
                  {[38, 46, 42, 54, 50, 62].map((h, i) => (
                    <span key={i} className="dmx-trend__bar" style={{ height: h }} />
                  ))}
                  <span className="dmx-trend__bar dmx-trend__bar--now" data-up={s.delta || undefined} />
                </span>
              </section>
              <section className="dmx-list">
                <div className="dmx-prow">
                  <span>{t.uvToday}</span>
                  <span className="dmx-muted">{t.uvValue}</span>
                </div>
                <div className="dmx-prow">
                  <span>{t.nextAppt}</span>
                  <span className="dmx-muted">{t.nextApptValue}</span>
                </div>
                <div className="dmx-prow">
                  <Bar w={110} h={8} r={4} tone={3} />
                  <Bar w={52} h={8} r={4} tone={2} />
                </div>
                <div className="dmx-prow">
                  <Bar w={84} h={8} r={4} tone={3} />
                  <Bar w={64} h={8} r={4} tone={2} />
                </div>
              </section>
            </div>
            <div className="dmx-banner" data-show={s.banner || undefined}>
              <Notification banner icon={<span className="dmx-appicon"><Signet size={22} /></span>} title="Dermetrics" body={t.reminder} />
            </div>
          </Phone>
        </>
      )}
    </Stage>
  )
}
