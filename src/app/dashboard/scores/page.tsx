import { createServerClient } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { Target, History, Calendar, Plus } from 'lucide-react';
import { addScore } from '@/app/actions/scores';
import { Button } from '@/components/ui';

export default async function ScoresPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(cookieStore);
  
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data: scores } = await supabase
    .from('scores')
    .select('*')
    .eq('user_id', user?.id)
    .order('recorded_at', { ascending: false });

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <div>
        <h1 className="text-4xl font-black text-white mb-2">My Performance</h1>
        <p className="text-zinc-500 font-medium text-lg">Your latest 5 Stableford scores used for prize draws.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-10">
        {/* Score Entry Form */}
        <div className="md:col-span-1">
          <div className="glass-card p-8 rounded-[32px] sticky top-8">
            <h2 className="text-xl font-black text-white mb-6 flex items-center">
              <Plus className="w-5 h-5 mr-2 text-green-500" /> New Entry
            </h2>
            <form action={addScore} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-400 ml-1">Stableford Score</label>
                <input
                  name="score"
                  type="number"
                  required
                  min="1"
                  max="45"
                  className="w-full bg-zinc-900/50 border border-zinc-800 text-white rounded-2xl py-4 px-4 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all font-black text-2xl text-center"
                  placeholder="36"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-400 ml-1">Date Played</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input
                    name="recorded_at"
                    type="date"
                    required
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full bg-zinc-900/50 border border-zinc-800 text-white rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full py-4 text-lg">
                Save Score
              </Button>
            </form>
          </div>
        </div>

        {/* Score History */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-white flex items-center">
              <History className="w-5 h-5 mr-2 text-green-500" /> Score History
            </h2>
            <div className="px-3 py-1 bg-green-500/10 rounded-full text-green-500 text-xs font-bold uppercase tracking-widest">
              {scores?.length || 0}/5 Slots Filled
            </div>
          </div>

          <div className="space-y-4">
            {scores && scores.length > 0 ? (
              scores.map((s, index) => (
                <div 
                  key={s.id} 
                  className={`glass-card p-6 rounded-3xl flex justify-between items-center transition-all ${index === 0 ? 'border-green-500/30' : ''}`}
                >
                  <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex flex-col items-center justify-center border border-white/5">
                      <div className="text-2xl font-black text-green-500 leading-none">{s.score}</div>
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter mt-1">PTS</div>
                    </div>
                    <div>
                      <div className="text-lg font-black text-white">Stableford Round</div>
                      <div className="text-zinc-500 font-medium">
                        {new Date(s.recorded_at).toLocaleDateString('en-GB', { 
                          weekday: 'short', 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </div>
                    </div>
                  </div>
                  {index === 0 && (
                    <div className="text-[10px] font-black bg-green-500 text-black px-2 py-1 rounded-md uppercase tracking-widest">
                      Latest
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="glass-card p-20 rounded-[40px] text-center border-dashed border-zinc-800">
                <Target className="w-16 h-16 text-zinc-800 mx-auto mb-6" />
                <h3 className="text-xl font-black text-white mb-2">No scores recorded yet</h3>
                <p className="text-zinc-500 font-medium max-w-xs mx-auto">
                  Enter your first Stableford score to start your journey as a Digital Hero.
                </p>
              </div>
            )}
          </div>

          {scores && scores.length >= 5 && (
            <div className="p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-3xl">
              <p className="text-yellow-500 text-sm font-bold leading-relaxed">
                Note: You've reached the maximum of 5 scores. Your next entry will automatically replace your oldest score from {new Date(scores[scores.length-1].recorded_at).toLocaleDateString()}.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
