import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Compass,
  LocateFixed,
  MapPin,
  Navigation,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Waves,
} from 'lucide-react'

import {
  getRecommendations,
  type Recommendation,
} from '../../services/recommendationService'

/* -------------------------------------------------------------------------- */
/*                               IMAGE LIBRARY                                */
/* -------------------------------------------------------------------------- */

const DESTINATION_IMAGES: Record<string, string> = {
  Vagamon:
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=85',

  Kumbalangi:
    'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1400&q=85',

  'Lonar Crater':
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=85',

  Bhandardara:
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=85',

  Bundi:
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1400&q=85',

  Kumbalgarh:
    'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1400&q=85',

  Jibhi:
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=85',

  Barot:
    'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1400&q=85',

  Mawlynnong:
    'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1400&q=85',

  Nongriat:
    'https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=1400&q=85',
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1400&q=85'

function getDestinationImage(name: string): string {
  return DESTINATION_IMAGES[name] ?? FALLBACK_IMAGE
}

/* -------------------------------------------------------------------------- */
/*                              HELPER FUNCTIONS                              */
/* -------------------------------------------------------------------------- */

function getCoordinates(recommendation: Recommendation) {
  /*
   * The current recommendation API does not yet expose coordinates.
   * Until the recommendation response is extended, we use destination-specific
   * prototype coordinates here.
   *
   * These will later come directly from the database.
   */

  const coordinates: Record<string, { lat: string; lng: string }> = {
    Vagamon: {
      lat: '9.6346° N',
      lng: '76.9067° E',
    },
    Kumbalangi: {
      lat: '9.8893° N',
      lng: '76.2833° E',
    },
    'Lonar Crater': {
      lat: '19.9989° N',
      lng: '76.5119° E',
    },
    Bhandardara: {
      lat: '19.5416° N',
      lng: '73.7580° E',
    },
    Bundi: {
      lat: '25.4380° N',
      lng: '75.6374° E',
    },
    Kumbalgarh: {
      lat: '25.1480° N',
      lng: '73.5860° E',
    },
    Jibhi: {
      lat: '31.6940° N',
      lng: '77.3430° E',
    },
    Barot: {
      lat: '32.0350° N',
      lng: '76.8380° E',
    },
    Mawlynnong: {
      lat: '25.2000° N',
      lng: '91.8830° E',
    },
    Nongriat: {
      lat: '25.2450° N',
      lng: '91.7050° E',
    },
  }

  return (
    coordinates[recommendation.destination.name] ?? {
      lat: '—',
      lng: '—',
    }
  )
}

function getStateName(recommendation: Recommendation): string {
  const stateMap: Record<string, string> = {
    Vagamon: 'Kerala',
    Kumbalangi: 'Kerala',
    'Lonar Crater': 'Maharashtra',
    Bhandardara: 'Maharashtra',
    Bundi: 'Rajasthan',
    Kumbalgarh: 'Rajasthan',
    Jibhi: 'Himachal Pradesh',
    Barot: 'Himachal Pradesh',
    Mawlynnong: 'Meghalaya',
    Nongriat: 'Meghalaya',
  }

  return stateMap[recommendation.destination.name] ?? 'India'
}

function getPostcardRotation(index: number): number {
  const rotations = [-4, 3, -2, 4]
  return rotations[index % rotations.length]
}

function getSignalIcon(label: string) {
  if (label.toLowerCase().includes('nature')) {
    return <Waves size={13} />
  }

  if (label.toLowerCase().includes('safety')) {
    return <ShieldCheck size={13} />
  }

  if (label.toLowerCase().includes('travel')) {
    return <Compass size={13} />
  }

  return <Sparkles size={13} />
}

/* -------------------------------------------------------------------------- */
/*                           MAIN DISCOVERY COMPONENT                         */
/* -------------------------------------------------------------------------- */

export default function SmartDiscovery() {
  const shouldReduceMotion = useReducedMotion()

  const [recommendations, setRecommendations] = useState<
    Recommendation[]
  >([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [activeIndex, setActiveIndex] = useState(0)
  const [hasSwiped, setHasSwiped] = useState(false)
  const [direction, setDirection] = useState(1)

  /* ---------------------------------------------------------------------- */
  /*                              LOAD DATA                                 */
  /* ---------------------------------------------------------------------- */

  async function loadRecommendations() {
    setLoading(true)
    setError(null)

    try {
      const response = await getRecommendations({
        max_results: 6,
      })

      setRecommendations(response.recommendations)
      setActiveIndex(0)
      setHasSwiped(false)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load Smart Discovery.',
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const response = await getRecommendations({
          max_results: 6,
        })

        if (!cancelled) {
          setRecommendations(response.recommendations)
          setActiveIndex(0)
          setError(null)
          setLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Failed to load Smart Discovery.',
          )

          setLoading(false)
        }
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [])

  /* ---------------------------------------------------------------------- */
  /*                              ACTIVE CARD                               */
  /* ---------------------------------------------------------------------- */

  const activeRecommendation =
    recommendations.length > 0
      ? recommendations[activeIndex % recommendations.length]
      : null

  const visibleStack = useMemo(() => {
    if (recommendations.length === 0) {
      return []
    }

    return [0, 1, 2]
      .map((offset) => {
        const index =
          (activeIndex + offset) % recommendations.length

        return {
          recommendation: recommendations[index],
          offset,
        }
      })
      .filter(Boolean)
  }, [recommendations, activeIndex])

  /* ---------------------------------------------------------------------- */
  /*                            DECK NAVIGATION                             */
  /* ---------------------------------------------------------------------- */

  function goNext() {
    if (recommendations.length <= 1) return

    setDirection(1)
    setHasSwiped(true)

    setActiveIndex(
      (current) => (current + 1) % recommendations.length,
    )
  }

  function goPrevious() {
    if (recommendations.length <= 1) return

    setDirection(-1)
    setHasSwiped(true)

    setActiveIndex(
      (current) =>
        (current - 1 + recommendations.length) %
        recommendations.length,
    )
  }

  function handleDragEnd(
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: {
      offset: {
        x: number
      }
      velocity: {
        x: number
      }
    },
  ) {
    const swipeDistance = Math.abs(info.offset.x)
    const swipeVelocity = Math.abs(info.velocity.x)

    const shouldSwipe =
      swipeDistance > 90 || swipeVelocity > 500

    if (!shouldSwipe) {
      return
    }

    if (info.offset.x < 0 || info.velocity.x < 0) {
      goNext()
    } else {
      goPrevious()
    }
  }

  /* ---------------------------------------------------------------------- */
  /*                             KEYBOARD                                   */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'ArrowRight') {
        goNext()
      }

      if (event.key === 'ArrowLeft') {
        goPrevious()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  })

  /* ---------------------------------------------------------------------- */
  /*                                RENDER                                  */
  /* ---------------------------------------------------------------------- */

  return (
    <section
      className="
        relative
        overflow-hidden
        bg-[#090D0B]
        py-24
        text-[#F8F1E5]
        md:py-32
      "
    >
      {/* ================================================================== */}
      {/*                         CINEMATIC BACKGROUND                       */}
      {/* ================================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-30
        "
        aria-hidden="true"
      >
        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_50%_40%,rgba(255,153,51,0.10),transparent_32%),radial-gradient(circle_at_15%_70%,rgba(40,53,147,0.08),transparent_30%),radial-gradient(circle_at_85%_60%,rgba(46,125,50,0.06),transparent_30%)]
          "
        />
      </div>

      {/* subtle explorer-map lines */}

      <div
        className="
          pointer-events-none
          absolute
          -left-40
          top-32
          h-[500px]
          w-[500px]
          rounded-full
          border
          border-[#FF9933]/5
        "
        aria-hidden="true"
      />

      <div
        className="
          pointer-events-none
          absolute
          -left-28
          top-44
          h-[340px]
          w-[340px]
          rounded-full
          border
          border-[#FF9933]/5
        "
        aria-hidden="true"
      />

      <div
        className="
          pointer-events-none
          absolute
          right-[-180px]
          bottom-20
          h-[500px]
          w-[500px]
          rounded-full
          border
          border-[#F8F1E5]/5
        "
        aria-hidden="true"
      />

      {/* ================================================================== */}
      {/*                               CONTENT                               */}
      {/* ================================================================== */}

      <div
        className="
          relative
          mx-auto
          max-w-7xl
          px-6
          lg:px-8
        "
      >
        {/* ================================================================ */}
        {/*                              HEADER                              */}
        {/* ================================================================ */}

        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 20,
                  }
            }
            whileInView={
              shouldReduceMotion
                ? undefined
                : {
                    opacity: 1,
                    y: 0,
                  }
            }
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="
              mb-6
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-[#FF9933]/25
              bg-[#FF9933]/5
              px-4
              py-2
              text-xs
              font-medium
              tracking-[0.16em]
              text-[#F8F1E5]/75
            "
          >
            <Compass
              size={14}
              strokeWidth={1.5}
              className="text-[#FF9933]"
            />

            KHOJ INTELLIGENCE
          </motion.div>

          <motion.h2
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 25,
                  }
            }
            whileInView={
              shouldReduceMotion
                ? undefined
                : {
                    opacity: 1,
                    y: 0,
                  }
            }
            viewport={{ once: true }}
            transition={{
              duration: 0.7,
              delay: 0.08,
            }}
            className="
              font-['DM_Serif_Display']
              text-5xl
              leading-[0.98]
              tracking-tight
              text-[#F8F1E5]
              md:text-6xl
              lg:text-7xl
            "
          >
            Destinations chosen
            <span className="block text-[#FF9933]">
              for you.
            </span>
          </motion.h2>

          <motion.p
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 20,
                  }
            }
            whileInView={
              shouldReduceMotion
                ? undefined
                : {
                    opacity: 1,
                    y: 0,
                  }
            }
            viewport={{ once: true }}
            transition={{
              duration: 0.7,
              delay: 0.15,
            }}
            className="
              mx-auto
              mt-7
              max-w-2xl
              text-sm
              leading-7
              text-[#F8F1E5]/50
              md:text-base
            "
          >
            Not just popular places.
            <br />
            Khoj finds possibilities shaped around your
            interests, travel style, safety, impact and
            destination conditions.
          </motion.p>
        </div>

        {/* ================================================================ */}
        {/*                         LOADING STATE                            */}
        {/* ================================================================ */}

        {loading && (
          <div
            className="
              flex
              flex-col
              items-center
              justify-center
              py-32
              text-[#F8F1E5]/50
            "
          >
            <RefreshCw
              className="animate-spin text-[#FF9933]"
              size={28}
              strokeWidth={1.5}
            />

            <p className="mt-5 text-sm">
              Khoj is finding places for you...
            </p>
          </div>
        )}

        {/* ================================================================ */}
        {/*                           ERROR STATE                            */}
        {/* ================================================================ */}

        {!loading && error && (
          <div
            className="
              mx-auto
              mt-16
              max-w-xl
              rounded-[28px]
              border
              border-[#F8F1E5]/10
              bg-[#F8F1E5]/5
              p-8
              text-center
            "
          >
            <div
              className="
                mx-auto
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                bg-red-500/10
                text-red-400
              "
            >
              <Navigation size={20} />
            </div>

            <p className="mt-5 text-sm leading-6 text-[#F8F1E5]/60">
              {error}
            </p>

            <button
              type="button"
              onClick={() => void loadRecommendations()}
              className="
                mt-6
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-[#F8F1E5]/10
                bg-[#F8F1E5]/8
                px-5
                py-2.5
                text-sm
                font-medium
                text-[#F8F1E5]
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-[#FF9933]
                hover:text-[#090D0B]
              "
            >
              <RefreshCw size={15} />
              Try again
            </button>
          </div>
        )}

        {/* ================================================================ */}
        {/*                         EMPTY STATE                              */}
        {/* ================================================================ */}

        {!loading &&
          !error &&
          recommendations.length === 0 && (
            <div
              className="
                mx-auto
                mt-16
                max-w-xl
                rounded-[28px]
                border
                border-[#F8F1E5]/10
                bg-[#F8F1E5]/5
                p-10
                text-center
              "
            >
              <Compass
                className="mx-auto text-[#FF9933]"
                size={32}
                strokeWidth={1.4}
              />

              <h3
                className="
                  mt-5
                  font-['DM_Serif_Display']
                  text-2xl
                  text-[#F8F1E5]
                "
              >
                Your journey is waiting.
              </h3>

              <p
                className="
                  mt-3
                  text-sm
                  leading-6
                  text-[#F8F1E5]/50
                "
              >
                Add more traveller preferences to help Khoj
                understand what kind of India you want to
                discover.
              </p>
            </div>
          )}

        {/* ================================================================ */}
        {/*                         DISCOVERY DECK                            */}
        {/* ================================================================ */}

        {!loading &&
          !error &&
          activeRecommendation &&
          recommendations.length > 0 && (
            <div className="mt-16">
              <div
                className="
                  relative
                  mx-auto
                  flex
                  min-h-[690px]
                  max-w-6xl
                  items-center
                  justify-center
                "
              >
                {/* ======================================================== */}
                {/*                       LEFT NOTE                           */}
                {/* ======================================================== */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    left-0
                    top-20
                    hidden
                    w-44
                    rotate-[-7deg]
                    xl:block
                  "
                >
                  <p
                    className="
                      font-['DM_Serif_Display']
                      text-2xl
                      italic
                      leading-tight
                      text-[#F8F1E5]/45
                    "
                  >
                    Not just places,
                    <br />
                    but possibilities...
                  </p>

                  <div
                    className="
                      mt-4
                      ml-20
                      h-14
                      w-20
                      rotate-[-25deg]
                      border-b
                      border-r
                      border-[#FF9933]/30
                    "
                  />
                </div>

                {/* ======================================================== */}
                {/*                     RIGHT NOTE                            */}
                {/* ======================================================== */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    right-0
                    top-32
                    hidden
                    w-48
                    rotate-[5deg]
                    xl:block
                  "
                >
                  <p
                    className="
                      font-['DM_Serif_Display']
                      text-xl
                      italic
                      leading-tight
                      text-[#F8F1E5]/40
                    "
                  >
                    Each card reveals
                    <br />
                    a new possibility...
                  </p>

                  <div
                    className="
                      mt-5
                      ml-6
                      h-12
                      w-20
                      rotate-[30deg]
                      border-b
                      border-l
                      border-[#FF9933]/30
                    "
                  />
                </div>

                {/* ======================================================== */}
                {/*                     CARD DECK                             */}
                {/* ======================================================== */}

                <div
                  className="
                    relative
                    h-[620px]
                    w-full
                    max-w-[560px]
                  "
                >
                  <AnimatePresence initial={false} custom={direction}>
                    {visibleStack
                      .slice()
                      .reverse()
                      .map(
                        ({
                          recommendation,
                          offset,
                        }) => {
                          const isActive = offset === 0

                          const coordinates =
                            getCoordinates(recommendation)

                          const state =
                            getStateName(recommendation)

                          const image =
                            getDestinationImage(
                              recommendation.destination.name,
                            )

                          const score =
                            Math.round(
                              recommendation.intelligence
                                .score.overall,
                            )

                          const confidence =
                            Math.round(
                              recommendation.intelligence
                                .score.confidence.score,
                            )

                          const reasons =
                            recommendation.intelligence.reasons

                          return (
                            <motion.article
                              key={`${recommendation.destination.id}-${activeIndex}-${offset}`}
                              custom={direction}
                              initial={
                                isActive
                                  ? {
                                      opacity: 0,
                                      x:
                                        direction > 0
                                          ? 120
                                          : -120,
                                      rotate:
                                        direction > 0
                                          ? 5
                                          : -5,
                                    }
                                  : false
                              }
                              animate={{
                                opacity:
                                  isActive
                                    ? 1
                                    : Math.max(
                                        0.35,
                                        1 -
                                          offset *
                                            0.16,
                                      ),

                                x: isActive
                                  ? 0
                                  : offset * 16,

                                y: offset * 18,

                                scale: isActive
                                  ? 1
                                  : 1 -
                                    offset *
                                      0.035,

                                rotate: isActive
                                  ? 0
                                  : getPostcardRotation(
                                      offset,
                                    ),

                                zIndex:
                                  20 - offset,
                              }}
                              exit={{
                                opacity: 0,
                                x:
                                  direction > 0
                                    ? -700
                                    : 700,
                                rotate:
                                  direction > 0
                                    ? -18
                                    : 18,
                                transition: {
                                  duration:
                                    shouldReduceMotion
                                      ? 0
                                      : 0.45,
                                  ease: [
                                    0.22,
                                    1,
                                    0.36,
                                    1,
                                  ],
                                },
                              }}
                              transition={{
                                duration:
                                  shouldReduceMotion
                                    ? 0
                                    : 0.5,
                                ease: [
                                  0.22,
                                  1,
                                  0.36,
                                  1,
                                ],
                              }}
                              drag={
                                isActive
                                  ? 'x'
                                  : false
                              }
                              dragConstraints={{
                                left: 0,
                                right: 0,
                              }}
                              dragElastic={0.7}
                              onDragEnd={
                                isActive
                                  ? handleDragEnd
                                  : undefined
                              }
                              whileDrag={
                                isActive
                                  ? {
                                      cursor:
                                        'grabbing',
                                    }
                                  : undefined
                              }
                              style={{
                                position:
                                  'absolute',
                                inset: 0,
                                cursor: isActive
                                  ? 'grab'
                                  : 'default',
                              }}
                              className="
                                overflow-hidden
                                rounded-[6px]
                                border
                                border-[#7A6548]/45
                                bg-[#DCC9A8]
                                text-[#272116]
                                shadow-[0_35px_100px_rgba(0,0,0,0.42)]
                              "
                            >
                              {/* ================================================== */}
                              {/*                    PAPER TEXTURE                     */}
                              {/* ================================================== */}

                              <div
                                className="
                                  pointer-events-none
                                  absolute
                                  inset-0
                                  z-20
                                  opacity-30
                                  mix-blend-multiply
                                  bg-[radial-gradient(circle_at_15%_15%,rgba(255,255,255,0.7),transparent_22%),radial-gradient(circle_at_80%_30%,rgba(91,62,28,0.12),transparent_25%),radial-gradient(circle_at_30%_80%,rgba(92,65,34,0.10),transparent_30%)]
                                "
                              />

                              {/* ================================================== */}
                              {/*                     CARD CONTENT                    */}
                              {/* ================================================== */}

                              <div className="relative flex h-full flex-col p-5 md:p-7">
                                {/* ---------------------------------------------- */}
                                {/* TOP INFORMATION                                  */}
                                {/* ---------------------------------------------- */}

                                <div className="flex items-start justify-between gap-4">
                                  <div>
                                    <div
                                      className="
                                        flex
                                        items-center
                                        gap-2
                                        text-[10px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.18em]
                                        text-[#3D3528]/75
                                      "
                                    >
                                      <MapPin
                                        size={13}
                                        strokeWidth={1.8}
                                      />

                                      {recommendation
                                        .destination
                                        .name
                                        .toUpperCase()}
                                    </div>

                                    <div
                                      className="
                                        mt-1
                                        pl-5
                                        text-[9px]
                                        uppercase
                                        tracking-[0.15em]
                                        text-[#3D3528]/50
                                      "
                                    >
                                      {state}, INDIA
                                    </div>

                                    <div
                                      className="
                                        mt-2
                                        pl-5
                                        font-mono
                                        text-[8px]
                                        tracking-[0.08em]
                                        text-[#3D3528]/50
                                      "
                                    >
                                      {coordinates.lat}
                                      {'  '}·{'  '}
                                      {coordinates.lng}
                                    </div>
                                  </div>

                                  {/* KHOJ STAMP */}

                                  <div
                                    className="
                                      relative
                                      flex
                                      h-20
                                      w-20
                                      shrink-0
                                      rotate-[4deg]
                                      items-center
                                      justify-center
                                      rounded-full
                                      border
                                      border-[#344333]/55
                                      text-[#344333]
                                    "
                                  >
                                    <div
                                      className="
                                        absolute
                                        inset-[5px]
                                        rounded-full
                                        border
                                        border-[#344333]/35
                                      "
                                    />

                                    <div className="flex flex-col items-center">
                                      <Compass
                                        size={24}
                                        strokeWidth={1.2}
                                      />

                                      <span
                                        className="
                                          mt-0.5
                                          text-[6px]
                                          font-bold
                                          tracking-[0.16em]
                                        "
                                      >
                                        KHOJ INDIA
                                      </span>

                                      <span
                                        className="
                                          text-[5px]
                                          tracking-[0.18em]
                                        "
                                      >
                                        DISCOVER
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* ---------------------------------------------- */}
                                {/* PHOTO                                            */}
                                {/* ---------------------------------------------- */}

                                <div
                                  className="
                                    relative
                                    mt-5
                                    h-[250px]
                                    overflow-hidden
                                    border
                                    border-[#6D583A]/40
                                    bg-[#A8906B]
                                  "
                                >
                                  <img
                                    src={image}
                                    alt={
                                      recommendation
                                        .destination
                                        .name
                                    }
                                    className="
                                      h-full
                                      w-full
                                      object-cover
                                      transition-transform
                                      duration-700
                                    "
                                    draggable={false}
                                  />

                                  <div
                                    className="
                                      pointer-events-none
                                      absolute
                                      inset-0
                                      bg-[linear-gradient(to_top,rgba(31,25,17,0.35),transparent_45%)]
                                    "
                                  />

                                  <div
                                    className="
                                      absolute
                                      bottom-3
                                      left-3
                                      flex
                                      items-center
                                      gap-2
                                      rounded-full
                                      border
                                      border-white/20
                                      bg-black/25
                                      px-3
                                      py-1.5
                                      text-[8px]
                                      font-semibold
                                      uppercase
                                      tracking-[0.14em]
                                      text-white/90
                                      backdrop-blur-sm
                                    "
                                  >
                                    <LocateFixed
                                      size={11}
                                    />

                                    KHOJ DISCOVERY
                                  </div>
                                </div>

                                {/* ---------------------------------------------- */}
                                {/* DESTINATION TITLE                               */}
                                {/* ---------------------------------------------- */}

                                <div className="mt-5">
                                  <div className="flex items-end justify-between gap-4">
                                    <div className="min-w-0">
                                      <h3
                                        className="
                                          font-['DM_Serif_Display']
                                          text-4xl
                                          italic
                                          leading-none
                                          text-[#2C2419]
                                          md:text-5xl
                                        "
                                      >
                                        {
                                          recommendation
                                            .destination
                                            .name
                                        }
                                      </h3>

                                      <p
                                        className="
                                          mt-2
                                          max-w-[340px]
                                          text-[11px]
                                          leading-5
                                          text-[#3D3528]/65
                                        "
                                      >
                                        {recommendation
                                          .destination
                                          .short_description ??
                                          'A place worth discovering beyond the usual path.'}
                                      </p>
                                    </div>

                                    {/* MATCH STAMP */}

                                    <div
                                      className="
                                        flex
                                        h-[78px]
                                        w-[78px]
                                        shrink-0
                                        rotate-[-4deg]
                                        flex-col
                                        items-center
                                        justify-center
                                        rounded-full
                                        border-2
                                        border-[#344333]/55
                                        text-[#344333]
                                      "
                                    >
                                      <span
                                        className="
                                          font-['DM_Serif_Display']
                                          text-2xl
                                          leading-none
                                        "
                                      >
                                        {score}%
                                      </span>

                                      <span
                                        className="
                                          mt-1
                                          text-[7px]
                                          font-bold
                                          uppercase
                                          tracking-[0.14em]
                                        "
                                      >
                                        Match
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* ---------------------------------------------- */}
                                {/* DIVIDER                                          */}
                                {/* ---------------------------------------------- */}

                                <div
                                  className="
                                    my-4
                                    h-px
                                    bg-[#5E4D34]/20
                                  "
                                />

                                {/* ---------------------------------------------- */}
                                {/* WHY KHOJ                                         */}
                                {/* ---------------------------------------------- */}

                                <div>
                                  <div
                                    className="
                                      mb-3
                                      text-[8px]
                                      font-bold
                                      uppercase
                                      tracking-[0.2em]
                                      text-[#3D3528]/55
                                    "
                                  >
                                    Why Khoj recommends
                                  </div>

                                  <div className="flex flex-wrap gap-2">
                                    {reasons
                                      .slice(0, 3)
                                      .map(
                                        (
                                          reason,
                                          index,
                                        ) => (
                                          <div
                                            key={`${reason}-${index}`}
                                            className="
                                              inline-flex
                                              items-center
                                              gap-1.5
                                              rounded-full
                                              border
                                              border-[#4B523D]/25
                                              bg-[#59634C]/8
                                              px-3
                                              py-1.5
                                              text-[9px]
                                              font-medium
                                              text-[#3B4433]
                                            "
                                          >
                                            {getSignalIcon(
                                              reason,
                                            )}

                                            <span className="max-w-[170px] truncate">
                                              {reason}
                                            </span>
                                          </div>
                                        ),
                                      )}

                                    {reasons.length ===
                                      0 && (
                                      <div
                                        className="
                                          flex
                                          items-center
                                          gap-1.5
                                          text-[9px]
                                          text-[#3D3528]/55
                                        "
                                      >
                                        <Sparkles
                                          size={12}
                                        />

                                        Matched to your
                                        traveller profile
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* ---------------------------------------------- */}
                                {/* FOOTER                                           */}
                                {/* ---------------------------------------------- */}

                                <div className="mt-auto pt-5">
                                  <div className="flex items-center justify-between gap-4">
                                    <div>
                                      <div
                                        className="
                                          flex
                                          items-center
                                          gap-1.5
                                          text-[8px]
                                          font-bold
                                          uppercase
                                          tracking-[0.16em]
                                          text-[#3D3528]/55
                                        "
                                      >
                                        <ShieldCheck
                                          size={12}
                                        />

                                        {recommendation
                                          .confidence_label ??
                                          'Khoj verified'}
                                      </div>

                                      <div
                                        className="
                                          mt-1
                                          text-[8px]
                                          text-[#3D3528]/45
                                        "
                                      >
                                        {confidence}% data
                                        confidence
                                      </div>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        window.location.href =
                                          `/explore?destination=${recommendation.destination.id}`
                                      }}
                                      className="
                                        group
                                        inline-flex
                                        items-center
                                        gap-3
                                        rounded-full
                                        bg-[#20251F]
                                        px-5
                                        py-3
                                        text-[10px]
                                        font-semibold
                                        text-[#F8F1E5]
                                        shadow-[0_8px_20px_rgba(0,0,0,0.16)]
                                        transition-all
                                        duration-300
                                        hover:-translate-y-0.5
                                        hover:bg-[#FF9933]
                                        hover:text-[#17140F]
                                      "
                                    >
                                      Explore destination

                                      <ArrowUpRight
                                        size={15}
                                        className="
                                          transition-transform
                                          duration-300
                                          group-hover:-translate-y-0.5
                                          group-hover:translate-x-0.5
                                        "
                                      />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </motion.article>
                          )
                        },
                      )}
                  </AnimatePresence>
                </div>

                {/* ======================================================== */}
                {/*                       SWIPE HINT                         */}
                {/* ======================================================== */}

                {!hasSwiped && (
                  <motion.div
                    initial={
                      shouldReduceMotion
                        ? false
                        : {
                            opacity: 0,
                            y: 10,
                          }
                    }
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: 1,
                      duration: 0.5,
                    }}
                    className="
                      absolute
                      bottom-2
                      left-1/2
                      flex
                      -translate-x-1/2
                      items-center
                      gap-3
                      text-[10px]
                      uppercase
                      tracking-[0.18em]
                      text-[#F8F1E5]/40
                    "
                  >
                    <motion.div
                      animate={
                        shouldReduceMotion
                          ? undefined
                          : {
                              x: [0, 8, 0],
                            }
                      }
                      transition={{
                        repeat: Infinity,
                        duration: 1.8,
                      }}
                    >
                      <ArrowLeft size={15} />
                    </motion.div>

                    Swipe to discover

                    <motion.div
                      animate={
                        shouldReduceMotion
                          ? undefined
                          : {
                              x: [0, 8, 0],
                            }
                      }
                      transition={{
                        repeat: Infinity,
                        duration: 1.8,
                      }}
                    >
                      <ArrowRight size={15} />
                    </motion.div>
                  </motion.div>
                )}
              </div>

              {/* ============================================================ */}
              {/*                         CONTROLS                             */}
              {/* ============================================================ */}

              <div className="mt-8 flex flex-col items-center">
                <div className="flex items-center gap-5">
                  <button
                    type="button"
                    onClick={goPrevious}
                    aria-label="Previous destination"
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#F8F1E5]/10
                      bg-[#F8F1E5]/5
                      text-[#F8F1E5]/65
                      transition-all
                      duration-300
                      hover:border-[#FF9933]/40
                      hover:bg-[#FF9933]/10
                      hover:text-[#FF9933]
                    "
                  >
                    <ArrowLeft size={17} />
                  </button>

                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-3">
                      <span
                        className="
                          font-['DM_Serif_Display']
                          text-xl
                          text-[#F8F1E5]
                        "
                      >
                        {String(activeIndex + 1).padStart(
                          2,
                          '0',
                        )}
                      </span>

                      <span className="text-xs text-[#F8F1E5]/25">
                        /
                      </span>

                      <span className="text-xs text-[#F8F1E5]/35">
                        {String(
                          recommendations.length,
                        ).padStart(2, '0')}
                      </span>
                    </div>

                    <div className="mt-2 h-px w-28 overflow-hidden bg-[#F8F1E5]/10">
                      <motion.div
                        className="h-full bg-[#FF9933]"
                        animate={{
                          width: `${
                            ((activeIndex + 1) /
                              recommendations.length) *
                            100
                          }%`,
                        }}
                        transition={{
                          duration:
                            shouldReduceMotion
                              ? 0
                              : 0.35,
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={goNext}
                    aria-label="Next destination"
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#F8F1E5]/10
                      bg-[#F8F1E5]/5
                      text-[#F8F1E5]/65
                      transition-all
                      duration-300
                      hover:border-[#FF9933]/40
                      hover:bg-[#FF9933]/10
                      hover:text-[#FF9933]
                    "
                  >
                    <ArrowRight size={17} />
                  </button>
                </div>

                {/* keyboard hint */}

                <p className="mt-5 text-[9px] uppercase tracking-[0.16em] text-[#F8F1E5]/20">
                  Drag · Swipe · Arrow keys
                </p>
              </div>
            </div>
          )}

        {/* ================================================================ */}
        {/*                           FOOTER NOTE                            */}
        {/* ================================================================ */}

        {!loading &&
          !error &&
          recommendations.length > 0 && (
            <div
              className="
                mx-auto
                mt-16
                flex
                max-w-5xl
                flex-col
                gap-4
                border-t
                border-[#F8F1E5]/10
                pt-7
                text-xs
                text-[#F8F1E5]/30
                md:flex-row
                md:items-center
                md:justify-between
              "
            >
              <div className="flex items-center gap-2">
                <Sparkles
                  size={13}
                  className="text-[#FF9933]"
                />

                Recommendations generated from your current
                traveller profile.
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2
                  size={13}
                  className="text-[#7BC47F]"
                />

                Powered by Khoj Intelligence
              </div>
            </div>
          )}
      </div>
    </section>
  )
}