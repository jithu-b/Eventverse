import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GradientButton } from '../components/common/GradientButton';
import { AnimatedGuideMan } from '../components/character/AnimatedGuideMan';

const inputClass =
  'w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-[#F3DCE8] focus:border-[#EC4899] rounded-xl focus:outline-none';

export function AdminPage() {
  const { authUser, loginAsAdmin, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [focusField, setFocusField] = useState<'email' | 'password' | 'none'>('none');
  const isAdmin = authUser?.role === 'admin';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Wrong email or password.');
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 gap-8 flex-wrap py-10">
      <div className="hidden lg:block w-72">
        <AnimatedGuideMan
          characterName="Jithu"
          currentFocus={focusField === 'none' ? undefined : focusField}
        />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-white/80 backdrop-blur-md border border-[#F3DCE8] rounded-3xl shadow-xl p-8"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#EC4899] to-[#A855F7] flex items-center justify-center mb-3">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-[#18131A]">Admin Login</h1>
          <p className="text-xs text-[#6B6470] mt-1">TinkerHub SBCE Campus Chapter</p>
        </div>

        {isAdmin ? (
          <div className="text-center space-y-4">
            <div className="mx-auto w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <p className="text-sm text-[#18131A] font-semibold">You're viewing as Admin</p>
            <p className="text-xs text-[#6B6470]">
              This is a showcase build — no real accounts or data are affected.
            </p>
            <GradientButton size="md" className="w-full justify-center" onClick={logout}>
              Exit Admin View
            </GradientButton>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-[#6B6470]" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusField('email')}
                  onBlur={() => setFocusField('none')}
                  className={inputClass}
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-[#6B6470]" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusField('password')}
                  onBlur={() => setFocusField('none')}
                  className={inputClass}
                />
              </div>
              <GradientButton type="submit" size="lg" className="w-full justify-center">
                Enter Admin View
              </GradientButton>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
