import { ArrowUpRight, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

import Badge from '../common/Badge'
import ExperienceCard from '../cards/ExperienceCard'
import Reveal from '../motion/Reveal'
import Stagger from '../motion/Stagger'
import SectionHeading from '../common/SectionHeading'

import { experiences } from '../../data/experiences'
import { ROUTES } from '../../config/routes'

function ExperiencesSection() {
  const featuredExperience = experiences[0]
  const supportingExperiences = experiences.slice(1, 4)

  return (
    <section className="section-khoj border-t border-[var(--color-border)]">
      <div className="container-khoj">
        <Reveal>
          <SectionHeading
            eyebrow="Local Experiences"
            title="Meet the people behind the place."
            description="Go beyond sightseeing. Discover food, craft, traditions and everyday experiences connected to the communities that make each destination unique."
          />
        </Reveal>

        {/* Featured Experience */}
        <Reveal delay={0.1} className="mt-14">
          <Link
            to={ROUTES.experiences}
            className="group block overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-surface)]"
          >
            <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
              <div className="relative min-h-[360px] overflow-hidden bg-[var(--color-background)]">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-gold)]/10 via-transparent to-black/10" />

                <div className="absolute bottom-7 left-7 right-7 flex items-end justify-between gap-6">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                      Featured experience
                    </p>

                    <p className="mt-2 text-2xl font-medium tracking-tight md:text-3xl">
                      {featuredExperience.title}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                    <ArrowUpRight size={18} strokeWidth={1.5} />
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between p-7 md:p-9">
                <div>
                  <Badge variant="gold">
                    {featuredExperience.category}
                  </Badge>

                  <h3 className="mt-6 text-3xl font-medium leading-tight tracking-tight md:text-4xl">
                    Experience a place,
                    <br />
                    don't just see it.
                  </h3>

                  <p className="mt-5 text-sm leading-7 text-[var(--color-text-secondary)]">
                    {featuredExperience.description}
                  </p>
                </div>

                <div className="mt-10 flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
                  <MapPin size={14} strokeWidth={1.5} />
                  {featuredExperience.location}
                </div>
              </div>
            </div>
          </Link>
        </Reveal>

        {/* Supporting Experiences */}
        <Stagger className="mt-6 grid gap-6 md:grid-cols-3">
          {supportingExperiences.map((experience) => (
            <ExperienceCard
              key={experience.title}
              title={experience.title}
              location={experience.location}
              description={experience.description}
              category={experience.category}
              host={experience.host}
              impactScore={experience.impactScore}
            />
          ))}
        </Stagger>

        {/* Section CTA */}
        <Reveal delay={0.12}>
          <div className="mt-10 flex justify-start">
            <Link
              to={ROUTES.experiences}
              className="group inline-flex items-center gap-3 text-sm text-[var(--color-text-primary)]"
            >
              <span className="border-b border-[var(--color-text-primary)] pb-1">
                Explore local experiences
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

export default ExperiencesSection