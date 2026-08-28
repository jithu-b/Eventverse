import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GradientButton } from '../components/common/GradientButton';
import { AnimatedGuideMan } from '../components/character/AnimatedGuideMan';

const inputClass =
  'w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-[#F3DCE8] focus:border-[#EC4899] rounded-xl focus:outline-none';

export function AuthPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusField, setFocusField] = useState<'email' | 'password' | 'none'>('none');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 gap-8 flex-wrap">
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
          <h1 className="text-xl font-bold text-[#18131A]">
            {mode === 'login' ? 'Welcome back' : 'Join EventVerse'}
          </h1>
          <p className="text-xs text-[#6B6470] mt-1">TinkerHub SBCE Campus Chapter</p>
        </div>

        {error && (
          <div className="mb-4 px-3 py-2 rounded-xl bg-[#FFF1F7] border border-[#F3DCE8] text-[#DB2777] text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 w-4 h-4 text-[#6B6470]" />
              <input
                type="text"
                required
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-[#6B6470]" />
            <input
              type="email"
              required
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
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusField('password')}
              onBlur={() => setFocusField('none')}
              className={inputClass}
            />
          </div>

          <GradientButton type="submit" size="lg" className="w-full justify-center" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Log In' : 'Create Account'}
          </GradientButton>
        </form>

        <p className="text-center text-xs text-[#6B6470] mt-5">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-[#EC4899] font-bold hover:underline"
          >
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
