import ExperienceCard from '../components/cards/ExperienceCard'
import PageHeader from '../components/layout/PageHeader'
import PageLayout from '../components/layout/PageLayout'
import { experiences } from '../data/experiences'

function ExperiencesPage() {
  return (
    <PageLayout>
      <PageHeader
        eyebrow="Experiences"
        title="Experience India differently."
        description="Discover food, crafts, traditions, adventures and meaningful experiences connected to the communities behind each destination."
      />

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {experiences.map((experience) => (
          <ExperienceCard
            key={experience.title}
            {...experience}
          />
        ))}
      </div>
    </PageLayout>
  )
}

export default ExperiencesPage