import type { ReactNode } from 'react'

interface PageLayoutProps {
  children: ReactNode
  className?: string
}

function PageLayout({
  children,
  className = '',
}: PageLayoutProps) {
  return (
    <section className={`section-khoj ${className}`}>
      <div className="container-khoj">
        {children}
      </div>
    </section>
  )
}

export default PageLayout