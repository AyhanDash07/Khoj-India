import { ArrowUpRight, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

import { destinations } from '../../data/destinations'
import Reveal from '../motion/Reveal'
import Stagger from '../motion/Stagger'
import SectionHeading from '../common/SectionHeading'
import Button from '../common/Button'
import Badge from '../common/Badge'
import { ROUTES } from '../../config/routes'

function HiddenIndiaSection() {
  const featuredDestinations = destinations.slice(0, 3)

  return (
    <section
      id="hidden-india"
      className="section-khoj border-b border-[var(--color-border)]"
    >
      <div className="container-khoj">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <Reveal>
            <SectionHeading
              eyebrow="Hidden India"
              title="Go beyond the obvious."
              description="The most memorable journeys aren't always the most visited ones. Khoj helps you discover places where culture, community and quieter landscapes come together."
            />
          </Reveal>

          <Reveal
            delay={0.1}
            className="lg:justify-self-end"
          >
            <div className="max-w-md border-l border-[var(--color-gold)]/40 pl-6">
              <p className="text-sm leading-7 text-[var(--color-text-secondary)]">
                Instead of sending everyone toward the same famous
                destinations, Khoj looks for places that match your intent
                while helping distribute tourism beyond crowded hotspots.
              </p>

              <Link
                to={ROUTES.explore}
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:text-[var(--color-gold-soft)]"
              >
                Explore hidden places
                <ArrowUpRight size={16} strokeWidth={1.6} />
              </Link>
            </div>
          </Reveal>
        </div>

        <Stagger className="mt-14 grid gap-5 md:grid-cols-3">
          {featuredDestinations.map((destination, index) => (
            <Reveal
              key={destination.name}
              delay={index * 0.08}
            >
              <article className="group h-full overflow-hidden rounded-[1.75rem] border border-[var(--color-border)] bg-[var(--color-surface)] transition-transform duration-500 hover:-translate-y-1">
                <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-surface-elevated)]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(218,171,91,0.18),transparent_30%),linear-gradient(145deg,#1a2420_0%,#0d1412_55%,#080c0b_100%)] transition-transform duration-700 group-hover:scale-105" />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="absolute left-5 top-5">
                    <Badge variant="gold">
                      {destination.category}
                    </Badge>
                  </div>

                  <div className="absolute bottom-5 left-5 right-5">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-1.5 text-white/50">
                          <MapPin size={12} strokeWidth={1.5} />
                          <span className="text-[10px] uppercase tracking-[0.16em]">
                            {destination.region}
                          </span>
                        </div>

                        <h3 className="mt-2 text-2xl font-medium tracking-tight text-white">
                          {destination.name}
                        </h3>
                      </div>

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 text-white transition-colors group-hover:border-[var(--color-gold-soft)] group-hover:text-[var(--color-gold-soft)]">
                        <ArrowUpRight
                          size={17}
                          strokeWidth={1.5}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-sm leading-6 text-[var(--color-text-secondary)]">
                    {destination.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-[var(--color-border)] pt-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                        Pressure
                      </p>

                      <p className="mt-1 text-sm font-medium">
                        {destination.pressure ?? 'Unknown'}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                        Khoj Impact
                      </p>

                      <p className="mt-1 text-sm font-medium text-[var(--color-gold-soft)]">
                        {destination.impactScore ?? '—'}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </Stagger>

        <Reveal delay={0.15}>
          <div className="mt-10 flex justify-center">
            <Link to={ROUTES.explore}>
              <Button variant="secondary">
                Discover more of India
                <ArrowUpRight size={16} strokeWidth={1.6} />
              </Button>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default HiddenIndiaSection