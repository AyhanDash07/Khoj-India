import { motion } from 'framer-motion'
import { ArrowUpRight, Compass } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import DestinationDetail from '../components/destination/DestinationDetail'
import PageLayout from '../components/layout/PageLayout'
import {
  getDestinationById,
  getDestinations,
  type Destination,
  type DestinationDetail as DestinationDetailData,
} from '../services/destinationService'

function ExplorePage() {
  const [searchParams, setSearchParams] =
    useSearchParams()

  const destinationParam =
    searchParams.get('destination')

  const parsedDestinationId = destinationParam
    ? Number(destinationParam)
    : null

  const hasValidDestinationId =
    parsedDestinationId !== null &&
    Number.isInteger(parsedDestinationId) &&
    parsedDestinationId > 0

  // ---------------------------------------------------------
  // Destination detail state
  // ---------------------------------------------------------

  const [destination, setDestination] =
    useState<DestinationDetailData | null>(null)

  const [loading, setLoading] = useState(
    hasValidDestinationId,
  )

  const [error, setError] =
    useState<string | null>(null)

  // ---------------------------------------------------------
  // Destination catalogue state
  // ---------------------------------------------------------

  const [destinations, setDestinations] =
    useState<Destination[]>([])

  const [destinationsLoading, setDestinationsLoading] =
    useState(true)

  const [destinationsError, setDestinationsError] =
    useState<string | null>(null)

  // ---------------------------------------------------------
  // Load selected destination
  // ---------------------------------------------------------

  useEffect(() => {
    if (
      parsedDestinationId === null ||
      !Number.isInteger(parsedDestinationId) ||
      parsedDestinationId <= 0
    ) {
      return
    }

    const id = parsedDestinationId
    let cancelled = false

    async function loadDestination() {
      try {
        setLoading(true)
        setError(null)

        const data =
          await getDestinationById(id)

        if (!cancelled) {
          setDestination(data)
        }
      } catch (err) {
        if (!cancelled) {
          setDestination(null)
          setError(
            err instanceof Error
              ? err.message
              : 'Unable to load this destination.',
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadDestination()

    return () => {
      cancelled = true
    }
  }, [parsedDestinationId])

  // ---------------------------------------------------------
  // Load destination catalogue
  // ---------------------------------------------------------

  useEffect(() => {
    async function loadDestinations() {
      try {
        setDestinationsLoading(true)
        setDestinationsError(null)

        const data = await getDestinations()

        setDestinations(data)
      } catch (err) {
        setDestinationsError(
          err instanceof Error
            ? err.message
            : 'Unable to load destinations.',
        )
      } finally {
        setDestinationsLoading(false)
      }
    }

    loadDestinations()
  }, [])

  // ---------------------------------------------------------
  // Return to Explore catalogue
  // ---------------------------------------------------------

  function handleBack() {
    setSearchParams({})
    setDestination(null)
    setError(null)
    setLoading(false)
  }

  // ---------------------------------------------------------
  // Invalid destination parameter
  // ---------------------------------------------------------

  if (
    destinationParam &&
    !hasValidDestinationId
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#090D0B] px-6 text-[#F8F1E5]">
        <div className="max-w-md text-center">
          <p className="text-xs uppercase tracking-[0.28em] text-[#FF9933]">
            Invalid destination
          </p>

          <h1 className="mt-4 font-serif text-4xl">
            We couldn't open this place.
          </h1>

          <p className="mt-4 text-sm leading-6 text-[#F8F1E5]/50">
            The destination link contains an
            invalid ID.
          </p>

          <button
            type="button"
            onClick={handleBack}
            className="mt-8 border border-[#F8F1E5]/15 px-5 py-3 text-sm transition hover:border-[#FF9933]/60 hover:text-[#FF9933]"
          >
            Back to Explore
          </button>
        </div>
      </main>
    )
  }

  // ---------------------------------------------------------
  // Destination loading
  // ---------------------------------------------------------

  if (
    destinationParam &&
    loading
  ) {
    return (
      <main className="min-h-screen bg-[#090D0B] px-6 py-32 text-[#F8F1E5]">
        <div className="mx-auto max-w-7xl">
          <div className="animate-pulse">
            <div className="h-[60vh] bg-[#111713]" />

            <div className="mt-10 h-8 w-64 bg-[#111713]" />

            <div className="mt-4 h-5 w-full max-w-2xl bg-[#111713]" />
          </div>
        </div>
      </main>
    )
  }

  // ---------------------------------------------------------
  // Destination loading error
  // ---------------------------------------------------------

  if (
    destinationParam &&
    (error || !destination)
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#090D0B] px-6 text-[#F8F1E5]">
        <div className="max-w-md text-center">
          <p className="text-xs uppercase tracking-[0.28em] text-[#FF9933]">
            Destination unavailable
          </p>

          <h1 className="mt-4 font-serif text-4xl">
            We couldn't find this place.
          </h1>

          <p className="mt-4 text-sm leading-6 text-[#F8F1E5]/50">
            {error ??
              'The destination could not be loaded.'}
          </p>

          <button
            type="button"
            onClick={handleBack}
            className="mt-8 border border-[#F8F1E5]/15 px-5 py-3 text-sm transition hover:border-[#FF9933]/60 hover:text-[#FF9933]"
          >
            Back to Explore
          </button>
        </div>
      </main>
    )
  }

  // ---------------------------------------------------------
  // Destination detail
  // ---------------------------------------------------------

  if (
    destinationParam &&
    destination
  ) {
    return (
      <DestinationDetail
        data={destination}
        onBack={handleBack}
      />
    )
  }

  // ---------------------------------------------------------
  // Normal Explore page
  // ---------------------------------------------------------

  const featuredDestination =
    destinations[0]

  const remainingDestinations =
    destinations.slice(1)

  return (
    <PageLayout>
      <main className="pb-24">
        {/* ------------------------------------------------- */}
        {/* Explore introduction */}
        {/* ------------------------------------------------- */}

        <section className="mx-auto max-w-7xl px-6 pb-20 pt-16 lg:px-10 lg:pb-28 lg:pt-24">
          <motion.div
            initial={{
              opacity: 0,
              y: 24,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-[#FF9933]">
              <Compass size={15} />
              <span>Explore India</span>
            </div>

            <h1 className="mt-7 max-w-4xl font-serif text-5xl leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
              Find the places
              <br />
              worth discovering.
            </h1>

            <p className="mt-8 max-w-2xl text-base leading-8 text-[#F8F1E5]/55 sm:text-lg">
              Not just the places everyone already
              knows. Discover landscapes, cultures,
              stories and experiences shaped by the
              people who call them home.
            </p>
          </motion.div>
        </section>

        {/* ------------------------------------------------- */}
        {/* Loading */}
        {/* ------------------------------------------------- */}

        {destinationsLoading ? (
          <section className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="grid gap-5 lg:grid-cols-2">
              <div className="animate-pulse bg-[#111713] lg:row-span-2">
                <div className="h-[520px] bg-[#F8F1E5]/5" />

                <div className="p-8">
                  <div className="h-3 w-24 bg-[#F8F1E5]/5" />

                  <div className="mt-5 h-10 w-2/3 bg-[#F8F1E5]/5" />

                  <div className="mt-5 h-4 w-full bg-[#F8F1E5]/5" />
                </div>
              </div>

              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="animate-pulse bg-[#111713]"
                >
                  <div className="h-64 bg-[#F8F1E5]/5" />

                  <div className="p-7">
                    <div className="h-3 w-24 bg-[#F8F1E5]/5" />

                    <div className="mt-4 h-8 w-1/2 bg-[#F8F1E5]/5" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : destinationsError ? (
          <section className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="border border-[#F8F1E5]/10 px-6 py-24 text-center">
              <p className="text-xs uppercase tracking-[0.24em] text-[#FF9933]">
                Explore unavailable
              </p>

              <h2 className="mt-4 font-serif text-3xl">
                We couldn't load destinations.
              </h2>

              <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#F8F1E5]/50">
                {destinationsError}
              </p>
            </div>
          </section>
        ) : destinations.length === 0 ? (
          <section className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="border border-dashed border-[#F8F1E5]/12 px-6 py-24 text-center">
              <p className="text-xs uppercase tracking-[0.24em] text-[#FF9933]">
                Khoj discovery
              </p>

              <h2 className="mt-4 font-serif text-3xl">
                No destinations yet.
              </h2>

              <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#F8F1E5]/50">
                New places will appear here as
                Khoj expands its destination network.
              </p>
            </div>
          </section>
        ) : (
          <>
            {/* ------------------------------------------------- */}
            {/* Featured discovery */}
            {/* ------------------------------------------------- */}

            {featuredDestination && (
              <section className="mx-auto max-w-7xl px-6 lg:px-10">
                <DestinationFeature
                  destination={
                    featuredDestination
                  }
                  onOpen={() =>
                    setSearchParams({
                      destination:
                        String(
                          featuredDestination.id,
                        ),
                    })
                  }
                />
              </section>
            )}

            {/* ------------------------------------------------- */}
            {/* Remaining destinations */}
            {/* ------------------------------------------------- */}

            {remainingDestinations.length > 0 && (
              <section className="mx-auto max-w-7xl px-6 pt-24 lg:px-10 lg:pt-36">
                <div className="mb-12 flex items-end justify-between border-b border-[#F8F1E5]/10 pb-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-[#FF9933]">
                      Continue exploring
                    </p>

                    <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
                      More from India
                    </h2>
                  </div>

                  <span className="hidden text-xs text-[#F8F1E5]/35 sm:block">
                    {remainingDestinations.length}{' '}
                    discoveries
                  </span>
                </div>

                <div className="grid gap-x-5 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
                  {remainingDestinations.map(
                    (item, index) => (
                      <DestinationGalleryCard
                        key={item.id}
                        destination={item}
                        index={index}
                        onOpen={() =>
                          setSearchParams({
                            destination:
                              String(item.id),
                          })
                        }
                      />
                    ),
                  )}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </PageLayout>
  )
}

// =============================================================
// Featured destination
// =============================================================

function DestinationFeature({
  destination,
  onOpen,
}: {
  destination: Destination
  onOpen: () => void
}) {
  const image =
    destination.hero_media?.media_url

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 35,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.15,
      }}
      transition={{
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative overflow-hidden border border-[#F8F1E5]/10 bg-[#111713]"
    >
      <button
        type="button"
        onClick={onOpen}
        className="block w-full text-left"
      >
        <div className="relative h-[480px] overflow-hidden sm:h-[600px] lg:h-[680px]">
          {image ? (
            <img
              src={image}
              alt={
                destination.hero_media
                  ?.alt_text ??
                destination.name
              }
              className="h-full w-full object-cover transition duration-1000 ease-out group-hover:scale-[1.035]"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[#0D120F] text-xs uppercase tracking-[0.24em] text-[#F8F1E5]/20">
              Khoj destination
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#090D0B] via-[#090D0B]/20 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 p-7 sm:p-10 lg:p-14">
            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-[#F8F1E5]/65">
              <span>
                {destination.states?.name ??
                  'India'}
              </span>

              {destination.destination_type && (
                <>
                  <span className="h-1 w-1 rounded-full bg-[#FF9933]" />

                  <span>
                    {destination.destination_type}
                  </span>
                </>
              )}

              {destination.verified && (
                <>
                  <span className="h-1 w-1 rounded-full bg-[#FF9933]" />

                  <span>Verified</span>
                </>
              )}
            </div>

            <div className="mt-5 flex items-end justify-between gap-8">
              <div className="max-w-3xl">
                <h2 className="font-serif text-5xl leading-[0.95] sm:text-6xl lg:text-8xl">
                  {destination.name}
                </h2>

                {destination.short_description && (
                  <p className="mt-6 max-w-xl text-sm leading-7 text-[#F8F1E5]/65 sm:text-base">
                    {
                      destination.short_description
                    }
                  </p>
                )}
              </div>

              <span className="hidden shrink-0 items-center gap-2 border border-[#F8F1E5]/20 px-5 py-3 text-sm text-[#F8F1E5]/80 transition group-hover:border-[#FF9933]/60 group-hover:text-[#FF9933] sm:inline-flex">
                Explore
                <ArrowUpRight size={16} />
              </span>
            </div>
          </div>
        </div>
      </button>
    </motion.article>
  )
}

// =============================================================
// Gallery card
// =============================================================

function DestinationGalleryCard({
  destination,
  index,
  onOpen,
}: {
  destination: Destination
  index: number
  onOpen: () => void
}) {
  const image =
    destination.hero_media?.media_url

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 30,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.12,
      }}
      transition={{
        duration: 0.65,
        delay: Math.min(index * 0.06, 0.24),
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group"
    >
      <button
        type="button"
        onClick={onOpen}
        className="block w-full text-left"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-[#111713]">
          {image ? (
            <img
              src={image}
              alt={
                destination.hero_media
                  ?.alt_text ??
                destination.name
              }
              className="h-full w-full object-cover transition duration-900 ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs uppercase tracking-[0.2em] text-[#F8F1E5]/20">
              Khoj destination
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#090D0B]/65 via-transparent to-transparent opacity-70 transition duration-500 group-hover:opacity-100" />

          <div className="absolute bottom-5 left-5 flex items-center gap-2 text-xs text-[#F8F1E5]/70 opacity-0 transition duration-500 group-hover:opacity-100">
            Explore destination
            <ArrowUpRight size={14} />
          </div>
        </div>

        <div className="pt-5">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#FF9933]">
            <span>
              {destination.states?.name ??
                'India'}
            </span>

            {destination.destination_type && (
              <>
                <span className="h-1 w-1 rounded-full bg-[#FF9933]" />

                <span>
                  {destination.destination_type}
                </span>
              </>
            )}
          </div>

          <h3 className="mt-3 font-serif text-3xl leading-tight transition duration-300 group-hover:text-[#FF9933]">
            {destination.name}
          </h3>

          {destination.short_description && (
            <p className="mt-3 max-w-sm text-sm leading-6 text-[#F8F1E5]/45">
              {destination.short_description}
            </p>
          )}
        </div>
      </button>
    </motion.article>
  )
}

export default ExplorePage