import { ArrowUpRight, Compass, MapPin, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

import Reveal from '../motion/Reveal'
import Stagger from '../motion/Stagger'
import SectionHeading from '../common/SectionHeading'

import { ROUTES } from '../../config/routes'

function MapSection() {
  return (
    <section className="section-khoj border-t border-[var(--color-border)]">
      <div className="container-khoj">
        <Reveal>
          <SectionHeading
            eyebrow="Khoj Map"
            title="See India differently."
            description="Explore destinations through more than geography. Discover hidden places, local experiences, stories and the signals that help you travel more thoughtfully."
          />
        </Reveal>

        <Reveal delay={0.1} className="mt-14">
          <div className="overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-surface)]">
            <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
              {/* Map Visual */}
              <div className="relative min-h-[460px] overflow-hidden bg-[var(--color-background)]">
                {/* Atmospheric layers */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(218,171,91,0.10),transparent_34%)]" />

                <div className="absolute inset-0 opacity-30">
                  <div className="absolute left-[18%] top-[22%] h-px w-[64%] rotate-[18deg] bg-[var(--color-border-strong)]" />
                  <div className="absolute left-[28%] top-[48%] h-px w-[50%] -rotate-[12deg] bg-[var(--color-border-strong)]" />
                  <div className="absolute left-[35%] top-[68%] h-px w-[38%] rotate-[8deg] bg-[var(--color-border-strong)]" />
                  <div className="absolute left-[45%] top-[15%] h-[70%] w-px rotate-[20deg] bg-[var(--color-border-strong)]" />
                </div>

                {/* India-inspired abstract map silhouette */}
                <div className="absolute left-1/2 top-1/2 h-[330px] w-[240px] -translate-x-1/2 -translate-y-1/2 rotate-[4deg]">
                  <div className="absolute left-[18%] top-[4%] h-[17%] w-[54%] rounded-[45%_55%_35%_40%] border border-[var(--color-border-strong)] bg-[var(--color-surface-elevated)]" />

                  <div className="absolute left-[11%] top-[14%] h-[68%] w-[72%] rotate-[5deg] rounded-[45%_42%_55%_38%] border border-[var(--color-border-strong)] bg-[var(--color-surface-elevated)]" />

                  <div className="absolute left-[34%] top-[65%] h-[30%] w-[32%] rotate-[16deg] rounded-[25%_65%_45%_55%] border border-[var(--color-border-strong)] bg-[var(--color-surface-elevated)]" />
                </div>

                {/* Discovery points */}
                <div className="absolute left-[37%] top-[29%]">
                  <div className="relative">
                    <span className="absolute -inset-2 animate-ping rounded-full bg-[var(--color-gold)]/10" />
                    <MapPin
                      size={20}
                      strokeWidth={1.5}
                      className="relative text-[var(--color-gold-soft)]"
                    />
                  </div>
                </div>

                <div className="absolute left-[58%] top-[42%]">
                  <div className="relative">
                    <span className="absolute -inset-2 rounded-full bg-[var(--color-gold)]/10" />
                    <MapPin
                      size={18}
                      strokeWidth={1.5}
                      className="relative text-[var(--color-gold-soft)]"
                    />
                  </div>
                </div>

                <div className="absolute left-[48%] top-[59%]">
                  <div className="relative">
                    <span className="absolute -inset-2 rounded-full bg-[var(--color-gold)]/10" />
                    <MapPin
                      size={18}
                      strokeWidth={1.5}
                      className="relative text-[var(--color-gold-soft)]"
                    />
                  </div>
                </div>

                <div className="absolute bottom-7 left-7">
                  <div className="flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]/80 px-3 py-2 backdrop-blur-sm">
                    <Compass size={14} strokeWidth={1.5} />
                    <span className="text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                      Explore India
                    </span>
                  </div>
                </div>
              </div>

              {/* Map Information */}
              <div className="flex flex-col justify-between border-t border-[var(--color-border)] p-7 md:p-9 lg:border-l lg:border-t-0">
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-border)]">
                    <Sparkles
                      size={18}
                      strokeWidth={1.5}
                      className="text-[var(--color-gold-soft)]"
                    />
                  </div>

                  <h3 className="mt-7 text-3xl font-medium leading-tight tracking-tight md:text-4xl">
                    A map that helps you discover, not just navigate.
                  </h3>

                  <p className="mt-5 text-sm leading-7 text-[var(--color-text-secondary)]">
                    Khoj brings together destinations, hidden gems, local
                    experiences, stories and tourism intelligence in one
                    evolving view of India.
                  </p>
                </div>

                <Stagger className="mt-10 space-y-3">
                  {[
                    'Hidden places beyond the obvious',
                    'Local experiences and communities',
                    'Tourism pressure and emerging destinations',
                    'Stories that give places meaning',
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 border-t border-[var(--color-border)] pt-3 text-sm text-[var(--color-text-secondary)]"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-gold)]" />
                      {item}
                    </div>
                  ))}
                </Stagger>

                <Link
                  to={ROUTES.map}
                  className="group mt-10 inline-flex items-center gap-3 self-start text-sm text-[var(--color-text-primary)]"
                >
                  <span className="border-b border-[var(--color-text-primary)] pb-1">
                    Explore the Khoj Map
                  </span>

                  <ArrowUpRight
                    size={16}
                    strokeWidth={1.5}
                    className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default MapSection