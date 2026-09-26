import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { motion, useAnimationControls, useReducedMotion } from "framer-motion";

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Compass,
  MapPin,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Users,
  Waves,
} from "lucide-react";

import { getRecommendations } from "../../services/recommendationService";
import type { Recommendation } from "../../types/recommendations";

/* -------------------------------------------------------------------------- */
/*                                CONSTANTS                                   */
/* -------------------------------------------------------------------------- */

const SWIPE_DISTANCE = 110;
const SWIPE_VELOCITY = 650;

const CARD_POSITIONS = {
  previous: {
    x: -430,
    y: 48,
    scale: 0.78,
    rotate: -3,
    opacity: 0.55,
    zIndex: 20,
  },

  active: {
    x: 0,
    y: 0,
    scale: 1,
    rotate: 0,
    opacity: 1,
    zIndex: 60,
  },

  next: {
    x: 430,
    y: 48,
    scale: 0.78,
    rotate: 3,
    opacity: 0.55,
    zIndex: 20,
  },
};

/* -------------------------------------------------------------------------- */
/*                              HELPER FUNCTIONS                              */
/* -------------------------------------------------------------------------- */

function formatCoordinate(
  value: number | null,
  positive: string,
  negative: string,
): string {
  if (value === null || Number.isNaN(value)) {
    return "—";
  }

  return `${Math.abs(value).toFixed(4)}° ${value >= 0 ? positive : negative}`;
}

function getState(recommendation: Recommendation): string {
  return recommendation.destination.state_name ?? "India";
}

function getImage(recommendation: Recommendation): string {
  const slug = recommendation.destination.slug?.toLowerCase() ?? "";

  const name = recommendation.destination.name.toLowerCase();

  /*
   * Supplied premium Vagamon image.
   * The file should exist at:
   * frontend/public/images/vagamon.jpg
   */
  if (slug === "vagamon" || name.includes("vagamon")) {
    return "/images/vagamon.jpg";
  }

  return recommendation.destination.image_url ?? "";
}

function getScore(recommendation: Recommendation): number {
  return Math.round(recommendation.intelligence.score.overall);
}

function getConfidence(recommendation: Recommendation): number {
  return Math.round(recommendation.intelligence.score.confidence.score);
}

/* -------------------------------------------------------------------------- */
/*                          INTELLIGENCE SIGNALS                              */
/* -------------------------------------------------------------------------- */

interface Signal {
  label: string;
  icon: "fit" | "impact" | "pressure" | "safety" | "season";
}

function getSignals(recommendation: Recommendation): Signal[] {
  const score = recommendation.intelligence.score;

  const signals: Array<Signal & { value: number }> = [];

  if (score.personal_fit >= 65) {
    signals.push({
      label:
        score.personal_fit >= 80
          ? "Matches your interests"
          : "Good personal fit",
      icon: "fit",
      value: score.personal_fit,
    });
  }

  if (score.impact !== null && score.impact >= 65) {
    signals.push({
      label:
        score.impact >= 80
          ? "Positive local impact"
          : "Supports local communities",
      icon: "impact",
      value: score.impact,
    });
  }

  if (score.pressure !== null && score.pressure >= 60) {
    signals.push({
      label: "Lower tourism pressure",
      icon: "pressure",
      value: score.pressure,
    });
  }

  if (score.safety !== null && score.safety >= 65) {
    signals.push({
      label:
        score.safety >= 75
          ? "Good safety conditions"
          : "Safety conditions considered",
      icon: "safety",
      value: score.safety,
    });
  }

  if (score.seasonality !== null && score.seasonality >= 65) {
    signals.push({
      label:
        score.seasonality >= 75
          ? "Good time to visit"
          : "Suitable travel season",
      icon: "season",
      value: score.seasonality,
    });
  }

  return signals
    .sort((a, b) => b.value - a.value)
    .slice(0, 3)
    .map(({ label, icon }) => ({
      label,
      icon,
    }));
}

function getSignalIcon(type: Signal["icon"]) {
  switch (type) {
    case "impact":
      return <Users size={14} />;

    case "pressure":
      return <Waves size={14} />;

    case "safety":
      return <ShieldCheck size={14} />;

    case "season":
      return <Compass size={14} />;

    default:
      return <Sparkles size={14} />;
  }
}

/* -------------------------------------------------------------------------- */
/*                              MAIN COMPONENT                                */
/* -------------------------------------------------------------------------- */

export default function SmartDiscovery() {
  const shouldReduceMotion = useReducedMotion();

  const navigate = useNavigate();

  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);

  const [hasInteracted, setHasInteracted] = useState(false);

  const [isAnimating, setIsAnimating] = useState(false);

  const swipeControls = useAnimationControls();

  /* ------------------------------------------------------------------------ */
  /*                              DATA LOADING                                */
  /* ------------------------------------------------------------------------ */

  const loadRecommendations = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getRecommendations({
        max_results: 6,
      });

      setRecommendations(response.recommendations);

      setActiveIndex(0);
      setHasInteracted(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load Smart Discovery.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  /*
   * We intentionally schedule the initial request
   * after mount instead of synchronously calling a
   * state-changing function from the effect.
   *
   * This keeps the React Hooks ESLint rule happy.
   */
  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadRecommendations();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadRecommendations]);

  /* ------------------------------------------------------------------------ */
  /*                           CURRENT DESTINATIONS                           */
  /* ------------------------------------------------------------------------ */

  const activeRecommendation =
    recommendations.length > 0
      ? recommendations[activeIndex % recommendations.length]
      : null;

  /* ------------------------------------------------------------------------ */
  /*                              NAVIGATION                                  */
  /* ------------------------------------------------------------------------ */

  const goNext = useCallback(() => {
    if (recommendations.length <= 1 || isAnimating) {
      return;
    }

    setHasInteracted(true);
    setActiveIndex((current) => (current + 1) % recommendations.length);
  }, [recommendations.length, isAnimating]);

  const goPrevious = useCallback(() => {
    if (recommendations.length <= 1 || isAnimating) {
      return;
    }

    setHasInteracted(true);
    setActiveIndex(
      (current) =>
        (current - 1 + recommendations.length) % recommendations.length,
    );
  }, [recommendations.length, isAnimating]);

  /* ------------------------------------------------------------------------ */
  /*                             KEYBOARD                                     */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrevious();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [goNext, goPrevious]);

  /* ------------------------------------------------------------------------ */
  /*                              SWIPE LOGIC                                 */
  /* ------------------------------------------------------------------------ */

  async function handleSwipe(direction: number) {
    if (recommendations.length <= 1 || isAnimating) {
      return;
    }

    setHasInteracted(true);
    setIsAnimating(true);

    if (shouldReduceMotion) {
      setActiveIndex((current) => {
        if (direction < 0) {
          return (current + 1) % recommendations.length;
        }

        return (current - 1 + recommendations.length) % recommendations.length;
      });

      swipeControls.set({
        x: 0,
        rotate: 0,
        opacity: 1,
      });

      setIsAnimating(false);

      return;
    }

    /*
     * FIRST:
     * Remove the active destination completely.
     *
     * We do NOT change activeIndex yet.
     */
    await swipeControls.start({
      x: direction * 900,
      rotate: direction * 7,
      opacity: 0,
      transition: {
        duration: 0.34,
        ease: [0.22, 1, 0.36, 1],
      },
    });

    /*
     * SECOND:
     * Now that the active card has left,
     * promote the next/previous card.
     */
    setActiveIndex((current) => {
      if (direction < 0) {
        return (current + 1) % recommendations.length;
      }

      return (current - 1 + recommendations.length) % recommendations.length;
    });

    /*
     * Reset the outgoing card before the
     * next render.
     */
    swipeControls.set({
      x: 0,
      rotate: 0,
      opacity: 1,
    });

    setIsAnimating(false);
  }

  function handleDragEnd(
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: {
      offset: { x: number };
      velocity: { x: number };
    },
  ) {
    if (isAnimating) {
      return;
    }

    const distance = Math.abs(info.offset.x);

    const velocity = Math.abs(info.velocity.x);

    if (distance < SWIPE_DISTANCE && velocity < SWIPE_VELOCITY) {
      return;
    }

    const direction = info.offset.x < 0 || info.velocity.x < 0 ? -1 : 1;

    void handleSwipe(direction);
  }

  /* ------------------------------------------------------------------------ */
  /*                                RENDER                                    */
  /* ------------------------------------------------------------------------ */

  return (
    <section
      className="
        relative
        overflow-hidden
        bg-[#06100C]
        py-24
        text-[#F8F1E5]
        md:py-28
        lg:py-32
      "
    >
      {/* ------------------------------------------------------------------ */}
      {/*                    CINEMATIC BACKGROUND                             */}
      {/* ------------------------------------------------------------------ */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
        aria-hidden="true"
      >
        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_50%_35%,rgba(255,153,51,0.10),transparent_28%),radial-gradient(circle_at_10%_55%,rgba(123,196,127,0.07),transparent_30%),radial-gradient(circle_at_90%_45%,rgba(40,53,147,0.07),transparent_30%)]
          "
        />

        <div
          className="
            absolute
            -left-[220px]
            top-[80px]
            h-[620px]
            w-[620px]
            rounded-full
            border
            border-[#FF9933]/10
          "
        />

        <div
          className="
            absolute
            -left-[150px]
            top-[150px]
            h-[480px]
            w-[480px]
            rounded-full
            border
            border-[#FF9933]/7
          "
        />

        <div
          className="
            absolute
            right-[-220px]
            bottom-[-120px]
            h-[650px]
            w-[650px]
            rounded-full
            border
            border-[#FF9933]/8
          "
        />

        <div
          className="
            absolute
            right-[-130px]
            bottom-[-40px]
            h-[500px]
            w-[500px]
            rounded-full
            border
            border-[#F8F1E5]/5
          "
        />

        <div
          className="
            absolute
            inset-0
            opacity-[0.025]
            [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)]
            [background-size:80px_80px]
          "
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/*                              CONTENT                                 */}
      {/* ------------------------------------------------------------------ */}

      <div
        className="
          relative
          mx-auto
          max-w-[1500px]
          px-5
          sm:px-8
          lg:px-10
        "
      >
        {/* ---------------------------------------------------------------- */}
        {/*                              HEADER                               */}
        {/* ---------------------------------------------------------------- */}

        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 16,
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
            viewport={{
              once: true,
              amount: 0.4,
            }}
            transition={{
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              mx-auto
              inline-flex
              items-center
              gap-2.5
              rounded-full
              border
              border-[#FF9933]/30
              bg-[#FF9933]/5
              px-5
              py-2.5
              text-[10px]
              font-medium
              uppercase
              tracking-[0.28em]
              text-[#F8F1E5]/75
            "
          >
            <Compass size={15} strokeWidth={1.4} className="text-[#FF9933]" />
            KHOJ INTELLIGENCE
          </motion.div>

          <motion.h2
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
            viewport={{
              once: true,
              amount: 0.4,
            }}
            transition={{
              duration: 0.65,
              delay: 0.06,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              mt-7
              font-['DM_Serif_Display']
              text-[48px]
              leading-[0.94]
              tracking-[-0.03em]
              text-[#F8F1E5]
              sm:text-[58px]
              md:text-[70px]
              lg:text-[82px]
            "
          >
            Destinations chosen
            <span className="block text-[#FF9933]">for you.</span>
          </motion.h2>

          <motion.p
            initial={
              shouldReduceMotion
                ? false
                : {
                    opacity: 0,
                    y: 14,
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
            viewport={{
              once: true,
              amount: 0.4,
            }}
            transition={{
              duration: 0.6,
              delay: 0.14,
            }}
            className="
              mx-auto
              mt-7
              max-w-[680px]
              text-sm
              leading-7
              text-[#F8F1E5]/50
              md:text-base
            "
          >
            Not just popular places.
            <br className="hidden sm:block" />
            Khoj finds possibilities shaped around your interests, travel style,
            safety, impact and destination conditions.
          </motion.p>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/*                           LOADING                                 */}
        {/* ---------------------------------------------------------------- */}

        {loading && (
          <div
            className="
              flex
              min-h-[650px]
              flex-col
              items-center
              justify-center
              text-[#F8F1E5]/45
            "
          >
            <RefreshCw
              size={27}
              strokeWidth={1.4}
              className="
                animate-spin
                text-[#FF9933]
              "
            />

            <p className="mt-5 text-sm">Khoj is finding places for you...</p>
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/*                             ERROR                                 */}
        {/* ---------------------------------------------------------------- */}

        {!loading && error && (
          <div
            className="
              mx-auto
              mt-16
              max-w-xl
              rounded-3xl
              border
              border-[#F8F1E5]/10
              bg-[#F8F1E5]/5
              p-8
              text-center
            "
          >
            <Sparkles
              size={28}
              className="
                mx-auto
                text-[#FF9933]
              "
            />

            <p
              className="
                mt-5
                text-sm
                leading-6
                text-[#F8F1E5]/55
              "
            >
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
                border-[#F8F1E5]/15
                bg-[#F8F1E5]/5
                px-5
                py-2.5
                text-sm
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:border-[#FF9933]/40
                hover:bg-[#FF9933]/10
                hover:text-[#FF9933]
              "
            >
              <RefreshCw size={15} />
              Try again
            </button>
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/*                         EMPTY STATE                               */}
        {/* ---------------------------------------------------------------- */}

        {!loading && !error && recommendations.length === 0 && (
          <div
            className="
                mx-auto
                mt-16
                max-w-xl
                rounded-3xl
                border
                border-[#F8F1E5]/10
                bg-[#F8F1E5]/5
                p-10
                text-center
              "
          >
            <Compass
              size={30}
              className="
                  mx-auto
                  text-[#FF9933]
                "
              strokeWidth={1.4}
            />

            <h3
              className="
                  mt-5
                  font-['DM_Serif_Display']
                  text-2xl
                "
            >
              Your journey is waiting.
            </h3>

            <p
              className="
                  mx-auto
                  mt-3
                  max-w-md
                  text-sm
                  leading-6
                  text-[#F8F1E5]/50
                "
            >
              Add traveller preferences to help Khoj understand what kind of
              India you want to discover.
            </p>
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/*                         DISCOVERY DECK                            */}
        {/* ---------------------------------------------------------------- */}

        {!loading &&
          !error &&
          activeRecommendation &&
          recommendations.length > 0 && (
            <div
              className="
    relative
    isolate
    mx-auto
    mt-16
    min-h-[760px]
    max-w-[1280px]
    lg:mt-20
  "
            >
              {/* ========================================================== */}
              {/*                         SIDE DECOR                          */}
              {/* ========================================================== */}

              <div
                className="
    pointer-events-none
    absolute
    right-0
    top-[42%]
    z-0
    hidden
    -translate-y-1/2
    lg:block
  "
              >
                <p
                  className="
      max-w-[180px]
      font-['DM_Serif_Display']
      text-2xl
      italic
      leading-tight
      text-[#F8F1E5]/20
    "
                >
                  Discover
                  <br />
                  beyond the
                  <br />
                  obvious.
                </p>
              </div>
              <div
                className="
                  pointer-events-none
                  absolute
                  right-4
                  top-36
                  hidden
                  text-right
                  xl:block
                "
              >
                <p
                  className="
                    max-w-[180px]
                    font-['DM_Serif_Display']
                    text-xl
                    italic
                    leading-tight
                    text-[#F8F1E5]/15
                  "
                >
                  A different
                  <br />
                  path through
                  <br />
                  India.
                </p>
              </div>

              {/* ========================================================== */}
              {/*                           DECK                              */}
              {/* ========================================================== */}

              <div
                className="
                  relative
                  mx-auto
                  h-[610px]
                  w-full
                  max-w-[1220px]
                "
              >
                <div
                  className="
    relative
    mx-auto
    h-[610px]
    w-full
    max-w-[1180px]
  "
                >
                  {/* ================================================================ */}
                  {/*                         PREVIOUS CARD                            */}
                  {/* ================================================================ */}

                  {recommendations.length > 1 && (
                    <motion.article
                      key={`previous-${
                        recommendations[
                          (activeIndex - 1 + recommendations.length) %
                            recommendations.length
                        ].destination.id
                      }`}
                      initial={false}
                      animate={{
                        x: CARD_POSITIONS.previous.x,
                        y: CARD_POSITIONS.previous.y,
                        scale: CARD_POSITIONS.previous.scale,
                        rotate: CARD_POSITIONS.previous.rotate,
                        opacity: CARD_POSITIONS.previous.opacity,
                      }}
                      transition={{
                        duration: shouldReduceMotion ? 0 : 0.48,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      style={{
                        position: "absolute",
                        left: "50%",
                        top: 0,
                        marginLeft: "-285px",
                        width: "570px",
                        height: "590px",
                        zIndex: CARD_POSITIONS.previous.zIndex,
                        pointerEvents: "none",
                      }}
                      className="
        overflow-hidden
        rounded-[24px]
        border
        border-[#D6B36A]/20
        bg-[#102018]
        shadow-[0_25px_70px_rgba(0,0,0,0.35)]
      "
                    >
                      <img
                        src={getImage(
                          recommendations[
                            (activeIndex - 1 + recommendations.length) %
                              recommendations.length
                          ],
                        )}
                        alt=""
                        draggable={false}
                        className="
          h-full
          w-full
          object-cover
        "
                      />

                      <div
                        className="
          absolute
          inset-0
          bg-black/45
        "
                      />

                      <div
                        className="
          absolute
          inset-x-0
          bottom-0
          p-6
        "
                      >
                        <p
                          className="
            text-[9px]
            font-semibold
            uppercase
            tracking-[0.18em]
            text-white/55
          "
                        >
                          {recommendations[
                            (activeIndex - 1 + recommendations.length) %
                              recommendations.length
                          ].destination.state_name ?? "India"}
                        </p>

                        <h3
                          className="
            mt-2
            font-['DM_Serif_Display']
            text-3xl
            text-white
          "
                        >
                          {
                            recommendations[
                              (activeIndex - 1 + recommendations.length) %
                                recommendations.length
                            ].destination.name
                          }
                        </h3>
                      </div>
                    </motion.article>
                  )}

                  {/* ================================================================ */}
                  {/*                            NEXT CARD                             */}
                  {/* ================================================================ */}

                  {recommendations.length > 1 && (
                    <motion.article
                      key={`next-${
                        recommendations[
                          (activeIndex + 1) % recommendations.length
                        ].destination.id
                      }`}
                      initial={false}
                      animate={{
                        x: CARD_POSITIONS.next.x,
                        y: CARD_POSITIONS.next.y,
                        scale: CARD_POSITIONS.next.scale,
                        rotate: CARD_POSITIONS.next.rotate,
                        opacity: CARD_POSITIONS.next.opacity,
                      }}
                      transition={{
                        duration: shouldReduceMotion ? 0 : 0.48,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      style={{
                        position: "absolute",
                        left: "50%",
                        top: 0,
                        marginLeft: "-285px",
                        width: "570px",
                        height: "590px",
                        zIndex: CARD_POSITIONS.next.zIndex,
                        pointerEvents: "none",
                      }}
                      className="
        overflow-hidden
        rounded-[24px]
        border
        border-[#D6B36A]/20
        bg-[#102018]
        shadow-[0_25px_70px_rgba(0,0,0,0.35)]
      "
                    >
                      <img
                        src={getImage(
                          recommendations[
                            (activeIndex + 1) % recommendations.length
                          ],
                        )}
                        alt=""
                        draggable={false}
                        className="
          h-full
          w-full
          object-cover
        "
                      />

                      <div
                        className="
          absolute
          inset-0
          bg-black/45
        "
                      />

                      <div
                        className="
          absolute
          inset-x-0
          bottom-0
          p-6
        "
                      >
                        <p
                          className="
            text-[9px]
            font-semibold
            uppercase
            tracking-[0.18em]
            text-white/55
          "
                        >
                          {recommendations[
                            (activeIndex + 1) % recommendations.length
                          ].destination.state_name ?? "India"}
                        </p>

                        <h3
                          className="
            mt-2
            font-['DM_Serif_Display']
            text-3xl
            text-white
          "
                        >
                          {
                            recommendations[
                              (activeIndex + 1) % recommendations.length
                            ].destination.name
                          }
                        </h3>
                      </div>
                    </motion.article>
                  )}

                  {/* ================================================================ */}
                  {/*                         ACTIVE HERO CARD                         */}
                  {/* ================================================================ */}

                  <motion.article
                    key={activeRecommendation.destination.id}
                    initial={false}
                    animate={swipeControls}
                    drag="x"
                    dragConstraints={{
                      left: 0,
                      right: 0,
                    }}
                    dragElastic={0.14}
                    dragMomentum={false}
                    onDragEnd={handleDragEnd}
                    whileDrag={
                      shouldReduceMotion
                        ? undefined
                        : {
                            scale: 1.015,
                            cursor: "grabbing",
                          }
                    }
                    transition={{
                      duration: shouldReduceMotion ? 0 : 0.42,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: 0,
                      marginLeft: "-285px",
                      width: "570px",
                      height: "590px",
                      zIndex: CARD_POSITIONS.active.zIndex,
                      willChange: "transform",
                      touchAction: "pan-y",
                      cursor: isAnimating ? "default" : "grab",
                    }}
                    className="
      overflow-hidden
      rounded-[24px]
      border
      border-[#D6B36A]/35
      bg-[#102018]
      shadow-[0_40px_110px_rgba(0,0,0,0.55)]
    "
                  >
                    {getImage(activeRecommendation) ? (
                      <img
                        src={getImage(activeRecommendation)}
                        alt={
                          activeRecommendation.destination.image_alt ??
                          activeRecommendation.destination.name
                        }
                        draggable={false}
                        className="
          absolute
          inset-0
          h-full
          w-full
          select-none
          object-cover
        "
                      />
                    ) : (
                      <div
                        className="
          absolute
          inset-0
          bg-[#13251C]
        "
                      />
                    )}

                    <div
                      className="
        absolute
        inset-0
        bg-[linear-gradient(to_bottom,rgba(3,12,8,0.55)_0%,rgba(3,12,8,0.08)_34%,rgba(3,12,8,0.18)_54%,rgba(3,12,8,0.96)_100%)]
      "
                    />

                    {/* ============================================================ */}
                    {/*                         TOP CONTENT                           */}
                    {/* ============================================================ */}

                    <div
                      className="
        relative
        z-10
        flex
        items-start
        justify-between
        p-6
        sm:p-7
      "
                    >
                      <div>
                        <div
                          className="
            flex
            items-center
            gap-2
            text-[13px]
            font-semibold
            uppercase
            tracking-[0.16em]
            text-white
          "
                        >
                          <MapPin size={18} />

                          {activeRecommendation.destination.name}
                        </div>

                        <div
                          className="
            mt-2
            pl-7
            text-[10px]
            uppercase
            tracking-[0.18em]
            text-white/65
          "
                        >
                          {getState(activeRecommendation)}, INDIA
                        </div>

                        <div
                          className="
            mt-2
            pl-7
            font-mono
            text-[9px]
            text-white/50
          "
                        >
                          {formatCoordinate(
                            activeRecommendation.destination.latitude,
                            "N",
                            "S",
                          )}
                          {" · "}
                          {formatCoordinate(
                            activeRecommendation.destination.longitude,
                            "E",
                            "W",
                          )}
                        </div>
                      </div>

                      {/* MATCH */}

                      <div
                        className="
          relative
          flex
          h-[88px]
          w-[88px]
          shrink-0
          rotate-[3deg]
          flex-col
          items-center
          justify-center
          rounded-full
          border
          border-[#F0D77B]/75
          bg-[#0C2117]/45
          text-[#F8F1E5]
        "
                      >
                        <div
                          className="
            absolute
            inset-[5px]
            rounded-full
            border
            border-[#F0D77B]/35
          "
                        />

                        <Compass
                          size={14}
                          className="
            absolute
            top-3
            text-[#F0D77B]
          "
                        />

                        <span
                          className="
            font-['DM_Serif_Display']
            text-[27px]
            leading-none
          "
                        >
                          {getScore(activeRecommendation)}%
                        </span>

                        <span
                          className="
            mt-1
            text-[7px]
            font-semibold
            uppercase
            tracking-[0.14em]
            text-white/75
          "
                        >
                          Khoj match
                        </span>
                      </div>
                    </div>

                    {/* ============================================================ */}
                    {/*                       KHOJ INDIA MARK                        */}
                    {/* ============================================================ */}

                    <div
                      className="
        absolute
        right-7
        top-[118px]
        z-10
        hidden
        items-center
        gap-2
        rounded-full
        border
        border-white/20
        bg-black/15
        px-3
        py-1.5
        text-[7px]
        uppercase
        tracking-[0.2em]
        text-white/60
        sm:flex
      "
                    >
                      <Compass size={11} className="text-[#FF9933]" />
                      KHOJ INDIA
                    </div>

                    {/* ============================================================ */}
                    {/*                         LOWER CONTENT                         */}
                    {/* ============================================================ */}

                    <div
                      className="
        absolute
        inset-x-0
        bottom-0
        z-10
        p-6
        sm:p-7
      "
                    >
                      <h3
                        className="
          font-['DM_Serif_Display']
          text-[44px]
          leading-[0.95]
          tracking-[-0.02em]
          text-white
          sm:text-[52px]
        "
                      >
                        {activeRecommendation.destination.name}
                      </h3>

                      <p
                        className="
          mt-3
          max-w-[430px]
          text-[11px]
          leading-5
          text-white/65
        "
                      >
                        {activeRecommendation.destination.short_description ??
                          "A place worth discovering beyond the usual path."}
                      </p>

                      <div
                        className="
          mt-5
          border-t
          border-white/15
          pt-4
        "
                      >
                        <div
                          className="
            mb-3
            text-[8px]
            font-semibold
            uppercase
            tracking-[0.2em]
            text-white/50
          "
                        >
                          Why Khoj recommends
                        </div>

                        <div className="space-y-2">
                          {getSignals(activeRecommendation).map((signal) => (
                            <div
                              key={signal.label}
                              className="
                flex
                items-center
                gap-2.5
                text-[10px]
                text-white/80
              "
                            >
                              <span
                                className="
                  flex
                  h-5
                  w-5
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-white/10
                  text-[#D9E5C6]
                "
                              >
                                {getSignalIcon(signal.icon)}
                              </span>

                              {signal.label}
                            </div>
                          ))}
                        </div>

                        <div
                          className="
            mt-4
            flex
            items-center
            justify-between
            gap-4
          "
                        >
                          <div
                            className="
              flex
              items-center
              gap-2
              text-[8px]
              uppercase
              tracking-[0.12em]
              text-white/40
            "
                          >
                            <ShieldCheck size={11} className="text-[#9BCB8D]" />
                            Khoj verified
                            <span className="text-white/20">·</span>
                            {getConfidence(activeRecommendation)}% confidence
                          </div>

                          <button
                            type="button"
                            disabled={isAnimating}
                            onClick={() => {
                              navigate(
                                `/explore?destination=${activeRecommendation.destination.id}`,
                              );
                            }}
                            className="
              group
              inline-flex
              shrink-0
              items-center
              gap-2
              rounded-full
              border
              border-white/30
              bg-black/25
              px-5
              py-2.5
              text-[10px]
              font-semibold
              text-white
              transition-all
              duration-300
              hover:border-[#F0D77B]
              hover:bg-[#F0D77B]
              hover:text-[#07130D]
            "
                          >
                            Explore destination
                            <ArrowUpRight
                              size={14}
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
                </div>
              </div>

              {/* ---------------------------------------------------------------- */}
              {/*                            CONTROLS                               */}
              {/* ---------------------------------------------------------------- */}

              <div
                className="
                  relative
                  z-[100]
                  mx-auto
                  mt-2
                  flex
                  flex-col
                  items-center
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-8
                  "
                >
                  <button
                    type="button"
                    onClick={goPrevious}
                    disabled={isAnimating}
                    aria-label="Previous destination"
                    className="
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#F8F1E5]/20
                      bg-[#F8F1E5]/5
                      text-[#F8F1E5]/70
                      backdrop-blur-sm
                      transition-all
                      duration-300
                      hover:border-[#FF9933]/50
                      hover:bg-[#FF9933]/10
                      hover:text-[#FF9933]
                      disabled:cursor-not-allowed
                      disabled:opacity-40
                    "
                  >
                    <ArrowLeft size={18} />
                  </button>

                  {/* pagination */}

                  <div
                    className="
                      flex
                      items-center
                      gap-2.5
                    "
                  >
                    {recommendations.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          if (isAnimating || index === activeIndex) {
                            return;
                          }

                          setHasInteracted(true);
                          setActiveIndex(index);
                        }}
                        aria-label={`Go to destination ${index + 1}`}
                        className={`
                            h-1.5
                            rounded-full
                            transition-all
                            duration-300
                            ${
                              index === activeIndex
                                ? "w-7 bg-[#FF9933]"
                                : "w-1.5 bg-[#F8F1E5]/20 hover:bg-[#F8F1E5]/45"
                            }
                          `}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={goNext}
                    disabled={isAnimating}
                    aria-label="Next destination"
                    className="
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#F8F1E5]/20
                      bg-[#F8F1E5]/5
                      text-[#F8F1E5]/70
                      backdrop-blur-sm
                      transition-all
                      duration-300
                      hover:border-[#FF9933]/50
                      hover:bg-[#FF9933]/10
                      hover:text-[#FF9933]
                      disabled:cursor-not-allowed
                      disabled:opacity-40
                    "
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>

                {/* swipe hint */}

                {!hasInteracted && (
                  <motion.div
                    initial={
                      shouldReduceMotion
                        ? false
                        : {
                            opacity: 0,
                            y: 8,
                          }
                    }
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: 0.8,
                      duration: 0.45,
                    }}
                    className="
                      mt-6
                      flex
                      items-center
                      gap-3
                      text-[9px]
                      uppercase
                      tracking-[0.18em]
                      text-[#F8F1E5]/35
                    "
                  >
                    <ArrowLeft size={13} />
                    Swipe to explore
                    <ArrowRight size={13} />
                  </motion.div>
                )}

                {/* index */}

                <div
                  className="
                    mt-4
                    flex
                    items-center
                    gap-2
                    text-[9px]
                    uppercase
                    tracking-[0.16em]
                    text-[#F8F1E5]/25
                  "
                >
                  <span className="text-[#F8F1E5]/65">
                    {String(activeIndex + 1).padStart(2, "0")}
                  </span>

                  <span>/</span>

                  <span>{String(recommendations.length).padStart(2, "0")}</span>
                </div>
              </div>
            </div>
          )}

        {/* ---------------------------------------------------------------- */}
        {/*                            FOOTER                                */}
        {/* ---------------------------------------------------------------- */}

        {!loading && !error && recommendations.length > 0 && (
          <div
            className="
                mx-auto
                mt-10
                flex
                max-w-6xl
                flex-col
                items-center
                justify-between
                gap-3
                border-t
                border-[#F8F1E5]/8
                pt-6
                text-[9px]
                uppercase
                tracking-[0.12em]
                text-[#F8F1E5]/25
                sm:flex-row
              "
          >
            <div
              className="
                  flex
                  items-center
                  gap-2
                "
            >
              <Sparkles size={12} className="text-[#FF9933]" />
              Recommendations generated from your traveller profile.
            </div>

            <div
              className="
                  flex
                  items-center
                  gap-2
                "
            >
              <CheckCircle2 size={12} className="text-[#7BC47F]" />
              Powered by Khoj Intelligence
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
