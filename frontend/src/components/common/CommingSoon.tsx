interface ComingSoonProps {
  eyebrow?: string
  title: string
  description: string
}

function ComingSoon({
  eyebrow = 'Khoj India',
  title,
  description,
}: ComingSoonProps) {
  return (
    <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 md:p-12">
      <p className="eyebrow-khoj">{eyebrow}</p>

      <h2 className="mt-5 text-3xl font-medium tracking-tight md:text-4xl">
        {title}
      </h2>

      <p className="body-khoj mt-4 max-w-2xl">
        {description}
      </p>
    </div>
  )
}

export default ComingSoon