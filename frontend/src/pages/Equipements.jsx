import React, { useState } from 'react';
import DataTable from '../components/DataTable';
import { useCrud } from '../hooks/useCrud';
import { useAuth } from '../context/AuthContext';
import { X, Network, Server, Settings, Cpu } from 'lucide-react';

const Equipements = () => {
  const { data: equipements, loading, createItem, updateItem, deleteItem } = useCrud('/equipements');
  const { data: repartiteurs } = useCrud('/repartiteurs');
  const { user } = useAuth();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [type, setType] = useState('SWITCH');
  const [manufacturer, setManufacturer] = useState('');
  const [model, setModel] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [macAddress, setMacAddress] = useState('');
  const [firmwareVersion, setFirmwareVersion] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [repartiteurId, setRepartiteurId] = useState('');

  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';

  const getRepartiteurName = (repId) => {
    const rep = repartiteurs.find(r => r.id === repId);
    return rep ? rep.name : 'Inconnu';
  };

  const columns = [
    {
      key: 'name',
      header: 'Équipement',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2.5 font-semibold text-gray-200">
          <Network className="h-4.5 w-4.5 text-indigo-400 shrink-0" />
          <div className="flex flex-col">
            <span>{row.name}</span>
            <span className="text-[10px] text-gray-500 font-mono">{row.serialNumber || 'No Serial'}</span>
          </div>
        </div>
      )
    },
    {
      key: 'type',
      header: 'Type',
      sortable: true,
      render: (row) => (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-gray-900 border border-gray-800 text-gray-300">
          {row.type}
        </span>
      )
    },
    {
      key: 'manufacturer',
      header: 'Marque / Modèle',
      render: (row) => (
        <span className="text-gray-300">
          {row.manufacturer} <span className="text-gray-500 font-medium">{row.model}</span>
        </span>
      )
    },
    {
      key: 'repartiteurId',
      header: 'Répartiteur (OLT)',
      sortable: true,
      render: (row) => (
        <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
          <Server className="h-3.5 w-3.5 text-purple-400" />
          {getRepartiteurName(row.repartiteurId)}
        </span>
      )
    },
    {
      key: 'ipAddress',
      header: 'Réseau (IP & MAC)',
      render: (row) => (
        <div className="flex flex-col font-mono text-xs">
          <span className="text-indigo-400">{row.ipAddress || 'N/A'}</span>
          <span className="text-gray-600 text-[10px]">{row.macAddress || 'N/A'}</span>
        </div>
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
    setType('SWITCH');
    setManufacturer('');
    setModel('');
    setSerialNumber('');
    setIpAddress('');
    setMacAddress('');
    setFirmwareVersion('');
    setStatus('ACTIVE');
    setRepartiteurId(repartiteurs[0]?.id || '');
    setFormError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setName(item.name || '');
    setType(item.type || 'SWITCH');
    setManufacturer(item.manufacturer || '');
    setModel(item.model || '');
    setSerialNumber(item.serialNumber || '');
    setIpAddress(item.ipAddress || '');
    setMacAddress(item.macAddress || '');
    setFirmwareVersion(item.firmwareVersion || '');
    setStatus(item.status || 'ACTIVE');
    setRepartiteurId(item.repartiteurId || '');
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim() || !manufacturer.trim() || !model.trim() || !repartiteurId) {
      setFormError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    const itemData = {
      name,
      type,
      manufacturer,
      model,
      serialNumber,
      ipAddress,
      macAddress,
      firmwareVersion,
      status,
      repartiteurId
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
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'équipement "${item.name}" ?`)) {
      const res = await deleteItem(item.id);
      if (!res.success) {
        alert(res.error || "Impossible de supprimer cet enregistrement.");
      }
    }
  };

  return (
    <div className="space-y-6">
      
      <DataTable
        title="Gestion des Équipements"
        description="Supervision du matériel réseau actif (commutateurs, routeurs, répartiteurs de cœurs)."
        columns={columns}
        data={equipements}
        isLoading={loading}
        searchPlaceholder="Rechercher équipement (nom, constructeur, SN...)..."
        searchFields={['name', 'manufacturer', 'model', 'serialNumber', 'ipAddress']}
        onAdd={handleOpenAdd}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        addLabel="Ajouter Équipement"
      />

      {/* Slide-over Form Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="w-full max-w-lg h-full bg-gray-950 border-l border-gray-800 flex flex-col p-6 shadow-2xl overflow-y-auto text-gray-200">
            
            <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white uppercase">
                  {editingItem ? 'Modifier Équipement' : 'Nouvel Équipement'}
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
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Nom de l'équipement *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Commutateur Ouest A"
                    className="w-full h-10 rounded-xl bg-gray-900 border border-gray-800 px-4 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                  />
                </div>

                {/* Type & OLT */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Type *</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full h-10 rounded-xl bg-gray-900 border border-gray-800 px-4 text-sm text-gray-100 focus:outline-none focus:border-indigo-500 transition-all"
                    >
                      <option value="SWITCH">Commutateur (SWITCH)</option>
                      <option value="ROUTER">Routeur (ROUTER)</option>
                      <option value="OLT">OLT</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Répartiteur OLT Parent *</label>
                    <select
                      value={repartiteurId}
                      required
                      onChange={(e) => setRepartiteurId(e.target.value)}
                      className="w-full h-10 rounded-xl bg-gray-900 border border-gray-800 px-4 text-sm text-gray-100 focus:outline-none focus:border-indigo-500 transition-all"
                    >
                      <option value="" disabled>Lier à un OLT</option>
                      {repartiteurs.map(rep => (
                        <option key={rep.id} value={rep.id}>{rep.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Manufacturer & Model */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Fabricant *</label>
                    <input
                      type="text"
                      required
                      value={manufacturer}
                      onChange={(e) => setManufacturer(e.target.value)}
                      placeholder="Ex: Cisco / Huawei"
                      className="w-full h-10 rounded-xl bg-gray-900 border border-gray-800 px-4 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Modèle *</label>
                    <input
                      type="text"
                      required
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="Ex: Catalyst 9300"
                      className="w-full h-10 rounded-xl bg-gray-900 border border-gray-800 px-4 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                    />
                  </div>
                </div>

                {/* Serial Number & Firmware */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Numéro de Série</label>
                    <input
                      type="text"
                      value={serialNumber}
                      onChange={(e) => setSerialNumber(e.target.value)}
                      placeholder="Ex: SN-283891823"
                      className="w-full h-10 rounded-xl bg-gray-900 border border-gray-800 px-4 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Firmware Version</label>
                    <input
                      type="text"
                      value={firmwareVersion}
                      onChange={(e) => setFirmwareVersion(e.target.value)}
                      placeholder="Ex: v15.2(4)E"
                      className="w-full h-10 rounded-xl bg-gray-900 border border-gray-800 px-4 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                    />
                  </div>
                </div>

                {/* IP & MAC addresses */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Adresse IP</label>
                    <input
                      type="text"
                      value={ipAddress}
                      onChange={(e) => setIpAddress(e.target.value)}
                      placeholder="Ex: 10.150.12.3"
                      className="w-full h-10 rounded-xl bg-gray-900 border border-gray-800 px-4 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Adresse MAC</label>
                    <input
                      type="text"
                      value={macAddress}
                      onChange={(e) => setMacAddress(e.target.value)}
                      placeholder="Ex: 00:0a:95:9d:68:16"
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

export default Equipements;
