import React, { useState } from 'react';
import { Mail, User } from 'lucide-react';
import { Modal } from '../common/Modal';
import { GradientButton } from '../common/GradientButton';
import { useStudentAuth } from '../../context/StudentAuthContext';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLoggedIn: () => void;
}

export const StudentLoginModal: React.FC<Props> = ({ isOpen, onClose, onLoggedIn }) => {
  const { login } = useStudentAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    login(email.trim().toLowerCase(), name.trim());
    onLoggedIn();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sign In" subtitle="Just your name and email — no password needed" maxWidth="sm" id="student-login-modal">
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        {error && (
          <div className="px-3 py-2 rounded-xl bg-[#FFF1F7] border border-[#F3DCE8] text-[#DB2777] text-xs font-semibold">
            {error}
          </div>
        )}
        <div className="relative">
          <User className="absolute left-3.5 top-3.5 w-4 h-4 text-[#6B6470]" />
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#F3DCE8] focus:border-[#EC4899] rounded-xl focus:outline-none text-sm"
          />
        </div>
        <div className="relative">
          <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-[#6B6470]" />
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#F3DCE8] focus:border-[#EC4899] rounded-xl focus:outline-none text-sm"
          />
        </div>
        <GradientButton type="submit" size="md" className="w-full justify-center">
          Continue
        </GradientButton>
      </form>
    </Modal>
  );
};
