import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Activity, ShieldAlert, KeyRound, UserRound, ArrowRight } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [matricule, setMatricule] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if redirected from expired session
  const searchParams = new URLSearchParams(location.search);
  const isExpired = searchParams.get('expired') === 'true';

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!matricule.trim() || !password.trim()) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);
    setError('');

    const res = await login(matricule, password);
    
    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setError(res.error);
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-950 px-4 text-gray-100 font-sans relative overflow-hidden">
      
      {/* Decorative background gradients */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-purple-600/10 blur-3xl"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {/* Logo and title */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-3">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white mb-1">FIBRE RÉSEAU</h1>
          <p className="text-sm text-gray-400 font-medium">Référentiel Réseau Fibre Optique</p>
        </div>

        {/* Login Card */}
        <div className="glass-panel rounded-2xl border border-gray-800 p-8 shadow-2xl relative">
          
          <h2 className="text-lg font-bold text-gray-100 mb-6">Connexion Agent</h2>

          {/* Session expiry or global errors */}
          {isExpired && !error && (
            <div className="mb-5 p-3.5 rounded-xl border border-orange-500/20 bg-orange-500/5 text-orange-400 text-xs font-semibold flex items-center gap-2">
              <ShieldAlert className="h-4.5 w-4.5 shrink-0" />
              <span>Votre session a expiré. Veuillez vous reconnecter.</span>
            </div>
          )}

          {error && (
            <div className="mb-5 p-3.5 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-semibold flex items-center gap-2">
              <ShieldAlert className="h-4.5 w-4.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Matricule Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Matricule</label>
              <div className="relative">
                <UserRound className="absolute left-3.5 top-3 h-4.5 w-4.5 text-gray-500" />
                <input
                  type="text"
                  required
                  disabled={loading}
                  value={matricule}
                  onChange={(e) => setMatricule(e.target.value)}
                  placeholder="Ex: AGT-2026-99"
                  className="w-full h-11 rounded-xl bg-gray-950 border border-gray-800 pl-11 pr-4 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Mot de passe</label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3 h-4.5 w-4.5 text-gray-500" />
                <input
                  type="password"
                  required
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-11 rounded-xl bg-gray-950 border border-gray-800 pl-11 pr-4 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/10 hover:shadow-indigo-500/20 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:scale-100 transition-all mt-2"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  <span>Se connecter</span>
                  <ArrowRight className="h-4.5 w-4.5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-gray-600 mt-6 font-medium">
          Accès sécurisé réservé aux techniciens et administrateurs réseau.
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
