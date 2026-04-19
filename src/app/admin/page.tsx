'use client';

import { useState, useEffect } from 'react';
import { Target, Trophy, Users, Heart, Play, Send, ShieldCheck, Loader2, Plus, Trash2, Globe, Image as ImageIcon, LogOut } from 'lucide-react';
import { Button } from '@/components/ui';
import { runDrawSimulation } from '@/app/actions/draws';
import { addCharity, deleteCharity } from '@/app/actions/charities';
import { createBrowserClient } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [simulation, setSimulation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [charities, setCharities] = useState<any[]>([]);
  const [isAddingCharity, setIsAddingCharity] = useState(false);
  const [stats, setStats] = useState({
    users: 0,
    prizePool: 12500,
    charity: 0,
    scores: 0
  });

  const supabase = createBrowserClient();
  const router = useRouter();

  const loadData = async () => {
    const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const { count: scoreCount } = await supabase.from('scores').select('*', { count: 'exact', head: true });
    const { data: charityData } = await supabase.from('charities').select('*').order('created_at', { ascending: false });
    
    setCharities(charityData || []);
    setStats(prev => ({
      ...prev,
      users: userCount || 0,
      scores: scoreCount || 0,
      charity: (scoreCount || 0) * 4.25
    }));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSimulate = async () => {
    setLoading(true);
    const result = await runDrawSimulation();
    setSimulation(result);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this charity?')) {
      await deleteCharity(id);
      loadData();
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
    router.refresh();
  };

  function PlusIcon({ className }: { className?: string }) {
    return (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
      >
        <path d="M5 12h14"/>
        <path d="M12 5v14"/>
      </svg>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b]">
      {/* Admin Header */}
      <nav className="border-b border-white/5 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 hero-gradient rounded-lg flex items-center justify-center">
                <Target className="text-white w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">Altru</span>
            </Link>
            <div className="h-4 w-px bg-white/10" />
            <span className="text-xs font-black text-green-500 uppercase tracking-[0.2em]">Admin</span>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/dashboard" className="text-sm font-bold text-zinc-400 hover:text-white transition-colors">
              User View
            </Link>
            <button 
              onClick={handleSignOut}
              className="text-sm font-bold text-zinc-400 hover:text-red-500 transition-colors flex items-center"
            >
              Sign Out <LogOut className="ml-2 w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto space-y-10 p-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center">
              <ShieldCheck className="text-black w-7 h-7" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-white">Admin Control Center</h1>
              <p className="text-zinc-500 font-medium">Altru Management & Analytics</p>

            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6">
          <div className="glass-card p-6 rounded-3xl border-zinc-800">
            <Users className="text-zinc-500 w-8 h-8 mb-4" />
            <div className="text-3xl font-black text-white">{stats.users}</div>
            <div className="text-zinc-500 font-bold text-xs uppercase tracking-widest">Total Users</div>
          </div>
          <div className="glass-card p-6 rounded-3xl border-zinc-800">
            <Trophy className="text-zinc-500 w-8 h-8 mb-4" />
            <div className="text-3xl font-black text-white">£{(stats.prizePool/1000).toFixed(1)}k</div>
            <div className="text-zinc-500 font-bold text-xs uppercase tracking-widest">Total Prize Pool</div>
          </div>
          <div className="glass-card p-6 rounded-3xl border-zinc-800">
            <Heart className="text-zinc-500 w-8 h-8 mb-4" />
            <div className="text-3xl font-black text-white">£{(stats.charity/1000).toFixed(1)}k</div>
            <div className="text-zinc-500 font-bold text-xs uppercase tracking-widest">Charity Generated</div>
          </div>
          <div className="glass-card p-6 rounded-3xl border-zinc-800">
            <Target className="text-zinc-500 w-8 h-8 mb-4" />
            <div className="text-3xl font-black text-white">{stats.scores}</div>
            <div className="text-zinc-500 font-bold text-xs uppercase tracking-widest">Scores Tracked</div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2 space-y-10">
            {/* Draw Simulation Section */}
            <div className="glass-card p-8 rounded-[40px] border-green-500/20">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black text-white flex items-center">
                  <Play className="w-6 h-6 mr-3 text-green-500" /> Draw Simulation
                </h2>
                <Button size="lg" onClick={handleSimulate} disabled={loading}>
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Run Simulation'}
                </Button>
              </div>

              {simulation ? (
                <div className="space-y-10">
                  <div className="text-center">
                    <div className="text-zinc-500 font-bold uppercase tracking-widest mb-4">Winning Numbers Generated</div>
                    <div className="flex justify-center space-x-4">
                      {simulation.winningNumbers.map((num: number) => (
                        <div key={num} className="w-10 h-10 bg-green-500 text-black rounded-full flex items-center justify-center text-xl font-black">
                          {num}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-zinc-900/50 p-4 rounded-2xl text-center">
                      <div className="text-white font-black text-xl">{simulation.matches[5]}</div>
                      <div className="text-zinc-500 text-[10px] uppercase font-bold">5-Match</div>
                    </div>
                    <div className="bg-zinc-900/50 p-4 rounded-2xl text-center">
                      <div className="text-white font-black text-xl">{simulation.matches[4]}</div>
                      <div className="text-zinc-500 text-[10px] uppercase font-bold">4-Match</div>
                    </div>
                    <div className="bg-zinc-900/50 p-4 rounded-2xl text-center">
                      <div className="text-white font-black text-xl">{simulation.matches[3]}</div>
                      <div className="text-zinc-500 text-[10px] uppercase font-bold">3-Match</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-10 text-center text-zinc-600 font-medium">Ready to analyze winner distribution.</div>
              )}
            </div>

            {/* Charity Management Section */}
            <div className="glass-card p-8 rounded-[40px] border-zinc-800">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-white flex items-center">
                  <Heart className="w-6 h-6 mr-3 text-red-500" /> Charity Partners
                </h2>
                <Button onClick={() => setIsAddingCharity(!isAddingCharity)} variant={isAddingCharity ? 'outline' : 'primary'} className="rounded-xl">
                  {isAddingCharity ? 'Cancel' : 'Add New Partner'}
                </Button>

              </div>

              {isAddingCharity && (
                <form action={async (fd) => { await addCharity(fd); setIsAddingCharity(false); loadData(); }} className="mb-10 p-6 bg-zinc-900/50 rounded-3xl border border-zinc-800 space-y-4 animate-in fade-in zoom-in duration-300">
                  <div className="grid md:grid-cols-2 gap-4">
                    <input name="name" placeholder="Charity Name" required className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:ring-2 focus:ring-green-500 outline-none" />
                    <input name="website_url" placeholder="Website URL" className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:ring-2 focus:ring-green-500 outline-none" />
                    <input name="image_url" placeholder="Image URL (Unsplash)" className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:ring-2 focus:ring-green-500 outline-none" />
                    <select name="is_featured" className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white focus:ring-2 focus:ring-green-500 outline-none">
                      <option value="false">Standard</option>
                      <option value="true">Featured</option>
                    </select>
                  </div>
                  <textarea name="description" placeholder="Short description..." required className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white h-24 focus:ring-2 focus:ring-green-500 outline-none" />
                  <Button type="submit" className="w-full py-4 text-lg rounded-xl">Save Partner</Button>
                </form>
              )}

              <div className="space-y-4">
                {charities.map((c) => (
                  <div key={c.id} className="p-4 bg-zinc-900/30 border border-white/5 rounded-2xl flex items-center justify-between group">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center overflow-hidden">
                        {c.image_url ? <img src={c.image_url} className="w-full h-full object-cover" /> : <Heart className="text-zinc-600 w-6 h-6" />}
                      </div>
                      <div>
                        <div className="text-white font-bold">{c.name}</div>
                        <div className="text-zinc-500 text-xs flex items-center">
                          <Globe className="w-3 h-3 mr-1" /> {c.website_url ? 'Linked' : 'No URL'} 
                          {c.is_featured && <span className="ml-2 text-green-500 font-black uppercase text-[8px] tracking-widest">Featured</span>}
                        </div>
                      </div>
                    </div>
                    <button onClick={() => handleDelete(c.id)} className="p-2 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions & Reports */}
          <div className="space-y-6">
            <div className="glass-card p-8 rounded-[40px] border-zinc-800">
              <h2 className="text-xl font-black text-white mb-6">System Reports</h2>
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="text-zinc-500 text-xs font-bold uppercase mb-1">Total Payouts</div>
                  <div className="text-2xl font-black text-white">£0.00</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="text-zinc-500 text-xs font-bold uppercase mb-1">Pending Verifications</div>
                  <div className="text-2xl font-black text-white">0</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
