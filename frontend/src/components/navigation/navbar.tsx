import { ChevronDown, Menu, Search, UserRound, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { NAVIGATION_ITEMS } from "../../config/constants";
import { ROUTES } from "../../config/routes";
import { useAuth } from "../../hooks/useAuth";
import { getProfile } from "../../services/profileService.ts";
import { signOut } from "../../services/authService.ts";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [profileName, setProfileName] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  const { user, loading } = useAuth();

  /*
   * ---------------------------------------------------------
   * Load the traveller profile
   *
   * We intentionally create a local user ID inside the
   * effect so TypeScript knows it is definitely a string
   * before getProfile() is called.
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const loadProfileName = async (id: string) => {
      try {
        const profile = await getProfile(id);

        setProfileName(profile?.full_name ?? null);
      } catch (error) {
        console.error("Failed to load navbar profile:", error);

        setProfileName(null);
      }
    };

    loadProfileName(user.id);
  }, [user?.id]);

  /*
   * ---------------------------------------------------------
   * Active navigation state
   * ---------------------------------------------------------
   */

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  /*
   * ---------------------------------------------------------
   * Display identity
   *
   * Priority:
   *
   * 1. Profile name from public.profiles
   * 2. Supabase Auth metadata
   * 3. Explorer
   * ---------------------------------------------------------
   */

  const displayName =
    profileName || user?.user_metadata?.full_name || "Explorer";

  /*
   * ---------------------------------------------------------
   * Menu helpers
   * ---------------------------------------------------------
   */

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const closeAccount = () => {
    setIsAccountOpen(false);
  };

  /*
   * ---------------------------------------------------------
   * Sign out
   * ---------------------------------------------------------
   */

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);

      await signOut();

      setProfileName(null);
      setIsAccountOpen(false);
      setIsMenuOpen(false);

      navigate(ROUTES.home);
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  /*
   * ---------------------------------------------------------
   * Render
   * ---------------------------------------------------------
   */

  return (
    <motion.header
      initial={{
        y: -24,
        opacity: 0,
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-background)]/95 backdrop-blur-md"
    >
      <div className="container-khoj">
        <nav
          className="flex h-20 items-center justify-between"
          aria-label="Main navigation"
        >
          {/* =================================================
              KHOJ INDIA LOGO
              ================================================= */}

          <Link
            to={ROUTES.home}
            className="shrink-0 text-sm font-semibold tracking-[0.18em] text-[var(--color-text-primary)] transition-colors duration-300 hover:text-[var(--color-gold-soft)]"
            aria-label="Khoj India home"
          >
            KHOJ INDIA
          </Link>

          {/* =================================================
              DESKTOP NAVIGATION
              ================================================= */}

          <div className="hidden items-center gap-7 lg:flex">
            {NAVIGATION_ITEMS.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`relative py-2 text-sm transition-colors duration-300 ${
                    active
                      ? "font-medium text-[var(--color-gold-soft)]"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                  }`}
                >
                  {item.label}

                  <AnimatePresence>
                    {active && (
                      <motion.span
                        layoutId="navbar-active-indicator"
                        initial={{
                          opacity: 0,
                          scaleX: 0,
                        }}
                        animate={{
                          opacity: 1,
                          scaleX: 1,
                        }}
                        exit={{
                          opacity: 0,
                          scaleX: 0,
                        }}
                        transition={{
                          duration: 0.3,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="absolute inset-x-0 -bottom-1 mx-auto h-px w-5 origin-center bg-[var(--color-gold-soft)]"
                      />
                    )}
                  </AnimatePresence>
                </Link>
              );
            })}
          </div>

          {/* =================================================
              DESKTOP ACTIONS
              ================================================= */}

          <div className="hidden items-center gap-5 lg:flex">
            {/* Search */}

            <motion.button
              type="button"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.94 }}
              transition={{ duration: 0.2 }}
              className="text-[var(--color-text-secondary)] transition-colors duration-300 hover:text-[var(--color-text-primary)]"
              aria-label="Search Khoj India"
            >
              <Search size={19} strokeWidth={1.7} />
            </motion.button>

            {/* =================================================
                LOGGED OUT
                ================================================= */}

            {!loading && !user && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-5"
              >
                <Link
                  to={ROUTES.login}
                  className="text-sm font-medium text-[var(--color-text-primary)] transition-colors duration-300 hover:text-[var(--color-gold-soft)]"
                >
                  Login
                </Link>

                <Link
                  to={ROUTES.register}
                  className="text-sm font-medium text-[var(--color-text-primary)] transition-colors duration-300 hover:text-[var(--color-gold-soft)]"
                >
                  Sign up
                </Link>
              </motion.div>
            )}

            {/* =================================================
                LOGGED IN ACCOUNT
                ================================================= */}

            {!loading && user && (
              <div className="relative">
                <motion.button
                  type="button"
                  onClick={() => setIsAccountOpen((current) => !current)}
                  whileTap={{ scale: 0.97 }}
                  className="group flex items-center gap-2 text-sm font-medium text-[var(--color-text-primary)] transition-colors duration-300 hover:text-[var(--color-gold-soft)]"
                  aria-expanded={isAccountOpen}
                  aria-haspopup="menu"
                  aria-label={`Open ${displayName} account menu`}
                >
                  {/* Avatar */}

                  <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-[var(--color-border)] transition-all duration-300 group-hover:border-[var(--color-gold-soft)]">
                    <UserRound size={15} strokeWidth={1.6} />
                  </span>

                  {/* Identity */}

                  <span className="max-w-28 truncate">{displayName}</span>

                  {/* Chevron */}

                  <motion.span
                    animate={{
                      rotate: isAccountOpen ? 180 : 0,
                    }}
                    transition={{
                      duration: 0.25,
                    }}
                  >
                    <ChevronDown size={15} strokeWidth={1.6} />
                  </motion.span>
                </motion.button>

                {/* =================================================
                    ACCOUNT DROPDOWN
                    ================================================= */}

                <AnimatePresence>
                  {isAccountOpen && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: -8,
                        scale: 0.98,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1,
                      }}
                      exit={{
                        opacity: 0,
                        y: -8,
                        scale: 0.98,
                      }}
                      transition={{
                        duration: 0.22,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="absolute right-0 top-12 w-64 overflow-hidden border border-[var(--color-border)] bg-[var(--color-background)] shadow-[0_18px_50px_rgba(0,0,0,0.12)]"
                      role="menu"
                      aria-label="Explorer account menu"
                    >
                      {/* Identity */}

                      <div className="border-b border-[var(--color-border)] px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)]">
                            <UserRound size={16} strokeWidth={1.6} />
                          </span>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-[var(--color-text-primary)]">
                              {displayName}
                            </p>

                            <p className="mt-1 truncate text-xs text-[var(--color-text-secondary)]">
                              {user.email}
                            </p>
                          </div>
                        </div>

                        <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-secondary)]">
                          Khoj Explorer
                        </p>
                      </div>

                      {/* Navigation */}

                      <div className="p-2">
                        <Link
                          to={ROUTES.profile}
                          onClick={closeAccount}
                          className="block px-3 py-2.5 text-sm text-[var(--color-text-secondary)] transition-colors duration-200 hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)]"
                          role="menuitem"
                        >
                          My Profile
                        </Link>

                        <Link
                          to="/profile/preferences"
                          onClick={closeAccount}
                          className="block px-3 py-2.5 text-sm text-[var(--color-text-secondary)] transition-colors duration-200 hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)]"
                          role="menuitem"
                        >
                          Preferences
                        </Link>

                        <Link
                          to={ROUTES.home}
                          onClick={closeAccount}
                          className="block px-3 py-2.5 text-sm text-[var(--color-text-secondary)] transition-colors duration-200 hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)]"
                          role="menuitem"
                        >
                          My Journeys
                        </Link>
                      </div>

                      {/* Sign out */}

                      <div className="border-t border-[var(--color-border)] p-2">
                        <button
                          type="button"
                          onClick={handleSignOut}
                          disabled={isSigningOut}
                          className="w-full px-3 py-2.5 text-left text-sm text-[var(--color-text-secondary)] transition-colors duration-200 hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)] disabled:cursor-not-allowed disabled:opacity-50"
                          role="menuitem"
                        >
                          {isSigningOut ? "Signing out..." : "Sign out"}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* =================================================
                PLAN CTA
                ================================================= */}

            <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
              <Link
                to={ROUTES.plan}
                className="btn-khoj btn-khoj-primary min-h-10 px-4"
              >
                Plan My Journey
              </Link>
            </motion.div>
          </div>

          {/* =================================================
              MOBILE MENU BUTTON
              ================================================= */}

          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            className="flex items-center justify-center text-[var(--color-text-primary)] lg:hidden"
            onClick={() => setIsMenuOpen((current) => !current)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isMenuOpen ? (
                <motion.span
                  key="close"
                  initial={{
                    opacity: 0,
                    rotate: -45,
                  }}
                  animate={{
                    opacity: 1,
                    rotate: 0,
                  }}
                  exit={{
                    opacity: 0,
                    rotate: 45,
                  }}
                >
                  <X size={24} strokeWidth={1.7} />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{
                    opacity: 0,
                    rotate: 45,
                  }}
                  animate={{
                    opacity: 1,
                    rotate: 0,
                  }}
                  exit={{
                    opacity: 0,
                    rotate: -45,
                  }}
                >
                  <Menu size={24} strokeWidth={1.7} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </nav>

        {/* =====================================================
            MOBILE MENU
            ===================================================== */}

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              transition={{
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="overflow-hidden border-t border-[var(--color-border)] lg:hidden"
            >
              <motion.div
                initial={{
                  y: -10,
                }}
                animate={{
                  y: 0,
                }}
                transition={{
                  duration: 0.35,
                  delay: 0.05,
                }}
                className="flex flex-col gap-5 py-6"
              >
                {/* Mobile navigation */}

                {NAVIGATION_ITEMS.map((item, index) => {
                  const active = isActive(item.href);

                  return (
                    <motion.div
                      key={item.label}
                      initial={{
                        opacity: 0,
                        x: -10,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.04,
                      }}
                    >
                      <Link
                        to={item.href}
                        className={`text-base transition-colors duration-300 ${
                          active
                            ? "font-medium text-[var(--color-gold-soft)]"
                            : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                        }`}
                        onClick={closeMenu}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  );
                })}

                {/* =================================================
                    MOBILE ACCOUNT
                    ================================================= */}

                <div className="mt-2 border-t border-[var(--color-border)] pt-5">
                  {/* Logged out */}

                  {!loading && !user && (
                    <div className="flex gap-4">
                      <Link
                        to={ROUTES.login}
                        className="btn-khoj btn-khoj-secondary flex-1 text-center"
                        onClick={closeMenu}
                      >
                        Login
                      </Link>

                      <Link
                        to={ROUTES.register}
                        className="btn-khoj btn-khoj-primary flex-1 text-center"
                        onClick={closeMenu}
                      >
                        Sign up
                      </Link>
                    </div>
                  )}

                  {/* Logged in */}

                  {!loading && user && (
                    <div className="flex flex-col gap-4">
                      {/* Explorer identity */}

                      <Link
                        to={ROUTES.profile}
                        className="flex items-center gap-3 border-b border-[var(--color-border)] pb-4"
                        onClick={closeMenu}
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--color-border)]">
                          <UserRound size={16} strokeWidth={1.6} />
                        </span>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-[var(--color-text-primary)]">
                            {displayName}
                          </p>

                          <p className="text-xs text-[var(--color-text-secondary)]">
                            Khoj Explorer
                          </p>
                        </div>
                      </Link>

                      {/* Profile */}

                      <Link
                        to={ROUTES.profile}
                        className="text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                        onClick={closeMenu}
                      >
                        My Profile
                      </Link>

                      {/* Preferences */}

                      <Link
                        to="/profile/preferences"
                        className="text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                        onClick={closeMenu}
                      >
                        Preferences
                      </Link>

                      {/* Sign out */}

                      <button
                        type="button"
                        className="text-left text-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)] disabled:opacity-50"
                        onClick={handleSignOut}
                        disabled={isSigningOut}
                      >
                        {isSigningOut ? "Signing out..." : "Sign out"}
                      </button>
                    </div>
                  )}

                  {/* Plan CTA */}

                  <Link
                    to={ROUTES.plan}
                    className="btn-khoj btn-khoj-primary mt-5 block w-full text-center"
                    onClick={closeMenu}
                  >
                    Plan My Journey
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}

export default Navbar;
