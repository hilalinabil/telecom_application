import React, { useState } from 'react';
import DataTable from '../components/DataTable';
import { useCrud } from '../hooks/useCrud';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { X, UserPlus, ShieldAlert, CheckCircle, Mail, UserCheck, AlertOctagon, Ban } from 'lucide-react';

const Users = () => {
  const { data: users, loading, createItem, refresh } = useCrud('/users');
  const { user: currentUser } = useAuth();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('TECHNICIAN');

  const isAdmin = currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'ADMIN';

  const handleDisableUser = async (userToDisable) => {
    if (userToDisable.matricule === currentUser.matricule) {
      alert("Vous ne pouvez pas désactiver votre propre compte.");
      return;
    }

    const actionText = userToDisable.status === 'ACTIVE' ? 'désactiver' : 'réactiver';
    if (window.confirm(`Êtes-vous sûr de vouloir ${actionText} l'agent "${userToDisable.firstName} ${userToDisable.lastName}" ?`)) {
      try {
        await api.put(`/users/${userToDisable.id}/disable`);
        refresh();
      } catch (err) {
        alert(err.response?.data?.message || "Impossible de modifier le statut de cet agent.");
      }
    }
  };

  const columns = [
    {
      key: 'fullName',
      header: 'Agent / Technicien',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shrink-0 shadow-sm">
            {row.firstName?.[0]}{row.lastName?.[0]}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              {row.firstName} {row.lastName}
            </span>
            <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold">{row.matricule}</span>
          </div>
        </div>
      )
    },
    {
      key: 'email',
      header: 'E-mail Professionnel',
      sortable: true,
      render: (row) => (
        <span className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 font-medium">
          <Mail className="h-3.5 w-3.5 text-gray-400" />
          {row.email}
        </span>
      )
    },
    {
      key: 'role',
      header: 'Rôle & Permissions',
      sortable: true,
      render: (row) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
          row.role === 'SUPER_ADMIN'
            ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
            : row.role === 'ADMIN'
              ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'
              : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
        }`}>
          {row.role}
        </span>
      )
    },
    {
      key: 'status',
      header: 'État Compte',
      sortable: true,
      render: (row) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
          row.status === 'ACTIVE' 
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            : 'bg-red-500/10 text-red-400 border border-red-500/20'
        }`}>
          {row.status === 'ACTIVE' ? 'Actif' : 'Désactivé'}
        </span>
      )
    },
    {
      key: 'lastLogin',
      header: 'Dernière Connexion',
      render: (row) => (
        <span className="text-xs text-gray-500 font-mono">
          {row.lastLogin ? new Date(row.lastLogin).toLocaleString() : 'Jamais connecté'}
        </span>
      )
    }
  ];

  const handleOpenAdd = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setRole('TECHNICIAN');
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
      setFormError('Veuillez remplir tous les champs.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    const res = await createItem({
      firstName,
      lastName,
      email,
      password,
      role
    });

    setIsSubmitting(false);
    if (res.success) {
      setModalOpen(false);
      refresh();
    } else {
      setFormError(res.error || "Une erreur s'est produite lors de la création de l'utilisateur.");
    }
  };

  return (
    <div className="space-y-6">
      
      <DataTable
        title="Gestion du personnel"
        description="Créez, administrez et gérez les comptes des techniciens terrain et administrateurs réseau."
        columns={columns}
        data={users}
        isLoading={loading}
        searchPlaceholder="Rechercher un agent (nom, matricule, email)..."
        searchFields={['firstName', 'lastName', 'matricule', 'email']}
        onAdd={isAdmin ? handleOpenAdd : null}
        // Custom row action in rendering rather than edit, but we can bind deleteItem as disable
        onDelete={isAdmin ? handleDisableUser : null}
        addLabel="Ajouter Agent"
        deleteLabel={row => row.status === 'ACTIVE' ? 'Désactiver' : 'Activer'}
      />

      {/* Slide-over Form Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="w-full max-w-lg h-full bg-white dark:bg-gray-950 border-l border-gray-200 dark:border-gray-800 flex flex-col p-6 shadow-2xl overflow-y-auto text-gray-800 dark:text-gray-200">
            
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-base font-bold text-gray-900 dark:text-white uppercase">
                  Nouvel Agent / Technicien
                </h3>
              </div>
              <button 
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {formError && (
              <div className="mb-6 p-3.5 rounded-xl border border-red-500/25 bg-red-950/20 text-red-500 dark:text-red-400 text-xs font-semibold">
                {formError}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-5 flex-1 flex flex-col">
              
              <div className="space-y-4 flex-1">
                {/* Identity */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Prénom *</label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Ex: Jean"
                      className="w-full h-10 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-4 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-650 focus:outline-none focus:border-indigo-500 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Nom *</label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Ex: Dupont"
                      className="w-full h-10 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-4 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-650 focus:outline-none focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Adresse E-mail *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ex: j.dupont@telecom.com"
                    className="w-full h-10 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-4 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-650 focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Mot de passe temporaire *</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-10 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-4 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-650 focus:outline-none focus:border-indigo-500 transition-all"
                  />
                  <p className="text-[10px] text-gray-400">Le nouvel agent devra changer ce mot de passe à sa première connexion.</p>
                </div>

                {/* Role */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Rôle Habilitation *</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full h-10 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-4 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-indigo-500 transition-all"
                  >
                    <option value="TECHNICIAN">Technicien terrain (TECHNICIAN)</option>
                    <option value="ADMIN">Administrateur système (ADMIN)</option>
                    <option value="SUPER_ADMIN">Super Administrateur (SUPER_ADMIN)</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-800 pt-5 mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="h-10 px-5 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-10 px-5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors font-semibold flex items-center justify-center gap-1.5"
                >
                  {isSubmitting && <div className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>}
                  <span>Enregistrer</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Users;
