'use client';

import React, { useState } from 'react';
import { FolderGit2, Lock, Mail, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { TokenPayload } from '@/lib/auth';

interface AuthScreenProps {
  onSuccess: (user: TokenPayload) => void;
}

export function AuthScreen({ onSuccess }: AuthScreenProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim() || !password) {
      setError('Please enter both email/username and password');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: identifier.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid credentials');
      }

      onSuccess(data.user);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sign in failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-zinc-950 flex flex-col items-center justify-center p-4 selection:bg-zinc-800">
      <div className="w-full max-w-sm">
        {/* Logo & Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-11 h-11 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-200 mb-3.5 shadow-sm">
            <FolderGit2 className="w-5 h-5 text-zinc-100" />
          </div>
          <h1 className="text-xl font-bold text-zinc-100 tracking-tight">
            Project Tracker
          </h1>
          <p className="text-xs text-zinc-500 mt-1 max-w-xs">
            Sign in to access your projects, database consoles, and tasks.
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
          {error && (
            <div className="flex items-center gap-2 p-2.5 mb-4 text-xs text-red-400 bg-red-950/30 border border-red-800/50 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Email or Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  required
                  autoFocus
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3.5 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3.5 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-sm"
            >
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
              {!loading && <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </form>

          {/* Secure indicator */}
          <div className="mt-4 pt-3.5 border-t border-zinc-800/80 flex items-center justify-center gap-1.5 text-[11px] text-zinc-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/80" />
            <span>Encrypted with JWT session cookie</span>
          </div>
        </div>

        {/* CLI Provisioning Footer Note */}
        <div className="mt-5 text-center px-4">
          <p className="text-[11px] text-zinc-600">
            Signups are restricted. To create or reset an account, use the terminal CLI:
          </p>
          <code className="inline-block mt-1.5 px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 font-mono">
            npm run create-user
          </code>
        </div>
      </div>
    </div>
  );
}

export default AuthScreen;
