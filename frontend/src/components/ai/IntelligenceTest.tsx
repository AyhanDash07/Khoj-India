import { useState } from 'react'
import {
  getDestinationIntelligence,
  type IntelligenceResult,
} from '../../services/intelligenceService'
import IntelligenceResultCard from './IntelligenceResultCard'

export default function IntelligenceTest() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<IntelligenceResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function testIntelligence(destinationId: number) {
  setLoading(true)
  setError(null)

  try {
    const data = await getDestinationIntelligence(destinationId)
    setResult(data)
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : 'Failed to test Khoj Intelligence.',
    )
  } finally {
    setLoading(false)
  }
}

  return (
    <main className="min-h-screen bg-[var(--color-background)] px-4 py-12 md:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <div className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-gold-soft)]">
            Development Preview
          </p>

          <h1 className="mt-3 font-serif text-3xl text-[var(--color-text-primary)] md:text-4xl">
            Khoj Intelligence
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-text-secondary)]">
            Testing the first destination intelligence experience.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
  <button
    type="button"
    onClick={() => testIntelligence(1)}
    disabled={loading}
    className="btn-khoj btn-khoj-primary disabled:cursor-not-allowed disabled:opacity-50"
  >
    {loading ? 'Calculating...' : 'Test Lonar'}
  </button>

  <button
    type="button"
    onClick={() => testIntelligence(5)}
    disabled={loading}
    className="btn-khoj btn-khoj-secondary disabled:cursor-not-allowed disabled:opacity-50"
  >
    Test Vagamon
  </button>

  <button
    type="button"
    onClick={() => testIntelligence(6)}
    disabled={loading}
    className="btn-khoj btn-khoj-secondary disabled:cursor-not-allowed disabled:opacity-50"
  >
    Test Kumbalangi
  </button>

  <button
    type="button"
    onClick={() => testIntelligence(3)}
    disabled={loading}
    className="btn-khoj btn-khoj-secondary disabled:cursor-not-allowed disabled:opacity-50"
  >
    Test Bundi
  </button>
</div>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/[0.05] px-5 py-4">
            <p className="text-sm text-red-300">
              {error}
            </p>
          </div>
        )}

        {result && (
          <div className="mt-8">
            <IntelligenceResultCard result={result} />
          </div>
        )}
      </div>
    </main>
  )
}