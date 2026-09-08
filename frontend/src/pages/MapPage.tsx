import ComingSoon from '../components/common/CommingSoon'
import PageHeader from '../components/layout/PageHeader'
import PageLayout from '../components/layout/PageLayout'

function MapPage() {
  return (
    <PageLayout>
      <PageHeader
        eyebrow="Khoj Map"
        title="See India beyond the usual map."
        description="Explore destinations, hidden gems, local experiences and communities through the Khoj discovery layer."
      />

      <div className="mt-12">
        <ComingSoon
          eyebrow="Map Integration"
          title="The Khoj Map is being built."
          description="Interactive destinations, hidden gems, experiences and tourism intelligence will appear here."
        />
      </div>
    </PageLayout>
  )
}

export default MapPage