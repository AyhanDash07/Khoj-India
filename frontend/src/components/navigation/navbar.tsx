import { Menu, Search, X } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { NAVIGATION_ITEMS } from '../../config/constants'
import { ROUTES } from '../../config/routes'

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const isActive = (href: string) => {
    return location.pathname === href
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-background)]/95 backdrop-blur-md">
      <div className="container-khoj">
        <nav className="flex h-20 items-center justify-between">
          <Link
            to={ROUTES.home}
            className="shrink-0 text-sm font-semibold tracking-[0.18em] text-[var(--color-text-primary)] transition-colors hover:text-[var(--color-gold-soft)]"
            aria-label="Khoj India home"
            onClick={closeMenu}
          >
            KHOJ INDIA
          </Link>

          <div className="hidden items-center gap-7 lg:flex">
            {NAVIGATION_ITEMS.map((item) => {
              const active = isActive(item.href)

              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`relative py-2 text-sm transition-colors ${
                    active
                      ? 'font-medium text-[var(--color-gold-soft)]'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  {item.label}

                  {active && (
                    <span className="absolute inset-x-0 -bottom-1 mx-auto h-px w-5 bg-[var(--color-gold-soft)]" />
                  )}
                </Link>
              )
            })}
          </div>

          <div className="hidden items-center gap-5 lg:flex">
            <button
              type="button"
              className="text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
              aria-label="Search"
            >
              <Search size={19} strokeWidth={1.7} />
            </button>

            <button
              type="button"
              className="text-sm font-medium text-[var(--color-text-primary)] transition-colors hover:text-[var(--color-gold-soft)]"
            >
              Login
            </button>

            <Link
              to={ROUTES.plan}
              className="btn-khoj btn-khoj-primary min-h-10 px-4"
            >
              Plan My Journey
            </Link>
          </div>

          <button
            type="button"
            className="flex items-center justify-center text-[var(--color-text-primary)] lg:hidden"
            onClick={() => setIsMenuOpen((current) => !current)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X size={24} strokeWidth={1.7} />
            ) : (
              <Menu size={24} strokeWidth={1.7} />
            )}
          </button>
        </nav>

        {isMenuOpen && (
          <div className="border-t border-[var(--color-border)] py-6 lg:hidden">
            <div className="flex flex-col gap-5">
              {NAVIGATION_ITEMS.map((item) => {
                const active = isActive(item.href)

                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={`text-base transition-colors ${
                      active
                        ? 'font-medium text-[var(--color-gold-soft)]'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                    }`}
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Link>
                )
              })}

              <div className="mt-2 flex items-center gap-4 border-t border-[var(--color-border)] pt-5">
                <button
                  type="button"
                  className="btn-khoj btn-khoj-secondary flex-1"
                  onClick={closeMenu}
                >
                  Login
                </button>

                <Link
                  to="/plan"
                  className="btn-khoj btn-khoj-primary flex-1 text-center"
                  onClick={closeMenu}
                >
                  Plan My Journey
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar