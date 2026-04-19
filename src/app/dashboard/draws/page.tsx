import { createServerClient } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { Trophy, Calendar, Zap, Info, ChevronRight } from 'lucide-react';

export default async function DrawsPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(cookieStore);
  
  const { data: draws } = await supabase
    .from('draws')
    .select('*')
    .eq('status', 'published')
    .order('draw_date', { ascending: false });

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-white mb-2">Prize Draws</h1>
          <p className="text-zinc-500 font-medium text-lg">Your entry is automatic with an active subscription.</p>
        </div>
      </div>

      {/* Current Jackpot Hero */}
      <div className="glass-card p-12 rounded-[48px] hero-gradient relative overflow-hidden group">
        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-widest">
              Upcoming Draw
            </div>
            <h2 className="text-6xl font-black text-white">May Mega <br/><span className="text-green-200">Jackpot</span></h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-white/80 font-bold">
                <Calendar className="w-5 h-5" /> <span>12 May 2026</span>
              </div>
              <div className="w-1 h-1 bg-white/30 rounded-full" />
              <div className="flex items-center space-x-2 text-white/80 font-bold">
                <Zap className="w-5 h-5" /> <span>2,400 Entries</span>
              </div>
            </div>
          </div>
          <div className="text-center md:text-right">
            <div className="text-zinc-100/60 font-black text-2xl uppercase tracking-[0.2em] mb-2">Estimated Pool</div>
            <div className="text-8xl md:text-9xl font-black text-white tracking-tighter drop-shadow-2xl">
              £12k
            </div>
          </div>
        </div>
        <Trophy className="absolute -right-16 -bottom-16 w-80 h-80 text-white/10 group-hover:scale-110 transition-transform duration-700" />
      </div>

      {/* Prize Tiers */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="glass-card p-8 rounded-[32px] border-yellow-500/20">
          <div className="text-yellow-500 font-black text-sm uppercase tracking-widest mb-4">5-Number Match</div>
          <div className="text-4xl font-black text-white mb-2">40% <span className="text-lg text-zinc-500 font-bold">Pool</span></div>
          <p className="text-zinc-500 font-medium text-sm">Jackpot rollover if no winners found.</p>
        </div>
        <div className="glass-card p-8 rounded-[32px] border-zinc-700">
          <div className="text-zinc-400 font-black text-sm uppercase tracking-widest mb-4">4-Number Match</div>
          <div className="text-4xl font-black text-white mb-2">35% <span className="text-lg text-zinc-500 font-bold">Pool</span></div>
          <p className="text-zinc-500 font-medium text-sm">Shared equally among all 4-matchers.</p>
        </div>
        <div className="glass-card p-8 rounded-[32px] border-zinc-700">
          <div className="text-zinc-400 font-black text-sm uppercase tracking-widest mb-4">3-Number Match</div>
          <div className="text-4xl font-black text-white mb-2">25% <span className="text-lg text-zinc-500 font-bold">Pool</span></div>
          <p className="text-zinc-500 font-medium text-sm">Shared equally among all 3-matchers.</p>
        </div>
      </div>

      {/* Past Results */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-white flex items-center">
          <History className="w-6 h-6 mr-3 text-green-500" /> Previous Results
        </h2>
        <div className="space-y-4">
          {draws && draws.length > 0 ? (
            draws.map((draw) => (
              <div key={draw.id} className="glass-card p-8 rounded-[32px] flex flex-col md:flex-row justify-between items-center group hover:bg-white/5 transition-all">
                <div className="flex items-center space-x-8 mb-6 md:mb-0 w-full md:w-auto">
                  <div className="text-left">
                    <div className="text-white font-black text-xl">{new Date(draw.draw_date).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })} Draw</div>
                    <div className="text-zinc-500 font-bold text-sm">Completed on {new Date(draw.draw_date).toLocaleDateString()}</div>
                  </div>
                  <div className="flex space-x-2">
                    {draw.winning_numbers.map((num: number, i: number) => (
                      <div key={i} className="w-10 h-10 bg-zinc-900 border border-white/10 rounded-full flex items-center justify-center font-black text-green-500">
                        {num}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-8 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <div className="text-white font-black text-xl">£{draw.total_prize_pool.toLocaleString()}</div>
                    <div className="text-zinc-500 font-bold text-sm uppercase tracking-widest">Total Pool</div>
                  </div>
                  <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-green-500 group-hover:border-green-500 transition-all">
                    <ChevronRight className="text-zinc-500 group-hover:text-black transition-colors" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 glass-card rounded-[32px] text-center">
              <Info className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
              <p className="text-zinc-500 font-bold tracking-tight">Previous results will appear here after the first draw.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function History({ className }: { className?: string }) {
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
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
      <path d="M3 3v5h5"/>
      <path d="M12 7v5l4 2"/>
    </svg>
  );
}
