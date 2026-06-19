import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useDashboard } from '../hooks/useDashboard';
import { useNetworkMap } from '../hooks/useNetworkMap';
import { 
  Zap, 
  ShieldAlert, 
  Layers, 
  TrendingUp, 
  Map, 
  Server, 
  Inbox, 
  GitMerge, 
  Database,
  ArrowRight,
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

const TechDashboard = () => {
  const { stats, loading: statsLoading } = useDashboard();
  const { nodes, fibrePaths, loading: mapLoading } = useNetworkMap();

  // Find all elements that need technician intervention (status CUT or MAINTENANCE)
  const interventions = useMemo(() => {
    const list = [];

    // Helper to push nodes
    const processNodes = (arr, type, label) => {
      arr.forEach(item => {
        if (item.status === 'CUT' || item.status === 'MAINTENANCE') {
          list.push({
            id: item.id,
            name: item.name,
            type,
            typeName: label,
            status: item.status,
            location: item.location || item.zone || `Lat: ${item.latitude?.toFixed(4)}, Lng: ${item.longitude?.toFixed(4)}`,
            updatedAt: item.updatedAt || new Date().toISOString()
          });
        }
      });
    };

    processNodes(nodes.datacenters, 'DATACENTER', 'Datacenter');
    processNodes(nodes.repartiteurs, 'REPARTITEUR', 'Répartiteur (OLT)');
    processNodes(nodes.splitters, 'SPLITTER', 'Splitter');
    processNodes(nodes.clientBoxes, 'CLIENT_BOX', 'Boîtier Client');

    // Add fibre paths
    fibrePaths.forEach(path => {
      if (path.status === 'CUT' || path.status === 'MAINTENANCE') {
        list.push({
          id: path.id,
          name: path.cableReference || `Fibre FP-${path.id.substring(0, 5)}`,
          type: 'PATH',
          typeName: 'Lien Fibre Optique',
          status: path.status,
          location: `De ${path.sourceType} à ${path.destinationType}`,
          updatedAt: path.updatedAt || new Date().toISOString()
        });
      }
    });

    // Sort by status (CUT/Alert first)
    return list.sort((a, b) => (a.status === 'CUT' ? -1 : 1));
  }, [nodes, fibrePaths]);

  const statsCards = [
    {
      title: "Coupures / Incidents",
      value: stats?.outagesCount !== undefined ? stats.outagesCount : '0',
      icon: ShieldAlert,
      color: stats?.outagesCount > 0 ? "from-red-500 to-rose-500" : "from-emerald-500 to-teal-500",
      shadow: stats?.outagesCount > 0 ? "shadow-red-500/10" : "shadow-emerald-500/5",
      desc: "Liaisons optiques coupées"
    },
    {
      title: "En Maintenance",
      value: interventions.filter(item => item.status === 'MAINTENANCE').length,
      icon: AlertTriangle,
      color: "from-amber-500 to-orange-500",
      shadow: "shadow-amber-500/10",
      desc: "Interventions actives encours"
    },
    {
      title: "Occupation Ports",
      value: stats?.occupationRate ? `${stats.occupationRate.toFixed(1)}%` : '0%',
      icon: TrendingUp,
      color: "from-blue-500 to-indigo-500",
      shadow: "shadow-blue-500/10",
      desc: "Taux de raccordement moyen"
    },
    {
      title: "Fibres Disponibles",
      value: stats?.freeFibers?.toLocaleString() || '0',
      icon: Layers,
      color: "from-purple-500 to-pink-500",
      shadow: "shadow-purple-500/10",
      desc: "Capacité libre raccordable"
    }
  ];

  if (statsLoading || mapLoading) {
    return (
      <div className="flex h-[calc(100vh-8.5rem)] w-full items-center justify-center bg-transparent text-gray-500">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
          <span className="text-sm font-semibold">Génération de votre espace technicien...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Banner Status */}
      <div className="p-5 rounded-2xl bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-1">Espace Technicien Terrain</h1>
          <p className="text-xs text-gray-550 dark:text-gray-400">Supervision des coupures, des raccordements clients et des fiches d'incidents.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-205 dark:border-gray-850">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200 flex items-center gap-1">
            <UserCheck className="h-3.5 w-3.5" /> Technicien connecté
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statsCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.3 }}
              className={`p-5 rounded-2xl bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 flex flex-col justify-between h-36 relative overflow-hidden shadow-sm ${card.shadow}`}
            >
              <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-gradient-to-br ${card.color} opacity-[0.04] blur-xl`}></div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{card.title}</span>
                <div className={`p-2 rounded-xl bg-gradient-to-br ${card.color} text-white shadow-inner`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <div>
                <p className="text-3xl font-extrabold text-gray-900 dark:text-white leading-none">{card.value}</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium mt-2">{card.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Interventions list */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col">
          <div className="border-b border-gray-150 dark:border-gray-800 pb-4 mb-4">
            <h3 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wider">Interventions & Incidents Réseau</h3>
            <p className="text-xs text-gray-500 mt-1">Liste des éléments nécessitant une réparation ou une maintenance active.</p>
          </div>

          <div className="flex-1 max-h-[380px] overflow-y-auto space-y-3 pr-1">
            {interventions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-gray-550 dark:text-gray-400">
                <Zap className="h-10 w-10 text-emerald-500 mb-2 animate-bounce" />
                <p className="text-xs font-bold">Excellent! Aucun incident ou coupure en cours sur la carte.</p>
              </div>
            ) : (
              interventions.map((item) => (
                <div 
                  key={item.id}
                  className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all hover:bg-gray-50 dark:hover:bg-gray-850 ${
                    item.status === 'CUT' 
                      ? 'border-red-500/20 bg-red-500/5' 
                      : 'border-amber-500/20 bg-amber-500/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white dark:bg-gray-905 border border-gray-200 dark:border-gray-800 shrink-0">
                      {item.type === 'DATACENTER' && <Database className="h-4.5 w-4.5 text-indigo-500" />}
                      {item.type === 'REPARTITEUR' && <Server className="h-4.5 w-4.5 text-purple-500" />}
                      {item.type === 'SPLITTER' && <GitMerge className="h-4.5 w-4.5 text-pink-500" />}
                      {item.type === 'CLIENT_BOX' && <Inbox className="h-4.5 w-4.5 text-sky-500" />}
                      {item.type === 'PATH' && <Zap className="h-4.5 w-4.5 text-amber-500" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-gray-850 dark:text-gray-100">{item.name}</p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          item.status === 'CUT' 
                            ? 'bg-red-500/10 text-red-650 dark:text-red-400 border border-red-500/20' 
                            : 'bg-amber-500/10 text-amber-650 dark:text-amber-400 border border-amber-500/20'
                        }`}>
                          {item.status === 'CUT' ? 'Coupé' : 'Maintenance'}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-1 font-medium">{item.location}</p>
                    </div>
                  </div>
                  
                  <Link 
                    to="/map"
                    className="p-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors shrink-0"
                    title="Voir sur la carte SIG"
                  >
                    <Map className="h-4 w-4" />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Quick actions */}
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between h-full">
          <div>
            <h3 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-gray-800 pb-3 mb-4">Actions Terrain Rapides</h3>
            <p className="text-xs text-gray-500 mb-6">Accédez rapidement aux outils d'installation et de maintenance du réseau.</p>
          </div>

          <div className="space-y-4">
            <Link 
              to="/clients" 
              className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-55/50 dark:bg-gray-950/30 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-650 dark:text-indigo-400">
                  <Inbox className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-850 dark:text-gray-100">Nouveau Raccordement Client</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">Enregistrer un client sur un boîtier client</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link 
              to="/map" 
              className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-55/50 dark:bg-gray-950/30 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-650 dark:text-purple-400">
                  <Map className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-850 dark:text-gray-100">Carte SIG Interactive</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">Modifier les statuts d'équipement sur la carte</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link 
              to="/equipements" 
              className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-55/50 dark:bg-gray-950/30 hover:border-pink-500/50 hover:bg-pink-500/5 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-pink-500/10 text-pink-650 dark:text-pink-400">
                  <Server className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-850 dark:text-gray-100">Fiche Équipements</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">Vérifier l'état et l'IP des routeurs/commutateurs</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};

export default TechDashboard;
