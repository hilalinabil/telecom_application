import React, { useState } from 'react';
import DataTable from '../components/DataTable';
import { useCrud } from '../hooks/useCrud';
import { useAuth } from '../context/AuthContext';
import { X, GitMerge, Server, MapPin } from 'lucide-react';

const Splitters = () => {
  const { data: splitters, loading, createItem, updateItem, deleteItem } = useCrud('/splitters');
  const { data: repartiteurs } = useCrud('/repartiteurs');
  const { user } = useAuth();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [ratio, setRatio] = useState('1:8');
  const [usedOutputs, setUsedOutputs] = useState('0');
  const [repartiteurId, setRepartiteurId] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [status, setStatus] = useState('ACTIVE');

  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';

  const getRepartiteurName = (repId) => {
    const rep = repartiteurs.find(r => r.id === repId);
    return rep ? rep.name : 'Inconnu';
  };

  const columns = [
    {
      key: 'name',
      header: 'Splitter',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2.5 font-semibold text-gray-200">
          <GitMerge className="h-4.5 w-4.5 text-pink-400 shrink-0" />
          <span>{row.name}</span>
        </div>
      )
    },
    {
      key: 'ratio',
      header: 'Ratio de Split',
      sortable: true,
      render: (row) => (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-pink-950/20 border border-pink-500/20 text-pink-400">
          {row.ratio}
        </span>
      )
    },
    {
      key: 'nbOutputs',
      header: 'Ports Sorties',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-1.5 bg-gray-950 rounded-full overflow-hidden border border-gray-800 shrink-0">
            <div 
              className="h-full bg-pink-500 rounded-full"
              style={{ width: `${((row.usedOutputs || 0) / row.nbOutputs) * 100}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-300">
            {row.usedOutputs || 0} / {row.nbOutputs}
          </span>
        </div>
      )
    },
    {
      key: 'repartiteurId',
      header: 'Répartiteur Source',
      sortable: true,
      render: (row) => (
        <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
          <Server className="h-3.5 w-3.5 text-purple-400" />
          {getRepartiteurName(row.repartiteurId)}
        </span>
      )
    },
    {
      key: 'latitude',
      header: 'Coordonnées',
      render: (row) => (
        <span className="font-mono text-xs text-gray-500">
          {row.latitude?.toFixed(5)}, {row.longitude?.toFixed(5)}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Statut',
      sortable: true,
      render: (row) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
          row.status === 'ACTIVE' 
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            : row.status === 'MAINTENANCE'
              ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
              : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
        }`}>
          {row.status === 'ACTIVE' ? 'Actif' : row.status === 'MAINTENANCE' ? 'Maintenance' : 'Inactif'}
        </span>
      )
    }
  ];

  const handleOpenAdd = () => {
    setEditingItem(null);
    setName('');
    setRatio('1:8');
    setUsedOutputs('0');
    setRepartiteurId(repartiteurs[0]?.id || '');
    setLatitude('');
    setLongitude('');
    setStatus('ACTIVE');
    setFormError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setName(item.name || '');
    setRatio(item.ratio || '1:8');
    setUsedOutputs(item.usedOutputs || '0');
    setRepartiteurId(item.repartiteurId || '');
    setLatitude(item.latitude || '');
    setLongitude(item.longitude || '');
    setStatus(item.status || 'ACTIVE');
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim() || !ratio || !repartiteurId || !latitude || !longitude) {
      setFormError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    // Determine outputs count based on selected ratio
    let nbOutputs = 8;
    if (ratio === '1:16') nbOutputs = 16;
    if (ratio === '1:32') nbOutputs = 32;

    const itemData = {
      name,
      ratio,
      nbOutputs,
      usedOutputs: parseInt(usedOutputs || 0),
      availableOutputs: nbOutputs - parseInt(usedOutputs || 0),
      repartiteurId,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      status
    };

    let res;
    if (editingItem) {
      res = await updateItem(editingItem.id, itemData);
    } else {
      res = await createItem(itemData);
    }

    setIsSubmitting(false);
    if (res.success) {
      setModalOpen(false);
    } else {
      setFormError(res.error || "Une erreur s'est produite.");
    }
  };

  const handleDelete = async (item) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le splitter "${item.name}" ?`)) {
      const res = await deleteItem(item.id);
      if (!res.success) {
        alert(res.error || "Impossible de supprimer cet enregistrement.");
      }
    }
  };

  return (
    <div className="space-y-6">
      
      <DataTable
        title="Gestion des Splitters (Coupleurs)"
        description="Coupleurs optiques passifs distribuant les signaux du répartiteur vers les boîtiers clients terminaux."
        columns={columns}
        data={splitters}
        isLoading={loading}
        searchPlaceholder="Rechercher un coupleur..."
        searchFields={['name', 'ratio']}
        onAdd={handleOpenAdd}
        onEdit={handleOpenEdit}
        onDelete={isAdmin ? handleDelete : null}
        addLabel="Ajouter Splitter"
      />

      {/* Slide-over Form Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="w-full max-w-lg h-full bg-gray-950 border-l border-gray-800 flex flex-col p-6 shadow-2xl overflow-y-auto text-gray-200">
            
            <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <GitMerge className="h-5 w-5 text-pink-400" />
                <h3 className="text-base font-bold text-white uppercase">
                  {editingItem ? 'Modifier Splitter' : 'Nouveau Splitter'}
                </h3>
              </div>
              <button 
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg border border-gray-800 bg-gray-900/60 hover:bg-gray-800 hover:text-white transition-colors"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {formError && (
              <div className="mb-6 p-3.5 rounded-xl border border-red-500/25 bg-red-950/20 text-red-400 text-xs font-semibold">
                {formError}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-5 flex-1 flex flex-col">
              
              <div className="space-y-4 flex-1">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Nom du coupleur *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: SPLIT-ZONE-A-01"
                    className="w-full h-10 rounded-xl bg-gray-900 border border-gray-800 px-4 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                  />
                </div>

                {/* Ratio & Parent OLT */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Ratio de division *</label>
                    <select
                      value={ratio}
                      onChange={(e) => setRatio(e.target.value)}
                      className="w-full h-10 rounded-xl bg-gray-900 border border-gray-800 px-4 text-sm text-gray-100 focus:outline-none focus:border-indigo-500 transition-all"
                    >
                      <option value="1:8">1:8 (8 ports)</option>
                      <option value="1:16">1:16 (16 ports)</option>
                      <option value="1:32">1:32 (32 ports)</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Répartiteur OLT Source *</label>
                    <select
                      value={repartiteurId}
                      required
                      onChange={(e) => setRepartiteurId(e.target.value)}
                      className="w-full h-10 rounded-xl bg-gray-900 border border-gray-800 px-4 text-sm text-gray-100 focus:outline-none focus:border-indigo-500 transition-all"
                    >
                      <option value="" disabled>Sélectionner OLT</option>
                      {repartiteurs.map(rep => (
                        <option key={rep.id} value={rep.id}>{rep.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Outputs & status */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Ports Sorties Utilisés</label>
                    <input
                      type="number"
                      min="0"
                      value={usedOutputs}
                      onChange={(e) => setUsedOutputs(e.target.value)}
                      placeholder="Ex: 0"
                      className="w-full h-10 rounded-xl bg-gray-900 border border-gray-800 px-4 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Statut Réseau</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full h-10 rounded-xl bg-gray-900 border border-gray-800 px-4 text-sm text-gray-100 focus:outline-none focus:border-indigo-500 transition-all"
                    >
                      <option value="ACTIVE">Actif</option>
                      <option value="MAINTENANCE">En Maintenance</option>
                      <option value="INACTIVE">Inactif</option>
                    </select>
                  </div>
                </div>

                {/* Coordinates */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Latitude *</label>
                    <input
                      type="number"
                      required
                      step="any"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      placeholder="Ex: 48.8566"
                      className="w-full h-10 rounded-xl bg-gray-900 border border-gray-800 px-4 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Longitude *</label>
                    <input
                      type="number"
                      required
                      step="any"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      placeholder="Ex: 2.3522"
                      className="w-full h-10 rounded-xl bg-gray-900 border border-gray-800 px-4 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-5 mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="h-10 px-5 rounded-xl border border-gray-800 text-gray-400 hover:text-white transition-colors"
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

export default Splitters;
