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
        <div className="relative flex items-center bg-white border border-[#F3DCE8] focus-within:border-[#EC4899] focus-within:ring-4 focus-within:ring-pink-500/10 rounded-2xl p-1.5 transition-all">
          <Search className="w-5 h-5 text-[#EC4899] ml-3 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search events, workshops, hackathons, quizzes, topics..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-3 py-2 text-sm text-[#18131A] placeholder-[#6B6470]/60 bg-transparent focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1.5 text-[#6B6470] hover:text-[#EC4899] hover:bg-pink-50 rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Results List */}
        <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
          {/* Events Section */}
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B6470] block px-1">
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
                    className="p-3 bg-[#FFF8FC] hover:bg-[#FFF1F7] border border-[#F3DCE8] rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 bg-pink-100">
                        <img src={evt.thumbnail} alt={evt.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#18131A] group-hover:text-[#EC4899] transition-colors line-clamp-1">
                          {evt.title}
                        </h4>
                        <p className="text-[10px] text-[#6B6470] flex items-center gap-2">
                          <span>{evt.category}</span>
                          <span>·</span>
                          <span>{evt.date}</span>
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#6B6470] group-hover:text-[#EC4899] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#6B6470] px-2">No matching events found.</p>
            )}
          </div>

          {/* Quizzes Section */}
          <div className="space-y-2 pt-2 border-t border-[#F3DCE8]">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B6470] block px-1">
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
                  className="p-3 bg-[#FFF8FC] hover:bg-[#FFF1F7] border border-[#F3DCE8] rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                      <Trophy className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#18131A] group-hover:text-[#EC4899] transition-colors">
                        {quiz.title}
                      </h4>
                      <span className="text-[10px] text-[#6B6470]">{quiz.eventTitle} · {quiz.totalQuestions} Questions</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#DB2777] bg-pink-100 px-2 py-0.5 rounded-full">
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
