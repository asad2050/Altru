'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Check, ShieldCheck, Zap, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { createBrowserClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const supabase = createBrowserClient();
  const router = useRouter();

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(data);
      }
      setStatusLoading(false);
    }
    loadProfile();
  }, []);

  const handleSubscribe = async (plan: string) => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from('profiles')
      .update({ 
        subscription_status: 'active',
        plan_type: plan.toLowerCase()
      })
      .eq('id', user?.id);

    if (error) {
      alert(`Error updating subscription: ${error.message}`);
      setLoading(false);
      return;
    }

    setTimeout(() => {
      setLoading(false);
      alert(`Success! You are now an Altru ${plan} Legend.`);
      router.refresh();
      const reload = async () => {
        const { data } = await supabase.from('profiles').select('*').eq('id', user?.id).single();
        setProfile(data);
      };
      reload();
    }, 1000);
  };

  if (statusLoading) {
    return (
      <div className="p-20 text-center">
        <Loader2 className="animate-spin mx-auto w-10 h-10 text-green-500" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div>
        <h1 className="text-4xl font-black text-white mb-2">Account Settings</h1>
        <p className="text-zinc-500 font-medium text-lg">Manage your subscription and hero status.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="glass-card p-8 rounded-[32px] border-zinc-800">
          <h2 className="text-xl font-black text-white mb-6">Profile Details</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Email Address</label>
              <div className="text-white font-bold text-lg">{profile?.email}</div>
            </div>
            <div>
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Full Name</label>
              <div className="text-white font-bold text-lg">{profile?.full_name}</div>
            </div>
          </div>
        </div>

        <div className={`glass-card p-8 rounded-[32px] border-zinc-800 ${profile?.subscription_status === 'active' ? 'border-green-500/20 bg-green-500/5' : ''}`}>
          <h2 className="text-xl font-black text-white mb-6 flex items-center">
            <ShieldCheck className={`w-5 h-5 mr-2 ${profile?.subscription_status === 'active' ? 'text-green-500' : 'text-zinc-500'}`} /> Membership
          </h2>
          <div className="text-4xl font-black text-white mb-2">
            {profile?.subscription_status === 'active' ? 'Active' : 'Inactive'}
          </div>
          <p className="text-zinc-400 font-medium mb-6">
            {profile?.subscription_status === 'active' 
              ? `You are on the ${profile.plan_type} plan. Next contribution: May 19, 2026.`
              : 'Subscribe to a plan to start your charity impact.'}
          </p>
          {profile?.subscription_status === 'active' && (
            <Button variant="outline" className="w-full rounded-xl border-zinc-700">Cancel Subscription</Button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-black text-white">Available Plans</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="glass-card p-8 rounded-[40px] border-zinc-800 hover:border-zinc-700 transition-all relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-xl font-black text-white mb-2">Monthly Hero</h3>
              <div className="text-4xl font-black text-white mb-6">£42.50<span className="text-lg text-zinc-500 font-bold">/mo</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-zinc-400 text-sm font-bold"><Check className="w-4 h-4 mr-2 text-green-500" /> Automatic Draw Entry</li>
                <li className="flex items-center text-zinc-400 text-sm font-bold"><Check className="w-4 h-4 mr-2 text-green-500" /> 10% Charity Donation</li>
                <li className="flex items-center text-zinc-400 text-sm font-bold"><Check className="w-4 h-4 mr-2 text-green-500" /> Performance Analytics</li>
              </ul>
              <Button onClick={() => handleSubscribe('Monthly')} disabled={loading} className="w-full py-6 rounded-2xl text-lg font-black">
                {loading ? <Loader2 className="animate-spin w-6 h-6" /> : 'Switch to Monthly'}
              </Button>
            </div>
          </div>

          <div className="glass-card p-8 rounded-[40px] border-purple-500/30 bg-purple-500/5 hover:border-purple-500/50 transition-all relative overflow-hidden group">
            <div className="absolute top-4 right-4 bg-purple-500 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest">Best Value</div>
            <div className="relative z-10">
              <h3 className="text-xl font-black text-white mb-2">Annual Legend</h3>
              <div className="text-4xl font-black text-white mb-6">£425<span className="text-lg text-zinc-500 font-bold">/yr</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-zinc-400 text-sm font-bold"><Check className="w-4 h-4 mr-2 text-purple-500" /> 2 Months Free</li>
                <li className="flex items-center text-zinc-400 text-sm font-bold"><Check className="w-4 h-4 mr-2 text-purple-500" /> VIP Event Access</li>
                <li className="flex items-center text-zinc-400 text-sm font-bold"><Check className="w-4 h-4 mr-2 text-purple-500" /> Double Charity Impact</li>
              </ul>
              <Button onClick={() => handleSubscribe('Annual')} disabled={loading} className="w-full py-6 rounded-2xl text-lg font-black bg-purple-600 hover:bg-purple-700 text-white border-none">
                {loading ? <Loader2 className="animate-spin w-6 h-6" /> : 'Switch to Annual'}
              </Button>
            </div>
            <Zap className="absolute -right-10 -bottom-10 w-40 h-40 text-purple-500/10 -rotate-12" />
          </div>
        </div>
      </div>
    </div>
  );
}
