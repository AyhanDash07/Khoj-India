import { ArrowUpRight, Leaf, Users, HeartHandshake } from 'lucide-react'
import { Link } from 'react-router-dom'

import Reveal from '../motion/Reveal'
import Stagger from '../motion/Stagger'
import SectionHeading from '../common/SectionHeading'

import { ROUTES } from '../../config/routes'

function ImpactSection() {
  const impactPoints = [
    {
      icon: Users,
      title: 'Support local communities',
      description:
        'Discover experiences, businesses and people whose work is connected to the places you visit.',
    },
    {
      icon: HeartHandshake,
      title: 'Keep culture alive',
      description:
        'Choose experiences that help preserve local traditions, stories, food and craftsmanship.',
    },
    {
      icon: Leaf,
      title: 'Travel more thoughtfully',
      description:
        'Understand how your choices can contribute to more responsible and balanced tourism.',
    },
  ]

  return (
    <section className="section-khoj border-t border-[var(--color-border)]">
      <div className="container-khoj">
        <Reveal>
          <SectionHeading
            eyebrow="Responsible Travel"
            title="Travel should leave something good behind."
            description="Khoj helps you understand the people, communities and places your journey can support."
          />
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Impact Score */}
          <Reveal>
            <div className="relative flex h-full min-h-[430px] flex-col justify-between overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-7 md:p-9">
              <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-[var(--color-gold)]/5 blur-3xl" />

              <div className="relative">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                  Khoj Impact
                </p>

                <div className="mt-10 flex items-end gap-3">
                  <span className="text-7xl font-medium tracking-[-0.06em]">
                    91
                  </span>

                  <span className="mb-3 text-sm text-[var(--color-text-muted)]">
                    / 100
                  </span>
                </div>

                <p className="mt-3 text-sm uppercase tracking-[0.16em] text-[var(--color-gold-soft)]">
                  High local impact
                </p>

                <p className="mt-6 max-w-sm text-sm leading-7 text-[var(--color-text-secondary)]">
                  A transparent way to understand how strongly an experience
                  connects with local communities, culture and responsible
                  tourism practices.
                </p>
              </div>

              <div className="relative mt-10">
                <div className="h-px w-full bg-[var(--color-border)]" />

                <div className="mt-5 flex items-center justify-between text-xs text-[var(--color-text-muted)]">
                  <span>Local ownership</span>
                  <span>Community participation</span>
                </div>

                <div className="mt-4 h-1 overflow-hidden rounded-full bg-[var(--color-border)]">
                  <div className="h-full w-[91%] rounded-full bg-[var(--color-gold)]" />
                </div>
              </div>
            </div>
          </Reveal>

          {/* Impact Principles */}
          <Stagger className="grid gap-4">
            {impactPoints.map((point) => {
              const Icon = point.icon

              return (
                <div
                  key={point.title}
                  className="group flex flex-col justify-between rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-surface)] p-7 transition-transform duration-300 hover:-translate-y-1 md:p-8"
                >
                  <div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-border)]">
                      <Icon
                        size={18}
                        strokeWidth={1.5}
                        className="text-[var(--color-gold-soft)]"
                      />
                    </div>

                    <h3 className="mt-6 text-2xl font-medium tracking-tight">
                      {point.title}
                    </h3>

                    <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--color-text-secondary)]">
                      {point.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </Stagger>
        </div>

        <Reveal delay={0.12}>
          <div className="mt-10">
            <Link
              to={ROUTES.explore}
              className="group inline-flex items-center gap-3 text-sm text-[var(--color-text-primary)]"
            >
              <span className="border-b border-[var(--color-text-primary)] pb-1">
                Discover responsible journeys
              </span>

              <ArrowUpRight
                size={16}
                strokeWidth={1.5}
                className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default ImpactSection