import React, { useState } from 'react';
import { QrCode, Camera, CheckCircle2, RefreshCw, Sparkles, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { Modal } from '../common/Modal';
import { GradientButton } from '../common/GradientButton';
import { EventItem } from '../../types';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventItem | null;
  onCheckInSuccess: (eventId: string) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  event,
  onCheckInSuccess,
}) => {
  const [isScanning, setIsScanning] = useState(true);
  const [scannedResult, setScannedResult] = useState<string | null>(null);

  if (!event) return null;

  const handleSimulateScan = () => {
    setIsScanning(false);
    setScannedResult(`TH-SBCE-ATTEND-${Date.now().toString().slice(-6)}`);
    onCheckInSuccess(event.id);
  };

  const handleReset = () => {
    setIsScanning(true);
    setScannedResult(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <QrCode className="w-5 h-5 text-[#E04848]" />
          <span>Live Attendance Check-In</span>
        </div>
      }
      subtitle={`Verify your attendance for ${event.title}`}
      maxWidth="md"
      id="qr-scanner-modal"
    >
      <div className="space-y-6 text-center">
        {isScanning ? (
          <div className="space-y-4">
            {/* Viewfinder simulation container */}
            <div className="relative mx-auto w-64 h-64 bg-slate-900 rounded-3xl overflow-hidden border-4 border-red-400/40 shadow-xl flex items-center justify-center p-4">
              {/* Animated laser line */}
              <motion.div
                animate={{ y: [-90, 90, -90] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-x-4 h-0.5 bg-gradient-to-r from-transparent via-[#DC2626] to-transparent shadow-[0_0_15px_#DC2626]"
              />

              {/* Viewfinder corner brackets */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-red-600 rounded-tl-lg" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-red-600 rounded-tr-lg" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-red-600 rounded-bl-lg" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-red-600 rounded-br-lg" />

              <div className="text-center text-white/80 space-y-2 z-10">
                <Camera className="w-8 h-8 mx-auto text-red-400 animate-pulse" />
                <p className="text-xs font-medium">Align Organizer / Venue QR inside the frame</p>
                <span className="text-[10px] text-red-200 block">SBCE Campus Geofence: Active</span>
              </div>
            </div>

            <p className="text-xs text-[#B3ABAB]">
              Hold your camera steadily or click below to simulate an instant QR scan verification.
            </p>

            <GradientButton
              size="md"
              onClick={handleSimulateScan}
              icon={<ShieldCheck className="w-4 h-4" />}
              className="w-full"
            >
              Simulate Instant QR Scan ⚡
            </GradientButton>
          </div>
        ) : (
          /* Success Screen */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4 py-2"
          >
            <div className="w-14 h-14 bg-[#1C3A2A] text-[#4ADE80] rounded-2xl mx-auto flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-lg font-extrabold text-white">Attendance Marked!</h4>
              <p className="text-xs text-[#B3ABAB] mt-1">
                Your presence has been logged in the TinkerHub SBCE records.
              </p>
            </div>

            <div className="p-4 bg-[#141012] rounded-2xl border border-[#B3282D] text-xs text-left space-y-1.5 font-mono">
              <div className="flex justify-between text-[#B3ABAB]">
                <span>Event:</span>
                <span className="font-bold text-white truncate max-w-[180px]">{event.title}</span>
              </div>
              <div className="flex justify-between text-[#B3ABAB]">
                <span>Timestamp:</span>
                <span className="text-white">{new Date().toLocaleTimeString()}</span>
              </div>
              <div className="flex justify-between text-[#B3ABAB]">
                <span>Check-in Token:</span>
                <span className="text-[#E04848] font-bold">{scannedResult}</span>
              </div>
              <div className="flex justify-between text-[#B3ABAB]">
                <span>Status:</span>
                <span className="text-[#4ADE80] font-bold">PRESENT (Verified)</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleReset}
                className="flex-1 py-2.5 px-3 text-xs font-bold text-[#B3ABAB] hover:text-[#E04848] bg-[#141012] border border-[#B3282D] rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Scan Another</span>
              </button>

              <GradientButton size="md" onClick={onClose} className="flex-1">
                Close
              </GradientButton>
            </div>
          </motion.div>
        )}
      </div>
    </Modal>
  );
};
