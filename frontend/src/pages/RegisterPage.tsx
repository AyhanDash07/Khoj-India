import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { signUp } from '../services/authService.ts'

function RegisterPage() {
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const data = await signUp(
        email,
        password,
        fullName,
      )

      if (data.session) {
        setSuccess(
          'Account created successfully. Welcome to Khoj.',
        )

        navigate('/')
        return
      }

      setSuccess(
        'Account created. Please check your email to confirm your account.',
      )
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to create your account. Please try again.'

      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="min-h-[calc(100vh-80px)] flex items-center">
      <div className="container-khoj w-full py-16">
        <div className="mx-auto max-w-md">
          <p className="eyebrow-khoj">
            Start discovering
          </p>

          <h1 className="heading-khoj mt-4">
            Create your Khoj account.
          </h1>

          <p className="body-khoj mt-4">
            Save journeys, discover hidden India, and plan
            smarter with Khoj Intelligence.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
            <div>
              <label
                htmlFor="fullName"
                className="mb-2 block text-sm font-medium"
              >
                Full name
              </label>

              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(event) =>
                  setFullName(event.target.value)
                }
                placeholder="Your name"
                autoComplete="name"
                required
                className="w-full rounded-xl border border-[var(--color-border)] bg-transparent px-4 py-3 outline-none transition focus:border-[var(--color-text-primary)]"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="w-full rounded-xl border border-[var(--color-border)] bg-transparent px-4 py-3 outline-none transition focus:border-[var(--color-text-primary)]"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Create a password"
                autoComplete="new-password"
                minLength={6}
                required
                className="w-full rounded-xl border border-[var(--color-border)] bg-transparent px-4 py-3 outline-none transition focus:border-[var(--color-text-primary)]"
              />
            </div>

            {error && (
              <p
                role="alert"
                className="text-sm"
              >
                {error}
              </p>
            )}

            {success && (
              <p
                role="status"
                className="text-sm"
              >
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[var(--color-text-primary)] px-5 py-3 font-medium text-[var(--color-background)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? 'Creating account...'
                : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-sm">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}

export default RegisterPage