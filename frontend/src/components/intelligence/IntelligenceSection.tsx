import { ArrowUpRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Reveal from "../motion/Reveal";
import Stagger from "../motion/Stagger";
import { itemVariants } from "../motion/motionVariants";

function IntelligenceSection() {
  return (
    <section
      id="explore"
      className="section-khoj border-t border-[var(--color-border)]"
    >
      <div className="container-khoj">
        {/* Section introduction */}
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <Reveal>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-gold-soft)]">
                01 — Khoj Intelligence
              </p>

              <p className="mt-5 max-w-sm text-sm leading-6 text-[var(--color-text-muted)]">
                A different way to discover India.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div>
              <h2 className="max-w-4xl text-4xl font-semibold leading-[1.05] tracking-[-0.035em] md:text-6xl">
                Travel doesn't begin with a destination.
                <span className="block text-[var(--color-gold-soft)]">
                  It begins with a feeling.
                </span>
              </h2>

              <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--color-text-secondary)] md:text-lg">
                Tell Khoj what you want from your journey. We connect your
                intent with places, experiences, people, seasonality, safety,
                accessibility and local impact.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Intelligence interface */}
        <Reveal delay={0.15}>
          <div className="mt-16 overflow-hidden rounded-[1.75rem] border border-[var(--color-border)] bg-[var(--color-surface)]">
            {/* Interface header */}
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4 md:px-7">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--color-border)]">
                  <Sparkles
                    size={15}
                    strokeWidth={1.5}
                    className="text-[var(--color-gold-soft)]"
                  />
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.16em]">
                    Khoj Intelligence
                  </p>

                  <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
                    Discovery engine
                  </p>
                </div>
              </div>

              <span className="hidden text-xs text-[var(--color-text-muted)] sm:block">
                Intelligent discovery
              </span>
            </div>

            {/* Interface body */}
            <div className="grid lg:grid-cols-[1.25fr_0.75fr]">
              {/* Prompt area */}
              <div className="border-b border-[var(--color-border)] p-6 md:p-10 lg:border-b-0 lg:border-r">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                  Tell Khoj what you're looking for
                </p>

                <div className="mt-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-5 md:p-7">
                  <p className="text-xl leading-8 text-[var(--color-text-primary)] md:text-2xl">
                    I want somewhere peaceful, surrounded by nature, with
                    interesting local food and culture.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-2">
                    <span className="rounded-full border border-[var(--color-border)] px-3 py-1.5 text-xs text-[var(--color-text-secondary)]">
                      Nature
                    </span>

                    <span className="rounded-full border border-[var(--color-border)] px-3 py-1.5 text-xs text-[var(--color-text-secondary)]">
                      Food
                    </span>

                    <span className="rounded-full border border-[var(--color-border)] px-3 py-1.5 text-xs text-[var(--color-text-secondary)]">
                      Culture
                    </span>

                    <span className="rounded-full border border-[var(--color-border)] px-3 py-1.5 text-xs text-[var(--color-text-secondary)]">
                      Peaceful
                    </span>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <motion.button
                      type="button"
                      className="btn-khoj btn-khoj-primary"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{
                        duration: 0.18,
                        ease: "easeOut",
                      }}
                    >
                      Ask Khoj
                      <ArrowUpRight size={17} strokeWidth={1.7} />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Intelligence logic */}
              <div className="p-6 md:p-10">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                  Khoj understands
                </p>

                <Stagger className="mt-7 space-y-3">
                  <motion.div
                    variants={itemVariants}
                    className="flex items-center justify-between border-b border-[var(--color-border)] pb-4"
                  >
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      Your intent
                    </span>

                    <span className="text-xs text-[var(--color-gold-soft)]">
                      understood
                    </span>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="flex items-center justify-between border-b border-[var(--color-border)] pb-4"
                  >
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      Destinations
                    </span>

                    <span className="text-xs text-[var(--color-text-muted)]">
                      matching
                    </span>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="flex items-center justify-between border-b border-[var(--color-border)] pb-4"
                  >
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      Experiences
                    </span>

                    <span className="text-xs text-[var(--color-text-muted)]">
                      exploring
                    </span>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="flex items-center justify-between border-b border-[var(--color-border)] pb-4"
                  >
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      Context
                    </span>

                    <span className="text-xs text-[var(--color-text-muted)]">
                      considering
                    </span>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="flex items-center justify-between pt-2"
                  >
                    <span className="text-sm font-medium">Your journey</span>

                    <span className="text-xs font-medium text-[var(--color-gold-soft)]">
                      ready
                    </span>
                  </motion.div>
                </Stagger>

                <div className="mt-10 border-t border-[var(--color-border)] pt-6">
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                    Why this matters
                  </p>

                  <p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">
                    Khoj doesn't simply return popular destinations. It
                    considers the context behind your journey.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Bottom statement */}
        <Reveal delay={0.2}>
          <div className="mt-10 flex flex-col gap-5 border-t border-[var(--color-border)] pt-7 md:flex-row md:items-center md:justify-between">
            <p className="max-w-xl text-sm leading-6 text-[var(--color-text-muted)]">
              From what you want to feel to where you should actually go — Khoj
              connects the two.
            </p>

            <button
              type="button"
              className="self-start text-sm font-medium text-[var(--color-gold-soft)] transition-colors hover:text-[var(--color-gold)]"
            >
              Discover how Khoj works →
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default IntelligenceSection;
