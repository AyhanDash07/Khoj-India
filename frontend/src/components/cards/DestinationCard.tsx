import { ArrowUpRight } from 'lucide-react'

export interface DestinationCardProps {
  name: string
  region: string
  description: string
  category?: string
  image?: string
  impactScore?: number
  pressure?: 'Low' | 'Moderate' | 'High'
}

function DestinationCard({
  name,
  region,
  description,
  category = 'Destination',
  image,
  impactScore,
  pressure,
}: DestinationCardProps) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-transform duration-300 hover:-translate-y-1">
      {/* Visual */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-surface-elevated)]">
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_25%,rgba(218,171,91,0.18),transparent_30%),linear-gradient(145deg,#1a2420_0%,#0d1412_55%,#080c0b_100%)]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        <div className="absolute left-5 top-5">
          <span className="rounded-full border border-white/15 bg-black/20 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-white/75 backdrop-blur-sm">
            {category}
          </span>
        </div>

        <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/50">
              {region}
            </p>

            <h3 className="mt-2 text-2xl font-medium text-white">
              {name}
            </h3>
          </div>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 text-white transition-colors group-hover:border-[var(--color-gold-soft)] group-hover:text-[var(--color-gold-soft)]">
            <ArrowUpRight size={17} strokeWidth={1.5} />
          </div>
        </div>
      </div>

      {/* Information */}
      <div className="p-6">
        <p className="text-sm leading-6 text-[var(--color-text-secondary)]">
          {description}
        </p>

        {(impactScore !== undefined || pressure) && (
          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-[var(--color-border)] pt-5">
            {impactScore !== undefined && (
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                  Impact
                </p>

                <p className="mt-1 text-sm font-medium text-[var(--color-gold-soft)]">
                  {impactScore}/100
                </p>
              </div>
            )}

            {pressure && (
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
                  Pressure
                </p>

                <p className="mt-1 text-sm font-medium">
                  {pressure}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  )
}

export default DestinationCard