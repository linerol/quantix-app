import React, { useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../services/api';

interface ProfileModalProps {
  onClose: () => void;
}

export default function ProfileModal({ onClose }: ProfileModalProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [changing, setChanging] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const { data } = await api.get('/users/me');
        setUser(data);
      } catch {
        toast.error("Erreur lors du chargement du profil");
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChanging(true);
    try {
      await api.patch('/users/me/password', { newPassword });
      toast.success('Mot de passe modifié');
      setNewPassword('');
    } catch {
      toast.error('Erreur lors du changement de mot de passe');
    } finally {
      setChanging(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) return;
    setDeleting(true);
    try {
      await api.delete('/users/me');
      toast.success('Compte supprimé');
      setTimeout(() => {
        window.location.href = '/register';
      }, 1200);
    } catch {
      toast.error('Erreur lors de la suppression du compte');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative animate-slide-in-left">
        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold" onClick={onClose} aria-label="Fermer">
          <XMarkIcon className="h-7 w-7" />
        </button>
        <h2 className="text-xl font-bold text-purple-700 mb-4">Mon profil</h2>
        {loading ? (
          <div className="text-center text-purple-600 font-medium animate-pulse">Chargement...</div>
        ) : user ? (
          <>
            <div className="mb-4">
              <div className="font-semibold">Email :</div>
              <div className="text-gray-700 mb-2">{user.email}</div>
              <div className="font-semibold">ID :</div>
              <div className="text-gray-500 text-xs break-all">{user._id}</div>
            </div>
            <form onSubmit={handleChangePassword} className="space-y-3 mb-4">
              <label className="block font-medium">Nouveau mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full border border-black/20 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 bg-white placeholder-gray-400 pr-10"
                  placeholder="Nouveau mot de passe"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 focus:outline-none"
                  tabIndex={-1}
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575m1.875-2.325A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 1.657-.403 3.22-1.125 4.575m-1.875 2.325A9.956 9.956 0 0112 21c-1.657 0-3.22-.403-4.575-1.125m-2.325-1.875A9.956 9.956 0 013 12c0-1.657.403-3.22 1.125-4.575" /></svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
              <button
                type="submit"
                disabled={changing}
                className="w-full py-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 transition rounded-md font-semibold text-white shadow-md text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {changing ? 'Modification...' : 'Changer le mot de passe'}
              </button>
            </form>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="w-full py-2 bg-red-600 hover:bg-red-700 transition rounded-md font-semibold text-white shadow-md text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleting ? 'Suppression...' : 'Supprimer mon compte'}
            </button>
          </>
        ) : (
          <div className="text-center text-red-600">Impossible de charger le profil.</div>
        )}
      </div>
    </div>
  );
} 