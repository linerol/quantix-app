import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

export default function Header() {
  return (
    <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-black/10 px-6 py-4 flex items-center justify-between shadow-sm">
      <span className="text-lg font-bold text-blue-700 tracking-tight">Quantix</span>
    </header>
  );
} 