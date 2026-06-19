import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import { 
  ChevronRight, 
  User, 
  LogOut, 
  Sun, 
  Moon, 
  Bell, 
  Search 
} from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  
  // Dropdown menus state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);

  // Real-time notifications state
  const [notifications, setNotifications] = useState([]);
  const [readNotifIds, setReadNotifIds] = useState(() => {
    try {
      const saved = localStorage.getItem('read_notif_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist read notifications
  useEffect(() => {
    localStorage.setItem('read_notif_ids', JSON.stringify(readNotifIds));
  }, [readNotifIds]);

  const formatRelativeTime = (dateStr) => {
    if (!dateStr) return 'Récemment';
    const date = new Date(dateStr);
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Il y a ${diffHours} h`;
    return date.toLocaleDateString();
  };

  // Fetch real notifications based on roles
  useEffect(() => {
    if (!user) return;

    const fetchRealNotifications = async () => {
      try {
        if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') {
          // Admins: Fetch real activity logs from database
          const response = await api.get('/logs');
          const logsData = response.data || [];
          
          const mapped = logsData.slice(0, 10).map(log => {
            let type = 'info';
            const action = log.action || '';
            if (action.includes('COUPURE') || action.includes('ERR') || action.includes('SUPPRESSION')) {
              type = 'error';
            } else if (action.includes('MAINTENANCE') || action.includes('STATUT')) {
              type = 'warning';
            } else if (action.includes('CREATION') || action.includes('RACCORDEMENT') || action.includes('CONNEXION')) {
              type = 'success';
            }
            
            return {
              id: `log_${log.id}`,
              title: action ? action.replace(/_/g, ' ') : 'Activité Réseau',
              message: log.details || 'Aucun détail fourni.',
              time: formatRelativeTime(log.createdAt),
              type
            };
          });
          setNotifications(mapped);
        } else {
          // Technicians: Fetch live statuses of OLTs, splitters, client boxes and paths
          const [dc, olt, split, cb, paths] = await Promise.all([
            api.get('/datacenters').catch(() => ({ data: [] })),
            api.get('/repartiteurs').catch(() => ({ data: [] })),
            api.get('/splitters').catch(() => ({ data: [] })),
            api.get('/client-boxes').catch(() => ({ data: [] })),
            api.get('/fibre-paths').catch(() => ({ data: [] }))
          ]);

          const list = [];
          const addAlerts = (resData, label, typeKey) => {
            const arr = Array.isArray(resData) ? resData : resData.content || [];
            arr.forEach(item => {
              if (item.status === 'CUT' || item.status === 'MAINTENANCE') {
                list.push({
                  id: `alert_${typeKey}_${item.id}`,
                  title: item.status === 'CUT' ? `Alerte: Coupure ${label}` : `Maintenance: ${label}`,
                  message: `L'équipement "${item.name || item.cableReference}" est en état ${item.status}. Zone: ${item.zone || item.location || 'N/A'}.`,
                  time: 'En cours',
                  type: item.status === 'CUT' ? 'error' : 'warning'
                });
              }
            });
          };

          addAlerts(dc.data, 'Datacenter', 'dc');
          addAlerts(olt.data, 'Répartiteur (OLT)', 'olt');
          addAlerts(split.data, 'Splitter', 'split');
          addAlerts(cb.data, 'Boîtier Client', 'cb');
          addAlerts(paths.data, 'Lien Fibre', 'path');

          setNotifications(list);
        }
      } catch (err) {
        console.error('Error loading real notifications:', err);
      }
    };

    fetchRealNotifications();
    // Poll every 30 seconds for live network changes
    const interval = setInterval(fetchRealNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  // Compute unread status using the state variables
  const processedNotifications = useMemo(() => {
    return notifications.map(n => ({
      ...n,
      unread: !readNotifIds.includes(n.id)
    }));
  }, [notifications, readNotifIds]);

  const unreadCount = processedNotifications.filter(n => n.unread).length;

  const markAllAsRead = () => {
    const ids = notifications.map(n => n.id);
    setReadNotifIds(prev => Array.from(new Set([...prev, ...ids])));
  };

  const toggleUnread = (id) => {
    setReadNotifIds(prev => 
      prev.includes(id) 
        ? prev.filter(x => x !== id) 
        : [...prev, id]
    );
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Map paths to breadcrumb labels
  const pathnames = location.pathname.split('/').filter((x) => x);
  const routeNames = {
    '': 'Tableau de bord',
    'map': 'Carte Réseau',
    'datacenters': 'Datacenters',
    'repartiteurs': 'Répartiteurs (OLT)',
    'splitters': 'Splitters',
    'client-boxes': 'Boîtes Clients',
    'clients': 'Clients',
    'equipements': 'Équipements',
    'fibre-paths': 'Liaisons Fibre',
    'users': 'Agents & Techniciens',
    'logs': 'Journaux d\'activités',
    'profile': 'Mon Profil'
  };

  return (
    <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md flex items-center justify-between px-6 z-20 sticky top-0 text-gray-800 dark:text-gray-105">
      
      {/* Breadcrumbs */}
      <div className="flex items-center space-y-0 text-sm font-semibold text-gray-500 dark:text-gray-400">
        <Link 
          to="/" 
          className="hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          Réseau Fibre
        </Link>
        
        {pathnames.length === 0 ? (
          <>
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400 dark:text-gray-600" />
            <span className="text-gray-950 dark:text-gray-100 font-extrabold">Tableau de bord</span>
          </>
        ) : (
          pathnames.map((value, index) => {
            const last = index === pathnames.length - 1;
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;
            const label = routeNames[value] || value;

            return (
              <React.Fragment key={to}>
                <ChevronRight className="h-4 w-4 mx-2 text-gray-400 dark:text-gray-600" />
                {last ? (
                  <span className="text-gray-950 dark:text-gray-100 font-extrabold truncate max-w-[150px] sm:max-w-none">{label}</span>
                ) : (
                  <Link to={to} className="hover:text-gray-900 dark:hover:text-white transition-colors truncate max-w-[100px] sm:max-w-none">
                    {label}
                  </Link>
                )}
              </React.Fragment>
            );
          })
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        
        {/* Search Bar - Aesthetic */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-gray-400 dark:text-gray-500" />
          <input 
            type="text" 
            placeholder="Rechercher équipement..." 
            className="h-9.5 w-60 rounded-xl bg-gray-105 dark:bg-gray-900 border border-gray-250 dark:border-gray-800 pl-9 pr-4 text-xs text-gray-800 dark:text-gray-250 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-indigo-505 focus:ring-1 focus:ring-indigo-500/20 transition-all font-semibold"
          />
        </div>

        {/* Notifications Button */}
        <div className="relative" ref={notificationsRef}>
          <button 
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-55 dark:bg-gray-900/50 hover:bg-gray-105 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all shadow-sm cursor-pointer"
          >
            <Bell className="h-4.5 w-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-indigo-650 dark:bg-indigo-500 ring-2 ring-white dark:ring-gray-950 animate-pulse"></span>
            )}
          </button>

          <AnimatePresence>
            {notificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl p-3 text-gray-700 dark:text-gray-100 z-55 overflow-hidden"
              >
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-2 mb-2">
                  <span className="text-xs font-bold text-gray-900 dark:text-white uppercase flex items-center gap-1.5">
                    <Bell className="h-4 w-4 text-indigo-550 dark:text-indigo-400" /> Notifications
                  </span>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllAsRead}
                      className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline font-bold cursor-pointer"
                    >
                      Tout marquer comme lu
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto space-y-1.5 divide-y divide-gray-100 dark:divide-gray-800/40">
                  {processedNotifications.length === 0 ? (
                    <div className="text-center py-6 text-xs text-gray-400 dark:text-gray-500 font-medium">
                      Aucune notification active.
                    </div>
                  ) : (
                    processedNotifications.map((notif) => (
                      <div 
                        key={notif.id}
                        onClick={() => toggleUnread(notif.id)}
                        className={`pt-2 pb-2.5 px-2 rounded-lg cursor-pointer transition-colors flex gap-2.5 ${
                          notif.unread 
                            ? 'bg-indigo-500/5 dark:bg-indigo-500/5 hover:bg-indigo-500/10 dark:hover:bg-indigo-500/10' 
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800/30'
                        }`}
                      >
                        <div className="mt-1.5 shrink-0">
                          {notif.type === 'warning' && <span className="flex h-2 w-2 rounded-full bg-amber-500"></span>}
                          {notif.type === 'success' && <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>}
                          {notif.type === 'error' && <span className="flex h-2 w-2 rounded-full bg-red-500"></span>}
                          {notif.type === 'info' && <span className="flex h-2 w-2 rounded-full bg-blue-500"></span>}
                        </div>
                        <div className="flex-1 space-y-0.5">
                          <div className="flex justify-between items-baseline gap-2">
                            <p className={`text-xs font-bold ${notif.unread ? 'text-gray-900 dark:text-white' : 'text-gray-550 dark:text-gray-400'}`}>
                              {notif.title}
                            </p>
                            <span className="text-[9px] text-gray-400 shrink-0 font-medium">{notif.time}</span>
                          </div>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                            {notif.message}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-55 dark:bg-gray-900/50 hover:bg-gray-105 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all shadow-sm cursor-pointer"
        >
          {theme === 'dark' ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
        </button>

        <div className="h-6 w-px bg-gray-250 dark:bg-gray-800"></div>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 text-left hover:opacity-90 transition-opacity cursor-pointer"
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-md shadow-indigo-500/10">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">{user?.firstName} {user?.lastName}</span>
              <span className="text-[10px] text-gray-400 dark:text-gray-505 uppercase tracking-wider font-medium">{user?.role}</span>
            </div>
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-250 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl p-1.5 text-gray-700 dark:text-gray-100 z-55 overflow-hidden"
              >
                <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 mb-1">
                  <p className="text-xs text-gray-400">Connecté en tant que</p>
                  <p className="text-sm font-semibold truncate text-gray-800 dark:text-gray-100">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-indigo-650 dark:text-indigo-400 font-mono mt-0.5 truncate">{user?.matricule}</p>
                </div>

                <div className="space-y-0.5">
                  <Link 
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex w-full items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <User className="h-4 w-4 text-gray-450" />
                    Mon Profil
                  </Link>
                </div>

                <div className="h-px bg-gray-100 dark:bg-gray-800 my-1"></div>

                <button 
                  onClick={() => {
                    setDropdownOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-500 dark:text-red-400 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-300 transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Se déconnecter
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </header>
  );
};

export default Header;
