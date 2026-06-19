import React, { useState } from 'react';
import DataTable from '../components/DataTable';
import { useCrud } from '../hooks/useCrud';
import { useAuth } from '../context/AuthContext';
import { X, Users, Inbox, Smartphone, Mail, Hash } from 'lucide-react';

const Clients = () => {
  const { data: clients, loading, createItem, updateItem, deleteItem } = useCrud('/clients');
  const { data: clientBoxes } = useCrud('/client-boxes');
  const { user } = useAuth();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields
  const [customerNumber, setCustomerNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [clientBoxId, setClientBoxId] = useState('');
  const [assignedPort, setAssignedPort] = useState('');
  const [subscriptionType, setSubscriptionType] = useState('FTTH-100M');
  const [status, setStatus] = useState('ACTIVE');

  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';

  const getClientBoxName = (boxId) => {
    const box = clientBoxes.find(b => b.id === boxId);
    return box ? box.name : 'Non Raccordé';
  };

  const columns = [
    {
      key: 'fullName',
      header: 'Abonné Client',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2.5 font-semibold text-gray-200">
          <Users className="h-4.5 w-4.5 text-indigo-400 shrink-0" />
          <div className="flex flex-col">
            <span>{row.fullName}</span>
            <span className="text-[10px] text-gray-500 font-mono flex items-center gap-0.5">
              <Hash className="h-2.5 w-2.5" />
              {row.customerNumber}
            </span>
          </div>
        </div>
      )
    },
    {
      key: 'contacts',
      header: 'Contacts',
      render: (row) => (
        <div className="flex flex-col text-xs text-gray-300">
          <span className="flex items-center gap-1"><Smartphone className="h-3 w-3 text-gray-500" /> {row.phone || 'N/A'}</span>
          <span className="flex items-center gap-1 text-gray-400 mt-0.5"><Mail className="h-3 w-3 text-gray-600" /> {row.email || 'N/A'}</span>
        </div>
      )
    },
    {
      key: 'address',
      header: 'Adresse d\'installation',
      render: (row) => <span className="text-xs text-gray-400 line-clamp-1">{row.address}</span>
    },
    {
      key: 'clientBoxId',
      header: 'Boîtier Raccordement',
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-xs text-gray-300 flex items-center gap-1">
            <Inbox className="h-3.5 w-3.5 text-sky-400" />
            {getClientBoxName(row.clientBoxId)}
          </span>
          <span className="text-[10px] text-gray-500 mt-0.5">Port Attribué: Port #{row.assignedPort || 'N/A'}</span>
        </div>
      )
    },
    {
      key: 'subscriptionType',
      header: 'Offre / Débit',
      sortable: true,
      render: (row) => (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-gray-900 border border-gray-800 text-indigo-400">
          {row.subscriptionType}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Abonnement',
      sortable: true,
      render: (row) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
          row.status === 'ACTIVE' 
            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            : row.status === 'SUSPENDED'
              ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
              : 'bg-red-500/10 text-red-400 border border-red-500/20'
        }`}>
          {row.status === 'ACTIVE' ? 'Actif' : row.status === 'SUSPENDED' ? 'Suspendu' : 'Résilier'}
        </span>
      )
    }
  ];

  const handleOpenAdd = () => {
    setEditingItem(null);
    setCustomerNumber(`CUST-${Math.floor(100000 + Math.random() * 900000)}`);
    setFullName('');
    setPhone('');
    setEmail('');
    setAddress('');
    setClientBoxId(clientBoxes[0]?.id || '');
    setAssignedPort('1');
    setSubscriptionType('FTTH-100M');
    setStatus('ACTIVE');
    setFormError('');
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setCustomerNumber(item.customerNumber || '');
    setFullName(item.fullName || '');
    setPhone(item.phone || '');
    setEmail(item.email || '');
    setAddress(item.address || '');
    setClientBoxId(item.clientBoxId || '');
    setAssignedPort(item.assignedPort || '1');
    setSubscriptionType(item.subscriptionType || 'FTTH-100M');
    setStatus(item.status || 'ACTIVE');
    setFormError('');
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !address.trim() || !clientBoxId || !assignedPort) {
      setFormError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    const itemData = {
      customerNumber,
      fullName,
      phone,
      email,
      address,
      clientBoxId,
      assignedPort: parseInt(assignedPort),
      subscriptionType,
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
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le client "${item.fullName}" ?`)) {
      const res = await deleteItem(item.id);
      if (!res.success) {
        alert(res.error || "Impossible de supprimer cet enregistrement.");
      }
    }
  };

  return (
    <div className="space-y-6">
      
      <DataTable
        title="Gestion des Abonnés Clients"
        description="Fiches abonnés et raccordements physiques finaux au boîtier de service (données consultées uniquement par l'équipe interne)."
        columns={columns}
        data={clients}
        isLoading={loading}
        searchPlaceholder="Rechercher abonnés (nom, numéro client, offre)..."
        searchFields={['fullName', 'customerNumber', 'email', 'phone', 'subscriptionType']}
        onAdd={handleOpenAdd}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        addLabel="Ajouter Client"
      />

      {/* Slide-over Form Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="w-full max-w-lg h-full bg-gray-950 border-l border-gray-800 flex flex-col p-6 shadow-2xl overflow-y-auto text-gray-200">
            
            <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white uppercase">
                  {editingItem ? 'Modifier Client' : 'Nouveau Client'}
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
                {/* Customer Number & Name */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">N° Client</label>
                    <input
                      type="text"
                      readOnly
                      value={customerNumber}
                      className="w-full h-10 rounded-xl bg-gray-900/40 border border-gray-800 px-4 text-sm text-gray-500 font-mono focus:outline-none cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Nom Complet *</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ex: Société Durant SA / Jean Dupont"
                      className="w-full h-10 rounded-xl bg-gray-900 border border-gray-800 px-4 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                    />
                  </div>
                </div>

                {/* Contacts */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Téléphone</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ex: +33 6 12 34 56 78"
                      className="w-full h-10 rounded-xl bg-gray-900 border border-gray-800 px-4 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">E-mail</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Ex: contact@email.com"
                      className="w-full h-10 rounded-xl bg-gray-900 border border-gray-800 px-4 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Adresse d'installation *</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ex: Bâtiment B, Escalier 2, Apt 42, 18 Rue Victor Hugo"
                    className="w-full h-10 rounded-xl bg-gray-900 border border-gray-800 px-4 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                  />
                </div>

                {/* Connection Box & Port */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5 col-span-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Boîtier Raccordement (PM) *</label>
                    <select
                      value={clientBoxId}
                      required
                      onChange={(e) => setClientBoxId(e.target.value)}
                      className="w-full h-10 rounded-xl bg-gray-900 border border-gray-800 px-4 text-sm text-gray-100 focus:outline-none focus:border-indigo-500 transition-all"
                    >
                      <option value="" disabled>Sélectionner Boîtier</option>
                      {clientBoxes.map(box => (
                        <option key={box.id} value={box.id}>{box.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">N° Port Attribué *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={assignedPort}
                      onChange={(e) => setAssignedPort(e.target.value)}
                      placeholder="Ex: 1"
                      className="w-full h-10 rounded-xl bg-gray-900 border border-gray-800 px-4 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                    />
                  </div>
                </div>

                {/* Offer Type & Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Type d'abonnement / Offre</label>
                    <select
                      value={subscriptionType}
                      onChange={(e) => setSubscriptionType(e.target.value)}
                      className="w-full h-10 rounded-xl bg-gray-900 border border-gray-800 px-4 text-sm text-gray-100 focus:outline-none focus:border-indigo-500 transition-all"
                    >
                      <option value="FTTH-100M">FTTH 100 Mbps</option>
                      <option value="FTTH-500M">FTTH 500 Mbps</option>
                      <option value="FTTH-1G">FTTH 1 Gbps</option>
                      <option value="FTTH-8G">FTTH Pro 8 Gbps</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">État Abonnée</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full h-10 rounded-xl bg-gray-900 border border-gray-800 px-4 text-sm text-gray-100 focus:outline-none focus:border-indigo-500 transition-all"
                    >
                      <option value="ACTIVE">Actif (Raccordé)</option>
                      <option value="SUSPENDED">Suspendu</option>
                      <option value="TERMINATED">Résilier (Inactif)</option>
                    </select>
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

export default Clients;
