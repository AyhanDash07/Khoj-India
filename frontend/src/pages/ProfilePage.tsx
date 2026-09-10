import { useEffect, useMemo, useState } from 'react'

import { Link } from 'react-router-dom'

import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Compass,
  Globe2,
  Pencil,
  Sparkles,
  UserRound,
} from 'lucide-react'

import { motion } from 'framer-motion'

import { useAuth } from '../hooks/useAuth'

import {
  getUserPreferences,
  getProfile,
  updateProfile,
  type Profile,
  type UserPreferences,
} from '../services/profileService.ts'

function formatList(items: string[] | null | undefined) {
  if (!items || items.length === 0) {
    return 'Not specified'
  }

  return items.join(' · ')
}

function formatDuration(days: number | null | undefined) {
  if (!days) {
    return 'Not specified'
  }

  return `${days} ${days === 1 ? 'day' : 'days'}`
}

function formatBudget(
  budget: number | null | undefined,
  currency: string | null | undefined,
) {
  if (budget === null || budget === undefined) {
    return 'Not specified'
  }

  const currencyCode = currency || 'INR'

  try {
    return (
      new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: currencyCode,
        maximumFractionDigits: 0,
      }).format(budget) + ' / person / day'
    )
  } catch {
    return `${currencyCode} ${budget.toLocaleString(
      'en-IN',
    )} / person / day`
  }
}

function formatCrowdPreference(value: string | null | undefined) {
  if (!value) {
    return 'Not specified'
  }

  const labels: Record<string, string> = {
    quiet: 'I prefer quieter places',
    avoid_crowds: 'I avoid crowded places',
    balanced: 'A balance of calm and energy',
    social: 'I enjoy lively places',
    popular: 'I enjoy popular destinations',
  }

  return labels[value] ?? value
}

function createExplorerId(userId: string) {
  const compact = userId.replace(/-/g, '').slice(-6).toUpperCase()

  return `KHJ-${compact}`
}

function PreferenceRow({
  label,
  value,
  delay = 0,
}: {
  label: string
  value: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="grid gap-2 border-b border-[var(--color-border)] py-6 sm:grid-cols-[0.32fr_0.68fr]"
    >
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
        {label}
      </p>

      <p className="text-base leading-7 sm:text-lg">{value}</p>
    </motion.div>
  )
}

function ProfilePage() {
  const { user, loading: authLoading } = useAuth()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [preferences, setPreferences] = useState<UserPreferences | null>(
    null,
  )

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)

  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [language, setLanguage] = useState('')

  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) {
      return
    }

    const userId = user.id

    async function loadTraveller() {
      try {
        setLoading(true)
        setError('')
        setMessage('')

        const [profileData, preferencesData] = await Promise.all([
          getProfile(userId),
          getUserPreferences(userId),
        ])

        setProfile(profileData)
        setPreferences(preferencesData)

        setFullName(profileData?.full_name ?? '')
        setUsername(profileData?.username ?? '')
        setBio(profileData?.bio ?? '')
        setLanguage(profileData?.preferred_language ?? '')
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load your traveller profile.',
        )
      } finally {
        setLoading(false)
      }
    }

    loadTraveller()
  }, [user])

  async function handleSave() {
    if (!user) {
      return
    }

    try {
      setSaving(true)
      setError('')
      setMessage('')

      const updatedProfile = await updateProfile(user.id, {
        full_name: fullName.trim() || null,
        username: username.trim() || null,
        bio: bio.trim() || null,
        preferred_language: language.trim() || null,
      })

      setProfile(updatedProfile)

      setFullName(updatedProfile.full_name ?? '')
      setUsername(updatedProfile.username ?? '')
      setBio(updatedProfile.bio ?? '')
      setLanguage(updatedProfile.preferred_language ?? '')

      setEditing(false)
      setMessage('Your traveller profile has been updated.')

      window.setTimeout(() => {
        setMessage('')
      }, 3500)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unable to update your profile.',
      )
    } finally {
      setSaving(false)
    }
  }

  function handleCancelEdit() {
    setFullName(profile?.full_name ?? '')
    setUsername(profile?.username ?? '')
    setBio(profile?.bio ?? '')
    setLanguage(profile?.preferred_language ?? '')

    setEditing(false)
    setError('')
    setMessage('')
  }

  const explorerId = useMemo(() => {
    return user ? createExplorerId(user.id) : ''
  }, [user])

  const hasPreferences =
    Boolean(preferences?.interests?.length) ||
    Boolean(preferences?.travel_styles?.length) ||
    Boolean(preferences?.preferred_regions?.length) ||
    Boolean(preferences?.preferred_trip_duration_days) ||
    Boolean(preferences?.budget_per_day) ||
    Boolean(preferences?.crowd_preference) ||
    Boolean(preferences?.food_preferences?.length) ||
    Boolean(preferences?.accessibility_needs?.length)

  const preferenceCount = useMemo(() => {
    if (!preferences) {
      return 0
    }

    let count = 0

    if (preferences.interests?.length) count += 1
    if (preferences.travel_styles?.length) count += 1
    if (preferences.preferred_regions?.length) count += 1
    if (preferences.preferred_trip_duration_days) count += 1
    if (preferences.budget_per_day) count += 1
    if (preferences.crowd_preference) count += 1
    if (preferences.food_preferences?.length) count += 1
    if (preferences.accessibility_needs?.length) count += 1

    return count
  }, [preferences])

  if (authLoading || (user && loading)) {
    return (
      <section className="section-khoj min-h-[70vh]">
        <div className="container-khoj flex min-h-[60vh] items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-border)]">
              <Compass
                size={20}
                strokeWidth={1.4}
                className="text-[var(--color-accent)]"
              />
            </div>

            <p className="body-khoj mt-5">
              Discovering your traveller profile...
            </p>
          </motion.div>
        </div>
      </section>
    )
  }

  if (!user) {
    return (
      <section className="section-khoj min-h-[70vh]">
        <div className="container-khoj flex min-h-[60vh] flex-col items-center justify-center text-center">
          <p className="eyebrow-khoj">TRAVELLER</p>

          <h1 className="heading-khoj mt-4">
            Your journey starts with you.
          </h1>

          <p className="body-khoj mt-5 max-w-xl">
            Sign in to create your traveller profile and let Khoj understand
            how you like to explore India.
          </p>

          <Link to="/login" className="button-khoj mt-8">
            Sign in
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="section-khoj overflow-hidden">
      <div className="container-khoj">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mb-14"
        >
          <Link
            to="/"
            className="group inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
          >
            <ArrowLeft
              size={16}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
            Back to Khoj
          </Link>

          <div className="mt-10 max-w-4xl">
            <p className="eyebrow-khoj">KHOJ EXPLORER</p>

            <h1 className="heading-khoj mt-4">
              Your journey.
              <br />
              <span className="text-[var(--color-accent)]">
                Your way of discovering India.
              </span>
            </h1>

            <p className="body-khoj mt-6 max-w-2xl">
              This is more than an account. It is the traveller identity Khoj
              uses to understand your interests, your rhythm, and the kind of
              places that may feel meaningful to you.
            </p>
          </div>
        </motion.div>

        {/* Identity + preferences */}
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
          {/* Explorer identity */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="relative overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] p-7 sm:p-8 md:p-10"
          >
            {/* Decorative compass */}
            <div className="pointer-events-none absolute -right-10 -top-10 opacity-[0.035]">
              <Compass size={210} strokeWidth={0.8} />
            </div>

            {/* Identity header */}
            <div className="relative flex items-start justify-between gap-5">
              <div>
                <p className="eyebrow-khoj">EXPLORER</p>

                <p className="mt-2 text-xs tracking-[0.16em] text-[var(--color-text-secondary)]">
                  TRAVELLER IDENTITY
                </p>
              </div>

              {!editing ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditing(true)
                    setMessage('')
                    setError('')
                  }}
                  className="group inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                >
                  <Pencil
                    size={15}
                    className="transition-transform duration-300 group-hover:-rotate-6"
                  />
                  Edit
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                >
                  Cancel
                </button>
              )}
            </div>

            {/* Avatar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-10 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-background)]"
            >
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name ?? 'Traveller'}
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserRound
                  size={34}
                  strokeWidth={1.3}
                  className="text-[var(--color-text-secondary)]"
                />
              )}
            </motion.div>

            {editing ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 space-y-6"
              >
                <label className="block">
                  <span className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
                    Full name
                  </span>

                  <input
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    className="mt-2 w-full border-b border-[var(--color-border)] bg-transparent py-3 outline-none transition-colors focus:border-[var(--color-accent)]"
                    placeholder="Your name"
                  />
                </label>

                <label className="block">
                  <span className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
                    Username
                  </span>

                  <input
                    type="text"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    className="mt-2 w-full border-b border-[var(--color-border)] bg-transparent py-3 outline-none transition-colors focus:border-[var(--color-accent)]"
                    placeholder="your_username"
                  />
                </label>

                <label className="block">
                  <span className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
                    Bio
                  </span>

                  <textarea
                    value={bio}
                    onChange={(event) => setBio(event.target.value)}
                    rows={4}
                    className="mt-2 w-full resize-none border-b border-[var(--color-border)] bg-transparent py-3 outline-none transition-colors focus:border-[var(--color-accent)]"
                    placeholder="Tell Khoj something about your way of travelling..."
                  />
                </label>

                <label className="block">
                  <span className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
                    Preferred language
                  </span>

                  <input
                    type="text"
                    value={language}
                    onChange={(event) => setLanguage(event.target.value)}
                    className="mt-2 w-full border-b border-[var(--color-border)] bg-transparent py-3 outline-none transition-colors focus:border-[var(--color-accent)]"
                    placeholder="English"
                  />
                </label>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="button-khoj inline-flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Check size={16} />

                  {saving ? 'Saving...' : 'Save changes'}
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.22 }}
              >
                <h2 className="mt-8 text-3xl font-medium tracking-tight">
                  {profile?.full_name || 'Explorer'}
                </h2>

                {profile?.username && (
                  <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                    @{profile.username}
                  </p>
                )}

                <p className="mt-6 max-w-md leading-7 text-[var(--color-text-secondary)]">
                  {profile?.bio ||
                    'Still discovering your way of travelling.'}
                </p>

                {/* Language */}
                <div className="mt-10 border-t border-[var(--color-border)] pt-6">
                  <div className="flex items-start gap-3">
                    <Globe2
                      size={17}
                      strokeWidth={1.5}
                      className="mt-0.5 text-[var(--color-text-secondary)]"
                    />

                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
                        Language
                      </p>

                      <p className="mt-1">
                        {profile?.preferred_language || 'Not specified'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Explorer ID */}
                <div className="mt-8 border-t border-[var(--color-border)] pt-6">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
                        Khoj Explorer ID
                      </p>

                      <p className="mt-2 font-mono text-sm tracking-[0.14em]">
                        {explorerId}
                      </p>
                    </div>

                    <Compass
                      size={19}
                      strokeWidth={1.2}
                      className="text-[var(--color-accent)]"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Travel identity */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16 }}
            className="border border-[var(--color-border)] bg-[var(--color-surface)] p-7 sm:p-8 md:p-10"
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="eyebrow-khoj">YOUR WAY TO TRAVEL</p>

                <h2 className="mt-4 text-3xl font-medium tracking-tight">
                  What makes a journey yours?
                </h2>
              </div>

              <motion.div
                animate={{ rotate: [0, 5, -3, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: 'easeInOut',
                }}
              >
                <Sparkles
                  size={22}
                  strokeWidth={1.4}
                  className="mt-1 shrink-0 text-[var(--color-accent)]"
                />
              </motion.div>
            </div>

            <p className="mt-4 max-w-xl leading-7 text-[var(--color-text-secondary)]">
              Khoj uses these preferences to understand what kind of journey
              is likely to feel right for you.
            </p>

            {hasPreferences ? (
              <>
                {/* Preference progress */}
                <div className="mt-8 flex items-center justify-between border-y border-[var(--color-border)] py-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
                    Explorer profile
                  </p>

                  <p className="text-sm">
                    {preferenceCount} preference
                    {preferenceCount === 1 ? '' : 's'} defined
                  </p>
                </div>

                {/* Preference rows */}
                <div className="mt-2">
                  <PreferenceRow
                    label="Curious about"
                    value={formatList(preferences?.interests)}
                    delay={0.08}
                  />

                  <PreferenceRow
                    label="Travel rhythm"
                    value={formatList(preferences?.travel_styles)}
                    delay={0.12}
                  />

                  <div className="grid gap-0 border-b border-[var(--color-border)] sm:grid-cols-2 sm:gap-8">
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.16 }}
                      className="py-6"
                    >
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
                        Usual journey
                      </p>

                      <p className="mt-3 text-lg">
                        {formatDuration(
                          preferences?.preferred_trip_duration_days,
                        )}
                      </p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                      className="border-t border-[var(--color-border)] py-6 sm:border-l sm:border-t-0 sm:pl-8"
                    >
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
                        Daily comfort
                      </p>

                      <p className="mt-3 text-lg">
                        {formatBudget(
                          preferences?.budget_per_day,
                          preferences?.budget_currency,
                        )}
                      </p>
                    </motion.div>
                  </div>

                  <PreferenceRow
                    label="Crowd comfort"
                    value={formatCrowdPreference(
                      preferences?.crowd_preference,
                    )}
                    delay={0.24}
                  />

                  <PreferenceRow
                    label="Drawn towards"
                    value={formatList(preferences?.preferred_regions)}
                    delay={0.28}
                  />

                  <PreferenceRow
                    label="Food preferences"
                    value={formatList(preferences?.food_preferences)}
                    delay={0.32}
                  />

                  {preferences?.accessibility_needs?.length ? (
                    <PreferenceRow
                      label="Accessibility"
                      value={formatList(preferences.accessibility_needs)}
                      delay={0.36}
                    />
                  ) : null}
                </div>

                {/* Edit preferences */}
                <div className="mt-8 flex flex-wrap items-center gap-6">
                  <Link
                    to="/profile/preferences"
                    className="group inline-flex items-center text-sm font-medium"
                  >
                    Edit travel preferences

                    <ArrowUpRight
                      size={15}
                      className="ml-2 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </Link>

                  <Link
                    to="/plan"
                    className="group inline-flex items-center text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                  >
                    Plan a journey

                    <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.15 }}
                className="mt-10 border-t border-[var(--color-border)] pt-8"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--color-border)]">
                  <Sparkles
                    size={21}
                    strokeWidth={1.3}
                    className="text-[var(--color-accent)]"
                  />
                </div>

                <p className="mt-6 text-sm text-[var(--color-text-secondary)]">
                  Your Explorer profile is waiting to be shaped.
                </p>

                <p className="mt-3 max-w-lg text-xl leading-8">
                  Tell Khoj how you like to travel. The more it understands,
                  the more meaningful your discoveries can become.
                </p>

                <Link
                  to="/profile/preferences"
                  className="group mt-7 inline-flex items-center text-sm font-medium"
                >
                  Shape your travel preferences

                  <ArrowUpRight
                    size={15}
                    className="ml-2 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Khoj intelligence connection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.25 }}
          className="mt-8 border border-[var(--color-border)] bg-[var(--color-background)] p-7 sm:p-8 md:p-10"
        >
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="eyebrow-khoj">KHOJ INTELLIGENCE</p>

              <h2 className="mt-3 text-2xl font-medium tracking-tight">
                Your profile becomes your discovery compass.
              </h2>

              <p className="mt-3 max-w-2xl leading-7 text-[var(--color-text-secondary)]">
                Your preferences will eventually help Khoj balance personal
                interests with destination pressure, local impact, safety,
                accessibility, and community experiences.
              </p>
            </div>

            <Link
              to="/plan"
              className="group inline-flex items-center justify-center whitespace-nowrap text-sm font-medium"
            >
              Explore with Khoj

              <ArrowUpRight
                size={16}
                className="ml-2 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>
          </div>
        </motion.div>

        {/* Messages */}
        {message && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-sm text-[var(--color-text-secondary)]"
            role="status"
          >
            {message}
          </motion.p>
        )}

        {error && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-sm text-red-700"
            role="alert"
          >
            {error}
          </motion.p>
        )}
      </div>
    </section>
  )
}

export default ProfilePage