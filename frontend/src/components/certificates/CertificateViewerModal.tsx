import React, { useState } from 'react';
import { 
  Award, 
  Download, 
  Share2, 
  ShieldCheck, 
  Check, 
  QrCode, 
  Sparkles, 
  ExternalLink,
  Building
} from 'lucide-react';
import { Certificate } from '../../types';
import { Modal } from '../common/Modal';
import { GradientButton } from '../common/GradientButton';
import { AnimatedProgressBar } from '../common/AnimatedProgressBar';

interface CertificateViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: Certificate | null;
  onOpenClaimWorkflow?: () => void;
}

export const CertificateViewerModal: React.FC<CertificateViewerModalProps> = ({
  isOpen,
  onClose,
  certificate,
  onOpenClaimWorkflow,
}) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!certificate) return null;

  const handleDownload = () => {
    setDownloading(true);
    setDownloadProgress(20);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloading(false);
          // create simulated download anchor
          const element = document.createElement('a');
          element.setAttribute(
            'href',
            'data:text/plain;charset=utf-8,' +
              encodeURIComponent(
                `=========================================\n` +
                `TINKERHUB SBCE OFFICIAL CERTIFICATE\n` +
                `Sri Buddha College of Engineering\n` +
                `=========================================\n` +
                `Credential Code : ${certificate.certificateCode}\n` +
                `Recipient Name  : ${certificate.recipientName}\n` +
                `Event           : ${certificate.eventTitle}\n` +
                `Distinction     : ${certificate.gradeOrRank || 'Distinction'}\n` +
                `Issued Date     : ${certificate.issueDate}\n` +
                `Status          : ${certificate.verificationStatus}\n` +
                `Ledger URL      : ${certificate.credentialUrl}\n` +
                `=========================================\n`
              )
          );
          element.setAttribute('download', `${certificate.certificateCode}.txt`);
          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);
          return 100;
        }
        return prev + 25;
      });
    }, 220);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(certificate.credentialUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="3xl"
      title={
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-[#EC4899]" />
          <span>Official Certificate of Excellence</span>
        </div>
      }
      subtitle={`Credential Code: ${certificate.certificateCode}`}
      id="certificate-viewer-modal"
    >
      <div className="space-y-6">
        {/* Certificate Display Canvas Frame */}
        <div className="relative p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-white via-[#FFF8FC] to-[#FFF1F7] border-4 border-[#F3DCE8] shadow-2xl shadow-pink-500/10 overflow-hidden text-center select-none">
          {/* Subtle decorative watermark */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 opacity-[0.03] pointer-events-none">
            <Award className="w-full h-full text-[#EC4899]" />
          </div>

          {/* Top Organization Header */}
          <div className="flex flex-col items-center space-y-1 pb-6 border-b border-[#F3DCE8]">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#EC4899] to-[#A855F7] flex items-center justify-center text-white text-xs font-bold shadow-xs">
                T
              </span>
              <span className="text-sm font-extrabold tracking-widest uppercase text-[#18131A] font-outfit">
                TINKERHUB SBCE CHAPTER
              </span>
            </div>
            <p className="text-[10px] uppercase tracking-widest text-[#6B6470]">
              Sri Buddha College of Engineering · Kerala, India
            </p>
          </div>

          {/* Certificate Body Title */}
          <div className="py-6 space-y-3">
            <span className="text-[11px] font-bold tracking-widest uppercase text-[#DB2777]">
              Certificate of Achievement & Participation
            </span>

            <p className="text-xs text-[#6B6470]">This is to proudly certify that</p>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#18131A] tracking-tight font-outfit underline decoration-pink-300 decoration-2 underline-offset-8">
              {certificate.recipientName}
            </h2>

            <p className="text-xs text-[#6B6470] max-w-lg mx-auto pt-2 leading-relaxed">
              has successfully participated in and demonstrated exemplary technical competence in{' '}
              <strong className="text-[#18131A] font-bold">{certificate.eventTitle}</strong> organized by TinkerHub SBCE on {certificate.issueDate}.
            </p>

            {certificate.gradeOrRank && (
              <div className="inline-block mt-2 px-3 py-1 text-xs font-bold bg-[#FFF1F7] text-[#DB2777] rounded-full border border-[#F3DCE8]">
                {certificate.gradeOrRank}
              </div>
            )}
          </div>

          {/* Bottom Signatories & Verification QR */}
          <div className="pt-6 border-t border-[#F3DCE8] grid grid-cols-3 gap-4 items-end text-xs">
            <div className="text-center sm:text-left">
              <div className="font-script text-sm sm:text-base font-semibold text-[#18131A] mb-1 font-serif italic">
                Prof. Sreekanth R.
              </div>
              <div className="w-24 sm:w-32 h-0.5 bg-[#18131A]/20 mx-auto sm:mx-0 mb-1" />
              <span className="text-[9px] font-bold text-[#6B6470] uppercase block">Faculty Advisor</span>
              <span className="text-[8px] text-[#6B6470]">TinkerHub SBCE</span>
            </div>

            {/* Central Verification Seal */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#EC4899] to-[#A855F7] p-0.5 shadow-md shadow-pink-500/20 mb-1">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-[#EC4899]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>
              <span className="text-[9px] font-bold text-green-700 uppercase">VERIFIED CREDENTIAL</span>
              <span className="text-[8px] text-[#6B6470] font-mono">{certificate.certificateCode}</span>
            </div>

            <div className="text-center sm:text-right">
              <div className="font-script text-sm sm:text-base font-semibold text-[#18131A] mb-1 font-serif italic">
                Aaditya Nair
              </div>
              <div className="w-24 sm:w-32 h-0.5 bg-[#18131A]/20 mx-auto sm:ml-auto sm:mr-0 mb-1" />
              <span className="text-[9px] font-bold text-[#6B6470] uppercase block">Campus Lead</span>
              <span className="text-[8px] text-[#6B6470]">TinkerHub SBCE</span>
            </div>
          </div>
        </div>

        {/* Animated Vector Export Progress */}
        {downloading && (
          <div className="p-4 bg-[#FFF8FC] rounded-2xl border border-[#F3DCE8] space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-[#DB2777]">
              <span>Generating tamper-proof high-res certificate document...</span>
              <span>{downloadProgress}%</span>
            </div>
            <AnimatedProgressBar
              progressPercent={downloadProgress}
              variant="gradient"
              size="md"
              showPercent={false}
              animateGlow
            />
          </div>
        )}

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2 text-xs text-[#6B6470]">
            <QrCode className="w-4 h-4 text-[#EC4899]" />
            <span>Official verification code: <strong className="font-mono text-[#18131A]">{certificate.certificateCode}</strong></span>
          </div>

          <div className="flex items-center gap-3">
            {onOpenClaimWorkflow && (
              <button
                onClick={onOpenClaimWorkflow}
                className="px-3.5 py-2 text-xs font-bold text-[#DB2777] bg-[#FFF1F7] hover:bg-pink-100 border border-[#F3DCE8] rounded-xl transition-all cursor-pointer"
              >
                Claim Wizard
              </button>
            )}

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-white hover:bg-pink-50 text-[#18131A] border border-[#F3DCE8] rounded-xl transition-all cursor-pointer shadow-xs"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Share2 className="w-4 h-4 text-[#EC4899]" />}
              <span>{copied ? 'Link Copied!' : 'Share'}</span>
            </button>

            <GradientButton
              size="md"
              onClick={handleDownload}
              icon={<Download className="w-4 h-4" />}
            >
              {downloading ? 'Rendering...' : 'Download Certificate 📜'}
            </GradientButton>
          </div>
        </div>
      </div>
    </Modal>
  );
};

