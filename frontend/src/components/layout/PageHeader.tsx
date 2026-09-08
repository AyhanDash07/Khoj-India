interface PageHeaderProps {
  eyebrow: string
  title: string
  description?: string
  className?: string
}

function PageHeader({
  eyebrow,
  title,
  description,
  className = '',
}: PageHeaderProps) {
  return (
    <header className={`max-w-3xl ${className}`}>
      <p className="eyebrow-khoj">
        {eyebrow}
      </p>

      <h1 className="heading-khoj mt-4">
        {title}
      </h1>

      {description && (
        <p className="body-khoj mt-5 max-w-2xl">
          {description}
        </p>
      )}
    </header>
  )
}

export default PageHeader