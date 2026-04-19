import Link from 'next/link';
import { Heart, Trophy, Target, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen gradient-bg">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto border-b border-white/5">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 hero-gradient rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
            <Target className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Altru</span>
        </div>
        <div className="flex items-center space-x-6">
          <Link href="/auth/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link 
            href="/auth/signup" 
            className="px-5 py-2.5 hero-gradient rounded-full text-sm font-semibold text-white shadow-lg shadow-green-500/30 hover:scale-105 transition-transform"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 pt-24 pb-32 max-w-7xl mx-auto overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-green-500/10 blur-[120px] rounded-full -z-10" />
        
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full glass-card border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-widest mb-8">
            Play with Purpose
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
            Improve Your Game. <span className="text-green-500">Change a Life.</span>
          </h1>
          <p className="text-xl text-zinc-400 mb-10 leading-relaxed">
            The modern golf tracking platform where every score you enter supports a charity of your choice. Enter draws, win prizes, and make a real impact.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              href="/auth/signup" 
              className="w-full sm:w-auto px-8 py-4 hero-gradient rounded-2xl text-lg font-bold text-white shadow-2xl shadow-green-500/40 hover:scale-105 transition-all flex items-center justify-center"
            >
              Join the Movement <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link 
              href="/charities" 
              className="w-full sm:w-auto px-8 py-4 glass-card rounded-2xl text-lg font-bold text-white hover:bg-zinc-800 transition-all flex items-center justify-center"
            >
              Explore Charities
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-24 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 glass-card rounded-3xl hover:border-green-500/30 transition-all group">
            <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition-colors">
              <Heart className="text-green-500 w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Impact-First</h3>
            <p className="text-zinc-400 leading-relaxed">
              We donate 10% of every subscription to the charity you choose. Monitor your lifetime impact from your dashboard.
            </p>
          </div>

          <div className="p-8 glass-card rounded-3xl hover:border-green-500/30 transition-all group">
            <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition-colors">
              <Target className="text-green-500 w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Performance Tracking</h3>
            <p className="text-zinc-400 leading-relaxed">
              Keep track of your latest 5 rounds using the Stableford scoring system. A streamlined interface designed for mobile.
            </p>
          </div>

          <div className="p-8 glass-card rounded-3xl hover:border-green-500/30 transition-all group">
            <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition-colors">
              <Trophy className="text-green-500 w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Monthly Draws</h3>
            <p className="text-zinc-400 leading-relaxed">
              Your performance enters you into monthly draws. Match your scores with draw numbers to win from the prize pool.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-20 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-around items-center space-y-12 md:space-y-0">
          <div className="text-center">
            <div className="text-5xl font-black text-white mb-2">£42,500+</div>
            <div className="text-zinc-500 font-medium uppercase tracking-widest text-sm">Raised for Charity</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-black text-white mb-2">1,240</div>
            <div className="text-zinc-500 font-medium uppercase tracking-widest text-sm">Active Heroes</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-black text-white mb-2">£15k</div>
            <div className="text-zinc-500 font-medium uppercase tracking-widest text-sm">Monthly Prize Pool</div>
          </div>
        </div>
      </section>
    </main>
  );
}
