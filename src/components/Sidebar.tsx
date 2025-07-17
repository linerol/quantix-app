import { HomeIcon, CubeIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import React from 'react';

const navLinks = [
  { href: '/products', label: 'Produits', icon: CubeIcon },
  { href: '/profile', label: 'Profil', icon: HomeIcon },
];

export default function Sidebar() {
  const { logout } = useAuth();
  return (
    <aside className="bg-white border-r border-black/10 w-64 min-h-screen p-6 flex flex-col gap-6 fixed md:relative z-20 transition-all shadow-lg">
      <div className="flex items-center gap-2 mb-8">
        <span className="text-2xl font-extrabold text-blue-700 tracking-tight">Quantix</span>
      </div>
      <nav className="flex-1 flex flex-col gap-2">
        {navLinks.map(link => (
            <Link key={link.href} href={link.href} className="flex items-center gap-3 px-3 py-2 rounded-lg text-black hover:bg-blue-50 font-medium transition-all">
              <link.icon className="h-5 w-5 text-blue-500" />
              {link.label}
            </Link>
        ))}
      </nav>
      <button onClick={logout} className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-all mt-auto border border-red-100">
        <ArrowLeftOnRectangleIcon className="h-5 w-5" />
        <span>Déconnexion</span>
      </button>
    </aside>
  );
} 