import { Component, type ErrorInfo, type ReactNode } from 'react'
import { RefreshCw } from 'lucide-react'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return {
      hasError: true,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('KHOJ INDIA application error:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-[var(--color-background)] px-6">
          <section className="w-full max-w-xl rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center md:p-12">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-gold-soft)]">
              <RefreshCw size={20} strokeWidth={1.5} />
            </div>

            <p className="eyebrow-khoj mt-6">Khoj India</p>

            <h1 className="mt-4 text-3xl font-medium tracking-tight md:text-4xl">
              Something interrupted the journey.
            </h1>

            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[var(--color-text-secondary)]">
              An unexpected error occurred. Try refreshing the page and
              continue exploring India.
            </p>

            <button
              type="button"
              onClick={this.handleReload}
              className="btn-khoj btn-khoj-primary mt-7"
            >
              Refresh Khoj
            </button>
          </section>
        </main>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary