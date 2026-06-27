import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ParkingProvider } from './context/ParkingContext';
import { LandingPage } from './components/LandingPage';
import { SearchPage } from './components/SearchPage';
import { ReservationPage } from './components/ReservationPage';
import { Leaf, MapPin } from 'lucide-react';
import dashboardBg from './assets/dashboard.jpg';

function AppContent() {
  return (
    <div className="min-h-screen bg-[#06110b] text-[#f8fafc] font-sans antialiased relative overflow-hidden flex flex-col justify-between">
      {/* Background Graphic with dark emerald overlays */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.05] pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: `url(${dashboardBg})` }}
      />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-900/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Header / Navigation */}
      <header className="sticky top-0 z-50 bg-[#06110b]/80 backdrop-blur-xl border-b border-[#22C55E]/15 py-4 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="h-10 w-10 flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#22C55E] to-[#15803D] shadow-[0_0_15px_rgba(34,197,94,0.3)]">
              <Leaf className="h-5.5 w-5.5 text-[#F8FAFC]" />
            </div>
            <div>
              <span className="font-display text-lg font-black tracking-tight text-[#F8FAFC]">
                PARK<span className="text-[#22C55E] font-medium">WISE</span>
              </span>
              <span className="text-[10px] block font-bold text-[#22C55E] tracking-widest uppercase -mt-1">
                AI Management
              </span>
            </div>
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link to="/" className="text-sm font-semibold text-[#94A3B8] hover:text-[#4ADE80] transition-colors">
              Home
            </Link>
            <Link to="/search" className="text-sm font-semibold text-[#94A3B8] hover:text-[#4ADE80] transition-colors">
              Find Parking
            </Link>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#94A3B8] bg-[#0F1F17] px-3 py-1.5 rounded-xl border border-[#22C55E]/10">
              <MapPin className="w-3.5 h-3.5 text-[#22C55E]" />
              Chennai, IN
            </span>
          </nav>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 w-full z-10 relative flex flex-col justify-between">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/reserve/:lotId" element={<ReservationPage />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-[#07130D] border-t border-[#22C55E]/10 py-6 px-6 sm:px-8 text-center text-xs text-[#94A3B8] z-10 relative">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>&copy; 2026 ParkWise AI Inc. Smart Parking Ecosystem for Urban Mobility.</p>
          <div className="flex gap-4">
            <Link to="/search" className="hover:text-[#22C55E] transition-colors">
              Search Parking
            </Link>
            <span>&middot;</span>
            <span className="flex items-center gap-1.5 text-[#22C55E] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-ping"></span>
              Secure System Online
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ParkingProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ParkingProvider>
  );
}

export default App;
