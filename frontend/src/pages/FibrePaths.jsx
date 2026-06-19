import React, { useState, useMemo } from 'react';
import DataTable from '../components/DataTable';
import { useCrud } from '../hooks/useCrud';
import { useAuth } from '../context/AuthContext';
import { X, GitCommit, Database, Server, GitMerge, Inbox, Activity, Calendar, Zap } from 'lucide-react';

const FibrePaths = () => {
  const { data: paths, loading, createItem, updateItem, deleteItem } = useCrud('/fibre-paths');
  const { data: datacenters } = useCrud('/datacenters');
  const { data: repartiteurs } = useCrud('/repartiteurs');
  const { data: splitters } = useCrud('/splitters');
  const { data: clientBoxes } = useCrud('/client-boxes');
  const { user } = useAuth();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [sourceType, setSourceType] = useState('DATACENTER');
  const [sourceId, setSourceId] = useState('');
  const [destinationType, setDestinationType] = useState('REPARTITEUR');
  const [destinationId, setDestinationId] = useState('');
  const [fibreType, setFibreType] = useState('Monomode G.652.D');
  const [cableReference, setCableReference] = useState('');
  const [lengthMeters, setLengthMeters] = useState('');
  const [coreCount, setCoreCount] = useState('12');
  const [usedCores, setUsedCores] = useState('0');
  const [status, setStatus] = useState('ACTIVE');
  const [installationDate, setInstallationDate] = useState('');
  const [lastMaintenance, setLastMaintenance] = useState('');

  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';

  // Helper to fetch entity name
  const getEntityName = (type, id) => {
    if (!id) return 'Non défini';
    let list = [];
    if (type === 'DATACENTER') list = datacenters;
    else if (type === 'REPARTITEUR') list = repartiteurs;
    else if (type === 'SPLITTER') list = splitters;
    else if (type === 'CLIENT_BOX') list = clientBoxes;

    const found = list.find(item => item.id === id);
    return found ? found.name : 'Inconnu';
  };

  // Helper to fetch list of source options depending on type selection
  const getSourceOptions = (type) => {
    if (type === 'DATACENTER') return datacenters;
    if (type === 'REPARTITEUR') return repartiteurs;
    if (type === 'SPLITTER') return splitters;
    if (type === 'CLIENT_BOX') return clientBoxes;
    return [];
  };

  const columns = [
    {
      key: 'cableReference',
      header: 'Réf. Câble',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2.5 font-semibold text-gray-800 dark:text-gray-200">
          <GitCommit className="h-4.5 w-4.5 text-indigo-500 dark:text-indigo-400 shrink-0 rotate-45" />
          <span>{row.cableReference || `FP-${row.id.substring(0, 5)}`}</span>
        </div>
      )
    },
    {
      key: 'sourceType',
      header: 'Source (Départ)',
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-xs text-gray-800 dark:text-gray-200 font-semibold">{getEntityName(row.sourceType, row.sourceId)}</span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-gray-500 mt-0.5">{row.sourceType}</span>
        </div>
      )
    },
    {
      key: 'destinationType',
      header: 'Destination (Arrivée)',
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-xs text-gray-800 dark:text-gray-200 font-semibold">{getEntityName(row.destinationType, row.destinationId)}</span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 dark:text-gray-505 mt-0.5">{row.destinationType}</span>
        </div>
      )
    },
    {
      key: 'fibreType',
      header: 'Type de Fibre',
      sortable: true,
      render: (row) => (
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
          {row.fibreType || 'Monomode'}
        </span>
      )
    },
    {
      key: 'lengthMeters',
      header: 'Longueur',
      sortable: true,
      render: (row) => (
        <span className="text-xs font-mono font-bold text-gray-650 dark:text-gray-300">
          {row.lengthMeters ? `${row.lengthMeters.toLocaleString()} m` : 'N/A'}
        </span>
      )
    },
    {
      key: 'coreCount',
      header: 'Brins (Cores)',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-1.5 bg-gray-100 dark:bg-gray-950 rounded-full overflow-hidden border border-gray-200 dark:border-gray-800 shrink-0">
            <div 
              className="h-full bg-indigo-500 rounded-full"
              style={{ width: `${((row.usedCores || 0) / (row.coreCount || 12)) * 100}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-600 dark:text-gray-300 font-semibold">
            {row.usedCores || 0} / {row.coreCount || 12}
          </span>
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
            ? 'bg-emerald-500/10 text-emerald-650 dark:text-emerald-400 border border-emerald-500/20'
            : row.status === 'MAINTENANCE'
              ? 'bg-orange-500/10 text-orange-650 dark:text-orange-400 border border-orange-500/20'
              : row.status === 'CUT'
                ? 'bg-red-500/10 text-red-650 dark:text-red-400 border border-red-500/20'
                : 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border border-gray-500/20'
        }`}>
          {row.status === 'ACTIVE' ? 'Actif' : row.status === 'MAINTENANCE' ? 'Maintenance' : row.status === 'CUT' ? 'Coupé' : 'Inactif'}
        </span>
      )
    }
  ];

  const handleOpenAdd = () => {
    setEditingItem(null);
    setSourceType('DATACENTER');
    setSourceId('');
    setDestinationType('REPARTITEUR');
    setDestinationId('');
    setFibreType('Monomode G.652.D');
    setCableReference('');
    setLengthMeters('');
    setCoreCount('12');
    setUsedCores('0');
    setStatus('ACTIVE');
    setInstallationDate(new Date().toISOString().substring(0, 10));
    setLastMaintenance(new Date().toISOString().substring(0, 10));
    setFormError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setSourceType(item.sourceType || 'DATACENTER');
    setSourceId(item.sourceId || '');
    setDestinationType(item.destinationType || 'REPARTITEUR');
    setDestinationId(item.destinationId || '');
    setFibreType(item.fibreType || '');
    setCableReference(item.cableReference || '');
    setLengthMeters(item.lengthMeters || '');
    setCoreCount(item.coreCount ? item.coreCount.toString() : '12');
    setUsedCores(item.usedCores ? item.usedCores.toString() : '0');
    setStatus(item.status || 'ACTIVE');
    setInstallationDate(item.installationDate ? item.installationDate.substring(0, 10) : '');
    setLastMaintenance(item.lastMaintenance ? item.lastMaintenance.substring(0, 10) : '');
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!cableReference.trim() || !sourceType || !sourceId || !destinationType || !destinationId || !lengthMeters) {
      setFormError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (sourceType === destinationType && sourceId === destinationId) {
      setFormError('La source et la destination ne peuvent pas être le même équipement.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    const itemData = {
      sourceType,
      sourceId,
      destinationType,
      destinationId,
      fibreType,
      cableReference,
      lengthMeters: parseFloat(lengthMeters),
      coreCount: parseInt(coreCount),
      usedCores: parseInt(usedCores),
      status,
      installationDate: installationDate ? `${installationDate}T00:00:00` : null,
      lastMaintenance: lastMaintenance ? `${lastMaintenance}T00:00:00` : null
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
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la liaison fibre "${item.cableReference || item.id}" ?`)) {
      const res = await deleteItem(item.id);
      if (!res.success) {
        alert(res.error || "Impossible de supprimer cette liaison.");
      }
    }
  };

  // Adjust default selection if options change
  useMemo(() => {
    const srcOpts = getSourceOptions(sourceType);
    if (srcOpts.length > 0 && !srcOpts.some(opt => opt.id === sourceId)) {
      setSourceId(srcOpts[0].id);
    }
  }, [sourceType, datacenters, repartiteurs, splitters, clientBoxes]);

  useMemo(() => {
    const destOpts = getSourceOptions(destinationType);
    if (destOpts.length > 0 && !destOpts.some(opt => opt.id === destinationId)) {
      setDestinationId(destOpts[0].id);
    }
  }, [destinationType, datacenters, repartiteurs, splitters, clientBoxes]);

  return (
    <div className="space-y-6">
      
      <DataTable
        title="Gestion des Chemins Fibre (Liaisons)"
        description="Liaisons par câbles de fibres optiques connectant les datacenters, OLTs, splitters et boîtiers abonnés."
        columns={columns}
        data={paths}
        isLoading={loading}
        searchPlaceholder="Rechercher liaison (câble, type)..."
        searchFields={['cableReference', 'fibreType']}
        onAdd={handleOpenAdd}
        onEdit={handleOpenEdit}
        onDelete={isAdmin ? handleDelete : null}
        addLabel="Créer Liaison Fibre"
      />

      {/* Slide-over Form Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="w-full max-w-lg h-full bg-white dark:bg-gray-950 border-l border-gray-200 dark:border-gray-800 flex flex-col p-6 shadow-2xl overflow-y-auto text-gray-800 dark:text-gray-200">
            
            <div className="flex items-center justify-between border-b border-gray-250 dark:border-gray-800 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <GitCommit className="h-5 w-5 text-indigo-500 dark:text-indigo-400 rotate-45" />
                <h3 className="text-base font-bold text-gray-900 dark:text-white uppercase">
                  {editingItem ? 'Modifier Liaison Fibre' : 'Nouvelle Liaison Fibre'}
                </h3>
              </div>
              <button 
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 hover:bg-gray-105 dark:hover:bg-gray-800 text-gray-500 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {formError && (
              <div className="mb-6 p-3.5 rounded-xl border border-red-500/25 bg-red-50 dark:bg-red-950/20 text-red-655 dark:text-red-400 text-xs font-semibold">
                {formError}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-5 flex-1 flex flex-col">
              
              <div className="space-y-4 flex-1">
                {/* Cable Reference */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Référence du Câble *</label>
                  <input
                    type="text"
                    required
                    value={cableReference}
                    onChange={(e) => setCableReference(e.target.value)}
                    placeholder="Ex: FP-CABLE-01-A"
                    className="w-full h-10 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-4 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all font-semibold"
                  />
                </div>

                {/* Source Type & Source Object */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type Source *</label>
                    <select
                      value={sourceType}
                      onChange={(e) => setSourceType(e.target.value)}
                      className="w-full h-10 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-4 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-indigo-500 transition-all font-semibold"
                    >
                      <option value="DATACENTER">Datacenter</option>
                      <option value="REPARTITEUR">Répartiteur (OLT)</option>
                      <option value="SPLITTER">Splitter (Coupleur)</option>
                      <option value="CLIENT_BOX">Boîtier Client</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Équipement Source *</label>
                    <select
                      value={sourceId}
                      required
                      onChange={(e) => setSourceId(e.target.value)}
                      className="w-full h-10 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-4 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-indigo-500 transition-all font-semibold"
                    >
                      <option value="" disabled>Sélectionner Source</option>
                      {getSourceOptions(sourceType).map(opt => (
                        <option key={opt.id} value={opt.id}>{opt.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Destination Type & Destination Object */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type Destination *</label>
                    <select
                      value={destinationType}
                      onChange={(e) => setDestinationType(e.target.value)}
                      className="w-full h-10 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-4 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-indigo-500 transition-all font-semibold"
                    >
                      <option value="DATACENTER">Datacenter</option>
                      <option value="REPARTITEUR">Répartiteur (OLT)</option>
                      <option value="SPLITTER">Splitter (Coupleur)</option>
                      <option value="CLIENT_BOX">Boîtier Client</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Équipement Dest. *</label>
                    <select
                      value={destinationId}
                      required
                      onChange={(e) => setDestinationId(e.target.value)}
                      className="w-full h-10 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-4 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-indigo-500 transition-all font-semibold"
                    >
                      <option value="" disabled>Sélectionner Destination</option>
                      {getSourceOptions(destinationType).map(opt => (
                        <option key={opt.id} value={opt.id}>{opt.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Fibre Type & Length */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type de Câble</label>
                    <input
                      type="text"
                      value={fibreType}
                      onChange={(e) => setFibreType(e.target.value)}
                      placeholder="Ex: Monomode G.652.D"
                      className="w-full h-10 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-4 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all font-semibold"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Longueur (Mètres) *</label>
                    <input
                      type="number"
                      required
                      min="0.1"
                      step="any"
                      value={lengthMeters}
                      onChange={(e) => setLengthMeters(e.target.value)}
                      placeholder="Ex: 450"
                      className="w-full h-10 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-4 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all font-semibold"
                    />
                  </div>
                </div>

                {/* Core count & Used core count */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nombre de Brins (Cores) *</label>
                    <select
                      value={coreCount}
                      onChange={(e) => setCoreCount(e.target.value)}
                      className="w-full h-10 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-4 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-indigo-500 transition-all font-semibold"
                    >
                      <option value="4">4 brins</option>
                      <option value="6">6 brins</option>
                      <option value="12">12 brins</option>
                      <option value="24">24 brins</option>
                      <option value="48">48 brins</option>
                      <option value="96">96 brins</option>
                      <option value="144">144 brins</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Brins Utilisés *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      max={coreCount}
                      value={usedCores}
                      onChange={(e) => setUsedCores(e.target.value)}
                      placeholder="Ex: 0"
                      className="w-full h-10 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-4 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all font-semibold"
                    />
                  </div>
                </div>

                {/* Status & Dates */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Statut Liaison</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full h-10 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-4 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-indigo-500 transition-all font-semibold"
                    >
                      <option value="ACTIVE">Actif</option>
                      <option value="MAINTENANCE">En Maintenance</option>
                      <option value="CUT">Coupé / Incident</option>
                      <option value="INACTIVE">Inactif</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> Date Installation
                    </label>
                    <input
                      type="date"
                      value={installationDate}
                      onChange={(e) => setInstallationDate(e.target.value)}
                      className="w-full h-10 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-4 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-indigo-500 transition-all font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <Activity className="h-3.5 w-3.5" /> Dernière Maintenance
                  </label>
                  <input
                    type="date"
                    value={lastMaintenance}
                    onChange={(e) => setLastMaintenance(e.target.value)}
                    className="w-full h-10 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-4 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:border-indigo-500 transition-all font-semibold"
                  />
                </div>

              </div>

              <div className="border-t border-gray-200 dark:border-gray-800 pt-5 mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="h-10 px-5 rounded-xl border border-gray-250 dark:border-gray-800 text-gray-400 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-10 px-5 rounded-xl bg-indigo-650 text-white hover:bg-indigo-550 disabled:opacity-50 transition-colors font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
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

export default FibrePaths;
