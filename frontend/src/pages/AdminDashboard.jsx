import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDashboard } from '../hooks/useDashboard';
import { useNetworkMap } from '../hooks/useNetworkMap';
import api from '../services/api';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { 
  Activity, 
  Zap, 
  ShieldAlert, 
  Layers, 
  TrendingUp, 
  FileText, 
  ArrowUpRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { stats, loading: statsLoading } = useDashboard();
  const { nodes, fibrePaths, loading: mapLoading } = useNetworkMap();
  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(true);

  // Fetch recent activity logs
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await api.get('/logs');
        setLogs(response.data.slice(0, 5)); // Keep only latest 5 logs
      } catch (err) {
        console.error('Error fetching logs:', err);
        setLogs([]);
      } finally {
        setLogsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  // Compute equipment status distribution dynamically
  const statusDistribution = React.useMemo(() => {
    let active = 0;
    let maintenance = 0;
    let inactive = 0;
    let cut = 0;

    const countStatuses = (arr) => {
      arr.forEach(item => {
        if (item.status === 'ACTIVE') active++;
        else if (item.status === 'MAINTENANCE') maintenance++;
        else if (item.status === 'INACTIVE') inactive++;
        else if (item.status === 'CUT') cut++;
      });
    };

    countStatuses(nodes.datacenters);
    countStatuses(nodes.repartiteurs);
    countStatuses(nodes.splitters);
    countStatuses(nodes.clientBoxes);
    countStatuses(fibrePaths);

    if (active === 0 && maintenance === 0 && inactive === 0 && cut === 0) {
      return [
        { name: 'Actif', value: 34, color: '#10b981' },
        { name: 'Maintenance', value: 8, color: '#f97316' },
        { name: 'Inactif', value: 5, color: '#6b7280' },
        { name: 'Coupé', value: 2, color: '#ef4444' },
      ];
    }

    return [
      { name: 'Actif', value: active, color: '#10b981' },
      { name: 'Maintenance', value: maintenance, color: '#f97316' },
      { name: 'Inactif', value: inactive, color: '#6b7280' },
      { name: 'Coupé', value: cut, color: '#ef4444' },
    ].filter(item => item.value > 0);
  }, [nodes, fibrePaths]);

  // Compute capacity data per node type for a bar chart
  const capacityData = React.useMemo(() => {
    const dcTotal = nodes.datacenters.reduce((sum, d) => sum + (d.capacity || 0), 0);
    const dcUsed = nodes.datacenters.reduce((sum, d) => sum + (d.usedCapacity || 0), 0);
    
    const oltTotal = nodes.repartiteurs.reduce((sum, o) => sum + (o.nbPorts || 0), 0);
    const oltUsed = nodes.repartiteurs.reduce((sum, o) => sum + (o.usedPorts || 0), 0);

    const splitTotal = nodes.splitters.reduce((sum, s) => sum + (s.nbOutputs || 0), 0);
    const splitUsed = nodes.splitters.reduce((sum, s) => sum + (s.usedOutputs || 0), 0);

    const cbTotal = nodes.clientBoxes.reduce((sum, c) => sum + (c.totalPorts || 0), 0);
    const cbUsed = nodes.clientBoxes.reduce((sum, c) => sum + (c.usedPorts || 0), 0);

    if (dcTotal === 0 && oltTotal === 0 && splitTotal === 0 && cbTotal === 0) {
      return [
        { name: 'Datacenters', Capacité: 100, Utilisation: 65 },
        { name: 'OLT / Repartiteurs', Capacité: 480, Utilisation: 320 },
        { name: 'Splitters', Capacité: 240, Utilisation: 180 },
        { name: 'Boîtes Clients', Capacité: 800, Utilisation: 540 }
      ];
    }

    return [
      { name: 'Datacenters', Capacité: dcTotal, Utilisation: dcUsed },
      { name: 'OLT / Repart.', Capacité: oltTotal, Utilisation: oltUsed },
      { name: 'Splitters', Capacité: splitTotal, Utilisation: splitUsed },
      { name: 'Boîtes Clients', Capacité: cbTotal, Utilisation: cbUsed }
    ];
  }, [nodes]);

  const statsCards = [
    {
      title: "Occupation Globale",
      value: stats?.occupationRate ? `${stats.occupationRate.toFixed(1)}%` : '0%',
      icon: TrendingUp,
      color: "from-blue-500 to-indigo-500",
      shadow: "shadow-blue-500/10",
      desc: "Taux de ports fibres occupés"
    },
    {
      title: "Fibres Utilisées",
      value: stats?.usedFibers?.toLocaleString() || '0',
      icon: Zap,
      color: "from-emerald-500 to-teal-500",
      shadow: "shadow-emerald-500/10",
      desc: "Faisceaux de fibres actifs"
    },
    {
      title: "Fibres Disponibles",
      value: stats?.freeFibers?.toLocaleString() || '0',
      icon: Layers,
      color: "from-purple-500 to-pink-500",
      shadow: "shadow-purple-500/10",
      desc: "Faisceaux libres de connexion"
    },
    {
      title: "Pannes & Coupures",
      value: stats?.outagesCount !== undefined ? stats.outagesCount : '0',
      icon: ShieldAlert,
      color: stats?.outagesCount > 0 ? "from-red-500 to-rose-500" : "from-gray-700 to-gray-800",
      shadow: stats?.outagesCount > 0 ? "shadow-red-500/10" : "shadow-gray-500/5",
      desc: "Alertes fibres coupées en cours"
    }
  ];

  if (statsLoading || mapLoading) {
    return (
      <div className="flex h-[calc(100vh-8.5rem)] w-full items-center justify-center bg-transparent text-gray-500">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
          <span className="text-sm font-semibold">Génération du tableau de bord d'administration...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Banner Status */}
      <div className="p-5 rounded-2xl bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-1">Supervision Réseau (Administration)</h1>
          <p className="text-xs text-gray-550 dark:text-gray-400">Suivi en temps réel de l'infrastructure et de l'occupation de la fibre optique.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-205 dark:border-gray-850">
          <span className={`h-2.5 w-2.5 rounded-full ${stats?.overallNetworkState === 'CRITICAL' ? 'bg-red-500 animate-pulse shadow-red-500/50 shadow' : 'bg-emerald-500'} inline-block`}></span>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200">
            État du Réseau: {stats?.overallNetworkState || 'STABLE'}
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

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pie Chart: Status Distribution */}
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 flex flex-col justify-between h-[360px] lg:col-span-1 shadow-sm">
          <div>
            <h3 className="text-sm font-extrabold text-gray-900 dark:text-gray-100 uppercase tracking-wider">État des Équipements</h3>
            <p className="text-xs text-gray-500 mt-1">Répartition globale par état opérationnel.</p>
          </div>
          
          <div className="h-48 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-extrabold text-gray-900 dark:text-white">
                {statusDistribution.reduce((a, b) => a + b.value, 0)}
              </span>
              <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Éléments</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-gray-400">
            {statusDistribution.map((entry, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ backgroundColor: entry.color }}></span>
                <span className="truncate">{entry.name}: {entry.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart: Resource Capacities */}
        <div className="p-6 rounded-2xl bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 flex flex-col justify-between h-[360px] lg:col-span-2 shadow-sm">
          <div>
            <h3 className="text-sm font-extrabold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Capacité et Ports</h3>
            <p className="text-xs text-gray-500 mt-1">Comparatif entre capacité totale installée et ports utilisés.</p>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={capacityData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-850" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={11} tickLine={false} />
                <YAxis stroke="#6b7280" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Legend iconSize={10} wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Capacité" fill="#312e81" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Utilisation" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Logs section */}
      <div className="p-6 rounded-2xl bg-white dark:bg-gray-900/40 border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4 mb-4">
          <div>
            <h3 className="text-sm font-extrabold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Journal d'activités</h3>
            <p className="text-xs text-gray-500 mt-1">Dernières opérations effectuées par les agents sur le terrain.</p>
          </div>
          <Link to="/logs" className="flex items-center gap-1 text-xs font-bold text-indigo-650 dark:text-indigo-400 hover:underline transition-colors">
            <span>Tout voir</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {logsLoading ? (
          <div className="h-32 flex items-center justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"></div>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-8 text-xs text-gray-500">Aucune activité enregistrée.</div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800/40">
            {logs.map((log) => (
              <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-850 shrink-0">
                    <FileText className="h-4 w-4 text-indigo-500 dark:text-indigo-455" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-850 dark:text-gray-200">{log.details}</p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-500">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400 uppercase">{log.action}</span>
                      <span>•</span>
                      <span>Agent: {log.matricule}</span>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-gray-450 dark:text-gray-550 self-end sm:self-auto">
                  {new Date(log.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminDashboard;
