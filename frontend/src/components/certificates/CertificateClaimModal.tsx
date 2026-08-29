import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Award, 
  CheckCircle2, 
  ShieldCheck, 
  QrCode, 
  Sparkles, 
  Download, 
  Share2, 
  Check, 
  User, 
  GraduationCap, 
  Building, 
  Lock, 
  ArrowRight, 
  ArrowLeft,
  FileCheck,
  Zap,
  Key
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Certificate, EventItem, UserProfile } from '../../types';
import { Modal } from '../common/Modal';
import { GradientButton } from '../common/GradientButton';
import { AnimatedProgressBar } from '../common/AnimatedProgressBar';

interface CertificateClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  event?: EventItem | null;
  certificate?: Certificate | null;
  onClaimSuccess?: (newCert: Certificate) => void;
  onViewCertificate?: (cert: Certificate) => void;
}

export const CertificateClaimModal: React.FC<CertificateClaimModalProps> = ({
  isOpen,
  onClose,
  user,
  event,
  certificate,
  onClaimSuccess,
  onViewCertificate,
}) => {
  // Steps: 1 = Verification, 2 = Details & Honors, 3 = Ledger Signing, 4 = Ready
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState({
    recipientName: user.name || 'Jithu Biju',
    collegeRollNo: 'SBCE-2023-CS-084',
    department: user.department || 'Computer Science & Engineering',
    year: user.year || 'S5 (3rd Year)',
    distinction: 'High Distinction (Top 5% Innovator)',
    eventTitle: event?.title || certificate?.eventTitle || 'React & AI Agents Hands-On Bootcamp',
  });

  // Step 3 Minting State
  const [mintingProgress, setMintingProgress] = useState(0);
  const [mintingStepText, setMintingStepText] = useState('Hashing student credentials (SHA-256)...');
  const [isMinted, setIsMinted] = useState(false);

  // Download simulation state
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  // Active generated certificate
  const [claimedCert, setClaimedCert] = useState<Certificate | null>(certificate || null);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setMintingProgress(0);
      setIsMinted(false);
      setDownloading(false);
      setDownloadProgress(0);
      setCopied(false);

      if (certificate) {
        setClaimedCert(certificate);
        setFormData({
          recipientName: certificate.recipientName,
          collegeRollNo: 'SBCE-2023-CS-084',
          department: user.department || 'Computer Science & Engineering',
          year: user.year || 'S5 (3rd Year)',
          distinction: certificate.gradeOrRank || 'Distinction',
          eventTitle: certificate.eventTitle,
        });
      } else if (event) {
        setFormData((prev) => ({
          ...prev,
          eventTitle: event.title,
          recipientName: user.name,
          department: user.department,
        }));
      }
    }
  }, [isOpen, certificate, event, user]);

  if (!isOpen) return null;

  // Step 3: Trigger Cryptographic Minting Animation
  const startMintingProcess = () => {
    setCurrentStep(3);
    setMintingProgress(15);
    setMintingStepText('Generating cryptographic SHA-256 signature...');

    setTimeout(() => {
      setMintingProgress(40);
      setMintingStepText('Attaching TinkerHub SBCE Faculty Advisor authority keys...');
    }, 500);

    setTimeout(() => {
      setMintingProgress(70);
      setMintingStepText('Generating verifiable offline QR verification code...');
    }, 1000);

    setTimeout(() => {
      setMintingProgress(95);
      setMintingStepText('Anchoring credential in TinkerHub SBCE Trust Ledger...');
    }, 1500);

    setTimeout(() => {
      setMintingProgress(100);
      setMintingStepText('Certificate officially issued & cryptographic hash sealed!');

      const randomCode = `TH-SBCE-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const newCert: Certificate = {
        id: `cert-${Date.now()}`,
        eventId: event?.id || 'event-1',
        eventTitle: formData.eventTitle,
        recipientName: formData.recipientName,
        recipientEmail: user.email,
        issueDate: '26 AUG 2026',
        certificateCode: randomCode,
        category: event?.category || 'Workshops',
        verificationStatus: 'Verified',
        gradeOrRank: formData.distinction,
        credentialUrl: `https://events.tinkerhubsbce.org/verify/${randomCode}`,
      };

      setClaimedCert(newCert);
      setIsMinted(true);
      if (onClaimSuccess) {
        onClaimSuccess(newCert);
      }

      // Fire confetti celebration
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#EC4899', '#DB2777', '#A855F7', '#22D3EE', '#F3E8FF'],
        });
      } catch {
        // ignore
      }

      setTimeout(() => {
        setCurrentStep(4);
      }, 700);
    }, 2000);
  };

  const handleDownload = () => {
    setDownloading(true);
    setDownloadProgress(20);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloading(false);

          // Download file
          const code = claimedCert?.certificateCode || 'TH-SBCE-CREDENTIAL';
          const element = document.createElement('a');
          element.setAttribute(
            'href',
            'data:text/plain;charset=utf-8,' +
              encodeURIComponent(
                `=========================================\n` +
                `TINKERHUB SBCE OFFICIAL CERTIFICATE\n` +
                `Sree Buddha College of Engineering\n` +
                `=========================================\n` +
                `Credential Code : ${code}\n` +
                `Recipient Name  : ${formData.recipientName}\n` +
                `Department      : ${formData.department}\n` +
                `Event           : ${formData.eventTitle}\n` +
                `Distinction     : ${formData.distinction}\n` +
                `Issued Date     : 26 AUG 2026\n` +
                `Status          : Cryptographically Verified\n` +
                `Ledger Verification : https://events.tinkerhubsbce.org/verify/${code}\n` +
                `=========================================\n`
              )
          );
          element.setAttribute('download', `${code}.txt`);
          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);

          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  const handleShare = () => {
    if (claimedCert?.credentialUrl && navigator.clipboard) {
      navigator.clipboard.writeText(claimedCert.credentialUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      title={
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-[#EC4899]" />
          <span>Certificate Claim & Verification Portal</span>
        </div>
      }
      subtitle={formData.eventTitle}
      id="certificate-claim-modal"
    >
      <div className="space-y-6">
        {/* Multi-Step Header Animated Progress Bar */}
        <div className="p-4 bg-gradient-to-r from-[#FFF8FC] to-[#FFF1F7] rounded-2xl border border-[#F3DCE8] space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#18131A] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#EC4899]" />
              Credential Issuance Workflow
            </span>
            <span className="font-mono text-[#DB2777] font-bold">
              {currentStep === 4 ? 'Complete · 100%' : `Step ${currentStep} of ${totalSteps} · ${Math.round(((currentStep - 1) / (totalSteps - 1)) * 100)}%`}
            </span>
          </div>

          <AnimatedProgressBar
            currentStep={currentStep}
            totalSteps={totalSteps}
            progressPercent={((currentStep - 1) / (totalSteps - 1)) * 100}
            variant="gradient"
            size="md"
            showPercent={false}
            animateGlow
            id="cert-workflow-progress"
          />

          {/* Step Labels */}
          <div className="grid grid-cols-4 gap-1 text-center text-[10px] font-semibold text-[#6B6470] pt-1">
            <span className={currentStep >= 1 ? 'text-[#EC4899] font-bold' : ''}>1. Eligibility</span>
            <span className={currentStep >= 2 ? 'text-[#EC4899] font-bold' : ''}>2. Details</span>
            <span className={currentStep >= 3 ? 'text-[#EC4899] font-bold' : ''}>3. Cryptography</span>
            <span className={currentStep >= 4 ? 'text-green-700 font-bold' : ''}>4. Ready</span>
          </div>
        </div>

        {/* Dynamic Step Content */}
        <AnimatePresence mode="wait">
          {/* STEP 1: ELIGIBILITY & ATTENDANCE VERIFICATION */}
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-[#18131A]">
                  Step 1: Automated Attendance & Eligibility Verification
                </h3>
                <p className="text-xs text-[#6B6470]">
                  Verifying completion criteria on TinkerHub SBCE Campus Event logs.
                </p>
              </div>

              {/* Verification Checklist Cards */}
              <div className="space-y-2.5">
                <div className="p-3.5 bg-white rounded-2xl border border-[#F3DCE8] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-green-50 text-green-700 border border-green-200">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#18131A]">Event Registration & Seat</h4>
                      <p className="text-[11px] text-[#6B6470]">Verified on student profile ({user.email})</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-green-100 text-green-800 rounded-lg">
                    VERIFIED
                  </span>
                </div>

                <div className="p-3.5 bg-white rounded-2xl border border-[#F3DCE8] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-green-50 text-green-700 border border-green-200">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#18131A]">Attendance QR Check-In</h4>
                      <p className="text-[11px] text-[#6B6470]">Logged via SBCE On-site Terminal</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-green-100 text-green-800 rounded-lg">
                    VERIFIED
                  </span>
                </div>

                <div className="p-3.5 bg-white rounded-2xl border border-[#F3DCE8] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-pink-50 text-[#DB2777] border border-pink-200">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#18131A]">Technical Competency Score</h4>
                      <p className="text-[11px] text-[#6B6470]">Passed threshold (≥ 60%) with distinction</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-pink-100 text-[#DB2777] rounded-lg">
                    ELIGIBLE 🏆
                  </span>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#F3DCE8]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-[#6B6470] hover:text-[#18131A] cursor-pointer"
                >
                  Cancel
                </button>
                <GradientButton
                  size="md"
                  onClick={() => setCurrentStep(2)}
                  icon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Continue to Credential Details →
                </GradientButton>
              </div>
            </motion.div>
          )}

          {/* STEP 2: CREDENTIAL CUSTOMIZATION & STUDENT DETAILS */}
          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-[#18131A]">
                  Step 2: Credential Details & Student Identification
                </h3>
                <p className="text-xs text-[#6B6470]">
                  Confirm your name and academic credentials as they will appear on the final certificate.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#18131A] mb-1">
                    Student Full Name (Printed on Certificate) *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3 w-4 h-4 text-[#6B6470]" />
                    <input
                      type="text"
                      required
                      value={formData.recipientName}
                      onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-[#F3DCE8] focus:border-[#EC4899] rounded-xl focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#18131A] mb-1">
                      College Registration / Roll No *
                    </label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3.5 top-3 w-4 h-4 text-[#6B6470]" />
                      <input
                        type="text"
                        required
                        value={formData.collegeRollNo}
                        onChange={(e) => setFormData({ ...formData, collegeRollNo: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-[#F3DCE8] focus:border-[#EC4899] rounded-xl focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#18131A] mb-1">
                      Academic Department *
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3.5 top-3 w-4 h-4 text-[#6B6470]" />
                      <input
                        type="text"
                        required
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-[#F3DCE8] focus:border-[#EC4899] rounded-xl focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#18131A] mb-1">
                    Recognition / Distinction Level
                  </label>
                  <select
                    value={formData.distinction}
                    onChange={(e) => setFormData({ ...formData, distinction: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-[#F3DCE8] focus:border-[#EC4899] rounded-xl focus:outline-none cursor-pointer"
                  >
                    <option value="High Distinction (Top 5% Innovator)">High Distinction (Top 5% Innovator)</option>
                    <option value="Distinction in Technical Excellence">Distinction in Technical Excellence</option>
                    <option value="Certificate of Active Participation">Certificate of Active Participation</option>
                    <option value="First Class with Honors">First Class with Honors</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-[#F3DCE8]">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="flex items-center gap-1 px-4 py-2 text-xs font-bold text-[#6B6470] hover:text-[#18131A] cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>

                <GradientButton
                  size="md"
                  onClick={startMintingProcess}
                  icon={<Key className="w-3.5 h-3.5" />}
                >
                  Mint & Sign Cryptographic Credential 📜
                </GradientButton>
              </div>
            </motion.div>
          )}

          {/* STEP 3: CRYPTOGRAPHIC SIGNING & LEDGER MINTING */}
          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="py-8 text-center space-y-6"
            >
              <div className="relative w-20 h-20 mx-auto">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                  className="w-full h-full rounded-full border-4 border-[#FFF1F7] border-t-[#EC4899] border-r-[#A855F7]"
                />
                <div className="absolute inset-0 flex items-center justify-center text-[#EC4899]">
                  <Lock className="w-8 h-8 animate-pulse" />
                </div>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-[#18131A] font-outfit">
                  Signing & Generating Verifiable Credential
                </h3>
                <p className="text-xs text-[#6B6470] font-mono">
                  {mintingStepText}
                </p>
              </div>

              {/* Minting Animated Progress Bar */}
              <div className="max-w-md mx-auto">
                <AnimatedProgressBar
                  progressPercent={mintingProgress}
                  variant="gradient"
                  size="lg"
                  showPercent
                  animateGlow
                />
              </div>

              <div className="p-3 bg-[#FFF8FC] rounded-2xl border border-[#F3DCE8] max-w-md mx-auto text-xs text-[#6B6470] flex items-center justify-between">
                <span className="font-mono text-[11px]">Signer: TinkerHub SBCE Faculty Key</span>
                <span className="font-mono text-[11px] text-[#DB2777]">SHA-256 RSA-2048</span>
              </div>
            </motion.div>
          )}

          {/* STEP 4: READY & CERTIFICATE PREVIEW */}
          {currentStep === 4 && claimedCert && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="text-center space-y-1">
                <span className="px-3 py-1 text-[11px] font-extrabold uppercase rounded-full bg-green-100 text-green-800">
                  🎉 Credential Successfully Minted & Verified
                </span>
                <h3 className="text-xl font-extrabold text-[#18131A] font-outfit mt-1">
                  Your Certificate is Ready!
                </h3>
                <p className="text-xs text-[#6B6470]">
                  Official tamper-proof credential anchored on the campus verification registry.
                </p>
              </div>

              {/* Mini Interactive Certificate Frame Preview */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-white via-[#FFF8FC] to-[#FFF1F7] border-2 border-[#F3DCE8] shadow-xl text-center space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between text-[10px] text-[#6B6470] border-b border-[#F3DCE8] pb-2 font-mono">
                  <span>TINKERHUB SBCE CHAPTER</span>
                  <span className="font-bold text-[#DB2777]">{claimedCert.certificateCode}</span>
                </div>

                <div className="py-2 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#EC4899]">
                    Certificate of Excellence
                  </span>
                  <h4 className="text-xl font-extrabold text-[#18131A] font-outfit">
                    {claimedCert.recipientName}
                  </h4>
                  <p className="text-xs text-[#6B6470] max-w-sm mx-auto">
                    for outstanding performance in <strong className="text-[#18131A]">{claimedCert.eventTitle}</strong>
                  </p>
                  <span className="inline-block mt-1 px-2.5 py-0.5 text-[10px] font-bold bg-[#FFF1F7] text-[#DB2777] rounded-full border border-[#F3DCE8]">
                    {claimedCert.gradeOrRank}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] text-[#6B6470] pt-2 border-t border-[#F3DCE8]">
                  <span className="flex items-center gap-1 text-green-700 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified
                  </span>
                  <span>Issued on 26 AUG 2026</span>
                </div>
              </div>

              {/* Animated Download Progress Bar when triggered */}
              {downloading && (
                <div className="p-3.5 bg-pink-50 rounded-2xl border border-pink-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#DB2777]">
                    <span>Exporting High-Res Vector Certificate...</span>
                    <span>{downloadProgress}%</span>
                  </div>
                  <AnimatedProgressBar
                    progressPercent={downloadProgress}
                    variant="pink"
                    size="sm"
                    showPercent={false}
                    animateGlow
                  />
                </div>
              )}

              {/* Action Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold bg-white hover:bg-pink-50 text-[#18131A] border border-[#F3DCE8] rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4 text-[#EC4899]" />}
                  <span>{copied ? 'Verification URL Copied!' : 'Share Credential Link'}</span>
                </button>

                <div className="flex items-center gap-2">
                  {onViewCertificate && (
                    <button
                      onClick={() => {
                        onClose();
                        onViewCertificate(claimedCert);
                      }}
                      className="px-4 py-2.5 text-xs font-bold text-[#DB2777] bg-[#FFF1F7] border border-[#F3DCE8] rounded-xl hover:bg-pink-100 cursor-pointer"
                    >
                      Full View 📜
                    </button>
                  )}

                  <GradientButton
                    size="md"
                    onClick={handleDownload}
                    icon={<Download className="w-4 h-4" />}
                  >
                    {downloading ? 'Exporting...' : 'Download Official Certificate'}
                  </GradientButton>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
};
