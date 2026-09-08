import type { CSSProperties } from 'react'

interface CinematicImageProps {
  src?: string
  alt: string
  className?: string
  position?: string
}

function CinematicImage({
  src,
  alt,
  className = '',
  position = 'center',
}: CinematicImageProps) {
  const imageStyle: CSSProperties = {
    objectPosition: position,
  }

  return (
    <div
      className={`absolute inset-0 overflow-hidden bg-[var(--color-surface)] ${className}`}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          style={imageStyle}
        />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_20%,rgba(218,171,91,0.22),transparent_30%),linear-gradient(145deg,#17221e_0%,#0a1110_55%,#050908_100%)]" />
      )}

      {/* Cinematic overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/10" />

      {/* Subtle grain-like atmosphere */}
      <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[radial-gradient(circle_at_center,transparent_20%,rgba(255,255,255,0.08)_100%)]" />
    </div>
  )
}

export default CinematicImage