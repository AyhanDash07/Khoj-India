import { motion } from "framer-motion";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Compass,
  ExternalLink,
  MapPin,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import type { DestinationDetail as DestinationDetailData } from "../../services/destinationService";

interface DestinationDetailProps {
  data: DestinationDetailData;
  onBack: () => void;
}

function formatScore(score: number | null) {
  if (score === null) return "—";
  return `${Math.round(score)}`;
}

function formatMonth(month: number) {
  return new Date(2024, month - 1, 1).toLocaleString("en-US", {
    month: "short",
  });
}

function getSafetyLabel(level: string | null) {
  switch (level) {
    case "low_risk":
      return "Low risk";
    case "moderate_risk":
      return "Use caution";
    case "high_risk":
      return "High risk";
    default:
      return "Not available";
  }
}

function getPressureLabel(level: string | null) {
  switch (level) {
    case "low":
      return "Low pressure";
    case "moderate":
      return "Moderate pressure";
    case "high":
      return "High pressure";
    case "critical":
      return "Critical pressure";
    default:
      return "Not available";
  }
}

function getSuitabilityLabel(score: number | null) {
  if (score === null) return "Not available";
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Good";
  if (score >= 50) return "Mixed";
  return "Challenging";
}

function hasContent(value: string | null | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function DestinationDetail({ data, onBack }: DestinationDetailProps) {
  const {
    destination,
    hero_media: heroMedia,
    story,
    intelligence,
    experiences,
  } = data;

  const stateName = destination.states?.name ?? "India";

  const stateCode = destination.states?.code ?? "";

  const heroImage =
    heroMedia?.media_url ??
    "https://images.unsplash.com/photo-1524492412937-b28074a5d7da";

  const bestMonths = intelligence.seasonality
    .filter(
      (season) =>
        season.suitability_score !== null && season.suitability_score >= 75,
    )
    .map((season) => formatMonth(season.month));

  const bestSeasonScore =
    intelligence.seasonality.length > 0
      ? Math.max(
          ...intelligence.seasonality.map(
            (season) => season.suitability_score ?? 0,
          ),
        )
      : null;

  return (
    <main className="min-h-screen bg-[#090D0B] text-[#F8F1E5]">
      {/* -------------------------------------------------- */}
      {/* HERO */}
      {/* -------------------------------------------------- */}

      <section className="relative min-h-[82vh] overflow-hidden">
        <img
          src={heroImage}
          alt={heroMedia?.alt_text ?? destination.name}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#090D0B] via-[#090D0B]/55 to-black/10" />

        <div className="absolute inset-0 bg-gradient-to-r from-[#090D0B]/75 via-[#090D0B]/20 to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[82vh] max-w-7xl flex-col justify-between px-6 py-8 lg:px-10">
          <motion.button
            type="button"
            onClick={onBack}
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.97 }}
            className="flex w-fit items-center gap-2 text-sm text-[#F8F1E5]/75 transition hover:text-[#F8F1E5]"
          >
            <ArrowLeft size={18} />
            Back to discoveries
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="max-w-4xl pb-8"
          >
            <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-[#F8F1E5]/75">
              <span className="flex items-center gap-1.5">
                <MapPin size={15} />

                {stateName}

                {stateCode && ` · ${stateCode}`}
              </span>

              <span className="h-1 w-1 rounded-full bg-[#FF9933]" />

              <span className="capitalize">
                {destination.destination_type ?? "Destination"}
              </span>

              {destination.verified && (
                <>
                  <span className="h-1 w-1 rounded-full bg-[#FF9933]" />

                  <span className="flex items-center gap-1.5">
                    <ShieldCheck size={15} />
                    Verified
                  </span>
                </>
              )}
            </div>

            <h1 className="max-w-4xl font-serif text-5xl leading-[0.92] tracking-tight sm:text-7xl lg:text-8xl">
              {destination.name}
            </h1>

            {destination.short_description && (
              <p className="mt-7 max-w-2xl text-base leading-7 text-[#F8F1E5]/75 sm:text-lg">
                {destination.short_description}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* ABOUT THIS PLACE */}
      {/* -------------------------------------------------- */}

      <section className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-40">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{ duration: 0.7 }}
          className="grid gap-16 lg:grid-cols-[0.7fr_1.3fr]"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[#FF9933]">
              About this place
            </p>

            <h2 className="mt-5 max-w-md font-serif text-4xl leading-[1.05] sm:text-5xl">
              A place worth
              <br />
              understanding.
            </h2>
          </div>

          <div className="max-w-3xl">
            <p className="text-xl leading-9 text-[#F8F1E5]/80 sm:text-2xl sm:leading-10">
              {story?.origin_story ??
                destination.description ??
                destination.short_description ??
                "A destination waiting to be discovered."}
            </p>

            <div className="mt-14 grid gap-8 border-t border-[#F8F1E5]/10 pt-8 sm:grid-cols-3">
              <EditorialFact label="Location" value={stateName} />

              <EditorialFact
                label="Type"
                value={destination.destination_type ?? "Destination"}
              />

              <EditorialFact
                label="Status"
                value={
                  destination.verified ? "Verified" : "Community discovery"
                }
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* -------------------------------------------------- */}
      {/* WHY THIS PLACE */}
      {/* -------------------------------------------------- */}

      <section className="border-y border-[#F8F1E5]/8 bg-[#0D120F]">
        <div className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-36">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{ duration: 0.7 }}
            className="grid gap-14 lg:grid-cols-[0.75fr_1.25fr]"
          >
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[#FF9933]">
                Why this place
              </p>

              <h2 className="mt-5 max-w-lg font-serif text-4xl leading-[1.05] sm:text-5xl">
                Go beyond
                <br />
                the destination.
              </h2>
            </div>

            <div className="max-w-3xl">
              <p className="text-base leading-8 text-[#F8F1E5]/65 sm:text-lg">
                Khoj looks beyond popularity when surfacing a destination. Its
                character, travel conditions, tourism pressure, safety and
                potential impact all help shape the discovery.
              </p>

              <div className="mt-12 flex flex-wrap gap-x-8 gap-y-5 border-t border-[#F8F1E5]/10 pt-8">
                <ContextSignal
                  icon={<Sparkles size={16} />}
                  label="Destination character"
                />

                <ContextSignal
                  icon={<TrendingUp size={16} />}
                  label="Tourism pressure"
                />

                <ContextSignal
                  icon={<ShieldCheck size={16} />}
                  label="Travel safety"
                />

                <ContextSignal
                  icon={<Compass size={16} />}
                  label="Travel conditions"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

            {/* -------------------------------------------------- */}
      {/* DESTINATION STORY */}
      {/* -------------------------------------------------- */}

      {(() => {
        const storyBlocks = [
          hasContent(story?.what_makes_it_special)
            ? {
                key: "special",
                eyebrow: "What makes it special",
                title: "More than\na place to see.",
                content: story!.what_makes_it_special!,
                size: "large",
              }
            : null,

          !hasContent(story?.what_makes_it_special) &&
          hasContent(story?.origin_story)
            ? {
                key: "origin",
                eyebrow: "Origin & history",
                title: "How the place\ncame to be.",
                content: story!.origin_story!,
                size: "large",
              }
            : null,

          hasContent(story?.cultural_significance)
            ? {
                key: "culture",
                eyebrow: "Culture & heritage",
                title: "Stories that\nshaped the place.",
                content: story!.cultural_significance!,
                size: "normal",
              }
            : null,

          hasContent(story?.ecological_story)
            ? {
                key: "ecology",
                eyebrow: "The living landscape",
                title: "Nature is\npart of the story.",
                content: story!.ecological_story!,
                size: "normal",
              }
            : null,
        ].filter(
          (
            block,
          ): block is {
            key: string;
            eyebrow: string;
            title: string;
            content: string;
            size: string;
          } => block !== null,
        );

        if (storyBlocks.length === 0) return null;

        return (
          <section className="border-y border-[#F8F1E5]/8 bg-[#090D0B]">
            <div className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-40">
              {storyBlocks.map((block, index) => (
                <motion.div
                  key={block.key}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  transition={{
                    duration: 0.7,
                    delay: Math.min(index * 0.05, 0.15),
                  }}
                  className={
                    index === 0
                      ? "grid gap-14 lg:grid-cols-[0.7fr_1.3fr]"
                      : "mt-28 grid gap-14 border-t border-[#F8F1E5]/10 pt-28 lg:grid-cols-[0.7fr_1.3fr]"
                  }
                >
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-[#FF9933]">
                      {block.eyebrow}
                    </p>

                    <h2 className="mt-5 max-w-md font-serif text-4xl leading-[1.05] sm:text-5xl">
                      {block.title.split("\n").map((line, i) => (
                        <span key={i}>
                          {i > 0 && <br />}
                          {line}
                        </span>
                      ))}
                    </h2>
                  </div>

                  <div className="max-w-3xl">
                    <p
                      className={
                        block.size === "large"
                          ? "text-xl leading-9 text-[#F8F1E5]/80 sm:text-2xl sm:leading-10"
                          : "text-lg leading-8 text-[#F8F1E5]/70 sm:text-xl sm:leading-9"
                      }
                    >
                      {block.content}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        );
      })()}
      
      {/* -------------------------------------------------- */}
      {/* KHOJ INTELLIGENCE */}
      {/* -------------------------------------------------- */}

      {(() => {
        const hasImpactScore = intelligence.impact?.impact_score !== null && intelligence.impact?.impact_score !== undefined;
        const hasPressure = Boolean(intelligence.pressure?.pressure_level);
        const hasSafety = Boolean(intelligence.safety?.safety_level);
        const hasBestTime = bestMonths.length > 0;

        if (!hasImpactScore && !hasPressure && !hasSafety && !hasBestTime) {
          return null;
        }

        return (
          <section className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-40">
            <div className="mb-14 max-w-2xl">
              <p className="mb-4 text-xs uppercase tracking-[0.28em] text-[#FF9933]">
                Khoj intelligence
              </p>

              <h2 className="font-serif text-4xl leading-tight sm:text-5xl">
                A quick read
                <br />
                before you go.
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-[#F8F1E5]/50">
                Contextual signals to put this destination into perspective.
              </p>
            </div>

            <div className="grid gap-px overflow-hidden border border-[#F8F1E5]/10 bg-[#F8F1E5]/10 md:grid-cols-2 lg:grid-cols-4">
              {hasImpactScore && (
                <IntelligenceMetric
                  label="Impact"
                  value={formatScore(intelligence.impact!.impact_score)}
                  suffix="/100"
                  icon={<Sparkles size={18} />}
                />
              )}

              {hasPressure && (
                <IntelligenceMetric
                  label="Tourism pressure"
                  value={getPressureLabel(intelligence.pressure?.pressure_level ?? null)}
                  icon={<TrendingUp size={18} />}
                />
              )}

              {hasSafety && (
                <IntelligenceMetric
                  label="Safety advisory"
                  value={getSafetyLabel(intelligence.safety?.safety_level ?? null)}
                  icon={<ShieldCheck size={18} />}
                />
              )}

              {hasBestTime && (
                <IntelligenceMetric
                  label="Best time"
                  value={bestMonths.slice(0, 3).join(" · ")}
                  icon={<Compass size={18} />}
                />
              )}
            </div>
          </section>
        );
      })()}

      {/* -------------------------------------------------- */}
      {/* IMPACT */}
      {/* -------------------------------------------------- */}

      {(() => {
        const impactScores = [
          intelligence.impact?.impact_score !== null && intelligence.impact?.impact_score !== undefined
            ? { label: "Overall impact", value: intelligence.impact.impact_score }
            : null,
          intelligence.impact?.heritage_preservation_score !== null && intelligence.impact?.heritage_preservation_score !== undefined
            ? { label: "Heritage preservation", value: intelligence.impact.heritage_preservation_score }
            : null,
          intelligence.impact?.environmental_practice_score !== null && intelligence.impact?.environmental_practice_score !== undefined
            ? { label: "Environmental practice", value: intelligence.impact.environmental_practice_score }
            : null,
          intelligence.impact?.local_ownership_score !== null && intelligence.impact?.local_ownership_score !== undefined
            ? { label: "Local ownership", value: intelligence.impact.local_ownership_score }
            : null,
          intelligence.impact?.local_sourcing_score !== null && intelligence.impact?.local_sourcing_score !== undefined
            ? { label: "Local sourcing", value: intelligence.impact.local_sourcing_score }
            : null,
          intelligence.impact?.community_participation_score !== null && intelligence.impact?.community_participation_score !== undefined
            ? { label: "Community participation", value: intelligence.impact.community_participation_score }
            : null,
        ].filter(
          (item): item is { label: string; value: number } => item !== null
        );

        if (impactScores.length === 0) return null;

        return (
          <section className="border-y border-[#F8F1E5]/8 bg-[#0D120F]">
            <div className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-40">
              <div className="grid gap-16 lg:grid-cols-[0.7fr_1.3fr]">
                <div>
                  <p className="mb-4 text-xs uppercase tracking-[0.28em] text-[#FF9933]">
                    Leave something good behind
                  </p>

                  <h2 className="max-w-md font-serif text-4xl leading-[1.05] sm:text-5xl">
                    Your journey
                    <br />
                    has an impact.
                  </h2>

                  <p className="mt-6 max-w-sm text-sm leading-7 text-[#F8F1E5]/45">
                    Khoj evaluates how tourism contributes positively to the places and communities people visit.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {impactScores.map((score) => (
                    <ScoreCard
                      key={score.label}
                      label={score.label}
                      value={score.value}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        );
      })()}

      {/* -------------------------------------------------- */}
      {/* TRAVEL CONDITIONS (KNOW BEFORE YOU GO) */}
      {/* -------------------------------------------------- */}

      {(() => {
        const hasSolo = hasContent(intelligence.safety?.solo_travel_suitability);
        const hasNight = hasContent(intelligence.safety?.night_travel_advisory);
        const hasEmergency = hasContent(intelligence.safety?.emergency_information);
        const hasSafetyData = hasSolo || hasNight || hasEmergency;

        const hasWheelchair = intelligence.accessibility?.wheelchair_accessible !== null && intelligence.accessibility?.wheelchair_accessible !== undefined;
        const hasTransport = intelligence.accessibility?.accessible_transport !== null && intelligence.accessibility?.accessible_transport !== undefined;
        const hasAccomm = intelligence.accessibility?.accessible_accommodation !== null && intelligence.accessibility?.accessible_accommodation !== undefined;
        const hasRestrooms = intelligence.accessibility?.accessible_restrooms !== null && intelligence.accessibility?.accessible_restrooms !== undefined;
        const hasNotes = hasContent(intelligence.accessibility?.accessibility_notes);
        const hasAccessibilityData = hasWheelchair || hasTransport || hasAccomm || hasRestrooms || hasNotes;

        if (!hasSafetyData && !hasAccessibilityData) return null;

        return (
          <section className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-40">
            <div className="mb-14 max-w-2xl">
              <p className="mb-4 text-xs uppercase tracking-[0.28em] text-[#FF9933]">
                Travel conditions
              </p>

              <h2 className="font-serif text-4xl leading-tight sm:text-5xl">
                Know before
                <br />
                you go.
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-[#F8F1E5]/50">
                Practical context for planning your journey with confidence.
              </p>
            </div>

            <div className={`grid gap-16 ${hasSafetyData && hasAccessibilityData ? "lg:grid-cols-2" : "grid-cols-1 max-w-3xl"}`}>
              {hasSafetyData && (
                <InfoPanel
                  title="Context-aware safety"
                  eyebrow="Travel with confidence"
                  icon={<ShieldCheck size={20} />}
                >
                  <div className="space-y-6">
                    {hasSolo && (
                      <InfoRow
                        label="Solo travel"
                        value={intelligence.safety!.solo_travel_suitability!}
                      />
                    )}

                    {hasNight && (
                      <InfoRow
                        label="Night travel advisory"
                        value={intelligence.safety!.night_travel_advisory!}
                      />
                    )}

                    {hasEmergency && (
                      <InfoRow
                        label="Emergency & medical"
                        value={intelligence.safety!.emergency_information!}
                      />
                    )}
                  </div>
                </InfoPanel>
              )}

              {hasAccessibilityData && (
                <InfoPanel
                  title="Accessibility"
                  eyebrow="Inclusive travel"
                  icon={<Compass size={20} />}
                >
                  {(hasWheelchair || hasTransport || hasAccomm || hasRestrooms) && (
                    <div className="grid grid-cols-2 gap-4">
                      {hasWheelchair && (
                        <BooleanRow
                          label="Wheelchair"
                          value={intelligence.accessibility!.wheelchair_accessible}
                        />
                      )}

                      {hasTransport && (
                        <BooleanRow
                          label="Transport"
                          value={intelligence.accessibility!.accessible_transport}
                        />
                      )}

                      {hasAccomm && (
                        <BooleanRow
                          label="Accommodation"
                          value={intelligence.accessibility!.accessible_accommodation}
                        />
                      )}

                      {hasRestrooms && (
                        <BooleanRow
                          label="Restrooms"
                          value={intelligence.accessibility!.accessible_restrooms}
                        />
                      )}
                    </div>
                  )}

                  {hasNotes && (
                    <p className="mt-7 max-w-xl text-sm leading-7 text-[#F8F1E5]/50">
                      {intelligence.accessibility!.accessibility_notes!}
                    </p>
                  )}
                </InfoPanel>
              )}
            </div>
          </section>
        );
      })()}

      {/* -------------------------------------------------- */}
      {/* BEST TIME */}
      {/* -------------------------------------------------- */}

      {(() => {
        if (!intelligence.seasonality || intelligence.seasonality.length === 0 || bestSeasonScore === null) {
          return null;
        }

        return (
          <section className="border-y border-[#F8F1E5]/8 bg-[#0D120F]">
            <div className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-36">
              <div className="grid gap-14 lg:grid-cols-[0.7fr_1.3fr]">
                <div>
                  <p className="mb-4 text-xs uppercase tracking-[0.28em] text-[#FF9933]">
                    Find your moment
                  </p>

                  <h2 className="font-serif text-4xl leading-[1.05] sm:text-5xl">
                    When should
                    <br />
                    you go?
                  </h2>
                </div>

                <div className="max-w-3xl">
                  <div className="flex flex-wrap items-end gap-5">
                    <span className="font-serif text-6xl sm:text-7xl">
                      {formatScore(bestSeasonScore)}
                    </span>

                    <span className="mb-2 text-sm text-[#F8F1E5]/40">
                      suitability score
                    </span>
                  </div>

                  <p className="mt-5 text-sm leading-7 text-[#F8F1E5]/50">
                    {getSuitabilityLabel(bestSeasonScore)} travel conditions observed across Khoj destination data.
                  </p>

                  {bestMonths.length > 0 && (
                    <div className="mt-10 border-t border-[#F8F1E5]/10 pt-7">
                      <p className="text-xs uppercase tracking-[0.14em] text-[#F8F1E5]/30">
                        Strongest months
                      </p>

                      <p className="mt-3 font-serif text-2xl text-[#F8F1E5]/85">
                        {bestMonths.join(" · ")}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        );
      })()}

            {/* -------------------------------------------------- */}
      {/* TRAVEL NOTES */}
      {/* -------------------------------------------------- */}

      {(() => {
        const noteBlocks = [
          hasContent(story?.things_to_know)
            ? {
                key: "things_to_know",
                eyebrow: "Things to know",
                color: "text-[#F8F1E5]/35",
                content: story!.things_to_know!,
              }
            : null,

          hasContent(story?.responsible_travel_notes)
            ? {
                key: "responsible_travel",
                eyebrow: "Travel responsibly",
                color: "text-[#FF9933]",
                content: story!.responsible_travel_notes!,
              }
            : null,
        ].filter(
          (
            block,
          ): block is {
            key: string;
            eyebrow: string;
            color: string;
            content: string;
          } => block !== null,
        );

        if (noteBlocks.length === 0) return null;

        return (
          <section className="border-y border-[#F8F1E5]/8 bg-[#090D0B]">
            <div className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-40">
              <div className="grid gap-16 lg:grid-cols-[0.7fr_1.3fr]">
                <div>
                  <p className="mb-4 text-xs uppercase tracking-[0.28em] text-[#FF9933]">
                    Before you travel
                  </p>

                  <h2 className="max-w-md font-serif text-4xl leading-[1.05] sm:text-5xl">
                    A little context
                    <br />
                    goes a long way.
                  </h2>

                  <p className="mt-6 max-w-sm text-sm leading-7 text-[#F8F1E5]/45">
                    Practical knowledge can make the journey more comfortable,
                    respectful and rewarding.
                  </p>
                </div>

                <div className="space-y-14">
                  {noteBlocks.map((block, index) => (
                    <motion.div
                      key={block.key}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{
                        once: true,
                        amount: 0.2,
                      }}
                      transition={{
                        duration: 0.7,
                        delay: Math.min(index * 0.05, 0.1),
                      }}
                      className={
                        index > 0 ? "border-t border-[#F8F1E5]/10 pt-14" : ""
                      }
                    >
                      <p
                        className={`text-xs uppercase tracking-[0.18em] ${block.color}`}
                      >
                        {block.eyebrow}
                      </p>

                      <p className="mt-5 max-w-3xl text-lg leading-8 text-[#F8F1E5]/70 sm:text-xl sm:leading-9">
                        {block.content}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        );
      })()}
      
      {/* -------------------------------------------------- */}
      {/* EXPERIENCES */}
      {/* -------------------------------------------------- */}

      <section className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-40">
        <div className="mb-14 flex items-end justify-between gap-6">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.28em] text-[#FF9933]">
              Experience the place
            </p>

            <h2 className="font-serif text-4xl leading-[1.05] sm:text-5xl">
              Don't just visit.
              <br />
              Experience it.
            </h2>
          </div>

          <span className="hidden text-sm text-[#F8F1E5]/40 sm:block">
            {experiences.length} experiences
          </span>
        </div>

        {experiences.length === 0 ? (
          <div className="border border-dashed border-[#F8F1E5]/12 px-6 py-20 text-center">
            <p className="font-serif text-2xl">
              Experiences are coming to this destination.
            </p>

            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#F8F1E5]/45">
              Khoj will surface locally connected experiences as verified
              partners join the community.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {experiences.map((experience) => (
              <article
                key={experience.id}
                className="border border-[#F8F1E5]/10 bg-[#111713] p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-serif text-2xl">{experience.title}</h3>

                  {experience.verified && (
                    <ShieldCheck
                      size={18}
                      className="shrink-0 text-[#7BC47F]"
                    />
                  )}
                </div>

                {experience.short_description ? (
                  <p className="mt-3 text-sm leading-7 text-[#F8F1E5]/55">
                    {experience.short_description}
                  </p>
                ) : experience.description ? (
                  <p className="mt-3 text-sm leading-7 text-[#F8F1E5]/55">
                    {experience.description}
                  </p>
                ) : null}

                <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#F8F1E5]/50">
                  {experience.duration_minutes !== null &&
                    experience.duration_minutes > 0 && (
                      <span>
                        {experience.duration_minutes >= 60
                          ? `${Math.floor(experience.duration_minutes / 60)}h${experience.duration_minutes % 60 ? ` ${experience.duration_minutes % 60}m` : ""}`
                          : `${experience.duration_minutes} min`}
                      </span>
                    )}

                  {experience.price_from !== null && (
                    <span>From ₹{experience.price_from}</span>
                  )}

                  {experience.max_group_size !== null &&
                    experience.max_group_size > 0 && (
                      <span>Up to {experience.max_group_size} guests</span>
                    )}

                  {experience.impact_score !== null && (
                    <span className="flex items-center gap-1 text-[#FF9933]">
                      <Sparkles size={12} />
                      Impact {Math.round(experience.impact_score)}/100
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* -------------------------------------------------- */}
      {/* LOCATION */}
      {/* -------------------------------------------------- */}

      <section className="border-t border-[#F8F1E5]/10 bg-[#0D120F]">
        <div className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-36">
          <div className="flex flex-col justify-between gap-12 md:flex-row md:items-end">
            <div>
              <p className="mb-4 text-xs uppercase tracking-[0.28em] text-[#FF9933]">
                Find your way
              </p>

              <h2 className="font-serif text-4xl leading-[1.05] sm:text-5xl">
                {destination.name}
                <br />
                {stateName}
              </h2>

              {destination.latitude !== null &&
                destination.longitude !== null && (
                  <p className="mt-6 font-mono text-xs text-[#F8F1E5]/40">
                    {destination.latitude.toFixed(4)}
                    {" · "}
                    {destination.longitude.toFixed(4)}
                  </p>
                )}
            </div>

            {destination.latitude !== null &&
              destination.longitude !== null && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${destination.latitude},${destination.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-fit items-center gap-2 border border-[#F8F1E5]/15 px-5 py-3 text-sm transition hover:border-[#FF9933]/60 hover:text-[#FF9933]"
                >
                  Open in Maps
                  <ArrowUpRight size={17} />
                </a>
              )}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- */}
      {/* SOURCE */}
      {/* -------------------------------------------------- */}

      {heroMedia && (
        <footer className="border-t border-[#F8F1E5]/8 px-6 py-8 lg:px-10">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 text-xs text-[#F8F1E5]/35 sm:flex-row sm:items-center sm:justify-between">
            <span>
              Image: {heroMedia.source_author ?? "Source unavailable"}
              {heroMedia.source_license ? ` · ${heroMedia.source_license}` : ""}
            </span>

            {heroMedia.source_url && (
              <a
                href={heroMedia.source_url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 transition hover:text-[#F8F1E5]/70"
              >
                View source
                <ExternalLink size={13} />
              </a>
            )}
          </div>
        </footer>
      )}
    </main>
  );
}

/* -------------------------------------------------- */
/* EDITORIAL FACT */
/* -------------------------------------------------- */

function EditorialFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.14em] text-[#F8F1E5]/30">
        {label}
      </p>

      <p className="mt-2 text-sm text-[#F8F1E5]/75">{value}</p>
    </div>
  );
}

/* -------------------------------------------------- */
/* CONTEXT SIGNAL */
/* -------------------------------------------------- */

function ContextSignal({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-[#F8F1E5]/55">
      <span className="text-[#FF9933]">{icon}</span>

      {label}
    </div>
  );
}

/* -------------------------------------------------- */
/* INTELLIGENCE METRIC */
/* -------------------------------------------------- */

function IntelligenceMetric({
  label,
  value,
  suffix,
  icon,
}: {
  label: string;
  value: string;
  suffix?: string;
  icon: ReactNode;
}) {
  return (
    <div className="bg-[#111713] p-7">
      <div className="flex items-center gap-2 text-[#FF9933]">
        {icon}

        <span className="text-xs uppercase tracking-[0.16em] text-[#F8F1E5]/45">
          {label}
        </span>
      </div>

      <div className="mt-9 flex items-baseline gap-1">
        <span className="font-serif text-3xl">{value}</span>

        {suffix && <span className="text-xs text-[#F8F1E5]/35">{suffix}</span>}
      </div>
    </div>
  );
}

/* -------------------------------------------------- */
/* SCORE CARD */
/* -------------------------------------------------- */

function ScoreCard({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="border border-[#F8F1E5]/10 p-7">
      <p className="text-xs uppercase tracking-[0.14em] text-[#F8F1E5]/40">
        {label}
      </p>

      <div className="mt-6 flex items-baseline gap-1">
        <span className="font-serif text-4xl">{formatScore(value)}</span>

        {value !== null && (
          <span className="text-xs text-[#F8F1E5]/35">/100</span>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------- */
/* INFO PANEL */
/* -------------------------------------------------- */

function InfoPanel({
  title,
  eyebrow,
  icon,
  children,
}: {
  title: string;
  eyebrow: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="border border-[#F8F1E5]/10 p-8 sm:p-10">
      <div className="flex items-center gap-2 text-[#FF9933]">
        {icon}

        <span className="text-xs uppercase tracking-[0.16em]">{eyebrow}</span>
      </div>

      <h3 className="mt-5 font-serif text-3xl">{title}</h3>

      <div className="mt-9">{children}</div>
    </div>
  );
}

/* -------------------------------------------------- */
/* INFO ROW */
/* -------------------------------------------------- */

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-[#F8F1E5]/8 pb-5">
      <p className="text-xs text-[#F8F1E5]/35">{label}</p>

      <p className="mt-2 text-sm leading-7 text-[#F8F1E5]/75">{value}</p>
    </div>
  );
}

/* -------------------------------------------------- */
/* BOOLEAN ROW */
/* -------------------------------------------------- */

function BooleanRow({
  label,
  value,
}: {
  label: string;
  value: boolean | null;
}) {
  const text =
    value === true
      ? "Available"
      : value === false
        ? "Not confirmed"
        : "Unknown";

  return (
    <div className="border border-[#F8F1E5]/8 p-5">
      <p className="text-xs text-[#F8F1E5]/35">{label}</p>

      <p className="mt-2 text-sm text-[#F8F1E5]/75">{text}</p>
    </div>
  );
}

export default DestinationDetail;
