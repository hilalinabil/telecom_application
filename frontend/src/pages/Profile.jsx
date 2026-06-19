import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  User, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  UserCheck 
} from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  
  // Password fields
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPassError('Veuillez remplir tous les champs.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassError('Le nouveau mot de passe et sa confirmation ne correspondent pas.');
      return;
    }
    if (newPassword.length < 6) {
      setPassError('Le nouveau mot de passe doit faire au moins 6 caractères.');
      return;
    }

    setIsSubmitting(true);
    setPassError('');
    setPassSuccess('');

    try {
      await api.put('/users/change-password', { oldPassword, newPassword });
      setPassSuccess('Mot de passe changé avec succès !');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err);
      setPassError(err.response?.data?.message || 'Erreur lors de la modification du mot de passe. Veuillez vérifier votre ancien mot de passe.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      
      {/* Page Title */}
      <div className="flex items-center gap-3 border-b border-gray-250 dark:border-gray-800 pb-5">
        <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20">
          <User className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-none">Mon Profil Utilisateur</h1>
          <p className="text-xs text-gray-500 mt-1.5">Consultez vos informations d'agent et modifiez vos paramètres de connexion.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* User Card Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
            
            {/* Avatar Circle */}
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center font-bold text-white text-3xl shadow-xl shadow-indigo-500/15 mb-4">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>

            <h2 className="text-lg font-bold text-gray-850 dark:text-white">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-mono font-bold mt-1">{user?.matricule}</p>

            <div className="mt-5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4" />
              <span>{user?.role}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="h-4 w-4 text-gray-400" /> Détails Agent
            </h3>
            <div className="space-y-3.5 text-sm">
              <div className="flex flex-col border-b border-gray-100 dark:border-gray-900 pb-2">
                <span className="text-[10px] uppercase font-bold text-gray-400">Prénom</span>
                <span className="font-semibold text-gray-700 dark:text-gray-200 mt-0.5">{user?.firstName}</span>
              </div>
              <div className="flex flex-col border-b border-gray-100 dark:border-gray-900 pb-2">
                <span className="text-[10px] uppercase font-bold text-gray-400">Nom de famille</span>
                <span className="font-semibold text-gray-700 dark:text-gray-200 mt-0.5">{user?.lastName}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-gray-400">Matricule professionnel</span>
                <span className="font-mono text-gray-700 dark:text-gray-200 mt-0.5">{user?.matricule}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Form */}
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
            
            <h3 className="text-base font-bold text-gray-950 dark:text-white uppercase mb-6 flex items-center gap-2">
              <Lock className="h-5 w-5 text-indigo-500" />
              <span>Modifier Mot de passe</span>
            </h3>

            {passError && (
              <div className="mb-6 p-4 rounded-xl border border-red-500/25 bg-red-500/5 text-red-500 text-xs font-semibold flex items-center gap-2.5">
                <AlertCircle className="h-5 w-5 shrink-0 text-red-550" />
                <span>{passError}</span>
              </div>
            )}

            {passSuccess && (
              <div className="mb-6 p-4 rounded-xl border border-emerald-500/25 bg-emerald-500/5 text-emerald-500 text-xs font-semibold flex items-center gap-2.5">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-550" />
                <span>{passSuccess}</span>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-5">
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-450 dark:text-gray-400 uppercase tracking-wider">Mot de passe actuel *</label>
                <input 
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Saisissez votre mot de passe actuel"
                  className="w-full h-11 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 px-4 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-450 dark:text-gray-400 uppercase tracking-wider">Nouveau mot de passe *</label>
                  <input 
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Au moins 6 caractères"
                    className="w-full h-11 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 px-4 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-450 dark:text-gray-400 uppercase tracking-wider">Confirmer nouveau mot de passe *</label>
                  <input 
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Saisissez à nouveau le mot de passe"
                    className="w-full h-11 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 px-4 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all font-semibold"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-150 dark:border-gray-800 flex justify-end">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 px-6 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-550 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 shadow-md shadow-indigo-600/10 cursor-pointer"
                >
                  {isSubmitting && <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>}
                  <span>Mettre à jour le mot de passe</span>
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Profile;
