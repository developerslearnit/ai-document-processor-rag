// Author: Adesina Mark Omoniyi
"use client";

import './globals.css';
import Link from 'next/link';
import { Sparkles, LayoutDashboard, Upload, LogOut, User as UserIcon } from 'lucide-react';
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter, usePathname } from 'next/navigation';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/';

  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth">
      <body className="antialiased min-h-screen flex flex-col">
        {!isAuthPage && (
          <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
              <Link 
                href="/" 
                onClick={(e) => {
                  if (pathname === "/") {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold tracking-tight">DocMind AI</span>
              </Link>
              
              <div className="flex items-center gap-6">
                <Link href="/documents" className={`flex items-center gap-2 text-sm font-medium transition-colors ${pathname === '/documents' ? 'text-blue-400' : 'text-white/60 hover:text-white'}`}>
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link href="/upload" className={`flex items-center gap-2 text-sm font-medium transition-colors ${pathname === '/upload' ? 'text-blue-400' : 'text-white/60 hover:text-white'}`}>
                  <Upload className="w-4 h-4" />
                  Upload
                </Link>
                <div className="h-4 w-[1px] bg-white/10 mx-2" />
                {user && (
                  <div className="flex items-center gap-2 text-sm font-medium text-white/80 mr-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <span className="max-w-[120px] truncate">{user.fullName}</span>
                  </div>
                )}
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-medium text-white/40 hover:text-red-400 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </nav>
        )}
        <main className={`flex-1 flex flex-col w-full ${!isAuthPage ? 'pt-24 max-w-7xl mx-auto px-6' : ''}`}>
          {children}
        </main>
      </body>
    </html>
  );
}
