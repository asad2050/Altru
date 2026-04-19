import { createServerClient } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { Heart, ExternalLink, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui';
import Link from 'next/link';

export default async function MyCharityPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(cookieStore);
  
  const { data: { user } } = await supabase.auth.getUser();
  
  // Fetch user's profile to get selected charity
  const { data: profile } = await supabase
    .from('profiles')
    .select('selected_charity_id')
    .eq('id', user?.id)
    .single();

  // Fetch all charities to show options or the selected one
  const { data: charities } = await supabase
    .from('charities')
    .select('*');

  const selectedCharity = charities?.find(c => c.id === profile?.selected_charity_id);

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div>
        <h1 className="text-4xl font-black text-white mb-2">My Charity</h1>
        <p className="text-zinc-500 font-medium text-lg">10% of your subscription goes to your chosen cause.</p>
      </div>

      {selectedCharity ? (
        <div className="glass-card p-10 rounded-[40px] border-green-500/20 relative overflow-hidden">
          <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-green-500/10 text-green-500 text-xs font-bold uppercase tracking-widest mb-6">
                Active Selection
              </div>
              <h2 className="text-5xl font-black text-white mb-6">{selectedCharity.name}</h2>
              <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                {selectedCharity.description || "Leading the charge in making the world a better place through dedicated community support and innovation."}
              </p>
              <div className="flex space-x-4">
                <Button className="rounded-2xl px-8 py-6 text-lg">
                  Change Charity
                </Button>
                <a 
                  href={selectedCharity.website_url || "#"} 
                  target="_blank" 
                  className="flex items-center justify-center px-6 text-zinc-500 hover:text-white font-bold transition-colors"
                >
                  Visit Website <ExternalLink className="ml-2 w-5 h-5" />
                </a>
              </div>
            </div>
            <div className="hidden md:block">
              {selectedCharity.image_url ? (
                <img src={selectedCharity.image_url} alt={selectedCharity.name} className="w-full h-64 object-cover rounded-3xl shadow-2xl" />
              ) : (
                <div className="w-full h-64 bg-zinc-900 rounded-3xl flex items-center justify-center border border-white/5">
                  <Heart className="w-24 h-24 text-zinc-800" />
                </div>
              )}
            </div>
          </div>
          <Heart className="absolute -right-20 -bottom-20 w-96 h-96 text-white/5 -rotate-12" />
        </div>
      ) : (
        <div className="glass-card p-12 rounded-[40px] text-center border-dashed border-zinc-800">
          <Heart className="w-16 h-16 text-zinc-800 mx-auto mb-6" />
          <h3 className="text-2xl font-black text-white mb-2">No charity selected</h3>
          <p className="text-zinc-500 font-medium max-w-sm mx-auto mb-8">
            Please select a charity to start making an impact with your subscription.
          </p>
          <Link href="/charities">
            <Button size="lg" className="rounded-2xl px-10 py-6 text-lg">
              Browse Charities <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      )}

      {/* Impact Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card p-8 rounded-[32px] border-zinc-800">
          <div className="text-zinc-500 font-bold text-xs uppercase tracking-widest mb-2">Monthly Contribution</div>
          <div className="text-4xl font-black text-white">£4.25</div>
          <p className="text-zinc-500 text-sm mt-4">Calculated as 10% of your £42.50 monthly subscription.</p>
        </div>
        <div className="glass-card p-8 rounded-[32px] border-zinc-800">
          <div className="text-zinc-500 font-bold text-xs uppercase tracking-widest mb-2">Lifetime Impact</div>
          <div className="text-4xl font-black text-green-500">£42.50</div>
          <p className="text-zinc-500 text-sm mt-4">Total amount raised for charities through your membership.</p>
        </div>
      </div>
    </div>
  );
}
