import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppModeProvider } from './context/AppModeContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { WasteSegregationPage } from './pages/WasteSegregationPage';
import { RecyclingMarketplacePage } from './pages/RecyclingMarketplacePage';
import { EWastePage } from './pages/EWastePage';
import { SolarCalculatorPage } from './pages/SolarCalculatorPage';
import { TransportComparisonPage } from './pages/TransportComparisonPage';
import { SustainabilityInsightsPage } from './pages/SustainabilityInsightsPage';
import { UserActivityPage } from './pages/UserActivityPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AuthPage } from './pages/AuthPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  return (
    <AppModeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-[#fcfbf9] text-slate-800 font-sans">
            <Navbar />
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/segregation" element={<WasteSegregationPage />} />
                <Route path="/recycling" element={<RecyclingMarketplacePage />} />
                <Route path="/ewaste" element={<EWastePage />} />
                <Route path="/solar" element={<SolarCalculatorPage />} />
                <Route path="/transport" element={<TransportComparisonPage />} />
                <Route path="/insights" element={<SustainabilityInsightsPage />} />
                <Route path="/activity" element={<UserActivityPage />} />
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </AppModeProvider>
  );
}

export default App;
