import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ArrowRight, 
  RotateCcw, 
  Sparkles, 
  Award, 
  Flame,
  Check,
  ShieldCheck,
  Zap,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Quiz, QuizQuestion } from '../../types';
import { Modal } from '../common/Modal';
import { GradientButton } from '../common/GradientButton';
import { AnimatedProgressBar } from '../common/AnimatedProgressBar';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  quiz: Quiz | null;
  onSubmitScore: (quizId: string, score: number, maxScore: number, timeSpent: number) => { passed: boolean; score: number; rankPoints: number };
  onViewCertificate?: () => void;
  onClaimCertificate?: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  isOpen,
  onClose,
  quiz,
  onSubmitScore,
  onViewCertificate,
  onClaimCertificate,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(180);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalProgress, setEvalProgress] = useState(0);
  const [evalStepText, setEvalStepText] = useState('Packaging test responses...');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState<{ passed: boolean; score: number; rankPoints: number } | null>(null);

  // Total time in seconds for percentage
  const totalQuizSeconds = (quiz?.timeLimitMinutes || 3) * 60;
  const timePercent = Math.max(0, Math.min(100, (timeLeft / totalQuizSeconds) * 100));

  // Initialize timer on quiz open
  useEffect(() => {
    if (isOpen && quiz) {
      setCurrentIdx(0);
      setSelectedAnswers({});
      setIsEvaluating(false);
      setEvalProgress(0);
      setIsSubmitted(false);
      setResult(null);
      setTimeLeft(quiz.timeLimitMinutes * 60);
    }
  }, [isOpen, quiz]);

  // Countdown clock
  useEffect(() => {
    if (!isOpen || isSubmitted || isEvaluating || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, isSubmitted, isEvaluating, timeLeft]);

  if (!quiz) return null;

  const currentQ: QuizQuestion = quiz.questions[currentIdx];
  const totalQuestions = quiz.questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const questionProgressPercent = ((currentIdx + 1) / totalQuestions) * 100;

  const handleSelectOption = (optionIdx: number) => {
    if (isSubmitted || isEvaluating) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [currentIdx]: optionIdx,
    });
  };

  const handleAutoSubmit = () => {
    calculateAndSubmit();
  };

  const calculateAndSubmit = () => {
    setIsEvaluating(true);
    setEvalProgress(15);
    setEvalStepText('Encrypting responses & timestamping submission...');

    // Multi-stage evaluation visual animation
    setTimeout(() => {
      setEvalProgress(45);
      setEvalStepText('Evaluating test cases & algorithmic accuracy...');
    }, 450);

    setTimeout(() => {
      setEvalProgress(75);
      setEvalStepText('Calculating TinkerHub leaderboard XP & rank position...');
    }, 900);

    setTimeout(() => {
      setEvalProgress(100);
      setEvalStepText('Finalizing verified score credential...');

      setTimeout(() => {
        let earnedPoints = 0;
        const totalPoints = quiz.questions.reduce((acc, q) => acc + q.points, 0);

        quiz.questions.forEach((q, idx) => {
          if (selectedAnswers[idx] === q.correctIndex) {
            earnedPoints += q.points;
          }
        });

        const timeSpent = quiz.timeLimitMinutes * 60 - timeLeft;
        const res = onSubmitScore(quiz.id, earnedPoints, totalPoints, timeSpent);
        setResult(res);
        setIsEvaluating(false);
        setIsSubmitted(true);

        if (res.passed) {
          try {
            confetti({
              particleCount: 100,
              spread: 80,
              origin: { y: 0.5 },
              colors: ['#DC2626', '#B91C1C', '#B91C1C', '#22D3EE', '#FEE2E2']
            });
          } catch {
            // ignore
          }
        }
      }, 400);
    }, 1350);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      title={
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-[#E04848]" />
          <span>{quiz.title}</span>
        </div>
      }
      subtitle={quiz.eventTitle}
      id="quiz-runner-modal"
    >
      {/* 1. Evaluation In-Progress State */}
      {isEvaluating ? (
        <div className="py-12 px-4 text-center space-y-6">
          <div className="relative w-20 h-20 mx-auto">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
              className="w-full h-full rounded-full border-4 border-[#FFF1F2] border-t-[#DC2626] border-r-[#B91C1C]"
            />
            <div className="absolute inset-0 flex items-center justify-center text-[#E04848]">
              <Cpu className="w-8 h-8 animate-pulse" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white font-outfit">
              Grading Your Submission
            </h3>
            <p className="text-xs text-[#B3ABAB] font-mono">
              {evalStepText}
            </p>
          </div>

          {/* Evaluation Animated Progress Bar */}
          <div className="max-w-md mx-auto">
            <AnimatedProgressBar
              progressPercent={evalProgress}
              variant="gradient"
              size="lg"
              showPercent
              animateGlow
            />
          </div>

          <div className="flex items-center justify-center gap-4 text-[11px] text-[#B3ABAB]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#4ADE80]" />
              Automated Integrity Verified
            </span>
            <span>·</span>
            <span>TinkerHub SBCE Engine</span>
          </div>
        </div>
      ) : !isSubmitted ? (
        /* 2. Active Quiz Runner State */
        <div className="space-y-6">
          {/* Top Multi-step Status & Timer Bar */}
          <div className="p-4 bg-gradient-to-r from-[#141012] to-[#141012] rounded-2xl border border-[#B3282D] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 text-xs font-extrabold bg-[#141012] text-[#E04848] rounded-xl border border-[#B3282D] shadow-2xs">
                  Question {currentIdx + 1} of {totalQuestions}
                </span>
                <span className="text-xs font-medium text-[#B3ABAB]">
                  ({currentQ.points} XP Points)
                </span>
              </div>

              {/* Countdown Time Indicator */}
              <div className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-bold rounded-xl border transition-all ${
                timeLeft < 30 
                  ? 'bg-[#3A1A1C] text-[#E04848] border-red-500/30 animate-pulse shadow-sm shadow-red-500/20' 
                  : 'bg-[#141012] text-white border-[#B3282D]'
              }`}>
                <Clock className={`w-3.5 h-3.5 ${timeLeft < 30 ? 'text-red-500' : 'text-[#E04848]'}`} />
                <span>{formatTime(timeLeft)} remaining</span>
              </div>
            </div>

            {/* Main Animated Multi-Step Question Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-semibold text-[#B3ABAB]">
                <span>Overall Quiz Progress</span>
                <span className="text-[#E04848] font-bold">
                  {answeredCount} of {totalQuestions} Answered ({Math.round((answeredCount / totalQuestions) * 100)}%)
                </span>
              </div>

              <AnimatedProgressBar
                currentStep={currentIdx + 1}
                totalSteps={totalQuestions}
                progressPercent={questionProgressPercent}
                variant="gradient"
                size="md"
                showPercent={false}
                animateGlow
                id="quiz-question-progress"
              />
            </div>

            {/* Question Step Pills Navigation */}
            <div className="flex items-center gap-1.5 pt-1 overflow-x-auto pb-0.5">
              {quiz.questions.map((q, qIndex) => {
                const isAnswered = selectedAnswers[qIndex] !== undefined;
                const isCurrent = qIndex === currentIdx;
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(qIndex)}
                    className={`h-7 min-w-7 px-2 text-[11px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      isCurrent
                        ? 'bg-[#DC2626] text-white shadow-xs shadow-red-600/30 scale-105 ring-2 ring-red-300'
                        : isAnswered
                        ? 'bg-red-500/15 text-[#E04848] border border-[#B3282D]'
                        : 'bg-[#141012] text-[#B3ABAB] border border-[#B3282D] hover:bg-red-500/15'
                    }`}
                    title={`Question ${qIndex + 1}`}
                  >
                    <span>{qIndex + 1}</span>
                    {isAnswered && !isCurrent && <Check className="w-2.5 h-2.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-3 pt-1">
            <h4 className="text-base sm:text-lg font-bold text-white leading-snug">
              {currentQ.question}
            </h4>

            {currentQ.codeSnippet && (
              <pre className="p-4 bg-slate-900 text-red-300 rounded-2xl text-xs font-mono overflow-x-auto shadow-inner">
                <code>{currentQ.codeSnippet}</code>
              </pre>
            )}
          </div>

          {/* Options Grid */}
          <div className="space-y-2.5">
            {currentQ.options.map((opt, oIdx) => {
              const isSelected = selectedAnswers[currentIdx] === oIdx;
              return (
                <button
                  key={oIdx}
                  onClick={() => handleSelectOption(oIdx)}
                  className={`w-full text-left p-4 rounded-2xl text-xs sm:text-sm font-medium border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#141012] text-[#E04848] border-[#DC2626] shadow-sm ring-2 ring-red-600/10'
                      : 'bg-[#141012] text-white border-[#B3282D] hover:border-red-500/30 hover:bg-red-500/15'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-[#DC2626] text-white' : 'bg-white/5 text-[#B3ABAB]'
                    }`}>
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span>{opt}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-[#E04848] shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-[#3B3535]">
            <button
              onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
              disabled={currentIdx === 0}
              className="px-4 py-2 text-xs font-bold text-[#B3ABAB] hover:text-white disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
            >
              ← Previous
            </button>

            <div className="flex items-center gap-2">
              {currentIdx < quiz.questions.length - 1 ? (
                <GradientButton
                  size="sm"
                  onClick={() => setCurrentIdx(currentIdx + 1)}
                  icon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Next Question
                </GradientButton>
              ) : (
                <GradientButton
                  size="sm"
                  onClick={calculateAndSubmit}
                  icon={<Sparkles className="w-3.5 h-3.5" />}
                >
                  Submit Final Quiz 🚀
                </GradientButton>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* 3. Result Scorecard Screen with Animated Progress Metrics */
        <div className="space-y-6 text-center py-2">
          <div className={`w-16 h-16 rounded-3xl mx-auto flex items-center justify-center shadow-lg ${
            result?.passed ? 'bg-red-500/15 text-[#E04848]' : 'bg-amber-500/15 text-amber-300'
          }`}>
            {result?.passed ? <Award className="w-9 h-9" /> : <Flame className="w-9 h-9" />}
          </div>

          <div>
            <span className="px-3 py-1 text-[11px] font-extrabold uppercase rounded-full bg-red-500/15 text-[#E04848]">
              {result?.passed ? 'Passed with Distinction 🏆' : 'Quiz Completed'}
            </span>
            <h3 className="text-2xl font-extrabold text-white mt-2 font-outfit">
              Score: {result?.score}%
            </h3>
            <p className="text-xs text-[#B3ABAB] mt-1 max-w-md mx-auto">
              {result?.passed
                ? 'Outstanding technical performance! You unlocked verified campus leaderboard XP and are eligible to claim your official digital certificate.'
                : 'Good effort! Review the solutions below and try again to improve your standing.'}
            </p>
          </div>

          {/* Animated Score Progress Bar against Passing Mark */}
          <div className="p-4 bg-[#141012] rounded-2xl border border-[#B3282D] space-y-2 text-left max-w-md mx-auto">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white">Mastery Score Gauge</span>
              <span className="font-mono font-bold text-[#E04848]">{result?.score}% (Pass: 60%)</span>
            </div>

            <div className="relative">
              <AnimatedProgressBar
                progressPercent={result?.score || 0}
                variant={result?.passed ? 'gradient' : 'amber'}
                size="md"
                showPercent={false}
                animateGlow
              />

              {/* 60% passing marker line */}
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-[#1A1313]/40 z-10 pointer-events-none"
                style={{ left: '60%' }}
                title="Passing threshold (60%)"
              />
            </div>

            <div className="flex items-center justify-between text-[10px] text-[#B3ABAB]">
              <span>0% Baseline</span>
              <span className="font-semibold text-[#4ADE80]">60% Certificate Cutoff</span>
              <span>100% Top Tier</span>
            </div>
          </div>

          {/* Score badges */}
          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto text-xs">
            <div className="p-3.5 bg-[#141012] rounded-2xl border border-[#B3282D]">
              <span className="text-[10px] text-[#B3ABAB] block">Leaderboard Points</span>
              <span className="text-lg font-bold text-[#E04848]">+{result?.rankPoints} XP</span>
            </div>
            <div className="p-3.5 bg-[#141012] rounded-2xl border border-[#B3282D]">
              <span className="text-[10px] text-[#B3ABAB] block">Campus Credential</span>
              <span className="text-lg font-bold text-[#4ADE80]">
                {result?.passed ? 'Unlocked ✨' : '60% Needed'}
              </span>
            </div>
          </div>

          {/* Solutions & Explanations Accordion list */}
          <div className="text-left space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Question Review & Explanations
            </h4>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {quiz.questions.map((q, idx) => {
                const userChoice = selectedAnswers[idx];
                const isCorrect = userChoice === q.correctIndex;
                return (
                  <div key={q.id} className="p-3 bg-[#141012] rounded-xl border border-[#B3282D] text-xs space-y-1.5">
                    <div className="flex items-start justify-between gap-2 font-semibold text-white">
                      <span>{idx + 1}. {q.question}</span>
                      {isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-[#4ADE80] shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      )}
                    </div>
                    <div className="text-[11px] text-[#B3ABAB]">
                      <span className="font-bold text-white">Correct: </span>
                      <span className="text-[#4ADE80]">{q.options[q.correctIndex]}</span>
                    </div>
                    <p className="text-[10px] text-[#B3ABAB] bg-[#141012] p-2 rounded-lg border border-[#B3282D]">
                      💡 {q.explanation}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action buttons with Claim Certificate Priority */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setIsSubmitted(false);
                setCurrentIdx(0);
                setSelectedAnswers({});
                setTimeLeft(quiz.timeLimitMinutes * 60);
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-[#B3ABAB] hover:text-white bg-[#141012] border border-[#B3282D] rounded-xl cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Quiz</span>
            </button>

            {result?.passed && (
              <GradientButton
                size="md"
                onClick={() => {
                  onClose();
                  if (onClaimCertificate) {
                    onClaimCertificate();
                  } else if (onViewCertificate) {
                    onViewCertificate();
                  }
                }}
                icon={<Award className="w-4 h-4" />}
              >
                Claim Official Certificate 📜
              </GradientButton>
            )}

            {!result?.passed && (
              <GradientButton size="md" onClick={onClose}>
                Done
              </GradientButton>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};

