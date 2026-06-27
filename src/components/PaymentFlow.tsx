import React from 'react';
import type { BookingSummary, PaymentStep } from '../types';
import { CreditCard, CheckCircle2, Loader2, ArrowLeft, Ticket, DollarSign, Clock, User, Car, Download } from 'lucide-react';
import { Fireworks } from './Fireworks';

interface PaymentFlowProps {
  summary: BookingSummary;
  paymentStep: PaymentStep;
  onPay: () => void;
  onCancel: () => void;
  onReset: () => void;
}

export const PaymentFlow: React.FC<PaymentFlowProps> = ({
  summary,
  paymentStep,
  onPay,
  onCancel,
  onReset,
}) => {
  // Format Date Helper
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDownload = () => {
    const receiptHtml = `
      <html>
        <head>
          <title>Parking Reservation Receipt - ${summary.transactionId}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              color: #1e293b;
              margin: 0;
              padding: 40px;
              background: #ffffff;
            }
            .receipt-container {
              max-width: 480px;
              margin: 0 auto;
              border: 1px solid #e2e8f0;
              padding: 30px;
              border-radius: 16px;
              box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);
            }
            .header {
              text-align: center;
              border-bottom: 2px dashed #e2e8f0;
              padding-bottom: 20px;
              margin-bottom: 20px;
            }
            .logo {
              font-size: 24px;
              font-weight: 800;
              color: #15803d;
              margin-bottom: 5px;
            }
            .subtitle {
              font-size: 12px;
              color: #64748b;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }
            .title {
              font-size: 18px;
              font-weight: 700;
              margin-top: 10px;
              color: #0f172a;
            }
            .section {
              margin-bottom: 15px;
            }
            .row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
              font-size: 14px;
            }
            .label {
              color: #64748b;
            }
            .value {
              font-weight: 600;
              color: #0f172a;
            }
            .total-row {
              border-top: 1px solid #e2e8f0;
              border-bottom: 1px solid #e2e8f0;
              padding: 12px 0;
              margin: 15px 0;
              font-size: 16px;
              font-weight: 700;
            }
            .total-value {
              color: #15803d;
              font-size: 18px;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              font-size: 12px;
              color: #94a3b8;
              border-top: 1px dashed #e2e8f0;
              padding-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <div class="header">
              <div class="logo">🚗 ParkWise</div>
              <div class="subtitle">Smart Parking System</div>
              <div class="title">Booking Receipt</div>
            </div>
            
            <div class="section">
              <div class="row">
                <span class="label">Transaction ID</span>
                <span class="value" style="font-family: monospace;">${summary.transactionId}</span>
              </div>
              <div class="row">
                <span class="label">Date</span>
                <span class="value">${new Date().toLocaleString()}</span>
              </div>
            </div>
            
            <div class="section" style="border-top: 1px solid #f1f5f9; padding-top: 15px;">
              <div class="row">
                <span class="label">Reserved Slot</span>
                <span class="value">Spot ${summary.slot.label} (${summary.slot.type.toUpperCase()})</span>
              </div>
              <div class="row">
                <span class="label">Driver Name</span>
                <span class="value">${summary.details.name}</span>
              </div>
              <div class="row">
                <span class="label">Vehicle Plate</span>
                <span class="value" style="text-transform: uppercase;">${summary.details.vehicleNumber}</span>
              </div>
            </div>

            <div class="section" style="border-top: 1px solid #f1f5f9; padding-top: 15px;">
              <div class="row">
                <span class="label">Start Time</span>
                <span class="value">${new Date(summary.details.startTime).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div class="row">
                <span class="label">End Time</span>
                <span class="value">${new Date(summary.details.endTime).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div class="row">
                <span class="label">Duration</span>
                <span class="value">${summary.hours.toFixed(1)} Hours</span>
              </div>
            </div>
            
            <div class="total-row">
              <div class="row">
                <span>Total Paid</span>
                <span class="total-value">$${summary.totalPrice.toFixed(2)}</span>
              </div>
            </div>
            
            <div style="display: flex; justify-content: center; margin: 20px 0;">
              <svg width="200" height="40" viewBox="0 0 100 20" xmlns="http://www.w3.org/2000/svg">
                <rect x="0" width="2" height="20" fill="black"/>
                <rect x="3" width="1" height="20" fill="black"/>
                <rect x="6" width="3" height="20" fill="black"/>
                <rect x="11" width="1" height="20" fill="black"/>
                <rect x="14" width="2" height="20" fill="black"/>
                <rect x="18" width="4" height="20" fill="black"/>
                <rect x="24" width="1" height="20" fill="black"/>
                <rect x="27" width="2" height="20" fill="black"/>
                <rect x="31" width="3" height="20" fill="black"/>
                <rect x="36" width="1" height="20" fill="black"/>
                <rect x="39" width="4" height="20" fill="black"/>
                <rect x="45" width="2" height="20" fill="black"/>
                <rect x="49" width="1" height="20" fill="black"/>
                <rect x="52" width="3" height="20" fill="black"/>
                <rect x="57" width="2" height="20" fill="black"/>
                <rect x="61" width="4" height="20" fill="black"/>
                <rect x="67" width="1" height="20" fill="black"/>
                <rect x="70" width="2" height="20" fill="black"/>
                <rect x="74" width="3" height="20" fill="black"/>
                <rect x="79" width="1" height="20" fill="black"/>
                <rect x="82" width="4" height="20" fill="black"/>
                <rect x="88" width="2" height="20" fill="black"/>
                <rect x="92" width="1" height="20" fill="black"/>
                <rect x="95" width="3" height="20" fill="black"/>
              </svg>
            </div>
            
            <div class="footer">
              <p>Thank you for choosing ParkWise!</p>
              <p>Show this receipt to the parking warden upon exit.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const blob = new Blob([receiptHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt-${summary.transactionId}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (paymentStep === 'processing') {
    return (
      <div className="bg-[#0F1F17]/90 rounded-2xl border border-[#22C55E]/30 p-8 shadow-[0_0_40px_rgba(34,197,94,0.15)] flex flex-col items-center justify-center min-h-[400px] text-center animate-fade-in">
        <div className="relative mb-6">
          <Loader2 className="w-16 h-16 text-[#22C55E] animate-spin" />
          <div className="absolute inset-0 rounded-full bg-[#22C55E]/10 blur-xl"></div>
        </div>
        <h3 className="text-xl font-bold font-display text-[#F8FAFC]">Simulating Payment Process</h3>
        <p className="text-sm text-[#94A3B8] max-w-xs mt-2">
          Verifying secure gateway connections and booking your slot. Please do not close this window.
        </p>
        <div className="mt-8 flex gap-2.5 items-center justify-center">
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-bounce"></span>
        </div>
      </div>
    );
  }

  if (paymentStep === 'success') {
    return (
      <div className="bg-[#0F1F17]/90 rounded-2xl border border-[#22C55E]/30 p-8 shadow-[0_0_40px_rgba(34,197,94,0.2)] text-center animate-slide-up">
        <Fireworks />
        {/* Success Icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/30 flex items-center justify-center mb-6 relative">
          <CheckCircle2 className="w-8 h-8 text-[#4ADE80]" />
          <div className="absolute inset-0 rounded-full bg-[#22C55E]/10 blur-lg animate-pulse-soft"></div>
        </div>

        <h3 className="text-2xl font-black font-display text-[#F8FAFC]">Payment Successful!</h3>
        <p className="text-sm text-[#4ADE80] font-semibold mt-1">Your parking spot has been reserved.</p>

        {/* Receipt Card */}
        <div className="bg-[#07130D]/85 border border-[#22C55E]/20 rounded-2xl p-6 mt-6 text-left space-y-4 shadow-inner">
          <div className="flex justify-between items-center border-b border-[#22C55E]/10 pb-3">
            <span className="text-xs uppercase font-semibold text-[#94A3B8] tracking-wider">Transaction ID</span>
            <span className="text-xs font-mono font-bold text-[#FFD700] bg-[#FFD700]/10 px-2 py-0.5 rounded border border-[#FFD700]/20">
              {summary.transactionId}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-xs text-[#94A3B8] block">Reserved Slot</span>
              <span className="font-extrabold text-[#F8FAFC] flex items-center gap-1.5 mt-0.5">
                <Ticket className="w-4 h-4 text-[#22C55E]" />
                Spot {summary.slot.label} ({summary.slot.type.toUpperCase()})
              </span>
            </div>
            <div>
              <span className="text-xs text-[#94A3B8] block">Amount Paid</span>
              <span className="font-extrabold text-[#4ADE80] flex items-center gap-0.5 mt-0.5">
                <DollarSign className="w-4 h-4" />
                {summary.totalPrice.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-xs text-[#94A3B8] block">Driver</span>
              <span className="font-medium text-[#F8FAFC] flex items-center gap-1.5 mt-0.5">
                <User className="w-4 h-4 text-[#22C55E]/60" />
                {summary.details.name}
              </span>
            </div>
            <div>
              <span className="text-xs text-[#94A3B8] block">Vehicle</span>
              <span className="font-medium text-[#F8FAFC] flex items-center gap-1.5 mt-0.5">
                <Car className="w-4 h-4 text-[#22C55E]/60" />
                {summary.details.vehicleNumber}
              </span>
            </div>
          </div>

          <div className="border-t border-[#22C55E]/10 pt-3 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-[#94A3B8]">Start:</span>
              <span className="font-semibold text-[#F8FAFC]">{formatDate(summary.details.startTime)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#94A3B8]">End:</span>
              <span className="font-semibold text-[#F8FAFC]">{formatDate(summary.details.endTime)}</span>
            </div>
            <div className="flex justify-between pt-1 font-semibold text-[#4ADE80]">
              <span>Duration:</span>
              <span>{summary.hours.toFixed(1)} hours</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleDownload}
            className="flex-1 bg-[#0F1F17] hover:bg-[#132a1e] text-[#F8FAFC] font-semibold py-2.5 px-4 rounded-xl border border-[#22C55E]/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4 text-[#22C55E]" />
            Download Receipt
          </button>
          <button
            onClick={onReset}
            className="flex-1 bg-gradient-to-r from-[#22C55E] to-[#15803D] hover:from-[#4ADE80] hover:to-[#22C55E] text-[#07130B] font-bold py-2.5 px-4 rounded-xl transition-all shadow-[0_0_15px_rgba(34,197,94,0.15)] active:scale-[0.98]"
          >
            New Reservation
          </button>
        </div>
      </div>
    );
  }

  // default 'summary' step
  return (
    <div className="bg-[#0F1F17]/90 rounded-2xl border border-[#22C55E]/20 p-6 shadow-[0_0_30px_rgba(34,197,94,0.08)] animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onCancel}
          className="p-2 rounded-lg bg-[#07130D]/70 border border-[#22C55E]/10 text-[#22C55E] hover:text-[#4ADE80] transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-xl font-bold font-display text-[#F8FAFC]">Payment Summary</h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">Please review your booking details before paying.</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Ticket Detail Block */}
        <div className="p-4 rounded-xl bg-[#07130D]/70 border border-[#22C55E]/10 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#4ADE80] px-1.5 py-0.5 rounded bg-[#22C55E]/10">
                {summary.slot.type} Spot
              </span>
              <h4 className="text-lg font-black text-[#F8FAFC] mt-1.5">Spot {summary.slot.label}</h4>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#94A3B8]">Rate</span>
              <p className="font-extrabold text-[#F8FAFC]">${summary.slot.pricePerHour}/hr</p>
            </div>
          </div>

          <div className="border-t border-[#22C55E]/10 my-3"></div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-[#94A3B8]">
              <User className="w-3.5 h-3.5 text-[#22C55E]/60" />
              <span className="font-medium text-[#F8FAFC]">{summary.details.name}</span>
            </div>
            <div className="flex items-center gap-2 text-[#94A3B8]">
              <Car className="w-3.5 h-3.5 text-[#22C55E]/60" />
              <span className="font-medium text-[#F8FAFC]">{summary.details.vehicleNumber}</span>
            </div>
            <div className="flex items-center gap-2 text-[#94A3B8]">
              <Clock className="w-3.5 h-3.5 text-[#22C55E]/60" />
              <span>Duration:</span>
              <span className="font-bold text-[#F8FAFC]">{summary.hours.toFixed(1)} hours</span>
            </div>
            <div className="flex items-center gap-2 text-[#94A3B8] pl-5">
              <span>{formatDate(summary.details.startTime)}</span>
              <span>&rarr;</span>
              <span>{formatDate(summary.details.endTime)}</span>
            </div>
          </div>
        </div>

        {/* Pricing Calculation Summary */}
        <div className="bg-[#07130D]/30 p-4 rounded-xl border border-[#22C55E]/10 space-y-2">
          <div className="flex justify-between text-xs text-[#94A3B8]">
            <span>Base Fare ({summary.hours.toFixed(1)} hrs × ${summary.slot.pricePerHour})</span>
            <span>${(summary.hours * summary.slot.pricePerHour).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs text-[#94A3B8]">
            <span>Taxes & Service Fees</span>
            <span>$0.00</span>
          </div>
          <div className="border-t border-[#22C55E]/10 my-2 pt-2 flex justify-between items-center">
            <span className="text-sm font-bold text-[#F8FAFC]">Total Amount due</span>
            <span className="text-xl font-black text-[#4ADE80] flex items-center">
              <DollarSign className="w-5 h-5 -mr-0.5" />
              {summary.totalPrice.toFixed(2)}
            </span>
          </div>
        </div>

        <button
          onClick={onPay}
          className="w-full mt-4 bg-gradient-to-r from-[#22C55E] to-[#15803D] hover:from-[#4ADE80] hover:to-[#22C55E] text-[#07130B] font-extrabold py-3.5 px-4 rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.25)] flex items-center justify-center gap-2 group transition-all duration-300 active:scale-[0.98]"
        >
          <CreditCard className="w-4 h-4" />
          Pay Now
        </button>
      </div>
    </div>
  );
};

