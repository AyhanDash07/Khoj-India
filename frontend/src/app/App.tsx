import { AnimatePresence } from "framer-motion";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

import { ROUTES } from "../config/routes";

import Navbar from "../components/navigation/navbar";
import PageTransition from "../components/motion/PageTransition";
import { AuthProvider } from "../context/AuthContext.tsx";

import HomePage from "../pages/HomePage";
import ExplorePage from "../pages/ExplorePage";
import ExperiencesPage from "../pages/ExperiencesPage";
import StoriesPage from "../pages/StoriesPage";
import MapPage from "../pages/MapPage";
import PlanPage from "../pages/PlanPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProfilePage from "../pages/ProfilePage";
import PreferencesPage from "../pages/PreferencesPage.tsx";
import TravellerIntelligence from "../components/ai/TravellerIntelligence.tsx";
import PreferenceApiTest from "../components/debug/PreferenceApiTest";

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
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <PageTransition key={location.pathname}>
        <Routes location={location}>
          <Route path={ROUTES.home} element={<HomePage />} />
          <Route path={ROUTES.explore} element={<ExplorePage />} />
          <Route path={ROUTES.experiences} element={<ExperiencesPage />} />
          <Route path={ROUTES.stories} element={<StoriesPage />} />
          <Route path={ROUTES.map} element={<MapPage />} />
          <Route path={ROUTES.plan} element={<PlanPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path={ROUTES.profile} element={<ProfilePage />} />
          <Route path={ROUTES.preferences} element={<PreferencesPage />} />
          <Route path={ROUTES.onboarding} element={<TravellerIntelligence />} />

          <Route path="*" element={<NotFoundPage />} />

          <Route path="/debug/preferences" element={<PreferenceApiTest />} />
        </Routes>
      </PageTransition>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)]">
          <Navbar />

          <main>
            <AnimatedRoutes />
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
