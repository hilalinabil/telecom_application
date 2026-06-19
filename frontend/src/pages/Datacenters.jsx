import React, { useState } from 'react';
import DataTable from '../components/DataTable';
import { useCrud } from '../hooks/useCrud';
import { useAuth } from '../context/AuthContext';
import { X, Server, ShieldCheck, MapPin, Database } from 'lucide-react';

const Datacenters = () => {
  const { data: datacenters, loading, createItem, updateItem, deleteItem } = useCrud('/datacenters');
  const { user } = useAuth();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('');
  const [usedCapacity, setUsedCapacity] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [description, setDescription] = useState('');

  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';

  // Table Column Definitions
  const columns = [
    {
      key: 'name',
      header: 'Nom',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2.5 font-semibold text-gray-200">
          <Database className="h-4.5 w-4.5 text-indigo-400 shrink-0" />
          <span>{row.name}</span>
        </div>
      )
    },
    {
      key: 'location',
      header: 'Localisation / Adresse',
      sortable: true
    },
    {
      key: 'capacity',
      header: 'Capacité',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-1.5 bg-gray-950 rounded-full overflow-hidden border border-gray-800 shrink-0">
            <div 
              className="h-full bg-indigo-500 rounded-full"
              style={{ width: `${(row.usedCapacity / row.capacity) * 100}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-300 font-medium">
            {row.usedCapacity || 0} / {row.capacity} ({Math.round(((row.usedCapacity || 0) / row.capacity) * 100)}%)
          </span>
        </div>
      )
    },
    {
      key: 'latitude',
      header: 'Coordonnées (Lat, Lng)',
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
    setLocation('');
    setCapacity('');
    setUsedCapacity('0');
    setLatitude('');
    setLongitude('');
    setStatus('ACTIVE');
    setDescription('');
    setFormError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setName(item.name || '');
    setLocation(item.location || '');
    setCapacity(item.capacity || '');
    setUsedCapacity(item.usedCapacity || '0');
    setLatitude(item.latitude || '');
    setLongitude(item.longitude || '');
    setStatus(item.status || 'ACTIVE');
    setDescription(item.description || '');
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim() || !location.trim() || !capacity || !latitude || !longitude) {
      setFormError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    const itemData = {
      name,
      location,
      capacity: parseInt(capacity),
      usedCapacity: parseInt(usedCapacity || 0),
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      status,
      description
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
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le datacenter "${item.name}" ?`)) {
      const res = await deleteItem(item.id);
      if (!res.success) {
        alert(res.error || "Impossible de supprimer cet enregistrement.");
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Table Section */}
      <DataTable
        title="Gestion des Datacenters"
        description="Liste et caractéristiques des centres d'hébergement du réseau fibre optique."
        columns={columns}
        data={datacenters}
        isLoading={loading}
        searchPlaceholder="Rechercher un datacenter..."
        searchFields={['name', 'location', 'description']}
        onAdd={isAdmin ? handleOpenAdd : null}
        onEdit={isAdmin ? handleOpenEdit : null}
        onDelete={isAdmin ? handleDelete : null}
        addLabel="Ajouter Datacenter"
      />

      {/* Slide-over Form Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="w-full max-w-lg h-full bg-gray-950 border-l border-gray-800 flex flex-col p-6 shadow-2xl overflow-y-auto text-gray-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white uppercase">
                  {editingItem ? 'Modifier Datacenter' : 'Nouveau Datacenter'}
                </h3>
              </div>
              <button 
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg border border-gray-800 bg-gray-900/60 hover:bg-gray-800 hover:text-white transition-colors"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Error alerts */}
            {formError && (
              <div className="mb-6 p-3.5 rounded-xl border border-red-500/25 bg-red-950/20 text-red-400 text-xs font-semibold">
                {formError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSave} className="space-y-5 flex-1 flex flex-col">
              
              <div className="space-y-4 flex-1">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Nom du centre *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Datacenter Paris Centre"
                    className="w-full h-10 rounded-xl bg-gray-900 border border-gray-800 px-4 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                  />
                </div>

                {/* Location */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Localisation / Adresse *</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ex: 12 Rue de la Paix, Paris"
                    className="w-full h-10 rounded-xl bg-gray-900 border border-gray-800 px-4 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                  />
                </div>

                {/* Capacity */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Capacité Totale *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                      placeholder="Ex: 500"
                      className="w-full h-10 rounded-xl bg-gray-900 border border-gray-800 px-4 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Capacité Utilisée</label>
                    <input
                      type="number"
                      min="0"
                      value={usedCapacity}
                      onChange={(e) => setUsedCapacity(e.target.value)}
                      placeholder="Ex: 0"
                      className="w-full h-10 rounded-xl bg-gray-900 border border-gray-800 px-4 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                    />
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

                {/* Status */}
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

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Description / Notes</label>
                  <textarea
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Notes techniques..."
                    className="w-full rounded-xl bg-gray-900 border border-gray-800 p-4 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all resize-none"
                  ></textarea>
                </div>
              </div>

              {/* Form Footer Action */}
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

export default Datacenters;
