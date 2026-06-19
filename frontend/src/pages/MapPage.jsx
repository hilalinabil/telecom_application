import React, { useState } from 'react';
import NetworkMap from '../components/NetworkMap';
import { useNetworkMap } from '../hooks/useNetworkMap';
import { 
  RefreshCw, 
  MapPin, 
  AlertCircle, 
  Search, 
  Database, 
  Server, 
  GitMerge, 
  Inbox, 
  Zap 
} from 'lucide-react';

const MapPage = () => {
  const { 
    nodes, 
    fibrePaths, 
    loading, 
    error, 
    refresh, 
    updateNodeStatus, 
    updatePathStatus 
  } = useNetworkMap();

  // Search & filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [visibleTypes, setVisibleTypes] = useState({
    DATACENTER: true,
    REPARTITEUR: true,
    SPLITTER: true,
    CLIENT_BOX: true,
    PATH: true
  });

  const toggleType = (type) => {
    setVisibleTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  // Perform dynamic filtering on nodes
  const filteredNodes = React.useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    
    const matchesFilter = (item) => {
      // Status filter
      if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
      
      // Text search filter
      if (term) {
        const matchesName = item.name?.toLowerCase().includes(term);
        const matchesZone = item.zone?.toLowerCase().includes(term);
        const matchesLocation = item.location?.toLowerCase().includes(term);
        const matchesIp = item.ipAddress?.toLowerCase().includes(term);
        const matchesId = item.id?.toString().toLowerCase().includes(term);
        return matchesName || matchesZone || matchesLocation || matchesIp || matchesId;
      }
      
      return true;
    };

    return {
      datacenters: visibleTypes.DATACENTER ? nodes.datacenters.filter(matchesFilter) : [],
      repartiteurs: visibleTypes.REPARTITEUR ? nodes.repartiteurs.filter(matchesFilter) : [],
      splitters: visibleTypes.SPLITTER ? nodes.splitters.filter(matchesFilter) : [],
      clientBoxes: visibleTypes.CLIENT_BOX ? nodes.clientBoxes.filter(matchesFilter) : []
    };
  }, [nodes, searchTerm, statusFilter, visibleTypes]);

  // Perform dynamic filtering on fiber paths
  const filteredPaths = React.useMemo(() => {
    if (!visibleTypes.PATH) return [];
    
    const term = searchTerm.trim().toLowerCase();
    return fibrePaths.filter(path => {
      // Status filter
      if (statusFilter !== 'ALL' && path.status !== statusFilter) return false;
      
      // Text search filter
      if (term) {
        const matchesRef = path.cableReference?.toLowerCase().includes(term);
        const matchesType = path.fibreType?.toLowerCase().includes(term);
        const matchesId = path.id?.toString().toLowerCase().includes(term);
        const matchesSourceType = path.sourceType?.toLowerCase().includes(term);
        const matchesDestType = path.destinationType?.toLowerCase().includes(term);
        return matchesRef || matchesType || matchesId || matchesSourceType || matchesDestType;
      }
      
      return true;
    });
  }, [fibrePaths, searchTerm, statusFilter, visibleTypes.PATH]);

  return (
    <div className="space-y-4 h-full flex flex-col">
      
      {/* Top Banner Control */}
      <div className="p-4 rounded-2xl glass-panel flex items-center justify-between gap-4 shrink-0 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-850 dark:text-white leading-none">Cartographie SIG</h1>
            <p className="text-xs text-gray-500 mt-1.5">Visualisation géographique et physique du réseau optique.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Refresh Action */}
          <button
            onClick={refresh}
            disabled={loading}
            className="flex items-center justify-center p-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
            title="Rafraîchir les données"
          >
            <RefreshCw className={`h-4.5 w-4.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Search & Filters Controls Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shrink-0 shadow-sm">
        <div className="flex flex-1 flex-col sm:flex-row gap-3">
          {/* Keyword Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-gray-450 dark:text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher sur la carte (nom, zone, IP, SN, réf)..."
              className="h-9.5 w-full rounded-xl bg-gray-100 dark:bg-gray-950 border border-gray-250 dark:border-gray-800 pl-10 pr-4 text-xs text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all font-semibold"
            />
          </div>

          {/* Status Dropdown */}
          <div className="relative shrink-0">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9.5 w-full sm:w-48 rounded-xl bg-gray-100 dark:bg-gray-950 border border-gray-250 dark:border-gray-800 px-3.5 text-xs text-gray-750 dark:text-gray-200 focus:outline-none focus:border-indigo-500 font-semibold cursor-pointer"
            >
              <option value="ALL">Tous les statuts</option>
              <option value="ACTIVE">Actif</option>
              <option value="MAINTENANCE">En Maintenance</option>
              <option value="CUT">Coupé (Fibre)</option>
              <option value="INACTIVE">Inactif</option>
            </select>
          </div>
        </div>

        {/* Badges Toggle Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mr-1">Afficher:</span>
          
          <button
            onClick={() => toggleType('DATACENTER')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              visibleTypes.DATACENTER 
                ? 'bg-indigo-550/10 border-indigo-500/30 text-indigo-650 dark:text-indigo-400 shadow-sm'
                : 'bg-transparent border-gray-200 dark:border-gray-800 text-gray-450 dark:text-gray-500 hover:text-gray-650 dark:hover:text-gray-300'
            }`}
          >
            <Database className="h-3.5 w-3.5" />
            <span>Datacenters</span>
          </button>

          <button
            onClick={() => toggleType('REPARTITEUR')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              visibleTypes.REPARTITEUR 
                ? 'bg-purple-550/10 border-purple-500/30 text-purple-650 dark:text-purple-400 shadow-sm'
                : 'bg-transparent border-gray-200 dark:border-gray-800 text-gray-450 dark:text-gray-500 hover:text-gray-650 dark:hover:text-gray-300'
            }`}
          >
            <Server className="h-3.5 w-3.5" />
            <span>Répartiteurs</span>
          </button>

          <button
            onClick={() => toggleType('SPLITTER')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              visibleTypes.SPLITTER 
                ? 'bg-pink-550/10 border-pink-500/30 text-pink-650 dark:text-pink-400 shadow-sm'
                : 'bg-transparent border-gray-200 dark:border-gray-800 text-gray-450 dark:text-gray-500 hover:text-gray-650 dark:hover:text-gray-300'
            }`}
          >
            <GitMerge className="h-3.5 w-3.5" />
            <span>Splitters</span>
          </button>

          <button
            onClick={() => toggleType('CLIENT_BOX')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              visibleTypes.CLIENT_BOX 
                ? 'bg-sky-550/10 border-sky-500/30 text-sky-650 dark:text-sky-400 shadow-sm'
                : 'bg-transparent border-gray-200 dark:border-gray-800 text-gray-450 dark:text-gray-500 hover:text-gray-650 dark:hover:text-gray-300'
            }`}
          >
            <Inbox className="h-3.5 w-3.5" />
            <span>Boîtiers</span>
          </button>

          <button
            onClick={() => toggleType('PATH')}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              visibleTypes.PATH 
                ? 'bg-amber-550/10 border-amber-500/30 text-amber-650 dark:text-amber-400 shadow-sm'
                : 'bg-transparent border-gray-200 dark:border-gray-800 text-gray-450 dark:text-gray-500 hover:text-gray-650 dark:hover:text-gray-300'
            }`}
          >
            <Zap className="h-3.5 w-3.5" />
            <span>Fibres</span>
          </button>
        </div>
      </div>

      {/* Main Map Render Container */}
      <div className="flex-1 min-h-0 relative">
        {error && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 w-full max-w-md p-4 rounded-xl border border-red-500/25 bg-red-950/90 text-red-300 text-xs font-semibold flex items-center gap-3 backdrop-blur-md shadow-2xl">
            <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
            <div className="flex-1">
              <p>{error}</p>
            </div>
            <button 
              onClick={refresh}
              className="px-3 py-1 rounded-lg bg-red-900/50 hover:bg-red-900 border border-red-500/30 text-white text-[10px] uppercase font-bold cursor-pointer"
            >
              Réessayer
            </button>
          </div>
        )}

        {loading && !nodes.datacenters.length && (
          <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-3 rounded-2xl">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"></div>
            <p className="text-xs text-gray-500 font-medium">Chargement des données de cartographie...</p>
          </div>
        )}

        <NetworkMap
          nodes={filteredNodes}
          fibrePaths={filteredPaths}
          onUpdateNodeStatus={updateNodeStatus}
          onUpdatePathStatus={updatePathStatus}
        />
      </div>

    </div>
  );
};

export default MapPage;
