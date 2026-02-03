'use client';

import { useState } from 'react';
import { Menu, X, User, Heart, Bell, Home, Building2 } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 px-6 py-3 shadow-xl">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center shadow-lg">
                <Home className="w-6 h-6 text-white" />
              </div>
              <span className="text-white font-bold text-xl hidden sm:block">
                HostelWala
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/"
                className="text-white hover:text-slate-300 transition-colors font-medium flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
              <Link
                href="/browsehostel"
                className="text-white hover:text-slate-300 transition-colors font-medium"
              >
                Hostels
              </Link>
              <Link
                href="/about"
                className="text-white hover:text-slate-300 transition-colors font-medium"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-white hover:text-slate-300 transition-colors font-medium"
              >
                Contact
              </Link>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-3">
              <Link
                href="/wishlist"
                className="hidden sm:block p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
              >
                <Heart className="w-5 h-5 text-white" />
              </Link>
              <button className="hidden sm:block p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all">
                <Bell className="w-5 h-5 text-white" />
              </button>
              <button className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-medium transition-all flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 text-white" />
                ) : (
                  <Menu className="w-6 h-6 text-white" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-white/20">
              <div className="flex flex-col gap-3">
                <Link
                  href="/"
                  className="text-white hover:text-slate-300 transition-colors font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/browsehostel"
                  className="text-white hover:text-slate-300 transition-colors font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Hostels
                </Link>
                <Link
                  href="/wishlist"
                  className="text-white hover:text-slate-300 transition-colors font-medium py-2 flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Heart className="w-4 h-4" />
                  Wishlist
                </Link>
                <Link
                  href="/about"
                  className="text-white hover:text-slate-300 transition-colors font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="text-white hover:text-slate-300 transition-colors font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
