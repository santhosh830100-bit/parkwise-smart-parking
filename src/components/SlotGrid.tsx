import React from 'react';
import type { ParkingSlot } from '../types';
import { Zap, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface SlotGridProps {
  slots: ParkingSlot[];
  selectedSlotId: string | null;
  onSelectSlot: (slotId: string) => void;
}

export const SlotGrid: React.FC<SlotGridProps> = ({
  slots,
  selectedSlotId,
  onSelectSlot,
}) => {
  return (
    <div className="bg-[#0F1F17]/90 rounded-2xl border border-[#22C55E]/20 p-6 shadow-[0_0_30px_rgba(34,197,94,0.08)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold font-display text-[#F8FAFC]">Parking Slot Selection</h2>
          <p className="text-sm text-[#94A3B8] mt-1">Select an available parking spot to begin booking.</p>
        </div>
        <div className="flex gap-2">
          <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#4ADE80]">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span>
            Live Spots
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-2 mb-6 text-xs text-[#94A3B8] border-b border-[#22C55E]/10 pb-4">
        <div className="flex items-center gap-2 justify-center py-1.5 rounded-lg bg-[#07130D]/50 border border-[#22C55E]/10">
          <div className="w-3 h-3 rounded bg-[#0F1F17] border border-[#22C55E] shadow-[0_0_8px_rgba(34,197,94,0.2)]"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2 justify-center py-1.5 rounded-lg bg-[#07130D]/50 border border-red-500/20">
          <div className="w-3 h-3 rounded bg-red-500/20 border border-red-500/40"></div>
          <span>Occupied</span>
        </div>
        <div className="flex items-center gap-2 justify-center py-1.5 rounded-lg bg-[#07130D]/50 border border-[#FFD700]/20">
          <div className="w-3 h-3 rounded bg-gradient-to-br from-[#FFD700] to-[#FFC107] border border-[#FFD700]"></div>
          <span>Selected</span>
        </div>
      </div>

      {/* Slot Grid Layout */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
        {slots.map((slot) => {
          const isBooked = slot.status === 'booked';
          const isSelected = selectedSlotId === slot.id;

          let slotBg = 'bg-[#07130D]/80 border-[#22C55E]/20 hover:border-[#22C55E]/50 hover:bg-[#132a1e]/40';
          let slotText = 'text-[#E2E8F0]';
          let iconColor = 'text-[#4ADE80]';

          if (isBooked) {
            slotBg = 'bg-red-950/20 border-red-900/40 cursor-not-allowed opacity-55';
            slotText = 'text-[#94A3B8] line-through';
            iconColor = 'text-red-400';
          } else if (isSelected) {
            slotBg = 'bg-gradient-to-br from-[#132a1e] to-[#0b1f16] border-[#FFD700] ring-1 ring-[#FFD700]/50 shadow-[0_0_20px_rgba(255,215,0,0.15)]';
            slotText = 'text-[#FFD700] font-bold';
            iconColor = 'text-[#FFD700]';
          }

          return (
            <button
              key={slot.id}
              onClick={() => !isBooked && onSelectSlot(slot.id)}
              disabled={isBooked}
              className={`flex flex-col items-center justify-between p-3.5 rounded-xl border text-center transition-all duration-300 active:scale-95 group ${slotBg}`}
            >
              {/* Slot Header Info */}
              <div className="flex justify-between w-full items-center mb-1">
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">
                  {slot.type}
                </span>
                {slot.type === 'ev' && <Zap className={`w-3.5 h-3.5 ${iconColor}`} />}
                {slot.type === 'disabled' && <ShieldAlert className={`w-3.5 h-3.5 ${iconColor}`} />}
                {slot.type === 'standard' && !isBooked && !isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]/30 group-hover:text-[#22C55E]/60 transition-colors" />}
              </div>

              {/* Slot Label */}
              <span className={`text-lg font-extrabold tracking-tight ${slotText}`}>
                {slot.label}
              </span>

              {/* Hourly Price */}
              <span className={`text-[11px] font-semibold mt-1 opacity-70 ${isSelected ? 'text-[#FFD700]' : 'text-[#4ADE80]'}`}>
                ${slot.pricePerHour}/hr
              </span>
            </button>
          );
        })}
      </div>

      {/* Lot Info summary */}
      <div className="mt-6 flex justify-between items-center text-xs text-[#94A3B8] border-t border-[#22C55E]/10 pt-4">
        <span>Available: {slots.filter(s => s.status === 'available').length} / {slots.length}</span>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          Gate open & monitored
        </span>
      </div>
    </div>
  );
};

