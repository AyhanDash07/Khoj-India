import StoryCard from '../components/cards/StoryCard'
import PageHeader from '../components/layout/PageHeader'
import PageLayout from '../components/layout/PageLayout'
import { stories } from '../data/stories'

function StoriesPage() {
  return (
    <PageLayout>
      <PageHeader
        eyebrow="Khoj Stories"
        title="Every place has a story."
        description="Explore the people, history, food, architecture, traditions and memories that give India's destinations their identity."
      />

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {stories.map((story) => (
          <StoryCard
            key={story.title}
            {...story}
          />
        ))}
      </div>
    </PageLayout>
  )
}

export default StoriesPage