import Hero from '../components/hero/Hero'
import HiddenIndiaSection from '../components/home/HiddenIndiaSection'
import ExperiencesSection from '../components/home/ExperienceSection'
import IntelligenceSection from '../components/intelligence/IntelligenceSection'
import StoriesSection from '../components/home/StoriesSection'
import MapSection from '../components/home/MapSection'
import ImpactSection from '../components/home/ImpactSection'

function HomePage() {
  return (
    <>
      <Hero />

      <IntelligenceSection />

      <HiddenIndiaSection />

      <ExperiencesSection />

      <StoriesSection/>
      
      <MapSection/>

      <ImpactSection/>
    </>
  )
}

export default HomePage