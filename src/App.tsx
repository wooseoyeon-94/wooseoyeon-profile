import { useState } from 'react';
import { usePortfolio } from './hooks/usePortfolio';
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import About from './components/About';
import Works from './components/Works';
import Feedback from './components/Feedback';
import Assets from './components/Assets';
import AdminPanel from './components/AdminPanel';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const { data, loading, user, isAdmin } = usePortfolio();
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'main' | 'works' | 'assets'>('main');

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-[10px] tracking-[0.3em] font-bold uppercase">Loading Portfolio</p>
      </div>
    );
  }

  const navigateTo = (view: 'main' | 'works' | 'assets') => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <div className="editorial-container">
      <Navbar onAdminClick={() => setIsAdminPanelOpen(true)} onHomeClick={() => navigateTo('main')} />
      
      <main>
        {currentView === 'main' && (
          <>
            <Landing profile={data.profile} />
            <About profile={data.profile} />
            <Works works={data.works} isPreview onViewAll={() => navigateTo('works')} />
            <Feedback feedback={data.testimonials} />
            <Assets assets={data.assets} isPreview onViewAll={() => navigateTo('assets')} />
          </>
        )}

        {currentView === 'works' && (
          <Works works={data.works} />
        )}

        {currentView === 'assets' && (
          <Assets assets={data.assets} />
        )}
      </main>

      <footer className="py-20 bg-brand-bg border-t border-brand-text/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-center md:text-left">
            <p className="text-[10px] tracking-[0.3em] font-bold text-gray-400 uppercase mb-2 cursor-pointer" onClick={() => navigateTo('main')}>
              © 2024 ACTRESS WOO SEOYEON
            </p>
            <p className="text-[10px] tracking-[0.1em] text-gray-300 uppercase">
              Professional Performance Portfolio
            </p>
          </div>
          <div className="flex space-x-12">
            <a href="#home" onClick={(e) => { e.preventDefault(); navigateTo('main'); }} className="text-[10px] tracking-[0.2em] font-bold text-gray-400 uppercase hover:text-black transition-colors border-b border-transparent hover:border-black pb-1">Back to TOP</a>
            <button onClick={() => setIsAdminPanelOpen(true)} className="text-[10px] tracking-[0.2em] font-bold text-gray-300 uppercase hover:text-black transition-colors">Admin Access</button>
          </div>
        </div>
      </footer>

      <AdminPanel 
        isOpen={isAdminPanelOpen} 
        onClose={() => setIsAdminPanelOpen(false)} 
        data={data}
        user={user}
        isAdmin={isAdmin}
      />
    </div>
  );
}
