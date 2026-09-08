import DestinationCard from '../components/cards/DestinationCard'
import PageHeader from '../components/layout/PageHeader'
import PageLayout from '../components/layout/PageLayout'
import { destinations } from '../data/destinations'

function ExplorePage() {
  return (
    <PageLayout>
      <PageHeader
        eyebrow="Explore"
        title="Explore India"
        description="Discover destinations, hidden gems, experiences and places shaped by the people who call them home."
      />

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {destinations.map((destination) => (
          <DestinationCard
            key={destination.name}
            {...destination}
          />
        ))}
      </div>
    </PageLayout>
  )
}

export default ExplorePage