import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar desktop */}
      <aside className="hidden md:block"><Sidebar /></aside>
      {/* Sidebar mobile (drawer) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/30" onClick={() => setSidebarOpen(false)} />
          {/* Drawer */}
          <div className="relative bg-white w-64 min-h-screen p-6 flex flex-col gap-6 shadow-lg animate-slide-in-left z-50">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold" onClick={() => setSidebarOpen(false)} aria-label="Fermer">
              <XMarkIcon className="h-7 w-7" />
            </button>
            <Sidebar />
          </div>
        </div>
      )}
      <div className="flex-1 flex flex-col md:ml-0">
        {/* Header avec bouton menu mobile */}
        <div className="sticky top-0 z-30">
          <div className="md:hidden flex items-center justify-between bg-white border-b border-black/10 px-4 py-3 shadow-sm">
            <button onClick={() => setSidebarOpen(true)} className="text-purple-700 hover:text-purple-900 focus:outline-none" aria-label="Ouvrir le menu">
              <Bars3Icon className="h-7 w-7" />
            </button>
            <span className="text-lg font-bold text-purple-700 tracking-tight">Quantix</span>
            <div className="w-7" /> {/* Pour équilibrer */}
          </div>
          <div className="hidden md:block"><Header /></div>
        </div>
        <main className="flex-1 p-2 sm:p-4 md:p-8 lg:p-10">{children}</main>
      </div>
    </div>
  );
}

// Ajoute l'animation Tailwind dans tailwind.config.js :
// 'slide-in-left': 'transform translate-x-0 transition-transform duration-300',
// (et -translate-x-full pour l'état caché si besoin) 