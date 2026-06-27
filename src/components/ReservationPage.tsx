import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useParking } from '../context/ParkingContext';
import type { ParkingSlot, BookingDetails, PaymentStep, BookingSummary } from '../types';
import { SlotGrid } from './SlotGrid';
import { BookingForm } from './BookingForm';
import { PaymentFlow } from './PaymentFlow';
import { 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Info,
  Compass,
  ArrowLeft
} from 'lucide-react';

export const ReservationPage: React.FC = () => {
  const { lotId } = useParams<{ lotId: string }>();
  const { locations, updateSlotCountDirectly } = useParking();

  const lot = locations.find(l => l.id === lotId) || null;

  // Initialize sample parking slots representing this lot
  const [slots, setSlots] = useState<ParkingSlot[]>(() => {
    if (!lot) return [];
    const basePrice = lot.status === 'free' ? 0 : 5;
    
    const initialSlots: ParkingSlot[] = [
      { id: '1', label: 'A-1', status: 'available', type: 'standard', pricePerHour: basePrice },
      { id: '2', label: 'A-2', status: 'available', type: 'standard', pricePerHour: basePrice },
      { id: '3', label: 'A-3', status: 'available', type: 'ev', pricePerHour: basePrice > 0 ? basePrice + 3 : 0 },
      { id: '4', label: 'A-4', status: 'available', type: 'standard', pricePerHour: basePrice },
      { id: '5', label: 'B-1', status: 'available', type: 'disabled', pricePerHour: Math.max(0, basePrice - 1) },
      { id: '6', label: 'B-2', status: 'available', type: 'ev', pricePerHour: basePrice > 0 ? basePrice + 3 : 0 },
      { id: '7', label: 'B-3', status: 'available', type: 'standard', pricePerHour: basePrice },
      { id: '8', label: 'B-4', status: 'available', type: 'ev', pricePerHour: basePrice > 0 ? basePrice + 3 : 0 },
      { id: '9', label: 'C-1', status: 'available', type: 'standard', pricePerHour: basePrice },
      { id: '10', label: 'C-2', status: 'available', type: 'disabled', pricePerHour: Math.max(0, basePrice - 1) },
      { id: '11', label: 'C-3', status: 'available', type: 'standard', pricePerHour: basePrice },
      { id: '12', label: 'C-4', status: 'available', type: 'standard', pricePerHour: basePrice },
    ];

    // Mark (12 - availableSlots) slots as booked based on current lot status
    const bookedCount = Math.max(0, 12 - lot.availableSlots);
    for (let i = 0; i < Math.min(bookedCount, 12); i++) {
      initialSlots[i].status = 'booked';
    }
    
    return initialSlots;
  });

  // Booking Flow States
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [paymentStep, setPaymentStep] = useState<PaymentStep>('idle');
  const [activeBooking, setActiveBooking] = useState<BookingSummary | null>(null);
  const [aiRecommendation, setAiRecommendation] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'info' | 'success' | 'warning' } | null>(null);

  // Get active selected slot details
  const selectedSlot = slots.find(s => s.id === selectedSlotId) || null;

  // Handle slot selection
  const handleSelectSlot = (slotId: string) => {
    setSelectedSlotId(slotId);
    setAiRecommendation(null);
    showNotification(`Selected Spot ${slots.find(s => s.id === slotId)?.label}`, 'info');
  };

  // Trigger Notification Helper
  const showNotification = (message: string, type: 'info' | 'success' | 'warning') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Trigger AI Spot Finder ("Ask Parkey" simulator)
  const handleAskParkey = () => {
    const available = slots.filter(s => s.status === 'available');
    if (available.length === 0) {
      showNotification("No spots available right now!", "warning");
      return;
    }

    const evSpot = available.find(s => s.type === 'ev');
    const recommended = evSpot || available.reduce((cheapest, current) => 
      current.pricePerHour < cheapest.pricePerHour ? current : cheapest
    , available[0]);

    setSelectedSlotId(recommended.id);
    setAiRecommendation(recommended.label);
    showNotification(`Parkey recommended spot ${recommended.label} for optimal parking!`, 'success');
  };

  // Handle Details Form Submission
  const handleFormSubmit = (details: BookingDetails) => {
    if (!selectedSlot) return;

    const start = new Date(details.startTime);
    const end = new Date(details.endTime);
    const diffMs = end.getTime() - start.getTime();
    const hours = Math.max(0.5, Math.round((diffMs / (1000 * 60 * 60)) * 10) / 10);
    const totalPrice = hours * selectedSlot.pricePerHour;

    setActiveBooking({
      slot: selectedSlot,
      details,
      hours,
      totalPrice,
    });
    setPaymentStep('summary');
  };

  // Simulate Payment Initiation
  const handlePay = () => {
    if (!lot) return;
    setPaymentStep('processing');
    
    // Simulate 2s payment processing delay
    setTimeout(() => {
      const mockTxnId = `TXN-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
      
      // Update slots to mark this one as booked
      if (selectedSlotId) {
        setSlots(prev => prev.map(s => s.id === selectedSlotId ? { ...s, status: 'booked' } : s));
      }

      // Decrement the global slot count for this location
      updateSlotCountDirectly(lot.id, -1);

      setActiveBooking(prev => prev ? { ...prev, transactionId: mockTxnId } : null);
      setPaymentStep('success');
      showNotification('Payment processed successfully!', 'success');
    }, 2000);
  };

  const handleCancelPayment = () => {
    setPaymentStep('idle');
  };

  const handleResetFlow = () => {
    setSelectedSlotId(null);
    setActiveBooking(null);
    setPaymentStep('idle');
    setAiRecommendation(null);
  };

  if (!lot) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-white">Parking Location Not Found</h2>
        <p className="text-gray-400 mt-2 max-w-md">The parking location you are trying to reserve could not be found or does not exist.</p>
        <Link 
          to="/search" 
          className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-[#22C55E] to-[#15803D] text-white font-bold py-2.5 px-6 rounded-xl hover:from-[#4ADE80] hover:to-[#22C55E] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Parking Search
        </Link>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 z-10">
      {/* Floating Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border bg-[#0F1F17] border-[#22C55E]/30 shadow-xl animate-slide-up">
          {notification.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          {notification.type === 'warning' && <AlertCircle className="w-5 h-5 text-red-400" />}
          {notification.type === 'info' && <Info className="w-5 h-5 text-cyan-400" />}
          <span className="text-sm font-semibold text-[#F8FAFC]">{notification.message}</span>
        </div>
      )}

      {/* Back Button & Navigation context */}
      <div className="mb-6">
        <Link 
          to="/search" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#4ADE80] hover:text-[#22C55E] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Parking Search
        </Link>
      </div>

      {/* Dashboard Grid Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-[#22C55E] text-xs font-bold uppercase tracking-wider mb-1">
            <MapPin className="w-3.5 h-3.5" />
            {lot.area}, Chennai
          </div>
          <h1 className="text-3xl font-black font-display text-[#F8FAFC] tracking-tight">
            {lot.name}
          </h1>
          <p className="text-[#94A3B8] text-sm mt-1">
            Select a spot and secure your booking for {lot.status === 'free' ? 'Free' : 'Paid'} Parking.
          </p>
        </div>

        {/* Parkey Recommendation Widget */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-[#0F1F17] to-[#07130D] border border-[#22C55E]/20 rounded-2xl p-4 shadow-[0_0_20px_rgba(34,197,94,0.05)] w-full md:w-auto relative group overflow-hidden">
          <div className="absolute inset-0 bg-[#22C55E]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <div className="h-10 w-10 rounded-xl bg-[#FFD700]/15 flex items-center justify-center text-[#FFD700]">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <p className="text-xs text-[#94A3B8] font-semibold">Stuck picking a slot?</p>
            <button 
              onClick={handleAskParkey}
              className="text-sm font-bold text-[#FFD700] hover:text-[#ffc107] flex items-center gap-1 mt-0.5"
            >
              Ask Parkey to choose
              <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
            </button>
          </div>
          {aiRecommendation && (
            <div className="ml-auto bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-lg px-2.5 py-1 text-center animate-fade-in">
              <span className="text-[10px] block text-[#FFD700] uppercase font-bold tracking-wider">AI Choice</span>
              <span className="text-xs font-black text-[#F8FAFC]">{aiRecommendation}</span>
            </div>
          )}
        </div>
      </div>

      {/* Dashboard Content Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Lot Layout & Slot Selection */}
        <div className="lg:col-span-7 space-y-8">
          <SlotGrid 
            slots={slots}
            selectedSlotId={selectedSlotId}
            onSelectSlot={handleSelectSlot}
          />

          {/* Interactive Simulated Map */}
          <div className="bg-[#0F1F17]/90 rounded-2xl border border-[#22C55E]/20 p-6 shadow-[0_0_30px_rgba(34,197,94,0.08)]">
            <h3 className="text-lg font-bold font-display text-[#F8FAFC] mb-4 flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#22C55E]" />
              Parking Layout Map (Live Visualizer)
            </h3>
            
            {/* Parking visual layout */}
            <div className="bg-[#07130D]/90 border border-[#22C55E]/15 rounded-xl p-5 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(34,197,94,0.04)_0%,transparent_75%)]" />
              
              {/* Visual lanes */}
              <div className="grid grid-cols-3 gap-4 relative z-10 text-center">
                <div className="border-r border-[#22C55E]/10 pr-2">
                  <span className="text-[10px] font-bold text-[#22C55E] uppercase tracking-wider block mb-3">Lane A (Standard)</span>
                  <div className="space-y-2">
                    <div className={`p-2 rounded text-xs font-bold border ${slots[0]?.status === 'booked' ? 'bg-red-500/10 border-red-500/30 text-red-400' : selectedSlotId === '1' ? 'bg-[#FFD700]/10 border-[#FFD700] text-[#FFD700]' : 'bg-[#0F1F17] border-[#22C55E]/20 text-[#4ADE80]'}`}>Slot A-1</div>
                    <div className={`p-2 rounded text-xs font-bold border ${slots[1]?.status === 'booked' ? 'bg-red-500/10 border-red-500/30 text-red-400' : selectedSlotId === '2' ? 'bg-[#FFD700]/10 border-[#FFD700] text-[#FFD700]' : 'bg-[#0F1F17] border-[#22C55E]/20 text-[#4ADE80]'}`}>Slot A-2</div>
                    <div className={`p-2 rounded text-xs font-bold border ${slots[3]?.status === 'booked' ? 'bg-red-500/10 border-red-500/30 text-red-400' : selectedSlotId === '4' ? 'bg-[#FFD700]/10 border-[#FFD700] text-[#FFD700]' : 'bg-[#0F1F17] border-[#22C55E]/20 text-[#4ADE80]'}`}>Slot A-4</div>
                  </div>
                </div>
                <div className="border-r border-[#22C55E]/10 px-2">
                  <span className="text-[10px] font-bold text-[#FFD700] uppercase tracking-wider block mb-3">Lane B (EV Charge)</span>
                  <div className="space-y-2">
                    <div className={`p-2 rounded text-xs font-bold border ${slots[2]?.status === 'booked' ? 'bg-red-500/10 border-red-500/30 text-red-400' : selectedSlotId === '3' ? 'bg-[#FFD700]/10 border-[#FFD700] text-[#FFD700]' : 'bg-[#0F1F17] border-[#22C55E]/20 text-[#4ADE80]'}`}>Slot A-3 (EV)</div>
                    <div className={`p-2 rounded text-xs font-bold border ${slots[5]?.status === 'booked' ? 'bg-red-500/10 border-red-500/30 text-red-400' : selectedSlotId === '6' ? 'bg-[#FFD700]/10 border-[#FFD700] text-[#FFD700]' : 'bg-[#0F1F17] border-[#22C55E]/20 text-[#4ADE80]'}`}>Slot B-2 (EV)</div>
                    <div className={`p-2 rounded text-xs font-bold border ${slots[7]?.status === 'booked' ? 'bg-red-500/10 border-red-500/30 text-red-400' : selectedSlotId === '8' ? 'bg-[#FFD700]/10 border-[#FFD700] text-[#FFD700]' : 'bg-[#0F1F17] border-[#22C55E]/20 text-[#4ADE80]'}`}>Slot B-4 (EV)</div>
                  </div>
                </div>
                <div className="pl-2">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-3">Lane C (Disabled)</span>
                  <div className="space-y-2">
                    <div className={`p-2 rounded text-xs font-bold border ${slots[4]?.status === 'booked' ? 'bg-red-500/10 border-red-500/30 text-red-400' : selectedSlotId === '5' ? 'bg-[#FFD700]/10 border-[#FFD700] text-[#FFD700]' : 'bg-[#0F1F17] border-[#22C55E]/20 text-[#4ADE80]'}`}>Slot B-1 (HC)</div>
                    <div className={`p-2 rounded text-xs font-bold border ${slots[9]?.status === 'booked' ? 'bg-red-500/10 border-red-500/30 text-red-400' : selectedSlotId === '10' ? 'bg-[#FFD700]/10 border-[#FFD700] text-[#FFD700]' : 'bg-[#0F1F17] border-[#22C55E]/20 text-[#4ADE80]'}`}>Slot C-2 (HC)</div>
                    <div className={`p-2 rounded text-xs font-bold border ${slots[10]?.status === 'booked' ? 'bg-red-500/10 border-red-500/30 text-red-400' : selectedSlotId === '11' ? 'bg-[#FFD700]/10 border-[#FFD700] text-[#FFD700]' : 'bg-[#0F1F17] border-[#22C55E]/20 text-[#4ADE80]'}`}>Slot C-3 (ST)</div>
                  </div>
                </div>
              </div>

              {/* Driveway lane visual lines */}
              <div className="border-t-2 border-dashed border-[#22C55E]/15 mt-6 pt-4 flex justify-between px-6">
                <span className="text-[9px] uppercase tracking-widest text-[#94A3B8]/40 font-bold">&larr; Entry Gate</span>
                <span className="text-[9px] uppercase tracking-widest text-[#94A3B8]/40 font-bold">Speed Limit 5mph</span>
                <span className="text-[9px] uppercase tracking-widest text-[#94A3B8]/40 font-bold">Exit Gate &rarr;</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Form / Payment flow states */}
        <div className="lg:col-span-5 h-full">
          {paymentStep === 'idle' ? (
            <BookingForm 
              selectedSlotLabel={selectedSlot ? selectedSlot.label : null}
              onSubmit={handleFormSubmit}
            />
          ) : (
            activeBooking && (
              <PaymentFlow 
                summary={activeBooking}
                paymentStep={paymentStep}
                onPay={handlePay}
                onCancel={handleCancelPayment}
                onReset={handleResetFlow}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};
