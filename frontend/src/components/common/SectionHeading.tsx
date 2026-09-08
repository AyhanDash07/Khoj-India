interface SectionHeadingProps {
  eyebrow: string
  title: string
  description?: string
  align?: 'left' | 'center'
}

function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
}: SectionHeadingProps) {
  const alignment =
    align === 'center'
      ? 'mx-auto text-center items-center'
      : 'text-left'

  return (
    <div className={`flex max-w-3xl flex-col ${alignment}`}>
      <p className="eyebrow-khoj">
        {eyebrow}
      </p>

      <h2 className="mt-4 text-4xl font-medium leading-[1.05] tracking-[-0.035em] md:text-5xl lg:text-6xl">
        {title}
      </h2>

      {description && (
        <p className="body-khoj mt-5 max-w-2xl">
          {description}
        </p>
      )}
    </div>
  )
}

export default SectionHeading