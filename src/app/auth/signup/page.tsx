'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Target, Mail, Lock, Loader2, User } from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase';
import { Button } from '@/components/ui';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createBrowserClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex flex-col items-center justify-center px-6">
      <Link href="/" className="mb-12 flex items-center space-x-2 group">
        <div className="w-12 h-12 hero-gradient rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
          <Target className="text-white w-7 h-7" />
        </div>
        <span className="text-2xl font-black text-white tracking-tight">Altru</span>
      </Link>

      <div className="w-full max-w-md glass-card rounded-[32px] p-8 md:p-12">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-black text-white mb-2">Join the Club</h1>
          <p className="text-zinc-500 font-medium">Start tracking, start giving.</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-400 ml-1">Full Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-green-500 transition-colors" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-zinc-900/50 border border-zinc-800 text-white rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-400 ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-green-500 transition-colors" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-900/50 border border-zinc-800 text-white rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-400 ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-green-500 transition-colors" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-900/50 border border-zinc-800 text-white rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm font-bold text-center">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full py-4 text-lg" disabled={loading}>
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Create Account'}
          </Button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-zinc-500 font-medium">
            Already a hero?{' '}
            <Link href="/auth/login" className="text-green-500 font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
