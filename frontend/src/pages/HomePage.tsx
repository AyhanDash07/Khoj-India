import Hero from '../components/hero/Hero'
import HiddenIndiaSection from '../components/home/HiddenIndiaSection'
import ExperiencesSection from '../components/home/ExperienceSection'
import IntelligenceSection from '../components/intelligence/IntelligenceSection'
import StoriesSection from '../components/home/StoriesSection'
import MapSection from '../components/home/MapSection'
import ImpactSection from '../components/home/ImpactSection'
import IntelligenceTest from '../components/ai/IntelligenceTest'
import SmartDiscovery from '../components/intelligence/SmartDiscovery'

function HomePage() {
  return (
    <>
      <Hero />

      <SmartDiscovery />

      <IntelligenceSection />

      <HiddenIndiaSection />

      <ExperiencesSection />

      <StoriesSection/>
      
      <MapSection/>

      <ImpactSection/>
      
      <IntelligenceTest/>
    </>
  )
}

export default HomePage