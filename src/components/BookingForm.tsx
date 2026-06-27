import React, { useState } from 'react';
import type { BookingDetails } from '../types';
import { User, Car, Clock, CalendarDays, ArrowRight } from 'lucide-react';

interface BookingFormProps {
  selectedSlotLabel: string | null;
  onSubmit: (details: BookingDetails) => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  selectedSlotLabel,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedSlotLabel) {
      setError('Please select a parking slot first.');
      return;
    }
    if (!name.trim()) {
      setError('Driver Name is required.');
      return;
    }
    if (!vehicleNumber.trim()) {
      setError('Vehicle Number / License Plate is required.');
      return;
    }
    if (!startTime) {
      setError('Start Time is required.');
      return;
    }
    if (!endTime) {
      setError('End Time is required.');
      return;
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    const now = new Date();

    if (start >= end) {
      setError('End Time must be after the Start Time.');
      return;
    }

    if (end <= now) {
      setError('End Time cannot be in the past.');
      return;
    }

    onSubmit({
      name: name.trim(),
      vehicleNumber: vehicleNumber.trim().toUpperCase(),
      startTime,
      endTime,
    });
  };

  return (
    <div className="bg-[#0F1F17]/90 rounded-2xl border border-[#22C55E]/20 p-6 shadow-[0_0_30px_rgba(34,197,94,0.08)] flex flex-col h-full justify-between">
      <div>
        <h2 className="text-xl font-bold font-display text-[#F8FAFC] mb-2">Driver & Vehicle Details</h2>
        <p className="text-sm text-[#94A3B8] mb-6">Enter driver information and reservation details below.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold animate-fade-in">
              {error}
            </div>
          )}

          {/* Slot indicator */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#07130D]/70 border border-[#22C55E]/10">
            <span className="text-sm text-[#94A3B8] flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-[#22C55E]" />
              Selected Slot:
            </span>
            <span className={`text-base font-extrabold ${selectedSlotLabel ? 'text-[#FFD700]' : 'text-red-400/80 text-sm'}`}>
              {selectedSlotLabel ? `Spot ${selectedSlotLabel}` : 'None (Select a spot)'}
            </span>
          </div>

          {/* Driver Name Input */}
          <div className="relative">
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5 uppercase tracking-wider">Driver Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#22C55E]/60" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-[#07130D] border border-[#22C55E]/20 rounded-xl py-2.5 pl-11 pr-4 text-sm text-[#F8FAFC] placeholder-[#94A3B8]/40 focus:outline-none focus:ring-2 focus:ring-[#22C55E]/30 focus:border-[#22C55E] transition-all"
              />
            </div>
          </div>

          {/* Vehicle Number Input */}
          <div className="relative">
            <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5 uppercase tracking-wider">Vehicle Plate Number</label>
            <div className="relative">
              <Car className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#22C55E]/60" />
              <input
                type="text"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                placeholder="ABC-1234"
                className="w-full bg-[#07130D] border border-[#22C55E]/20 rounded-xl py-2.5 pl-11 pr-4 text-sm text-[#F8FAFC] placeholder-[#94A3B8]/40 focus:outline-none focus:ring-2 focus:ring-[#22C55E]/30 focus:border-[#22C55E] transition-all"
              />
            </div>
          </div>

          {/* Timings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5 uppercase tracking-wider">Start Time</label>
              <div className="relative">
                <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#22C55E]/60" />
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-[#07130D] border border-[#22C55E]/20 rounded-xl py-2.5 pl-11 pr-4 text-sm text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/30 focus:border-[#22C55E] transition-all [color-scheme:dark]"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-xs font-semibold text-[#94A3B8] mb-1.5 uppercase tracking-wider">End Time</label>
              <div className="relative">
                <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#22C55E]/60" />
                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full bg-[#07130D] border border-[#22C55E]/20 rounded-xl py-2.5 pl-11 pr-4 text-sm text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/30 focus:border-[#22C55E] transition-all [color-scheme:dark]"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-gradient-to-r from-[#22C55E] to-[#15803D] hover:from-[#4ADE80] hover:to-[#22C55E] text-[#07130B] font-bold py-3 px-4 rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.25)] flex items-center justify-center gap-2 group transition-all duration-300 active:scale-[0.98]"
          >
            Confirm Reservation
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  );
};

