import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import StoryCard from '../cards/StoryCard'
import Reveal from '../motion/Reveal'
import Stagger from '../motion/Stagger'
import SectionHeading from '../common/SectionHeading'

import { stories } from '../../data/stories'
import { ROUTES } from '../../config/routes'

function StoriesSection() {
  const featuredStory = stories[0]
  const supportingStories = stories.slice(1, 4)

  return (
    <section className="section-khoj border-t border-[var(--color-border)]">
      <div className="container-khoj">
        <Reveal>
          <SectionHeading
            eyebrow="Khoj Stories"
            title="Every place has a story."
            description="Discover the people, traditions, food and histories that give India's places their identity."
          />
        </Reveal>

        {/* Featured Story */}
        <Reveal delay={0.1} className="mt-14">
          <Link
            to={ROUTES.stories}
            className="group block overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-surface)]"
          >
            <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
              {/* Visual */}
              <div className="relative min-h-[380px] overflow-hidden bg-[var(--color-surface-elevated)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_25%,rgba(218,171,91,0.18),transparent_30%),linear-gradient(135deg,#1b2521_0%,#111916_52%,#090d0c_100%)]" />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                <div className="absolute left-7 top-7">
                  <span className="rounded-full border border-white/15 bg-black/20 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-white/70 backdrop-blur-sm">
                    {featuredStory.category}
                  </span>
                </div>

                <div className="absolute bottom-7 left-7 right-7">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/50">
                    Featured story
                  </p>

                  <h3 className="mt-3 max-w-xl text-3xl font-medium leading-tight tracking-tight text-white md:text-5xl">
                    {featuredStory.title}
                  </h3>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col justify-between p-7 md:p-9">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                    {featuredStory.location}
                  </p>

                  <h3 className="mt-6 max-w-md text-3xl font-medium leading-tight tracking-tight md:text-4xl">
                    Places become meaningful when you understand the people behind them.
                  </h3>

                  <p className="mt-5 max-w-md text-sm leading-7 text-[var(--color-text-secondary)]">
                    {featuredStory.description}
                  </p>
                </div>

                <div className="mt-10 flex items-center justify-between gap-5 border-t border-[var(--color-border)] pt-5">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                      Written by
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      {featuredStory.author}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                    <ArrowUpRight size={18} strokeWidth={1.5} />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </Reveal>

        {/* Supporting Stories */}
        <Stagger className="mt-6 grid gap-6 md:grid-cols-3">
          {supportingStories.map((story) => (
            <StoryCard
              key={story.title}
              title={story.title}
              location={story.location}
              description={story.description}
              category={story.category}
              author={story.author}
            />
          ))}
        </Stagger>

        {/* CTA */}
        <Reveal delay={0.12}>
          <div className="mt-10 flex justify-start">
            <Link
              to={ROUTES.stories}
              className="group inline-flex items-center gap-3 text-sm text-[var(--color-text-primary)]"
            >
              <span className="border-b border-[var(--color-text-primary)] pb-1">
                Explore Khoj Stories
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

export default StoriesSection