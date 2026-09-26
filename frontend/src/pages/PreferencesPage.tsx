import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, RotateCcw, Save, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import { supabase } from "../lib/supabase";

const INTERESTS = [
  "Nature",
  "Culture",
  "Food",
  "Heritage",
  "Adventure",
  "Wellness",
  "Arts & Crafts",
];

const TRAVEL_STYLES = [
  "Slow & relaxed",
  "Off the beaten path",
  "Cultural immersion",
  "Adventure",
  "Weekend escape",
  "Family travel",
  "Solo exploration",
];

const QUICK_DURATIONS = [1, 2, 3, 4, 5, 7, 10, 14];

const CROWD_PREFERENCES = [
  "I avoid them",
  "A little is okay",
  "I don't mind",
  "I enjoy lively places",
];

const REGIONS = [
  "Maharashtra",
  "Rajasthan",
  "Kerala",
  "Himachal Pradesh",
  "Meghalaya",
];

const FOOD_PREFERENCES = [
  "Local & regional",
  "Vegetarian",
  "Street food",
  "Fine dining",
  "Traditional food",
  "No preference",
];

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MIN_BUDGET = 500;
const MAX_BUDGET = 50000;
const BUDGET_STEP = 500;

interface PreferencesResponse {
  success: boolean;
  message?: string;
  data: {
    interests: string[];
    travel_styles: string[];
    preferred_trip_duration_days: number | null;
    budget_per_day: number | null;
    budget_currency: string | null;
    crowd_preference: string | null;
    preferred_regions: string[];
    accessibility_needs: string[];
    food_preferences: string[];
    language_preferences: string[];
    travel_month: number | null;
  };
}

function SelectionTile({
  label,
  selected,
  onClick,
  multiple = false,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  multiple?: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        duration: 0.18,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={[
        "group relative border px-5 py-4 text-left transition-all duration-300",
        selected
          ? "border-[var(--color-accent)] bg-[var(--color-accent)]/8"
          : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-text-secondary)]",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-4">
        <span
          className={
            selected ? "font-medium" : "text-[var(--color-text-primary)]"
          }
        >
          {label}
        </span>

        <motion.span
          animate={{
            scale: selected ? 1 : 0.96,
          }}
          transition={{ duration: 0.2 }}
          className={[
            "flex h-5 w-5 shrink-0 items-center justify-center border transition-all duration-300",
            selected
              ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
              : "border-[var(--color-border)] group-hover:border-[var(--color-text-secondary)]",
            multiple ? "rounded-md" : "rounded-full",
          ].join(" ")}
        >
          <AnimatePresence initial={false}>
            {selected && (
              <motion.span
                initial={{
                  opacity: 0,
                  scale: 0.5,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.5,
                }}
              >
                <Check size={12} strokeWidth={2.5} />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.span>
      </div>
    </motion.button>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-7">
      <p className="eyebrow-khoj">{eyebrow}</p>

      <h2 className="mt-3 text-2xl font-medium tracking-tight md:text-3xl">
        {title}
      </h2>

      <p className="mt-3 max-w-2xl leading-7 text-[var(--color-text-secondary)]">
        {description}
      </p>
    </div>
  );
}

function PreferencesPage() {
  const navigate = useNavigate();
  const resetConfirmationRef = useRef<HTMLDivElement | null>(null);

  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  const [resetting, setResetting] = useState(false);

  const [showResetConfirmation, setShowResetConfirmation] = useState(false);

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [interests, setInterests] = useState<string[]>([]);

  const [travelStyles, setTravelStyles] = useState<string[]>([]);

  const [tripDurationDays, setTripDurationDays] = useState<number | null>(null);

  const [customDuration, setCustomDuration] = useState("");

  const [crowdPreference, setCrowdPreference] = useState("");

  const [budgetPerDay, setBudgetPerDay] = useState<number | null>(null);

  const [budgetInput, setBudgetInput] = useState("");

  const [regions, setRegions] = useState<string[]>([]);

  const [foodPreferences, setFoodPreferences] = useState<string[]>([]);

  const [travelMonth, setTravelMonth] = useState<number | null>(null);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  /*
   * Load existing preferences.
   */
  useEffect(() => {
    if (!user) {
      return;
    }

    async function loadPreferences() {
      try {
        setLoading(true);
        setError("");
        setMessage("");

        const {
  data: { session },
} = await supabase.auth.getSession();

if (!session) {
  throw new Error("Your session has expired. Please sign in again.");
}

const response = await api.get<PreferencesResponse>(
  "/preferences",
  {
    token: session.access_token,
  },
);

if (!response.success) {
  throw new Error(
    response.message ?? "Unable to load your travel preferences.",
  );
}

const data = response.data;

        setInterests(data?.interests ?? []);

        setTravelStyles(data?.travel_styles ?? []);

        const savedDuration = data?.preferred_trip_duration_days;

        if (typeof savedDuration === "number" && savedDuration > 0) {
          setTripDurationDays(savedDuration);

          if (!QUICK_DURATIONS.includes(savedDuration)) {
            setCustomDuration(String(savedDuration));
          }
        } else {
          setTripDurationDays(null);
          setCustomDuration("");
        }

        setCrowdPreference(data?.crowd_preference ?? "");

        const savedBudget = data?.budget_per_day;

        if (typeof savedBudget === "number" && savedBudget >= 0) {
          setBudgetPerDay(savedBudget);
          setBudgetInput(String(savedBudget));
        } else {
          setBudgetPerDay(null);
          setBudgetInput("");
        }

        setRegions(data?.preferred_regions ?? []);

        setFoodPreferences(data?.food_preferences ?? []);

        setTravelMonth(data?.travel_month ?? null);

        setHasUnsavedChanges(false);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load your travel preferences.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadPreferences();
  }, [user]);

  /*
   * Temporary success notification.
   */
  useEffect(() => {
    if (!message) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setMessage("");
    }, 3500);

    return () => window.clearTimeout(timeout);
  }, [message]);

  /*
   * Smoothly reveal reset confirmation.
   */
  useEffect(() => {
    if (!showResetConfirmation) {
      return;
    }

    const timeout = window.setTimeout(() => {
      resetConfirmationRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 80);

    return () => window.clearTimeout(timeout);
  }, [showResetConfirmation]);

  function markAsChanged() {
    setHasUnsavedChanges(true);
    setMessage("");
    setError("");
  }

  function toggleSelection(
    value: string,
    current: string[],
    setter: (values: string[]) => void,
  ) {
    if (current.includes(value)) {
      setter(current.filter((item) => item !== value));
    } else {
      setter([...current, value]);
    }

    markAsChanged();
  }

  function handleDurationChange(days: number) {
    setTripDurationDays(days);
    setCustomDuration("");
    markAsChanged();
  }

  function handleCustomDurationChange(value: string) {
    const cleanValue = value.replace(/\D/g, "");

    setCustomDuration(cleanValue);

    if (cleanValue === "") {
      setTripDurationDays(null);
    } else {
      const parsed = Number(cleanValue);

      if (parsed >= 1 && parsed <= 365) {
        setTripDurationDays(parsed);
      }
    }

    markAsChanged();
  }

  function handleTravelMonthChange(month: number) {
    setTravelMonth(month);
    markAsChanged();
  }

  function handleBudgetSliderChange(value: string) {
    const parsed = Number(value);

    if (!Number.isFinite(parsed)) {
      return;
    }

    setBudgetPerDay(parsed);
    setBudgetInput(String(parsed));
    markAsChanged();
  }

  function handleBudgetInputChange(value: string) {
    const cleanValue = value.replace(/[^\d]/g, "");

    setBudgetInput(cleanValue);

    if (cleanValue === "") {
      setBudgetPerDay(null);
      markAsChanged();
      return;
    }

    const parsed = Number(cleanValue);

    if (parsed >= MIN_BUDGET && parsed <= MAX_BUDGET) {
      setBudgetPerDay(parsed);
    }

    markAsChanged();
  }

  function commitBudgetInput() {
    if (budgetInput === "") {
      setBudgetPerDay(null);
      return;
    }

    const parsed = Number(budgetInput);

    if (!Number.isFinite(parsed)) {
      setBudgetPerDay(null);
      setBudgetInput("");
      return;
    }

    const clamped = Math.min(MAX_BUDGET, Math.max(MIN_BUDGET, parsed));

    const rounded = Math.round(clamped / BUDGET_STEP) * BUDGET_STEP;

    setBudgetPerDay(rounded);
    setBudgetInput(String(rounded));
  }

  async function handleSave() {
    if (!user || !hasUnsavedChanges) {
      return;
    }

    /*
     * Validate duration before sending.
     */
    if (
      tripDurationDays !== null &&
      (tripDurationDays < 1 || tripDurationDays > 365)
    ) {
      setError("Trip duration must be between 1 and 365 days.");
      return;
    }

    /*
     * Validate budget before sending.
     */
    if (budgetPerDay !== null && (budgetPerDay < 0 || budgetPerDay > 1000000)) {
      setError("Please enter a valid daily budget.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      /*
       * We continue writing the legacy fields
       * temporarily while the V2 fields become
       * the source of truth.
       */
      const {
  data: { session },
} = await supabase.auth.getSession();

if (!session) {
  throw new Error("Your session has expired. Please sign in again.");
}

const response = await api.post<PreferencesResponse>(
  "/preferences",
  {
    interests,
    travel_styles: travelStyles,
    preferred_trip_duration_days: tripDurationDays,
    budget_per_day: budgetPerDay,
    budget_currency: budgetPerDay !== null ? "INR" : null,
    crowd_preference: crowdPreference || null,
    preferred_regions: regions,
    accessibility_needs: [],
    food_preferences: foodPreferences,
    language_preferences: [],
    travel_month: travelMonth,
  },
  {
    token: session.access_token,
  },
);

if (!response.success) {
  throw new Error(
    response.message ?? "Unable to save your travel preferences.",
  );
}

      setHasUnsavedChanges(false);

      setMessage("Your travel preferences have been saved.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save your travel preferences.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleResetPreferences() {
    if (!user) {
      return;
    }

    try {
      setResetting(true);
      setError("");
      setMessage("");

      const {
  data: { session },
} = await supabase.auth.getSession();

if (!session) {
  throw new Error("Your session has expired. Please sign in again.");
}

const response = await api.post<PreferencesResponse>(
  "/preferences",
  {
    interests: [],
    travel_styles: [],
    preferred_trip_duration_days: null,
    budget_per_day: null,
    budget_currency: null,
    crowd_preference: null,
    preferred_regions: [],
    accessibility_needs: [],
    food_preferences: [],
    language_preferences: [],
    travel_month: null,
  },
  {
    token: session.access_token,
  },
);

if (!response.success) {
  throw new Error(
    response.message ?? "Unable to reset your travel preferences.",
  );
}

      setInterests([]);
      setTravelStyles([]);

      setTripDurationDays(null);
      setCustomDuration("");

      setCrowdPreference("");

      setBudgetPerDay(null);
      setBudgetInput("");

      setRegions([]);
      setFoodPreferences([]);
      setTravelMonth(null);

      setHasUnsavedChanges(false);

      setShowResetConfirmation(false);

      setMessage(
        "Your preferences have been cleared. Khoj is ready for a fresh start.",
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to reset your travel preferences.",
      );
    } finally {
      setResetting(false);
    }
  }

  function handleStartFresh() {
    navigate("/plan", {
      state: {
        freshStart: true,
      },
    });
  }

  if (authLoading || (user && loading)) {
    return (
      <section className="section-khoj min-h-[70vh]">
        <div className="container-khoj flex min-h-[60vh] items-center justify-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="body-khoj"
          >
            Understanding your way of travelling...
          </motion.p>
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="section-khoj min-h-[70vh]">
        <div className="container-khoj flex min-h-[60vh] flex-col items-center justify-center text-center">
          <p className="eyebrow-khoj">KHOJ INTELLIGENCE</p>

          <h1 className="heading-khoj mt-4 max-w-2xl">
            Tell Khoj how you travel.
          </h1>

          <p className="body-khoj mt-5 max-w-xl">
            Sign in to create your traveller profile and personalise the
            journeys Khoj discovers for you.
          </p>

          <Link to="/login" className="button-khoj mt-8">
            Sign in
          </Link>
        </div>
      </section>
    );
  }

  const sliderValue = budgetPerDay ?? MIN_BUDGET;

  return (
    <section className="section-khoj">
      <div className="container-khoj">
        {/* Header */}
        <motion.div
          initial={{
            opacity: 0,
            y: 12,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mb-14"
        >
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
          >
            <ArrowLeft size={16} />
            Back to profile
          </Link>

          <p className="eyebrow-khoj mt-10">KHOJ INTELLIGENCE</p>

          <h1 className="heading-khoj mt-4 max-w-4xl">
            Tell us how
            <br />
            <span className="text-[var(--color-accent)]">you travel.</span>
          </h1>

          <p className="body-khoj mt-5 max-w-2xl">
            There is no right way to explore India. Choose what feels like you,
            and Khoj will use it to shape better discoveries.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
            <Sparkles size={15} className="text-[var(--color-accent)]" />
            <span>You are editing your traveller profile.</span>
          </div>
        </motion.div>

        <div className="space-y-16">
          {/* 01 — Interests */}
          <motion.section
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
              delay: 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <SectionHeading
              eyebrow="01 — WHAT DRAWS YOU"
              title="What are you curious about?"
              description="Choose as many as feel natural. These become some of Khoj's strongest signals when discovering experiences for you."
            />

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {INTERESTS.map((interest) => (
                <SelectionTile
                  key={interest}
                  label={interest}
                  selected={interests.includes(interest)}
                  multiple
                  onClick={() =>
                    toggleSelection(interest, interests, setInterests)
                  }
                />
              ))}
            </div>
          </motion.section>

          {/* 02 — Travel style */}
          <motion.section
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <SectionHeading
              eyebrow="02 — YOUR RHYTHM"
              title="How do you like to travel?"
              description="Your travel style matters as much as the destination itself."
            />

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {TRAVEL_STYLES.map((style) => (
                <SelectionTile
                  key={style}
                  label={style}
                  selected={travelStyles.includes(style)}
                  multiple
                  onClick={() =>
                    toggleSelection(style, travelStyles, setTravelStyles)
                  }
                />
              ))}
            </div>
          </motion.section>

          {/* 03 — Duration */}
          <motion.section
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <SectionHeading
              eyebrow="03 — YOUR TIME"
              title="How long do you usually disappear for?"
              description="Choose an exact number of days. Khoj can then build recommendations around the amount of time you actually have."
            />

            <div className="grid gap-3 grid-cols-2 sm:grid-cols-4 lg:grid-cols-8">
              {QUICK_DURATIONS.map((days) => (
                <SelectionTile
                  key={days}
                  label={`${days} ${days === 1 ? "day" : "days"}`}
                  selected={tripDurationDays === days && !customDuration}
                  onClick={() => handleDurationChange(days)}
                />
              ))}
            </div>

            <div className="mt-6 max-w-md">
              <label htmlFor="custom-duration" className="text-sm font-medium">
                Or choose your own
              </label>

              <div className="mt-2 flex items-center border border-[var(--color-border)] bg-[var(--color-surface)]">
                <input
                  id="custom-duration"
                  type="number"
                  min={1}
                  max={365}
                  value={customDuration}
                  onChange={(event) =>
                    handleCustomDurationChange(event.target.value)
                  }
                  placeholder="e.g. 12"
                  className="w-full bg-transparent px-4 py-3 outline-none"
                />

                <span className="px-4 text-sm text-[var(--color-text-secondary)]">
                  days
                </span>
              </div>

              <p className="mt-2 text-xs text-[var(--color-text-secondary)]">
                Choose anywhere from 1 to 365 days.
              </p>
            </div>
          </motion.section>

          {/* 04 — Crowds */}
          <motion.section
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <SectionHeading
              eyebrow="04 — YOUR CROWD COMFORT"
              title="What do you feel about crowds?"
              description="This preference becomes especially important when Khoj considers tourist pressure and hidden alternatives."
            />

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {CROWD_PREFERENCES.map((preference) => (
                <SelectionTile
                  key={preference}
                  label={preference}
                  selected={crowdPreference === preference}
                  onClick={() => {
                    setCrowdPreference(preference);
                    markAsChanged();
                  }}
                />
              ))}
            </div>
          </motion.section>

          {/* 05 — Budget */}
          <motion.section
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
              delay: 0.25,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <SectionHeading
              eyebrow="05 — YOUR COMFORT"
              title="What feels right for your budget?"
              description="Give Khoj a practical number instead of choosing a vague budget category. This is your approximate spend per person, per day."
            />

            <div className="max-w-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 md:p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Approximate daily budget
                  </p>

                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      ₹
                    </span>

                    <span className="text-4xl font-medium tracking-tight">
                      {budgetPerDay
                        ? budgetPerDay.toLocaleString("en-IN")
                        : "—"}
                    </span>

                    <span className="text-sm text-[var(--color-text-secondary)]">
                      / person / day
                    </span>
                  </div>
                </div>

                <div className="w-full sm:w-48">
                  <label htmlFor="budget-input" className="sr-only">
                    Daily budget in Indian rupees
                  </label>

                  <div className="flex items-center border border-[var(--color-border)]">
                    <span className="px-3 text-sm text-[var(--color-text-secondary)]">
                      ₹
                    </span>

                    <input
                      id="budget-input"
                      type="text"
                      inputMode="numeric"
                      value={budgetInput}
                      onChange={(event) =>
                        handleBudgetInputChange(event.target.value)
                      }
                      onBlur={commitBudgetInput}
                      placeholder="5000"
                      className="w-full bg-transparent px-2 py-3 text-sm outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <label htmlFor="budget-slider" className="sr-only">
                  Daily budget
                </label>

                <input
                  id="budget-slider"
                  type="range"
                  min={MIN_BUDGET}
                  max={MAX_BUDGET}
                  step={BUDGET_STEP}
                  value={sliderValue}
                  onChange={(event) =>
                    handleBudgetSliderChange(event.target.value)
                  }
                  className="w-full cursor-pointer accent-[var(--color-accent)]"
                />

                <div className="mt-2 flex justify-between text-xs text-[var(--color-text-secondary)]">
                  <span>₹{MIN_BUDGET.toLocaleString("en-IN")}</span>

                  <span>₹{MAX_BUDGET.toLocaleString("en-IN")}+</span>
                </div>
              </div>

              <p className="mt-6 text-sm leading-6 text-[var(--color-text-secondary)]">
                This is not a spending limit. It simply gives Khoj a signal when
                balancing stays, food, transport and experiences.
              </p>
            </div>
          </motion.section>

          {/* 06 — Regions */}
          <motion.section
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
              delay: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <SectionHeading
              eyebrow="06 — WHERE NEXT"
              title="Which parts of India call you?"
              description="Choose the regions you're curious about."
            />

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {REGIONS.map((region) => (
                <SelectionTile
                  key={region}
                  label={region}
                  selected={regions.includes(region)}
                  multiple
                  onClick={() => toggleSelection(region, regions, setRegions)}
                />
              ))}
            </div>
          </motion.section>

          {/* 07 — Food */}
          <motion.section
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
              delay: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <SectionHeading
              eyebrow="07 — TASTE OF THE JOURNEY"
              title="What belongs on your table?"
              description="Food can be one of the best ways to discover a place. Tell Khoj what you're drawn to."
            />

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {FOOD_PREFERENCES.map((food) => (
                <SelectionTile
                  key={food}
                  label={food}
                  selected={foodPreferences.includes(food)}
                  multiple
                  onClick={() =>
                    toggleSelection(food, foodPreferences, setFoodPreferences)
                  }
                />
              ))}
            </div>
          </motion.section>

          {/* 08 — Travel month */}
          <motion.section
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
              delay: 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <SectionHeading
              eyebrow="08 — WHEN ARE YOU GOING"
              title="When would you like to explore?"
              description="Your travel month helps Khoj understand seasonal conditions, crowd patterns and the best time to visit each destination."
            />

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {MONTHS.map((month, index) => {
                const monthNumber = index + 1;

                return (
                  <SelectionTile
                    key={month}
                    label={month}
                    selected={travelMonth === monthNumber}
                    onClick={() => handleTravelMonthChange(monthNumber)}
                  />
                );
              })}
            </div>

            <p className="mt-4 text-xs text-[var(--color-text-secondary)]">
              Choose the month you are most likely to travel. Khoj can use this
              when evaluating seasonal suitability.
            </p>
          </motion.section>

          {/* Save */}
          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
              delay: 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="border-t border-[var(--color-border)] pt-10"
          >
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-lg font-medium">
                  Ready to let Khoj learn your rhythm?
                </p>

                <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                  You can change these preferences at any time.
                </p>
              </div>

              <motion.button
                type="button"
                onClick={handleSave}
                disabled={saving || !hasUnsavedChanges}
                whileHover={
                  hasUnsavedChanges && !saving ? { y: -2 } : undefined
                }
                whileTap={
                  hasUnsavedChanges && !saving ? { scale: 0.98 } : undefined
                }
                transition={{
                  duration: 0.2,
                }}
                className="button-khoj inline-flex items-center justify-center gap-2 transition-all duration-300 disabled:cursor-default disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Saving...
                  </>
                ) : hasUnsavedChanges ? (
                  <>
                    <Save size={16} />
                    Save preferences
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    All changes saved
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Success */}
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -8,
                }}
                transition={{
                  duration: 0.3,
                }}
                role="status"
                aria-live="polite"
                className="border border-[var(--color-accent)]/40 bg-[var(--color-accent)]/5 px-5 py-4 text-sm text-[var(--color-text-secondary)]"
              >
                <div className="flex items-center gap-3">
                  <Check
                    size={16}
                    className="shrink-0 text-[var(--color-accent)]"
                  />

                  <span>{message}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 8,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -8,
                }}
                transition={{
                  duration: 0.3,
                }}
                role="alert"
                className="border border-red-200 px-5 py-4 text-sm text-red-700"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Preference management */}
          <motion.section
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
              delay: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="border-t border-[var(--color-border)] pt-14"
          >
            <p className="eyebrow-khoj">YOUR KHOJ PROFILE</p>

            <h2 className="mt-4 text-2xl font-medium tracking-tight md:text-3xl">
              Change the way Khoj knows you.
            </h2>

            <p className="mt-3 max-w-2xl leading-7 text-[var(--color-text-secondary)]">
              Your preferences are the personal layer Khoj uses to understand
              your travel style. Change them whenever your interests change,
              clear them when you want a blank slate, or start a completely new
              discovery with Khoj.
            </p>

            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              {/* Start Fresh */}
              <motion.button
                type="button"
                onClick={handleStartFresh}
                whileHover={{
                  y: -4,
                }}
                whileTap={{
                  scale: 0.99,
                }}
                transition={{
                  duration: 0.25,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-left transition-colors duration-300 hover:border-[var(--color-accent)]"
              >
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <motion.div
                      whileHover={{
                        scale: 1.05,
                      }}
                      transition={{
                        duration: 0.2,
                      }}
                      className="mb-4 flex h-10 w-10 items-center justify-center border border-[var(--color-border)]"
                    >
                      <Sparkles size={18} />
                    </motion.div>

                    <h3 className="text-xl font-medium">
                      Start fresh with Khoj
                    </h3>

                    <p className="mt-3 max-w-md text-sm leading-6 text-[var(--color-text-secondary)]">
                      Looking for something different? Begin a new discovery
                      conversation and tell Khoj what you want from your next
                      journey.
                    </p>
                  </div>

                  <span className="text-[var(--color-accent)] transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </motion.button>

              {/* Reset Preferences */}
              <motion.div
                whileHover={{
                  y: -4,
                }}
                transition={{
                  duration: 0.25,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-colors duration-300 hover:border-[var(--color-accent)]"
              >
                <motion.div
                  whileHover={{
                    rotate: -12,
                    scale: 1.05,
                  }}
                  transition={{
                    duration: 0.25,
                  }}
                  className="mb-4 flex h-10 w-10 items-center justify-center border border-[var(--color-border)]"
                >
                  <RotateCcw size={18} />
                </motion.div>

                <h3 className="text-xl font-medium">Reset your Khoj profile</h3>

                <p className="mt-3 max-w-md text-sm leading-6 text-[var(--color-text-secondary)]">
                  Clear the travel preferences Khoj currently uses to
                  personalise your recommendations. Your account, profile,
                  journeys and saved places stay untouched.
                </p>

                <motion.button
                  type="button"
                  onClick={() => setShowResetConfirmation(true)}
                  whileHover={{
                    x: 2,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  className="mt-6 text-sm font-medium underline decoration-[var(--color-text-secondary)] underline-offset-4 transition-all duration-300 hover:text-[var(--color-accent)] hover:decoration-[var(--color-accent)]"
                >
                  Clear my preferences
                </motion.button>
              </motion.div>
            </div>
          </motion.section>

          {/* Reset Confirmation */}
          <AnimatePresence>
            {showResetConfirmation && (
              <motion.div
                ref={resetConfirmationRef}
                initial={{
                  opacity: 0,
                  y: 18,
                  scale: 0.99,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: -8,
                  scale: 0.99,
                }}
                transition={{
                  duration: 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="border border-[var(--color-accent)] bg-[var(--color-surface)] p-6 md:p-8"
              >
                <p className="eyebrow-khoj">RESET KHOJ PROFILE</p>

                <h3 className="mt-4 text-2xl font-medium">Are you sure?</h3>

                <p className="mt-3 max-w-2xl leading-7 text-[var(--color-text-secondary)]">
                  This will clear your travel preferences from Khoj. Your
                  profile, saved places, journeys, reviews and account will
                  remain untouched.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setShowResetConfirmation(false)}
                    disabled={resetting}
                    className="border border-[var(--color-border)] px-5 py-3 text-sm font-medium transition-colors hover:border-[var(--color-text-primary)] disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <motion.button
                    type="button"
                    onClick={handleResetPreferences}
                    disabled={resetting}
                    whileHover={!resetting ? { y: -2 } : undefined}
                    whileTap={!resetting ? { scale: 0.98 } : undefined}
                    transition={{
                      duration: 0.2,
                    }}
                    className="inline-flex items-center justify-center gap-2 border border-[var(--color-accent)] bg-[var(--color-accent)] px-5 py-3 text-sm font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {resetting ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Resetting...
                      </>
                    ) : (
                      <>
                        <RotateCcw size={15} />
                        Reset everything
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export default PreferencesPage;
