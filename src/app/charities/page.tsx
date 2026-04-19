import { createServerClient } from '@/lib/supabase';
import { cookies } from 'next/headers';
import { Heart, Search, Filter, ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui';
import Link from 'next/link';

export default async function CharitiesPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(cookieStore);
  const { data: charities, error } = await supabase
    .from('charities')
    .select('*')
    .order('is_featured', { ascending: false });

  if (error) {
    console.error('Supabase Error in /charities:', error.message);
  }

  return (
    <div className="min-h-screen gradient-bg">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto border-b border-white/5">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 hero-gradient rounded-lg flex items-center justify-center">
            <Heart className="text-white w-5 h-5" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">Altru</span>
        </Link>
        <Link href="/auth/signup" className="px-5 py-2.5 hero-gradient rounded-full text-sm font-semibold text-white shadow-lg">
          Join Now
        </Link>
      </nav>

      <main className="px-6 py-16 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-5xl font-black text-white mb-6">Our Partners</h1>
          <p className="text-xl text-zinc-400 font-medium">
            Choose the cause that resonates with you. 10% of your subscription goes directly to your selected charity.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search charities..." 
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-green-500/50"
            />
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="rounded-2xl h-14 px-6 border-zinc-800">
              <Filter className="w-5 h-5 mr-2" /> Categories
            </Button>
          </div>
        </div>

        {/* Charity Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {charities && charities.length > 0 ? (
            charities.map((charity) => (
              <div key={charity.id} className="glass-card rounded-[40px] overflow-hidden flex flex-col hover:border-green-500/30 transition-all group">
                <div className="h-48 bg-zinc-800 relative">
                  {charity.image_url ? (
                    <img src={charity.image_url} alt={charity.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-900">
                      <Heart className="w-12 h-12 text-zinc-800" />
                    </div>
                  )}
                  {charity.is_featured && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-green-500 text-black text-[10px] font-black uppercase tracking-widest rounded-full">
                      Featured
                    </div>
                  )}
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-2xl font-black text-white mb-3">{charity.name}</h3>
                  <p className="text-zinc-500 font-medium mb-6 line-clamp-3">
                    {charity.description || "Leading the charge in making the world a better place through dedicated community support and innovation."}
                  </p>
                  <div className="mt-auto space-y-4">
                    <Button className="w-full py-4 text-lg rounded-2xl">
                      Select This Charity
                    </Button>
                    <a 
                      href={charity.website_url || "#"} 
                      target="_blank" 
                      className="flex items-center justify-center text-zinc-500 hover:text-white font-bold text-sm transition-colors"
                    >
                      Visit Website <ExternalLink className="ml-2 w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Placeholder/Mock charities if DB is empty
            [1, 2, 3].map((i) => (
              <div key={i} className="glass-card rounded-[40px] overflow-hidden flex flex-col border-zinc-800/50">
                <div className="h-48 bg-zinc-900/50" />
                <div className="p-8">
                  <div className="h-8 bg-zinc-800 w-2/3 rounded-lg mb-4 animate-pulse" />
                  <div className="h-4 bg-zinc-800 w-full rounded-lg mb-2 animate-pulse" />
                  <div className="h-4 bg-zinc-800 w-5/6 rounded-lg mb-8 animate-pulse" />
                  <div className="h-14 bg-zinc-800 w-full rounded-2xl animate-pulse" />
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
