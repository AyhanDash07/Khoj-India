import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import CinematicImage from '../media/CinematicImage'
import MotionButton from '../motion/motionButton'
import Reveal from '../motion/Reveal'
import { ROUTES } from '../../config/routes'

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--color-border)]">
      <div className="container-khoj">
        <div className="grid min-h-[calc(100vh-5rem)] items-center gap-12 py-16 md:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-24">
          {/* Left Content */}
          <div className="max-w-3xl">
            <Reveal>
              <p className="eyebrow-khoj">
                Discover India differently
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="mt-6 max-w-3xl text-5xl font-medium leading-[0.95] tracking-[-0.045em] text-[var(--color-text-primary)] sm:text-6xl md:text-7xl lg:text-[5.5rem]">
                Find the India
                <br />
                others miss.
              </h1>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="body-khoj mt-7 max-w-xl text-base leading-7 md:text-lg md:leading-8">
                Discover hidden places, meaningful experiences and local
                stories through a smarter way to explore India.
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <Link to={ROUTES.plan}>
                  <MotionButton>
                    <span>Plan My Journey</span>
                    <ArrowUpRight size={17} strokeWidth={1.7} />
                  </MotionButton>
                </Link>
              </div>

              <p className="mt-4 max-w-md text-xs leading-5 text-[var(--color-text-muted)]">
                Discover hidden places, local experiences and journeys shaped
                around you.
              </p>
            </Reveal>
          </div>

          {/* Right Visual */}
          <Reveal
            delay={0.18}
            y={30}
            className="relative mx-auto w-full max-w-xl lg:max-w-none"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-surface)]">
              <CinematicImage
                className="absolute inset-0 h-full w-full"
                alt="A cinematic view representing the diverse landscapes and cultural richness of India"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-end justify-between gap-6">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/50">
                      Khoj India
                    </p>

                    <p className="mt-2 max-w-xs text-sm leading-6 text-white/80">
                      The places, people and stories beyond the obvious.
                    </p>
                  </div>

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 text-white">
                    <ArrowUpRight size={18} strokeWidth={1.5} />
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default Hero