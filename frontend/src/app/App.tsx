import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { ROUTES } from '../config/routes'

import Navbar from '../components/navigation/navbar'

import HomePage from '../pages/HomePage'
import ExplorePage from '../pages/ExplorePage'
import ExperiencesPage from '../pages/ExperiencesPage'
import StoriesPage from '../pages/StoriesPage'
import MapPage from '../pages/MapPage'
import PlanPage from '../pages/PlanPage'

function NotFoundPage() {
  return (
    <section className="section-khoj">
      <div className="container-khoj">
        <p className="eyebrow-khoj">404</p>

        <h1 className="heading-khoj mt-4">
          This path hasn't been discovered yet.
        </h1>

        <p className="body-khoj mt-5 max-w-2xl">
          The destination you're looking for doesn't exist yet.
        </p>
      </div>
    </section>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)]">
        <Navbar />

        <main>
          <Routes>
            <Route path={ROUTES.home} element={<HomePage />} />
            <Route path={ROUTES.explore} element={<ExplorePage />} />
            <Route
              path={ROUTES.experiences}
              element={<ExperiencesPage />}
            />
            <Route path={ROUTES.stories} element={<StoriesPage />} />
            <Route path={ROUTES.map} element={<MapPage />} />
            <Route path={ROUTES.plan} element={<PlanPage />} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App