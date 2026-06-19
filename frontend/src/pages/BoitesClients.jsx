import React, { useState } from 'react';
import DataTable from '../components/DataTable';
import { useCrud } from '../hooks/useCrud';
import { useAuth } from '../context/AuthContext';
import { X, Inbox, GitMerge, MapPin } from 'lucide-react';

const BoitesClients = () => {
  const { data: clientBoxes, loading, createItem, updateItem, deleteItem } = useCrud('/client-boxes');
  const { data: splitters } = useCrud('/splitters');
  const { user } = useAuth();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [type, setType] = useState('16FO');
  const [splitterId, setSplitterId] = useState('');
  const [usedPorts, setUsedPorts] = useState('0');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [zone, setZone] = useState('');

  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';

  const getSplitterName = (splitId) => {
    const s = splitters.find(item => item.id === splitId);
    return s ? s.name : 'Inconnu';
  };

  const columns = [
    {
      key: 'name',
      header: 'Point de Mutualisation (Boîtier)',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2.5 font-semibold text-gray-200">
          <Inbox className="h-4.5 w-4.5 text-sky-400 shrink-0" />
          <span>{row.name}</span>
        </div>
      )
    },
    {
      key: 'type',
      header: 'Type Boîtier',
      sortable: true,
      render: (row) => (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-sky-950/20 border border-sky-500/20 text-sky-400">
          {row.type}
        </span>
      )
    },
    {
      key: 'totalPorts',
      header: 'Ports Raccordés',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-1.5 bg-gray-950 rounded-full overflow-hidden border border-gray-800 shrink-0">
            <div 
              className="h-full bg-sky-500 rounded-full"
              style={{ width: `${((row.usedPorts || 0) / row.totalPorts) * 100}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-300">
            {row.usedPorts || 0} / {row.totalPorts}
          </span>
        </div>
      )
    },
    {
      key: 'splitterId',
      header: 'Splitter Liaison',
      sortable: true,
      render: (row) => (
        <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
          <GitMerge className="h-3.5 w-3.5 text-pink-400" />
          {getSplitterName(row.splitterId)}
        </span>
      )
    },
    {
      key: 'zone',
      header: 'Zone de Service',
      sortable: true
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
    setType('16FO');
    setSplitterId(splitters[0]?.id || '');
    setUsedPorts('0');
    setLatitude('');
    setLongitude('');
    setStatus('ACTIVE');
    setZone('');
    setFormError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setName(item.name || '');
    setType(item.type || '16FO');
    setSplitterId(item.splitterId || '');
    setUsedPorts(item.usedPorts || '0');
    setLatitude(item.latitude || '');
    setLongitude(item.longitude || '');
    setStatus(item.status || 'ACTIVE');
    setZone(item.zone || '');
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim() || !type || !splitterId || !latitude || !longitude) {
      setFormError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    // Determine totalPorts based on selected type
    const totalPorts = type === '24FO' ? 24 : 16;

    const itemData = {
      name,
      type,
      splitterId,
      totalPorts,
      usedPorts: parseInt(usedPorts || 0),
      availablePorts: totalPorts - parseInt(usedPorts || 0),
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      status,
      zone
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
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le boîtier client "${item.name}" ?`)) {
      const res = await deleteItem(item.id);
      if (!res.success) {
        alert(res.error || "Impossible de supprimer cet enregistrement.");
      }
    }
  };

  return (
    <div className="space-y-6">
      
      <DataTable
        title="Gestion des Boîtiers Clients"
        description="Boîtiers de distribution abonnés (points de mutualisation optique) gérant le raccordement physique final des clients."
        columns={columns}
        data={clientBoxes}
        isLoading={loading}
        searchPlaceholder="Rechercher un boîtier client..."
        searchFields={['name', 'type', 'zone']}
        onAdd={handleOpenAdd}
        onEdit={handleOpenEdit}
        onDelete={isAdmin ? handleDelete : null}
        addLabel="Ajouter Boîtier"
      />

      {/* Slide-over Form Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="w-full max-w-lg h-full bg-gray-950 border-l border-gray-800 flex flex-col p-6 shadow-2xl overflow-y-auto text-gray-200">
            
            <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Inbox className="h-5 w-5 text-sky-400" />
                <h3 className="text-base font-bold text-white uppercase">
                  {editingItem ? 'Modifier Boîtier Client' : 'Nouveau Boîtier Client'}
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
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Nom du boîtier *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: CB-RUE-FLEURS-04"
                    className="w-full h-10 rounded-xl bg-gray-900 border border-gray-800 px-4 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                  />
                </div>

                {/* Type & Parent Splitter */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Type de Boîtier *</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full h-10 rounded-xl bg-gray-900 border border-gray-800 px-4 text-sm text-gray-100 focus:outline-none focus:border-indigo-500 transition-all"
                    >
                      <option value="16FO">16FO (16 ports)</option>
                      <option value="24FO">24FO (24 ports)</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Splitter Parent *</label>
                    <select
                      value={splitterId}
                      required
                      onChange={(e) => setSplitterId(e.target.value)}
                      className="w-full h-10 rounded-xl bg-gray-900 border border-gray-800 px-4 text-sm text-gray-100 focus:outline-none focus:border-indigo-500 transition-all"
                    >
                      <option value="" disabled>Sélectionner Coupleur</option>
                      {splitters.map(sp => (
                        <option key={sp.id} value={sp.id}>{sp.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Ports & status */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Ports Connectés Utilisés</label>
                    <input
                      type="number"
                      min="0"
                      value={usedPorts}
                      onChange={(e) => setUsedPorts(e.target.value)}
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

                {/* Zone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Zone Géographique / Secteur</label>
                  <input
                    type="text"
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    placeholder="Ex: Secteur Résidentiel Est"
                    className="w-full h-10 rounded-xl bg-gray-900 border border-gray-800 px-4 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                  />
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

export default BoitesClients;
