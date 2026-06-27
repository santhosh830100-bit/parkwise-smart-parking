import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import type { ParkingLocation, Destination, VehicleType, NoParkingZone } from '../types';

// Mock Chennai Destinations
export const ChennaiDestinations: Destination[] = [
  { id: 'anna-nagar', name: 'Anna Nagar', latitude: 13.085, longitude: 80.2101 },
  { id: 't-nagar', name: 'T Nagar', latitude: 13.0418, longitude: 80.2341 },
  { id: 'marina-beach', name: 'Marina Beach', latitude: 13.05, longitude: 80.2824 },
  { id: 'velachery', name: 'Velachery', latitude: 12.9815, longitude: 80.218 },
  { id: 'guindy', name: 'Guindy', latitude: 13.0067, longitude: 80.2206 },
  { id: 'porur', name: 'Porur', latitude: 13.0358, longitude: 80.1569 },
  { id: 'tambaram', name: 'Tambaram', latitude: 12.9249, longitude: 80.1 },
  { id: 'vadapalani', name: 'Vadapalani', latitude: 13.0478, longitude: 80.212 },
  { id: 'nungambakkam', name: 'Nungambakkam', latitude: 13.0604, longitude: 80.2426 },
  { id: 'mylapore', name: 'Mylapore', latitude: 13.0339, longitude: 80.2696 },
  { id: 'adyar', name: 'Adyar', latitude: 13.0067, longitude: 80.2573 },
  { id: 'besant-nagar', name: 'Besant Nagar', latitude: 13.006, longitude: 80.2699 },
  { id: 'thiruvanmiyur', name: 'Thiruvanmiyur', latitude: 12.985, longitude: 80.2514 },
  { id: 'omr-sholinganallur', name: 'OMR / Sholinganallur', latitude: 12.901, longitude: 80.2279 },
  { id: 'egmore', name: 'Egmore', latitude: 13.0732, longitude: 80.2609 },
  { id: 'kilpauk', name: 'Kilpauk', latitude: 13.0777, longitude: 80.2437 },
  { id: 'royapettah', name: 'Royapettah', latitude: 13.0588, longitude: 80.2647 },
  { id: 'chromepet', name: 'Chromepet', latitude: 12.9516, longitude: 80.1392 },
  { id: 'pallavaram', name: 'Pallavaram', latitude: 12.9675, longitude: 80.1536 },
  { id: 'avadi', name: 'Avadi', latitude: 13.1143, longitude: 80.0994 },
  { id: 'ambattur', name: 'Ambattur', latitude: 13.1143, longitude: 80.148 },
  { id: 'perambur', name: 'Perambur', latitude: 13.1149, longitude: 80.234 },
  { id: 'medavakkam', name: 'Medavakkam', latitude: 12.9174, longitude: 80.192 },
  { id: 'koyambedu', name: 'Koyambedu (CMBT)', latitude: 13.0694, longitude: 80.1948 },
  { id: 'chennai-central', name: 'Chennai Central', latitude: 13.0827, longitude: 80.275 },
  { id: 'chennai-airport', name: 'Chennai Airport', latitude: 12.9941, longitude: 80.1709 },
  { id: 'phoenix-mall', name: 'Phoenix Mall (Velachery)', latitude: 13.0144, longitude: 80.2036 },
  { id: 'vr-mall', name: 'VR Mall (Anna Nagar)', latitude: 13.0827, longitude: 80.2707 },
  { id: 'express-avenue', name: 'Express Avenue', latitude: 13.0588, longitude: 80.2647 },
  { id: 'mount-road', name: 'Mount Road', latitude: 13.068, longitude: 80.262 },
  { id: 'alwarpet', name: 'Alwarpet', latitude: 13.033, longitude: 80.256 },
  { id: 'porur-junction', name: 'Porur Junction', latitude: 13.038, longitude: 80.158 },
  { id: 'siruseri', name: 'Siruseri (SIPCOT)', latitude: 12.836, longitude: 80.226 },
  { id: 'ecr', name: 'ECR (East Coast Road)', latitude: 12.948, longitude: 80.256 }
];

// Mock Vehicle Types
export const VehicleTypesList: VehicleType[] = [
  { id: 'two-wheeler', label: 'Two Wheeler', size: 'small' },
  { id: 'hatchback', label: 'Hatchback', size: 'compact' },
  { id: 'sedan', label: 'Sedan', size: 'medium' },
  { id: 'suv', label: 'SUV', size: 'large' },
  { id: 'minivan', label: 'Minivan', size: 'xlarge' },
  { id: 'commercial', label: 'Commercial Vehicle', size: 'commercial' }
];

// Mock Chennai Parking Lots
const InitialParkingLocations: ParkingLocation[] = [
  { id: 'p1', name: 'Anna Nagar Metro Parking', availableSlots: 45, totalSlots: 80, vehicleSupport: ['two-wheeler', 'hatchback', 'sedan', 'suv'], status: 'free', latitude: 13.085, longitude: 80.2101, area: 'Anna Nagar' },
  { id: 'p2', name: 'VR Mall Parking', availableSlots: 12, totalSlots: 200, vehicleSupport: ['two-wheeler', 'hatchback', 'sedan', 'suv', 'minivan'], status: 'paid', latitude: 13.0827, longitude: 80.2707, area: 'Anna Nagar' },
  { id: 'p3', name: 'Phoenix Mall Parking', availableSlots: 8, totalSlots: 350, vehicleSupport: ['two-wheeler', 'hatchback', 'sedan', 'suv', 'minivan'], status: 'paid', latitude: 13.0144, longitude: 80.2036, area: 'Velachery' },
  { id: 'p4', name: 'T Nagar Public Parking', availableSlots: 22, totalSlots: 60, vehicleSupport: ['two-wheeler', 'hatchback', 'sedan'], status: 'free', latitude: 13.0418, longitude: 80.2341, area: 'T Nagar' },
  { id: 'p5', name: 'Marina Beach Parking', availableSlots: 35, totalSlots: 120, vehicleSupport: ['two-wheeler', 'hatchback', 'sedan', 'suv'], status: 'free', latitude: 13.05, longitude: 80.2824, area: 'Marina Beach' },
  { id: 'p6', name: 'Guindy Metro Parking', availableSlots: 28, totalSlots: 70, vehicleSupport: ['two-wheeler', 'hatchback', 'sedan', 'suv'], status: 'free', latitude: 13.0105, longitude: 80.2128, area: 'Guindy' },
  { id: 'p7', name: 'Vadapalani Metro Parking', availableSlots: 32, totalSlots: 65, vehicleSupport: ['two-wheeler', 'hatchback', 'sedan', 'suv'], status: 'free', latitude: 13.0478, longitude: 80.212, area: 'Vadapalani' },
  { id: 'p8', name: 'Tambaram Railway Parking', availableSlots: 40, totalSlots: 90, vehicleSupport: ['two-wheeler', 'hatchback', 'sedan', 'suv'], status: 'free', latitude: 12.9249, longitude: 80.127, area: 'Tambaram' },
  { id: 'p9', name: 'Porur Public Parking', availableSlots: 18, totalSlots: 50, vehicleSupport: ['two-wheeler', 'hatchback', 'sedan'], status: 'free', latitude: 13.0358, longitude: 80.1569, area: 'Porur' },
  { id: 'p10', name: 'Koyambedu Metro Parking', availableSlots: 55, totalSlots: 120, vehicleSupport: ['two-wheeler', 'hatchback', 'sedan', 'suv', 'minivan'], status: 'paid', latitude: 13.0694, longitude: 80.1948, area: 'Koyambedu' },
  { id: 'p11', name: 'Chennai Central Railway Parking', availableSlots: 15, totalSlots: 100, vehicleSupport: ['two-wheeler', 'hatchback', 'sedan', 'suv', 'minivan'], status: 'paid', latitude: 13.0827, longitude: 80.275, area: 'Chennai Central' },
  { id: 'p12', name: 'Egmore Railway Parking', availableSlots: 20, totalSlots: 75, vehicleSupport: ['two-wheeler', 'hatchback', 'sedan', 'suv'], status: 'paid', latitude: 13.0732, longitude: 80.2609, area: 'Egmore' },
  { id: 'p13', name: 'Velachery MRTS Parking', availableSlots: 24, totalSlots: 55, vehicleSupport: ['two-wheeler', 'hatchback', 'sedan', 'suv'], status: 'free', latitude: 12.9815, longitude: 80.218, area: 'Velachery' },
  { id: 'p14', name: 'Express Avenue Parking', availableSlots: 5, totalSlots: 180, vehicleSupport: ['two-wheeler', 'hatchback', 'sedan', 'suv', 'minivan'], status: 'paid', latitude: 13.0588, longitude: 80.2647, area: 'Royapettah' },
  { id: 'p15', name: 'Chennai Airport Parking', availableSlots: 80, totalSlots: 300, vehicleSupport: ['two-wheeler', 'hatchback', 'sedan', 'suv', 'minivan', 'commercial'], status: 'paid', latitude: 12.9941, longitude: 80.1709, area: 'Chennai Airport' }
];

// Mock Chennai No-Parking Zones
export const ChennaiNoParkingZones: NoParkingZone[] = [
  { id: 'np1', name: 'Mount Road No-Parking Zone', description: 'Strict no-parking enforced 24/7 near government buildings', coordinates: [[13.068, 80.26], [13.0695, 80.265], [13.067, 80.2665], [13.0655, 80.2615]] },
  { id: 'np2', name: 'Kamarajar Salai Restricted Zone', description: 'No parking along Marina promenade during peak hours', coordinates: [[13.052, 80.278], [13.054, 80.285], [13.051, 80.286], [13.0495, 80.279]] },
  { id: 'np3', name: 'T Nagar Bus Stand Zone', description: 'Emergency vehicle access — parking prohibited', coordinates: [[13.043, 80.231], [13.0445, 80.2335], [13.042, 80.235], [13.0405, 80.2325]] }
];

// Helper Functions
const EARTH_RADIUS = 6371; // km

// Haversine Distance Formula
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS * c;
}

function calculateDistances(locs: ParkingLocation[], dest: Destination): ParkingLocation[] {
  return locs.map(l => ({
    ...l,
    distance: getDistance(dest.latitude, dest.longitude, l.latitude, l.longitude)
  }));
}

// AI Scoring Algorithms
const weights = {
  destinationMatch: 0.5,
  distance: 0.4,
  availability: 0.03,
  vehicleMatch: 0.05,
  freeBonus: 0.02
};

function normalizeString(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function calculateDestinationMatch(loc: ParkingLocation, dest: Destination): number {
  if (!dest || !dest.name) return 0;
  const dName = normalizeString(dest.name);
  const lName = normalizeString(`${loc.name} ${loc.area || ''}`);
  if (!dName || !lName) return 0;
  if (lName.includes(dName)) return 1;
  const parts = dName.split(' ').filter(Boolean);
  const locSet = new Set(lName.split(' ').filter(Boolean));
  if (parts.every(p => locSet.has(p))) return 0.95;
  const partials = parts.filter(p => p.length >= 3).filter(p => lName.includes(p));
  return partials.length > 0 ? Math.min(0.85, 0.4 + 0.15 * partials.length) : 0;
}

function scoreDistance(dist: number, maxDist: number): number {
  const limit = Math.max(maxDist, 0.1);
  return 1 - Math.min(dist, limit) / limit;
}

function scoreAvailability(loc: ParkingLocation): number {
  return loc.totalSlots === 0 ? 0 : loc.availableSlots / loc.totalSlots;
}

function scoreVehicleMatch(loc: ParkingLocation, vehicleType: string): number {
  return loc.vehicleSupport.includes(vehicleType) ? 1 : 0;
}

function scoreFreeBonus(loc: ParkingLocation): number {
  return loc.status === 'free' ? 1 : 0;
}

function computeLocationScore(loc: ParkingLocation, vehicleType: string, maxDist: number, dest: Destination) {
  const isCompatible = loc.vehicleSupport.includes(vehicleType);
  if (!isCompatible || loc.availableSlots === 0) {
    return {
      score: 0,
      compatible: isCompatible,
      breakdown: {
        destinationMatchScore: 0,
        distanceScore: 0,
        availabilityScore: 0,
        vehicleMatchScore: 0,
        freeBonus: 0
      }
    };
  }

  const distanceVal = loc.distance ?? getDistance(dest.latitude, dest.longitude, loc.latitude, loc.longitude);
  const destMatchVal = calculateDestinationMatch(loc, dest);
  const distScoreVal = scoreDistance(distanceVal, maxDist);
  const availScoreVal = scoreAvailability(loc);
  const vehMatchVal = scoreVehicleMatch(loc, vehicleType);
  const freeBonusVal = scoreFreeBonus(loc);

  if (destMatchVal >= 0.9) {
    return {
      score: 100,
      compatible: isCompatible,
      breakdown: {
        destinationMatchScore: 100,
        distanceScore: Math.round(distScoreVal * 100),
        availabilityScore: Math.round(availScoreVal * 100),
        vehicleMatchScore: 100,
        freeBonus: freeBonusVal ? 100 : 0
      }
    };
  }

  const rawScore =
    destMatchVal * weights.destinationMatch +
    vehMatchVal * weights.vehicleMatch +
    availScoreVal * weights.availability +
    freeBonusVal * weights.freeBonus +
    distScoreVal * weights.distance;

  return {
    score: Math.round(rawScore * 100),
    compatible: isCompatible,
    breakdown: {
      destinationMatchScore: Math.round(destMatchVal * 100),
      distanceScore: Math.round(distScoreVal * 100),
      availabilityScore: Math.round(availScoreVal * 100),
      vehicleMatchScore: Math.round(vehMatchVal * 100),
      freeBonus: Math.round(freeBonusVal * 100)
    }
  };
}

function rankLocations(locations: ParkingLocation[], vehicleType: string, dest: Destination): ParkingLocation[] {
  const locsWithDistance = calculateDistances(locations, dest);
  const maxDist = Math.max(...locsWithDistance.map(l => l.distance ?? 0.1), 0.1);
  return locsWithDistance
    .map(l => {
      const res = computeLocationScore(l, vehicleType, maxDist, dest);
      return {
        ...l,
        aiScore: res.score,
        breakdown: res.breakdown,
        compatible: res.compatible
      };
    })
    .sort((a, b) => (b.aiScore !== a.aiScore ? (b.aiScore ?? 0) - (a.aiScore ?? 0) : (a.distance ?? 0) - (b.distance ?? 0)));
}

function generateAITextRecommendation(topPick: ParkingLocation | null, destName = ''): string {
  if (!topPick || topPick.aiScore === 0) {
    return 'No compatible parking found for your vehicle type. Try a different vehicle or destination.';
  }
  const points: string[] = [];
  const suffix = destName ? ` near ${destName}` : '';

  if ((topPick.breakdown?.distanceScore ?? 0) >= 70) {
    points.push(`it is the closest option${suffix}`);
  } else if ((topPick.breakdown?.distanceScore ?? 0) >= 40) {
    points.push(`it is reasonably close${suffix}`);
  }

  if ((topPick.breakdown?.availabilityScore ?? 0) >= 50) {
    points.push('has high availability');
  } else if ((topPick.breakdown?.availabilityScore ?? 0) >= 20) {
    points.push('has moderate availability');
  }

  if (topPick.breakdown?.vehicleMatchScore === 100) {
    points.push('matches your vehicle type');
  }

  if (topPick.status === 'free') {
    points.push('offers free parking');
  }

  if (points.length === 0) {
    return `Recommended based on overall AI scoring for your destination${suffix}.`;
  }

  return `Recommended because ${
    points.length === 1 ? points[0] : `${points.slice(0, -1).join(', ')} and ${points[points.length - 1]}`
  }.`;
}

function getRecommendationReasons(topPick: ParkingLocation | null): string[] {
  if (!topPick || topPick.aiScore === 0) {
    return ['No compatible parking found for your current search criteria.'];
  }
  const reasons: string[] = [];
  if ((topPick.breakdown?.distanceScore ?? 0) >= 40) reasons.push('Closest to destination');
  if ((topPick.breakdown?.availabilityScore ?? 0) >= 30) reasons.push('High slot availability');
  if (topPick.breakdown?.vehicleMatchScore === 100) reasons.push('Compatible with your vehicle');
  if ((topPick.aiScore ?? 0) >= 50) reasons.push('Better overall AI score');
  if (topPick.status === 'free') reasons.push('Free parking available');
  if (reasons.length === 0) reasons.push('Best match from overall AI analysis');
  return reasons;
}

function calculateDashboardStats(locs: ParkingLocation[], communityUpdatesCount: number) {
  const totalLocations = locs.length;
  const totalAvailable = locs.reduce((acc, l) => acc + l.availableSlots, 0);
  const totalCapacity = locs.reduce((acc, l) => acc + l.totalSlots, 0);
  const totalBooked = totalCapacity - totalAvailable;
  const occupancyRate = totalCapacity > 0 ? Math.round((totalBooked / totalCapacity) * 100) : 0;
  return {
    totalLocations,
    totalAvailable,
    totalCapacity,
    occupancyRate,
    communityUpdates: communityUpdatesCount
  };
}

// Context Interfaces
export interface SearchState {
  vehicleNumber: string;
  vehicleType: string;
  destination: string;
  hasSearched: boolean;
}

export interface AIResult {
  ranked: ParkingLocation[];
  topPick: ParkingLocation | null;
  explanation: string;
  reasons: string[];
}

export interface SuccessModalState {
  visible: boolean;
  title: string;
  message: string;
}

export interface NotificationMsg {
  id: number;
  message: string;
  type: 'success' | 'warning' | 'info';
}

interface ParkingContextProps {
  locations: ParkingLocation[];
  searchState: SearchState;
  parkingResults: ParkingLocation[];
  aiResult: AIResult;
  parkeyPanelOpen: boolean;
  parkeyPromptVisible: boolean;
  parkeyPromptDismissed: boolean;
  notifications: NotificationMsg[];
  confettiActive: boolean;
  successModal: SuccessModalState;
  dashboardStats: {
    totalLocations: number;
    totalAvailable: number;
    totalCapacity: number;
    occupancyRate: number;
    communityUpdates: number;
  };
  selectedDestination: Destination;
  updateSearchField: (field: keyof SearchState, value: any) => void;
  findParking: () => void;
  askParkey: () => void;
  dismissParkeyPrompt: () => void;
  showParkeyPrompt: () => void;
  openParkeyPanel: () => void;
  closeParkeyPanel: () => void;
  markParkedHere: (locId: string) => void;
  markFull: (locId: string) => void;
  closeSuccessModal: () => void;
  removeNotification: (id: number) => void;
  updateSlotCountDirectly: (locId: string, delta: number) => void;
}

const ParkingContext = createContext<ParkingContextProps | undefined>(undefined);

const defaultAiState: AIResult = {
  ranked: [],
  topPick: null,
  explanation: '',
  reasons: []
};

export const ParkingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locations, setLocations] = useState<ParkingLocation[]>(() => InitialParkingLocations.map(l => ({ ...l })));
  const [communityUpdatesCount, setCommunityUpdatesCount] = useState(0);
  const [notifications, setNotifications] = useState<NotificationMsg[]>([]);
  const [searchState, setSearchState] = useState<SearchState>({
    vehicleNumber: '',
    vehicleType: 'sedan',
    destination: ChennaiDestinations[1].id, // T Nagar
    hasSearched: false
  });

  const [aiResult, setAiResult] = useState<AIResult>(defaultAiState);
  const [parkeyPanelOpen, setParkeyPanelOpen] = useState(false);
  const [parkeyPromptVisible, setParkeyPromptVisible] = useState(false);
  const [parkeyPromptDismissed, setParkeyPromptDismissed] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const [successModal, setSuccessModal] = useState<SuccessModalState>({
    visible: false,
    title: '',
    message: ''
  });

  // Selected Destination metadata
  const selectedDestination = useMemo(() => {
    return ChennaiDestinations.find(d => d.id === searchState.destination) || ChennaiDestinations[1];
  }, [searchState.destination]);

  // Filter locations by vehicle compatibility and proximity
  const parkingResults = useMemo(() => {
    if (!searchState.hasSearched) return [];
    return rankLocations(locations, searchState.vehicleType, selectedDestination);
  }, [locations, searchState.hasSearched, selectedDestination, searchState.vehicleType]);

  // Notifications helper
  const addNotification = useCallback((message: string, type: 'success' | 'warning' | 'info' = 'success') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3500);
  }, []);

  const removeNotification = useCallback((id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const updateSearchField = useCallback((field: keyof SearchState, value: any) => {
    setSearchState(prev => ({ ...prev, [field]: value }));
  }, []);

  const findParking = useCallback(() => {
    setParkeyPanelOpen(false);
    setParkeyPromptVisible(false);
    setParkeyPromptDismissed(false);
    setAiResult(defaultAiState);
    setSearchState(prev => ({ ...prev, hasSearched: true }));
  }, []);

  // Update AI recommendations when search state changes
  useEffect(() => {
    if (searchState.hasSearched) {
      setParkeyPanelOpen(false);
      setAiResult(defaultAiState);
      setParkeyPromptDismissed(false);
      setParkeyPromptVisible(false);
    }
  }, [searchState.destination, searchState.vehicleType, searchState.hasSearched]);

  // Compute AI scoring
  const calculateAIRecommendation = useCallback(() => {
    const ranked = rankLocations(locations, searchState.vehicleType, selectedDestination);
    const topPick = ranked.find(r => (r.aiScore ?? 0) > 0) || null;
    const explanation = generateAITextRecommendation(topPick, selectedDestination.name);
    const reasons = getRecommendationReasons(topPick);
    setAiResult({ ranked, topPick, explanation, reasons });
  }, [locations, selectedDestination, searchState.vehicleType]);

  const askParkey = useCallback(() => {
    calculateAIRecommendation();
    setParkeyPanelOpen(true);
    setParkeyPromptVisible(false);
    setParkeyPromptDismissed(true);
  }, [calculateAIRecommendation]);

  const dismissParkeyPrompt = useCallback(() => {
    setParkeyPromptVisible(false);
    setParkeyPromptDismissed(true);
  }, []);

  const showParkeyPrompt = useCallback(() => {
    if (!parkeyPromptDismissed && !parkeyPanelOpen) {
      setParkeyPromptVisible(true);
    }
  }, [parkeyPromptDismissed, parkeyPanelOpen]);

  const openParkeyPanel = useCallback(() => {
    calculateAIRecommendation();
    setParkeyPanelOpen(true);
  }, [calculateAIRecommendation]);

  const closeParkeyPanel = useCallback(() => {
    setParkeyPanelOpen(false);
  }, []);

  const closeSuccessModal = useCallback(() => {
    setSuccessModal({ visible: false, title: '', message: '' });
  }, []);

  // Community Updates: Mark Spot Taken
  const markParkedHere = useCallback((locId: string) => {
    setLocations(prev =>
      prev.map(l => {
        if (l.id === locId) {
          const newAvail = Math.max(0, l.availableSlots - 1);
          return { ...l, availableSlots: newAvail };
        }
        return l;
      })
    );
    setCommunityUpdatesCount(prev => prev + 1);
    addNotification('Thanks! Available slots updated. Community data refreshed.', 'success');
    setConfettiActive(true);
    setSuccessModal({
      visible: true,
      title: '🎉 Thank You!',
      message: `Your parking update helps other drivers find available spots faster. Together we're building a cleaner city.`
    });
    setTimeout(() => setConfettiActive(false), 3500);
  }, [addNotification]);

  // Direct slot modifier (used after a booking successfully finishes)
  const updateSlotCountDirectly = useCallback((locId: string, delta: number) => {
    setLocations(prev =>
      prev.map(l => {
        if (l.id === locId) {
          const newAvail = Math.max(0, Math.min(l.totalSlots, l.availableSlots + delta));
          return { ...l, availableSlots: newAvail };
        }
        return l;
      })
    );
    setCommunityUpdatesCount(prev => prev + 1);
  }, []);

  // Community Updates: Mark Location Full
  const markFull = useCallback((locId: string) => {
    setLocations(prev =>
      prev.map(l => (l.id === locId ? { ...l, availableSlots: 0 } : l))
    );
    setCommunityUpdatesCount(prev => prev + 1);
    addNotification('Parking marked as full. Other drivers will see this update.', 'warning');
    setSuccessModal({
      visible: true,
      title: '✅ Update Recorded',
      message: 'This parking location has been marked as full. Thank you for helping keep parking information accurate.'
    });
  }, [addNotification]);

  const dashboardStats = useMemo(() => {
    return calculateDashboardStats(locations, communityUpdatesCount);
  }, [locations, communityUpdatesCount]);

  return (
    <ParkingContext.Provider
      value={{
        locations,
        searchState,
        parkingResults,
        aiResult,
        parkeyPanelOpen,
        parkeyPromptVisible,
        parkeyPromptDismissed,
        notifications,
        confettiActive,
        successModal,
        dashboardStats,
        selectedDestination,
        updateSearchField,
        findParking,
        askParkey,
        dismissParkeyPrompt,
        showParkeyPrompt,
        openParkeyPanel,
        closeParkeyPanel,
        markParkedHere,
        markFull,
        closeSuccessModal,
        removeNotification,
        updateSlotCountDirectly
      }}
    >
      {children}
    </ParkingContext.Provider>
  );
};

export const useParking = () => {
  const context = useContext(ParkingContext);
  if (!context) {
    throw new Error('useParking must be used within a ParkingProvider');
  }
  return context;
};
