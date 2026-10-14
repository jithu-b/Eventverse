import React, { useState, useEffect } from 'react';
import { Search, Calendar, Trophy, Compass, ArrowRight, X } from 'lucide-react';
import { EventItem, Quiz } from '../../types';
import { Modal } from '../common/Modal';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: EventItem[];
  quizzes: Quiz[];
  onSelectEvent: (eventId: string) => void;
  onSelectQuiz: (quizId: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  events = [],
  quizzes = [],
  onSelectEvent,
  onSelectQuiz,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  const safeEvents = Array.isArray(events) ? events : [];
  const safeQuizzes = Array.isArray(quizzes) ? quizzes : [];

  const filteredEvents = query.trim()
    ? safeEvents.filter(
        (e) =>
          (e?.title || '').toLowerCase().includes(query.toLowerCase()) ||
          (e?.description || '').toLowerCase().includes(query.toLowerCase()) ||
          (e?.category || '').toLowerCase().includes(query.toLowerCase()) ||
          (e?.tags || []).some((t) => t.toLowerCase().includes(query.toLowerCase()))
      )
    : safeEvents.slice(0, 3);

  const filteredQuizzes = query.trim()
    ? safeQuizzes.filter(
        (q) =>
          (q?.title || '').toLowerCase().includes(query.toLowerCase()) ||
          (q?.eventTitle || '').toLowerCase().includes(query.toLowerCase())
      )
    : safeQuizzes;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="xl" id="global-search-modal">
      <div className="space-y-4">
        {/* Search Field */}
        <div className="relative flex items-center bg-[#141012] border border-[#B3282D] focus-within:border-[#DC2626] focus-within:ring-4 focus-within:ring-red-600/10 rounded-2xl p-1.5 transition-all">
          <Search className="w-5 h-5 text-[#E04848] ml-3 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search events, workshops, hackathons, quizzes, topics..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-3 py-2 text-sm text-white placeholder-[#A8A0A0]/60 bg-transparent focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1.5 text-[#B3ABAB] hover:text-[#E04848] hover:bg-red-500/15 rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Results List */}
        <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
          {/* Events Section */}
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#B3ABAB] block px-1">
              Events ({filteredEvents.length})
            </span>

            {filteredEvents.length > 0 ? (
              <div className="space-y-1.5">
                {filteredEvents.map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => {
                      onSelectEvent(evt.id);
                      onClose();
                    }}
                    className="p-3 bg-[#141012] hover:bg-[#141012] border border-[#B3282D] rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 bg-red-500/15">
                        <img src={evt.thumbnail} alt={evt.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white group-hover:text-[#E04848] transition-colors line-clamp-1">
                          {evt.title}
                        </h4>
                        <p className="text-[10px] text-[#B3ABAB] flex items-center gap-2">
                          <span>{evt.category}</span>
                          <span>·</span>
                          <span>{evt.date}</span>
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#B3ABAB] group-hover:text-[#E04848] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#B3ABAB] px-2">No matching events found.</p>
            )}
          </div>

          {/* Quizzes Section */}
          <div className="space-y-2 pt-2 border-t border-[#3B3535]">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#B3ABAB] block px-1">
              Interactive Quizzes ({filteredQuizzes.length})
            </span>

            <div className="space-y-1.5">
              {filteredQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  onClick={() => {
                    onSelectQuiz(quiz.id);
                    onClose();
                  }}
                  className="p-3 bg-[#141012] hover:bg-[#141012] border border-[#B3282D] rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#3A1A1C] text-[#E04848] flex items-center justify-center shrink-0">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-[#E04848] transition-colors">
                        {quiz.title}
                      </h4>
                      <span className="text-[10px] text-[#B3ABAB]">{quiz.eventTitle} · {quiz.totalQuestions} Questions</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#E04848] bg-red-500/15 px-2 py-0.5 rounded-full">
                    Start Quiz
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
