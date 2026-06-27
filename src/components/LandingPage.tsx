import React from 'react';
import { Link } from 'react-router-dom';
import { useParking } from '../context/ParkingContext';
import {
  Car,
  MapPin,
  Sparkles,
  Fuel,
  Cloud,
  Clock,
  Brain,
  CircleCheckBig,
  CircleParking,
  Percent,
  Building2,
  Camera,
  ChartColumn,
  ArrowRight,
  TriangleAlert
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { dashboardStats } = useParking();
  const { totalLocations, totalAvailable, occupancyRate, communityUpdates } = dashboardStats;

  // Environmental Impact Stats list
  const impactStats = [
    {
      icon: Fuel,
      label: 'Fuel Saved',
      value: '1,240',
      suffix: 'L',
      description: 'Reduced idle search driving across Chennai sessions'
    },
    {
      icon: Cloud,
      label: 'CO₂ Reduced',
      value: '2.8',
      suffix: 'tons',
      description: 'Lower emissions from optimized parking routes'
    },
    {
      icon: Clock,
      label: 'Time Saved',
      value: '890',
      suffix: 'hrs',
      description: 'Less circling — faster spot discovery with AI'
    }
  ];

  // Features list
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Recommendations',
      description: 'Our Parkey AI engine scores parking spots using distance, availability, vehicle match, and free parking bonuses.',
      gradient: 'from-[#22C55E] to-[#15803D]'
    },
    {
      icon: Car,
      title: 'Vehicle-Aware Parking',
      description: 'From two-wheelers to commercial vehicles — only see parking that fits your vehicle size and type.',
      gradient: 'from-[#4ADE80] to-[#16A34A]'
    },
    {
      icon: CircleCheckBig,
      title: 'Community Updates',
      description: 'Drivers update slot availability in real time with "Mark Full" actions.',
      gradient: 'from-[#15803D] to-[#22C55E]'
    },
    {
      icon: TriangleAlert,
      title: 'No-Parking Zone Awareness',
      description: 'Red-highlighted restricted zones on the map help you avoid fines and emergency access areas.',
      gradient: 'from-red-500 to-orange-600'
    }
  ];

  // Future Scope Roadmap list
  const roadmap = [
    {
      icon: Brain,
      title: 'Demand Prediction using Machine Learning',
      description: 'Forecast parking demand by time, events, and weather patterns across the city.'
    },
    {
      icon: Camera,
      title: 'Computer Vision Occupancy Detection',
      description: 'Camera-based slot detection for automated, real-time occupancy without manual updates.'
    },
    {
      icon: Building2,
      title: 'Smart City Integration',
      description: 'Connect with municipal APIs, traffic signals, and civic dashboards for unified mobility.'
    },
    {
      icon: ChartColumn,
      title: 'Urban Mobility Analytics',
      description: 'Heatmaps and insights for planners to optimize parking infrastructure and reduce congestion.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#07130D] text-[#f8fafc] font-sans antialiased relative overflow-hidden flex flex-col justify-between">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 lg:px-8">
        {/* Background Gradients */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'linear-gradient(#22C55E 1px, transparent 1px), linear-gradient(90deg, #22C55E 1px, transparent 1px)',
              backgroundSize: '48px 48px'
            }}
          />
          <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-[#22C55E]/20 blur-3xl" />
          <div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-[#4ADE80]/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-64 w-[600px] -translate-x-1/2 rounded-full bg-[#15803D]/15 blur-3xl" />
          <div className="absolute -right-44 top-8 hidden sm:block pointer-events-none select-none z-0">
            <span
              className="text-[400px] sm:text-[500px] md:text-[600px] leading-none opacity-[0.06] bg-gradient-to-r from-[#16a34a] to-[#b8860b] bg-clip-text text-transparent blur-sm"
              style={{ display: 'block', lineHeight: 0 }}
            >
              🅿
            </span>
          </div>
        </div>

        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            <div className="animate-fade-in mb-6 inline-flex items-center gap-2 rounded-full border border-[#22C55E]/30 bg-[#22C55E]/10 px-4 py-1.5 text-sm font-medium text-[#4ADE80]">
              <Sparkles className="h-4 w-4 text-[#FACC15] animate-pulse" />
              AI-Powered Urban Parking Intelligence
            </div>
            
            <h1 className="animate-slide-up font-display text-5xl font-extrabold tracking-tight text-[#F8FAFC] sm:text-6xl lg:text-7xl">
              ParkWise{' '}
              <span className="bg-gradient-to-r from-[#4ADE80] via-[#22C55E] to-[#15803D] bg-clip-text text-transparent">
                AI
              </span>
            </h1>
            
            <p className="animate-slide-up mt-6 text-xl font-medium text-[#94A3B8] sm:text-2xl">
              Find Smart. Park Smart. Drive Green.
            </p>
            
            <p className="animate-slide-up mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#94A3B8]">
              Discover the most suitable parking spaces in Chennai with AI recommendations, vehicle-size compatibility, community-driven updates, and real-time map visualization.
            </p>

            <div className="animate-slide-up mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/search" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#22C55E] to-[#16A34A] px-6 py-3 text-base font-semibold text-[#F8FAFC] shadow-lg shadow-[0_0_20px_rgba(34,197,94,0.25)] transition hover:from-[#4ADE80] hover:to-[#22C55E] active:scale-[0.98] min-w-[200px]">
                <MapPin className="h-5 w-5" />
                Find Parking
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a href="#features" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F1F17] text-[#22C55E] border border-[#22C55E]/30 px-6 py-3 text-base font-semibold transition hover:bg-[#22C55E]/10 backdrop-blur-sm active:scale-[0.98]">
                Explore Features
              </a>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="animate-slide-up mx-auto mt-16 grid max-w-3xl grid-cols-3 gap-4 sm:gap-8">
            {[
              { value: '15', label: 'Parking Lots' },
              { value: 'AI', label: 'Smart Scoring' },
              { value: 'Live', label: 'Community Updates' }
            ].map(stat => (
              <div
                key={stat.label}
                className="rounded-2xl border border-[#22C55E]/20 bg-[#0F1F17] p-4 text-center shadow-[0_0_30px_rgba(34,197,94,0.08)] backdrop-blur-sm"
              >
                <p className="font-display text-2xl font-bold text-[#F8FAFC] sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-[#94A3B8] sm:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Environmental Impact Section */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center">
            <span className="rounded-full border border-[#22C55E]/30 bg-[#22C55E]/10 px-4 py-1.5 text-sm font-medium text-[#4ADE80]">
              Environmental Impact
            </span>
            <h2 className="mt-4 font-display text-2xl font-bold text-[#F8FAFC] sm:text-3xl">
              Smarter parking. Cleaner cities.
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-[#94A3B8]">
              AI-directed parking cuts unnecessary driving, fuel waste, and urban emissions.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {impactStats.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-[#22C55E]/20 bg-[#0F1F17] p-5 backdrop-blur-sm hover:border-[#22C55E]/30 hover:shadow-[0_0_30px_rgba(34,197,94,0.12)] transition-all duration-300 text-center"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#22C55E]/20 to-[#15803D]/10 text-[#4ADE80]">
                  <item.icon className="h-6 w-6" />
                </div>
                <p className="mt-4 text-sm font-medium text-[#94A3B8]">{item.label}</p>
                <p className="mt-1 font-display text-3xl font-bold text-[#F8FAFC]">
                  {item.value}
                  <span className="ml-1 text-lg font-semibold text-[#94A3B8]">{item.suffix}</span>
                </p>
                <p className="mt-2 text-xs leading-relaxed text-[#94A3B8]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Live Stats Dashboard Summary */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center sm:text-left">
            <h2 className="font-display text-2xl font-bold text-[#F8FAFC] sm:text-3xl">Live Dashboard</h2>
            <p className="mt-2 text-[#94A3B8]">Real-time parking statistics across Chennai demo locations</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: MapPin, label: 'Total Parking Locations', value: totalLocations, color: 'from-[#22C55E]/20 to-[#15803D]/10 text-[#4ADE80]', trend: 'Chennai demo' },
              { icon: CircleParking, label: 'Available Slots', value: `${totalAvailable} slots`, color: 'from-[#4ADE80]/20 to-[#22C55E]/10 text-[#4ADE80]', trend: 'Live count' },
              { icon: Percent, label: 'Occupancy Rate', value: `${occupancyRate}%`, color: 'from-amber-500/20 to-amber-600/5 text-amber-400', trend: 'City-wide' },
              { icon: CircleCheckBig, label: 'Community Updates', value: communityUpdates, color: 'from-[#15803D]/20 to-[#22C55E]/10 text-[#22C55E]', trend: 'This session' }
            ].map((stat, i) => (
              <div
                key={i}
                className="group rounded-2xl bg-slate-900/50 backdrop-blur-sm p-5 border border-emerald-500/20 transition-all hover:border-emerald-500/40 hover:shadow-[0_0_20px_rgba(34,197,94,0.12)]"
              >
                <div className="flex items-start justify-between">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-[#4ADE80]">{stat.trend}</span>
                </div>
                <p className="mt-4 text-sm font-medium text-[#94A3B8]">{stat.label}</p>
                <p className="mt-1 font-display text-3xl font-bold text-[#F8FAFC]">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Features Section */}
      <section id="features" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold text-[#F8FAFC] sm:text-4xl">
              Everything you need to park smarter
            </h2>
            <p className="mt-4 text-lg text-[#94A3B8]">
              Built for hackathon-grade demos with real-world urban parking scenarios in mind.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-[#22C55E]/20 bg-[#0F1F17] p-5 backdrop-blur-sm hover:border-[#22C55E]/30 hover:shadow-[0_0_30px_rgba(34,197,94,0.12)] transition-all duration-300 group"
              >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} shadow-lg transition-transform group-hover:scale-110`}>
                  <item.icon className="h-6 w-6 text-[#F8FAFC]" />
                </div>
                <h3 className="font-display text-lg font-semibold text-[#F8FAFC]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#94A3B8]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Roadmap Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <span className="rounded-full border border-[#22C55E]/30 bg-[#22C55E]/10 px-4 py-1.5 text-sm font-medium text-[#4ADE80]">
              Future Scope
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold text-[#F8FAFC] sm:text-4xl">
              What's next for ParkWise AI
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-[#94A3B8]">
              Our roadmap extends beyond recommendations into predictive, vision-powered smart city parking.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {roadmap.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-[#22C55E]/20 bg-[#0F1F17] p-5 backdrop-blur-sm hover:border-[#22C55E]/30 hover:shadow-[0_0_30px_rgba(34,197,94,0.12)] transition-all duration-300"
              >
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#22C55E]/20 to-[#15803D]/20 text-[#4ADE80]">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-[#F8FAFC]">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#94A3B8]">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
