'use client';

import { useState, useEffect } from 'react';
import { Target, Heart, Trophy, CreditCard, Plus, ArrowUpRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { createBrowserClient } from '@/lib/supabase';
import Link from 'next/link';

export default function DashboardPage() {
  const [scores, setScores] = useState<any[]>([]);
  const [stats, setStats] = useState({
    impact: 0,
    avgScore: 0,
    drawsEntered: 0,
    status: 'Inactive'
  });
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserClient();

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Fetch Scores
      const { data: scoresData } = await supabase
        .from('scores')
        .select('*')
        .eq('user_id', user.id)
        .order('recorded_at', { ascending: false });

      // 2. Fetch Profile for Status & Impact
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, subscription_status')
        .eq('id', user.id)
        .single();

      if (scoresData) {
        setScores(scoresData);
        const avg = scoresData.length > 0 
          ? (scoresData.reduce((acc: number, curr: any) => acc + curr.score, 0) / scoresData.length).toFixed(1)
          : 0;
        
        setStats({
          impact: scoresData.length * 0.85, 
          avgScore: Number(avg),
          drawsEntered: profile?.subscription_status === 'active' ? 1 : 0,
          status: profile?.subscription_status === 'active' ? 'Active Hero' : 'Inactive'
        });
      }
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-green-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-white mb-2">Welcome Back, Hero</h1>
          <p className="text-zinc-500 font-medium text-lg">Your game is making a difference.</p>
        </div>
        <div className="flex space-x-4">
          <Link href="/dashboard/settings">
            <Button variant="outline" size="lg" className="rounded-2xl">
              <CreditCard className="w-5 h-5 mr-2" /> Manage Sub
            </Button>
          </Link>
          <Link href="/dashboard/scores">
            <Button size="lg" className="rounded-2xl px-10">
              <Plus className="w-5 h-5 mr-2" /> Enter Score
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-[32px] border-green-500/20 relative overflow-hidden group">
          <Heart className="text-green-500 w-8 h-8 mb-4" />
          <div className="text-3xl font-black text-white mb-1">£{stats.impact.toFixed(2)}</div>
          <div className="text-zinc-500 font-bold text-xs uppercase tracking-widest">Estimated Impact</div>
        </div>

        <div className="glass-card p-6 rounded-[32px] border-blue-500/20 relative overflow-hidden group">
          <Target className="text-blue-500 w-8 h-8 mb-4" />
          <div className="text-3xl font-black text-white mb-1">{stats.avgScore}</div>
          <div className="text-zinc-500 font-bold text-xs uppercase tracking-widest">Avg. Stableford</div>
        </div>

        <div className="glass-card p-6 rounded-[32px] border-purple-500/20 relative overflow-hidden group">
          <Trophy className="text-purple-500 w-8 h-8 mb-4" />
          <div className="text-3xl font-black text-white mb-1">{stats.drawsEntered}</div>
          <div className="text-zinc-500 font-bold text-xs uppercase tracking-widest">Draws Entered</div>
        </div>

        <div className="glass-card p-6 rounded-[32px] border-yellow-500/20 relative overflow-hidden group">
          <ArrowUpRight className="text-yellow-500 w-8 h-8 mb-4" />
          <div className="text-3xl font-black text-white mb-1">{stats.status}</div>
          <div className="text-zinc-500 font-bold text-xs uppercase tracking-widest">Account Status</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Recent Scores */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-black text-white">Latest Scores</h2>
            <Link href="/dashboard/scores" className="text-green-500 font-bold text-sm hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {scores.length > 0 ? (
              scores.slice(0, 5).map((s) => (
                <div key={s.id} className="glass-card p-5 rounded-3xl flex justify-between items-center hover:bg-white/5 transition-all">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center font-black text-green-500 border border-white/5">
                      {s.score}
                    </div>
                    <div>
                      <div className="text-white font-bold">Stableford Points</div>
                      <div className="text-zinc-500 text-sm font-medium">{new Date(s.recorded_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-zinc-500 font-medium p-8 glass-card rounded-3xl text-center">No scores yet. Enter your first score to see stats!</p>
            )}
          </div>
        </div>

        {/* Charity & Draw */}
        <div className="space-y-10">
          <div className="glass-card p-8 rounded-[40px] hero-gradient relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center space-x-2 text-white/80 font-bold text-sm uppercase tracking-widest mb-4">
                <Heart className="w-4 h-4" /> Your Impact
              </div>
              <h2 className="text-3xl font-black text-white mb-2">Changing Lives</h2>
              <p className="text-white/80 font-medium mb-6">10% of your subscription goes directly to your selected charity.</p>
              <Link href="/dashboard/charity">
                <Button variant="secondary" className="rounded-2xl text-black bg-white hover:bg-zinc-100">My Charity</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
