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
          <QrCode className="w-5 h-5 text-[#EC4899]" />
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
            <div className="relative mx-auto w-64 h-64 bg-slate-900 rounded-3xl overflow-hidden border-4 border-pink-400/40 shadow-xl flex items-center justify-center p-4">
              {/* Animated laser line */}
              <motion.div
                animate={{ y: [-90, 90, -90] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-x-4 h-0.5 bg-gradient-to-r from-transparent via-[#EC4899] to-transparent shadow-[0_0_15px_#EC4899]"
              />

              {/* Viewfinder corner brackets */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-pink-500 rounded-tl-lg" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-pink-500 rounded-tr-lg" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-pink-500 rounded-bl-lg" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-pink-500 rounded-br-lg" />

              <div className="text-center text-white/80 space-y-2 z-10">
                <Camera className="w-8 h-8 mx-auto text-pink-400 animate-pulse" />
                <p className="text-xs font-medium">Align Organizer / Venue QR inside the frame</p>
                <span className="text-[10px] text-pink-200 block">SBCE Campus Geofence: Active</span>
              </div>
            </div>

            <p className="text-xs text-[#6B6470]">
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
            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl mx-auto flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-lg font-extrabold text-[#18131A]">Attendance Marked!</h4>
              <p className="text-xs text-[#6B6470] mt-1">
                Your presence has been logged in the TinkerHub SBCE records.
              </p>
            </div>

            <div className="p-4 bg-[#FFF8FC] rounded-2xl border border-[#F3DCE8] text-xs text-left space-y-1.5 font-mono">
              <div className="flex justify-between text-[#6B6470]">
                <span>Event:</span>
                <span className="font-bold text-[#18131A] truncate max-w-[180px]">{event.title}</span>
              </div>
              <div className="flex justify-between text-[#6B6470]">
                <span>Timestamp:</span>
                <span className="text-[#18131A]">{new Date().toLocaleTimeString()}</span>
              </div>
              <div className="flex justify-between text-[#6B6470]">
                <span>Check-in Token:</span>
                <span className="text-[#EC4899] font-bold">{scannedResult}</span>
              </div>
              <div className="flex justify-between text-[#6B6470]">
                <span>Status:</span>
                <span className="text-green-600 font-bold">PRESENT (Verified)</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleReset}
                className="flex-1 py-2.5 px-3 text-xs font-bold text-[#6B6470] hover:text-[#EC4899] bg-white border border-[#F3DCE8] rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
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
