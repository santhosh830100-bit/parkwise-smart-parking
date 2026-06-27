import React, { useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useParking, ChennaiDestinations, VehicleTypesList, ChennaiNoParkingZones } from '../context/ParkingContext';
import type { ParkingLocation } from '../types';
import {
  MapPin,
  Sparkles,
  Search,
  CircleCheckBig,
  Ban,
  CircleParking,
  Percent,
  X,
  Car
} from 'lucide-react';

const CHENNAI_CENTER: [number, number] = [13.0827, 80.2707];

// Custom Leaflet Icons to prevent Vite bundle asset path errors
const destinationMarkerIcon = L.divIcon({
  className: "destination-marker",
  html: `
    <div style="
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #10B981, #059669);
      border: 3px solid white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(34,197,94,0.5);
    ">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36]
});

function getParkingMarkerIcon(status: 'available' | 'limited' | 'full', isFree: boolean) {
  const colors = {
    available: '#22c55e',
    limited: '#eab308',
    full: '#ef4444'
  };
  const borderColor = isFree ? '#4ADE80' : '#15803D';
  return L.divIcon({
    className: "custom-parking-marker",
    html: `
      <div style="
        width: 28px;
        height: 28px;
        background: ${colors[status]};
        border: 3px solid ${borderColor};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28]
  });
}

// Map Auto-Fitter Component
const MapFitter: React.FC<{ locations: any[]; destination: any }> = ({ locations, destination }) => {
  const map = useMap();
  useEffect(() => {
    if (locations.length === 0) return;
    const bounds = L.latLngBounds([
      ...locations.map(l => [l.latitude, l.longitude] as [number, number]),
      [destination.latitude, destination.longitude] as [number, number]
    ]);
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
  }, [locations, destination, map]);

  return null;
};

// Map Legend Component
const MapLegend: React.FC = () => {
  return (
    <div className="absolute bottom-4 left-4 z-[1000] rounded-xl border border-[#22C55E]/20 bg-[#07130D]/90 p-4 shadow-xl backdrop-blur-xl pointer-events-auto">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">Map Legend</p>
      <div className="space-y-2 text-xs text-[#94A3B8]">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
          <span>Limited</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-500"></span>
          <span>Full</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full border-2 border-[#4ADE80] bg-[#22C55E]"></span>
          <span>Free Zone Border</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full border-2 border-[#15803D] bg-[#22C55E]"></span>
          <span>Paid Zone Border</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-red-500/40 border border-red-500"></span>
          <span>No-Parking Zone</span>
        </div>
      </div>
    </div>
  );
};

// Map Container Component
const ParkingMap: React.FC = () => {
  const { parkingResults, aiResult, searchState, selectedDestination, parkeyPanelOpen } = useParking();
  const noParkingZones = useMemo(() => ChennaiNoParkingZones, []);
  const activeLocations = searchState.hasSearched && parkingResults.length > 0 ? parkingResults : [];

  return (
    <div className="relative h-[400px] overflow-hidden rounded-2xl border border-[#22C55E]/20 shadow-[0_0_30px_rgba(34,197,94,0.08)] sm:h-[500px]">
      <MapContainer center={CHENNAI_CENTER} zoom={12} className="h-full w-full z-0" scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapFitter locations={activeLocations} destination={selectedDestination} />

        {/* Selected Destination Pin */}
        <Marker position={[selectedDestination.latitude, selectedDestination.longitude]} icon={destinationMarkerIcon}>
          <Popup>
            <div className="text-sm font-sans">
              <strong>Your Destination</strong>
              <br />
              {selectedDestination.name}
            </div>
          </Popup>
        </Marker>

        {/* No-Parking Zones */}
        {noParkingZones.map(zone => (
          <Polygon
            key={zone.id}
            positions={zone.coordinates}
            pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.35, weight: 2, dashArray: '6, 4' }}
          >
            <Popup>
              <div className="text-sm font-sans">
                <strong className="text-red-500">⚠ No Parking Zone</strong>
                <br />
                <strong>{zone.name}</strong>
                <br />
                <span className="text-gray-600">{zone.description}</span>
              </div>
            </Popup>
          </Polygon>
        ))}

        {/* Parking Lot Markers */}
        {activeLocations.map(loc => {
          const availRatio = loc.availableSlots === 0 ? 'full' : loc.availableSlots / loc.totalSlots <= 0.15 ? 'limited' : 'available';
          const icon = getParkingMarkerIcon(availRatio, loc.status === 'free');
          const isTopPick = parkeyPanelOpen && aiResult.topPick?.id === loc.id;
          const dist = loc.distance ?? 0.1;
          const score = parkeyPanelOpen ? (aiResult.ranked.find(r => r.id === loc.id)?.aiScore ?? '—') : '—';

          return (
            <Marker
              key={loc.id}
              position={[loc.latitude, loc.longitude]}
              icon={icon}
              zIndexOffset={isTopPick ? 1000 : 0}
            >
              <Popup>
                <div className="min-w-[200px] text-sm font-sans">
                  {isTopPick && (
                    <span className="mb-1 inline-block rounded bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">
                      ⭐ AI Recommended
                    </span>
                  )}
                  <strong className="block text-base">{loc.name}</strong>
                  <p className="mt-1 text-gray-600 leading-relaxed">
                    Distance: {dist < 1 ? `${Math.round(dist * 1000)} m` : `${dist.toFixed(1)} km`}
                    <br />
                    Slots: {loc.availableSlots}/{loc.totalSlots}
                    <br />
                    Status: {loc.status === 'free' ? 'Free' : 'Paid'}
                    <br />
                    AI Score: {score}
                  </p>
                  {loc.compatible && loc.availableSlots > 0 && (
                    <Link
                      to={`/reserve/${loc.id}`}
                      className="mt-2 text-center block w-full rounded bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white py-1.5 px-2.5 text-xs font-bold shadow hover:from-[#4ADE80] hover:to-[#22C55E]"
                    >
                      Book Now &rarr;
                    </Link>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Map Legend Overlay */}
      <MapLegend />

      <div className="absolute right-4 top-4 z-[1000] rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-400 backdrop-blur-xl pointer-events-none">
        ⚠ No Parking Zones highlighted in red
      </div>
    </div>
  );
};

// Search Form
const SearchForm: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { searchState, updateSearchField, findParking } = useParking();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    findParking();
  };

  return (
    <div className={`rounded-2xl border bg-[#0F1F17] p-5 backdrop-blur-sm border-[#22C55E]/20 hover:border-[#22C55E]/30 hover:shadow-[0_0_30px_rgba(34,197,94,0.12)] transition-all duration-300 ${compact ? '' : 'mx-auto max-w-xl'}`}>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#22C55E]/20 text-[#4ADE80]">
          <Search className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold text-[#F8FAFC]">Parking Search</h2>
          <p className="text-sm text-[#94A3B8]">
            {compact ? 'Update your search' : 'Enter your details to find parking near your destination'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="vehicleNumber" className="mb-2 block text-sm font-medium text-[#94A3B8]">
            Vehicle Plate Number
          </label>
          <div className="relative">
            <Car className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#94A3B8]" />
            <input
              id="vehicleNumber"
              type="text"
              placeholder="e.g. TN 01 AB 1234"
              value={searchState.vehicleNumber}
              onChange={e => updateSearchField('vehicleNumber', e.target.value.toUpperCase())}
              className="w-full rounded-xl border border-[#22C55E]/20 bg-[#07130D]/50 py-3 pl-11 pr-4 text-[#F8FAFC] placeholder:text-[#94A3B8]/40 focus:border-[#22C55E] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/30 transition-all"
            />
          </div>
        </div>

        <div>
          <label htmlFor="destination" className="mb-2 block text-sm font-medium text-[#94A3B8]">
            Destination
          </label>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#94A3B8]" />
            <select
              id="destination"
              value={searchState.destination}
              onChange={e => updateSearchField('destination', e.target.value)}
              className="w-full appearance-none rounded-xl border border-[#22C55E]/20 bg-[#07130D]/50 py-3 pl-11 pr-10 text-[#F8FAFC] focus:border-[#22C55E] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/30 [color-scheme:dark] transition-all"
            >
              {ChennaiDestinations.map(d => (
                <option key={d.id} value={d.id} className="bg-[#0F1F17]">
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="vehicleType" className="mb-2 block text-sm font-medium text-[#94A3B8]">
            Vehicle Type
          </label>
          <select
            id="vehicleType"
            value={searchState.vehicleType}
            onChange={e => updateSearchField('vehicleType', e.target.value)}
            className="w-full rounded-xl border border-[#22C55E]/20 bg-[#07130D]/50 py-3 px-4 text-[#F8FAFC] focus:border-[#22C55E] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/30 [color-scheme:dark] transition-all"
          >
            {VehicleTypesList.map(v => (
              <option key={v.id} value={v.id} className="bg-[#0F1F17]">
                {v.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 active:scale-[0.98] bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-[#F8FAFC] shadow-lg shadow-[0_0_20px_rgba(34,197,94,0.25)] hover:from-[#4ADE80] hover:to-[#22C55E] py-3 text-base"
        >
          <Search className="h-4 w-4" />
          Find Parking
        </button>
      </form>
    </div>
  );
};

// AI Choice Detail Modal Panel
const ParkeyPanel: React.FC = () => {
  const { parkeyPanelOpen, closeParkeyPanel, aiResult } = useParking();

  useEffect(() => {
    if (!parkeyPanelOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeParkeyPanel();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [parkeyPanelOpen, closeParkeyPanel]);

  if (!parkeyPanelOpen) return null;
  const { topPick, explanation, reasons } = aiResult;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-[#07130D]/85 backdrop-blur-sm transition-opacity" onClick={closeParkeyPanel} />
      
      <div className="relative z-10 w-full max-w-3xl animate-slide-up overflow-hidden rounded-[2rem] border border-[#22C55E]/20 bg-[#0B1F16]/95 shadow-[0_40px_80px_rgba(0,0,0,0.45)] max-h-[80vh] sm:max-h-[85vh] overflow-y-auto overscroll-contain">
        <div className="flex h-full min-h-0 flex-col gap-6 p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="relative flex h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0 items-center justify-center rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#22C55E] to-[#15803D] shadow-[0_0_35px_rgba(34,197,94,0.25)]">
                <Car className="h-6 w-6 sm:h-7 sm:w-7 text-[#F8FAFC]" />
                <Sparkles className="absolute -right-1 -top-1 h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#FACC15] animate-pulse" />
              </div>
              <div className="min-w-0">
                <h2 className="font-display text-lg sm:text-2xl font-bold text-[#F8FAFC] leading-snug break-words">Parkey Recommendation</h2>
                <p className="mt-1 text-xs sm:text-sm text-[#CBD5E1] leading-relaxed">Our AI Choice algorithm selected the best spot for you.</p>
              </div>
            </div>
            
            <button
              onClick={closeParkeyPanel}
              className="ml-auto flex-shrink-0 inline-flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-2xl sm:rounded-3xl border border-[#94A3B8]/20 bg-[#0F1F17] text-[#E2E8F0] transition hover:bg-[#22C55E]/10 hover:text-[#F8FAFC]"
              aria-label="Close recommendations"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="min-h-0 flex-1">
            {topPick ? (
              <div className="rounded-2xl border bg-[#0F1F17] p-5 backdrop-blur-sm border-[#22C55E]/50 shadow-[0_0_30px_rgba(34,197,94,0.15)] ring-1 ring-[#22C55E]/30 animate-slide-up relative overflow-hidden">
                <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#22C55E]/10 blur-2xl" />
                
                <div className="relative flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-6 w-6 fill-[#4ADE80] text-[#4ADE80]" />
                    <h3 className="font-display text-xl font-bold text-[#F8FAFC]">⭐ AI Recommended Parking</h3>
                  </div>
                  <span className="rounded-full bg-[#22C55E]/20 px-3 py-1 text-sm font-bold text-[#4ADE80]">
                    AI Score: {topPick.aiScore}/100
                  </span>
                </div>

                <h4 className="mt-4 font-display text-2xl font-bold text-[#F8FAFC]">{topPick.name}</h4>

                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-xl bg-[#07130D]/50 p-3">
                    <span className="text-xs text-[#94A3B8] flex items-center gap-2"><MapPin className="h-4 w-4" /> Distance</span>
                    <p className="mt-1 font-semibold text-[#F8FAFC]">
                      {topPick.distance && (topPick.distance < 1 ? `${Math.round(topPick.distance * 1000)} m` : `${topPick.distance.toFixed(1)} km`)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-[#07130D]/50 p-3">
                    <span className="text-xs text-[#94A3B8] flex items-center gap-2"><CircleParking className="h-4 w-4" /> Slots</span>
                    <p className="mt-1 font-semibold text-[#F8FAFC]">{topPick.availableSlots}/{topPick.totalSlots}</p>
                  </div>
                  <div className="rounded-xl bg-[#07130D]/50 p-3">
                    <span className="text-xs text-[#94A3B8] flex items-center gap-2"><Percent className="h-4 w-4" /> Pricing</span>
                    <p className="mt-1 font-semibold capitalize text-[#F8FAFC]">{topPick.status}</p>
                  </div>
                  <div className="rounded-xl bg-[#07130D]/50 p-3">
                    <span className="text-xs text-[#94A3B8] flex items-center gap-2"><Sparkles className="h-4 w-4" /> Breakdown</span>
                    <p className="mt-1 text-xs font-medium text-[#F8FAFC]">
                      D:{topPick.breakdown?.distanceScore} A:{topPick.breakdown?.availabilityScore} V:{topPick.breakdown?.vehicleMatchScore}
                    </p>
                  </div>
                </div>

                <div className="mt-4 text-sm text-[#4ADE80] flex items-center gap-2">
                  <CircleCheckBig className="h-4 w-4" />
                  <span>Vehicle compatible · {topPick.area}</span>
                </div>

                <div className="mt-6 rounded-xl border border-[#22C55E]/20 bg-[#07130D]/40 p-4">
                  <p className="text-sm font-semibold text-[#F8FAFC]">Recommended because:</p>
                  <ul className="mt-3 space-y-2">
                    {reasons.map(reason => (
                      <li key={reason} className="flex items-start gap-2 text-sm text-[#94A3B8]">
                        <CircleCheckBig className="mt-0.5 h-4 w-4 shrink-0 text-[#4ADE80]" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                  {explanation && <p className="mt-3 text-xs leading-relaxed text-[#94A3B8]">{explanation}</p>}
                </div>

                <div className="mt-6 flex">
                  <Link
                    to={`/reserve/${topPick.id}`}
                    onClick={closeParkeyPanel}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 active:scale-[0.98] bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-[#F8FAFC] shadow-lg shadow-[0_0_20px_rgba(34,197,94,0.25)] hover:from-[#4ADE80] hover:to-[#22C55E] py-3 text-base"
                  >
                    Select & Reserve Spot &rarr;
                  </Link>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border bg-[#0F1F17] p-5 border-amber-500/30 bg-amber-500/5">
                <p className="text-sm text-amber-300">No AI recommendation available. Adjust search criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

// AI Floating choice Prompt
const ParkeyPrompt: React.FC<{ visible: boolean; onAskParkey: () => void; onDismiss: () => void }> = ({ visible, onAskParkey, onDismiss }) => {
  if (!visible) return null;
  return createPortal(
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#07130D]/80 backdrop-blur-sm animate-fade-in" onClick={onDismiss} />
      <div className="relative w-full max-w-md animate-slide-up rounded-2xl border border-[#22C55E]/30 bg-[#0F1F17] p-6 shadow-[0_0_40px_rgba(34,197,94,0.2)]">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#22C55E] to-[#15803D] shadow-[0_0_20px_rgba(34,197,94,0.3)]">
            <Car className="h-6 w-6 text-[#F8FAFC]" />
          </div>
          <h2 className="font-display text-xl font-bold text-[#F8FAFC]">🤖 Parkey</h2>
        </div>
        <p className="mt-4 text-base leading-relaxed text-[#94A3B8]">
          Too many choices?<br />Let Parkey find the best parking spot for you.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onAskParkey}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 active:scale-[0.98] bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-[#F8FAFC] shadow-lg shadow-[0_0_20px_rgba(34,197,94,0.2)] py-2.5 px-4 text-sm"
          >
            Ask Parkey
          </button>
          <button
            onClick={onDismiss}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 active:scale-[0.98] bg-[#0F1F17] text-[#22C55E] border border-[#22C55E]/30 py-2.5 px-4 text-sm hover:bg-[#22C55E]/10"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

// Floating Bubble Launcher
const ParkeyBubble: React.FC = () => {
  const { searchState, openParkeyPanel } = useParking();
  if (!searchState.hasSearched) return null;
  return (
    <button
      onClick={openParkeyPanel}
      className="group fixed right-4 top-20 z-[9990] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFC107] text-[#07130B] transition-all duration-300 hover:scale-105 active:scale-95 animate-pulse"
      aria-label="Ask Parkey"
    >
      <span className="pointer-events-none absolute inset-0 rounded-full bg-[#FFD700]/35 blur-xl opacity-70 transition-all duration-300 group-hover:opacity-95" />
      <span className="pointer-events-none absolute inset-0 rounded-full border border-[#FFD700]/40" />
      <Car className="relative h-6 w-6 drop-shadow-[0_8px_18px_rgba(255,215,0,0.35)]" />
      <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-[#FFD700]/30 bg-[#07130B] px-2 py-1 text-xs font-medium text-[#FFD700] opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100">
        Ask Parkey
      </span>
    </button>
  );
};

// Result Card Component
const ResultCard: React.FC<{ location: ParkingLocation; isRecommended: boolean; showAiScore: boolean; aiScore: number }> = ({
  location,
  isRecommended,
  showAiScore,
  aiScore
}) => {
  const { markFull, searchState } = useParking();
  const ratio = location.availableSlots === 0 ? 'full' : location.availableSlots / location.totalSlots <= 0.15 ? 'limited' : 'available';
  
  const statusLabels = {
    available: { text: 'Available', style: 'bg-[#22C55E]/20 text-[#4ADE80]' },
    limited: { text: 'Limited', style: 'bg-amber-500/20 text-amber-400' },
    full: { text: 'Full', style: 'bg-red-500/20 text-red-400' }
  };
  const status = statusLabels[ratio];
  const dist = location.distance ?? 0.1;
  const isCompatible = location.vehicleSupport.includes(searchState.vehicleType);

  return (
    <div className={`rounded-2xl border bg-[#0F1F17] p-5 backdrop-blur-sm transition-all duration-300 ${isRecommended ? 'border-[#22C55E]/50 shadow-[0_0_30px_rgba(34,197,94,0.15)] ring-1 ring-[#22C55E]/30' : 'border-[#22C55E]/20 hover:border-[#22C55E]/30 hover:shadow-[0_0_30px_rgba(34,197,94,0.12)]'} ${isCompatible ? '' : 'opacity-60'}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {isRecommended && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#4ADE80]/20 px-2.5 py-0.5 text-xs font-bold text-[#4ADE80]">
                <Sparkles className="h-3 w-3 fill-current" />
                AI Pick
              </span>
            )}
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.style}`}>{status.text}</span>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${location.status === 'free' ? 'bg-[#22C55E]/20 text-[#4ADE80]' : 'bg-[#15803D]/30 text-[#22C55E]'}`}>
              {location.status === 'free' ? 'Free' : 'Paid'}
            </span>
          </div>
          <h3 className="mt-2 font-display text-lg font-bold text-[#F8FAFC]">{location.name}</h3>
          <p className="text-sm text-[#94A3B8]">{location.area}</p>
        </div>

        {showAiScore && (
          <div className="text-right">
            <p className="font-display text-2xl font-bold text-[#4ADE80]">{aiScore}</p>
            <p className="text-xs text-[#94A3B8]">AI Score</p>
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="flex items-center gap-2 text-sm text-[#94A3B8]">
          <MapPin className="h-4 w-4 text-[#4ADE80]" />
          <span>{dist < 1 ? `${Math.round(dist * 1000)} m` : `${dist.toFixed(1)} km`}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-[#94A3B8]">
          <CircleParking className="h-4 w-4 text-[#22C55E]" />
          <span>{location.availableSlots}/{location.totalSlots} slots</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-[#94A3B8]">
          <Percent className="h-4 w-4 text-[#15803D]" />
          <span>{location.status === 'free' ? 'Free Parking' : 'Paid Parking'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          {isCompatible ? (
            <>
              <CircleCheckBig className="h-4 w-4 text-[#4ADE80]" />
              <span className="text-[#4ADE80]">Compatible</span>
            </>
          ) : (
            <>
              <Ban className="h-4 w-4 text-red-400" />
              <span className="text-red-400">Incompatible</span>
            </>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {isCompatible && location.availableSlots > 0 ? (
          <Link
            to={`/reserve/${location.id}`}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 active:scale-[0.98] bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-[#F8FAFC] shadow-lg shadow-[0_0_20px_rgba(34,197,94,0.2)] py-1.5 px-3 text-sm hover:from-[#4ADE80] hover:to-[#22C55E]"
          >
            Select & Reserve Spot &rarr;
          </Link>
        ) : (
          <button
            disabled
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl font-semibold opacity-50 cursor-not-allowed bg-slate-800 text-slate-400 py-1.5 px-3 text-sm"
          >
            Incompatible Spot
          </button>
        )}

        <button
          onClick={() => markFull(location.id)}
          disabled={location.availableSlots === 0}
          className="inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 active:scale-[0.98] bg-red-950/20 text-red-400 border border-red-500/20 py-1.5 px-3 text-sm hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Mark Full
        </button>
      </div>
    </div>
  );
};

// Results List
const ResultsList: React.FC = () => {
  const { searchState, parkingResults, parkeyPanelOpen, aiResult } = useParking();
  if (!searchState.hasSearched) return null;

  const topPickId = parkeyPanelOpen ? aiResult.topPick?.id ?? null : null;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-4 font-display text-lg font-semibold text-[#F8FAFC]">
          Parking Locations ({parkingResults.length})
        </h3>
        
        <div className="grid gap-4 lg:grid-cols-2">
          {parkingResults.map(loc => {
            const score = aiResult.ranked.find(r => r.id === loc.id)?.aiScore ?? 0;
            return (
              <ResultCard
                key={loc.id}
                location={loc}
                isRecommended={topPickId === loc.id}
                showAiScore={parkeyPanelOpen}
                aiScore={score}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Spark Parkey Prompt trigger logic
const ParkeyPromptTrigger: React.FC = () => {
  const { searchState, parkeyPromptDismissed, parkeyPanelOpen, showParkeyPrompt } = useParking();
  
  useEffect(() => {
    if (!searchState.hasSearched || parkeyPromptDismissed || parkeyPanelOpen) return;
    const timer = setTimeout(() => {
      showParkeyPrompt();
    }, 10000); // Trigger after 10s
    return () => clearTimeout(timer);
  }, [searchState.hasSearched, parkeyPromptDismissed, parkeyPanelOpen, showParkeyPrompt]);

  return null;
};

// Success Update Modal Component
const SuccessUpdateModal: React.FC = () => {
  const { successModal, closeSuccessModal } = useParking();

  useEffect(() => {
    if (!successModal.visible) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSuccessModal();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [successModal.visible, closeSuccessModal]);

  if (!successModal.visible) return null;

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#07130D]/80 backdrop-blur-sm transition-opacity" onClick={closeSuccessModal} />
      
      <div className="relative z-10 w-full max-w-sm animate-slide-up overflow-hidden rounded-2xl border border-[#22C55E]/20 bg-[#0B1F16]/95 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
            {successModal.title}
          </h3>
          <button
            onClick={closeSuccessModal}
            className="flex-shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-xl border border-[#94A3B8]/20 bg-[#0F1F17] text-[#E2E8F0] transition hover:bg-[#22C55E]/10 hover:text-[#F8FAFC]"
            aria-label="Close message"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-3 text-sm text-[#CBD5E1] leading-relaxed">
          {successModal.message}
        </p>
      </div>
    </div>,
    document.body
  );
};

// Main SearchPage Component
export const SearchPage: React.FC = () => {
  const { searchState, parkeyPromptVisible, askParkey, dismissParkeyPrompt } = useParking();

  return (
    <div className="min-h-screen bg-[#07130D] text-white">
      {/* Prompt trigger */}
      <ParkeyPromptTrigger />

      {/* Robot Prompts */}
      <ParkeyPrompt visible={parkeyPromptVisible} onAskParkey={askParkey} onDismiss={dismissParkeyPrompt} />

      {/* Floating Sparkles Bubble */}
      <ParkeyBubble />

      {/* Drawer */}
      <ParkeyPanel />

      {/* Success Update Modal */}
      <SuccessUpdateModal />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {searchState.hasSearched ? (
          <div className="space-y-6">
            <div className="mb-8">
              <h1 className="font-display text-3xl font-bold text-[#F8FAFC] sm:text-4xl">Find Your Perfect Spot</h1>
              <p className="mt-2 text-[#94A3B8]">
                Explore parking on the map — ask Parkey when you want an AI recommendation.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-12">
              <div className="space-y-6 lg:col-span-4">
                <SearchForm compact={true} />
              </div>
              
              <div className="space-y-6 lg:col-span-8">
                <ParkingMap />
                <ResultsList />
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-2xl">
            <div className="mb-8 text-center">
              <h1 className="font-display text-3xl font-bold text-[#F8FAFC] sm:text-4xl">Find Your Perfect Spot</h1>
              <p className="mt-2 text-[#94A3B8]">
                Enter your vehicle and destination to explore parking options across Chennai.
              </p>
            </div>
            
            <SearchForm />
          </div>
        )}
      </main>
    </div>
  );
};
