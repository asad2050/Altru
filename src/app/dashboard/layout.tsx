'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Target, LayoutDashboard, Trophy, Heart, Settings, LogOut } from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createBrowserClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
    router.refresh();
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/dashboard/scores', label: 'My Scores', icon: Target },
    { href: '/dashboard/draws', label: 'Prize Draws', icon: Trophy },
    { href: '/dashboard/charity', label: 'My Charity', icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 flex flex-col p-6 space-y-8 h-screen sticky top-0">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 hero-gradient rounded-lg flex items-center justify-center">
            <Target className="text-white w-5 h-5" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">Altru</span>
        </Link>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-bold transition-all group ${
                  isActive 
                    ? 'bg-white/5 text-white' 
                    : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-green-500' : 'group-hover:text-green-500'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-white/5 space-y-2">
          <Link 
            href="/dashboard/settings" 
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-bold transition-all group ${
              pathname === '/dashboard/settings' 
                ? 'bg-white/5 text-white' 
                : 'text-zinc-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Settings className={`w-5 h-5 transition-colors ${pathname === '/dashboard/settings' ? 'text-green-500' : 'group-hover:text-green-500'}`} />
            <span>Settings</span>
          </Link>
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-zinc-400 font-bold hover:bg-red-500/10 hover:text-red-500 group transition-all"
          >
            <LogOut className="w-5 h-5 group-hover:text-red-500 transition-colors" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
