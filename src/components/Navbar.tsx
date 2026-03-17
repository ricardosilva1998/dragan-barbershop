"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-amber-500 font-bold text-xl tracking-wide">
            Barbershop Dragan
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-zinc-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-zinc-300 hover:text-white transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-zinc-300 hover:text-white transition-colors">
              Contact
            </Link>
            <Link
              href="/booking"
              className="bg-amber-600 hover:bg-amber-500 text-white px-5 py-2 rounded-lg font-semibold transition-colors"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-zinc-300 hover:text-white"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/" onClick={() => setIsOpen(false)} className="block text-zinc-300 hover:text-white py-2">
              Home
            </Link>
            <Link href="/about" onClick={() => setIsOpen(false)} className="block text-zinc-300 hover:text-white py-2">
              About
            </Link>
            <Link href="/contact" onClick={() => setIsOpen(false)} className="block text-zinc-300 hover:text-white py-2">
              Contact
            </Link>
            <Link
              href="/booking"
              onClick={() => setIsOpen(false)}
              className="block bg-amber-600 hover:bg-amber-500 text-white px-5 py-2 rounded-lg font-semibold text-center transition-colors"
            >
              Book Now
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
