import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { MobileNav } from './components/layout/MobileNav';
import { OfflineBanner } from './components/common/OfflineBanner';
import { RecipesPage } from './pages/RecipesPage';
import { MealPlannerPage } from './pages/MealPlannerPage';
import { ShoppingListPage } from './pages/ShoppingListPage';
import { TechniquesPage } from './pages/TechniquesPage';
import { AIChefPage } from './pages/AIChefPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { LegalPage } from './pages/LegalPage';
import { useTheme } from './hooks/useTheme';
import { IOSInstallPrompt } from './components/pwa/IOSInstallPrompt';
import { SmartKitchenAssistant } from './components/timers/SmartKitchenAssistant';
import { Footer } from './components/layout/Footer';

export const App: React.FC = () => {
  // Initialize dark mode class sync
  useTheme();

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
        {/* Network Status Banner */}
        <OfflineBanner />

        {/* Global Desktop Header Navigation */}
        <Navbar /> 

        {/* Primary Route Container */}
        <main className="flex-1 pb-20 md:pb-8">
          <Routes>
            <Route path="/" element={<RecipesPage />} />
            <Route path="/planner" element={<MealPlannerPage />} />
            <Route path="/shopping" element={<ShoppingListPage />} />
            <Route path="/techniques" element={<TechniquesPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/ai-chef" element={<AIChefPage />} />
            <Route path="/legal" element={<LegalPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* App Footer */}
        <Footer />

        {/* Global Mobile Sticky Bottom Navigation */}
        <MobileNav />

        {/* Global Floating Widgets & PWA Prompts */}
        <SmartKitchenAssistant />
        <IOSInstallPrompt />
      </div>
    </BrowserRouter>
  );
};

export default App;