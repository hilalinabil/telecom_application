import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Map, 
  Database, 
  Server, 
  Network, 
  GitMerge, 
  Inbox, 
  Users, 
  ChevronLeft, 
  Activity,
  LogOut,
  UserCheck,
  UserCog,
  FileClock,
  GitCommit
} from 'lucide-react';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/',
      icon: LayoutDashboard,
      roles: ['SUPER_ADMIN', 'ADMIN', 'TECHNICIAN']
    },
    {
      title: 'Carte Réseau',
      path: '/map',
      icon: Map,
      roles: ['SUPER_ADMIN', 'ADMIN', 'TECHNICIAN']
    },
    {
      title: 'Datacenters',
      path: '/datacenters',
      icon: Database,
      roles: ['SUPER_ADMIN', 'ADMIN', 'TECHNICIAN']
    },
    {
      title: 'Répartiteurs (OLT)',
      path: '/repartiteurs',
      icon: Server,
      roles: ['SUPER_ADMIN', 'ADMIN', 'TECHNICIAN']
    },
    {
      title: 'Splitters',
      path: '/splitters',
      icon: GitMerge,
      roles: ['SUPER_ADMIN', 'ADMIN', 'TECHNICIAN']
    },
    {
      title: 'Boîtes Clients',
      path: '/client-boxes',
      icon: Inbox,
      roles: ['SUPER_ADMIN', 'ADMIN', 'TECHNICIAN']
    },
    {
      title: 'Clients',
      path: '/clients',
      icon: Users,
      roles: ['SUPER_ADMIN', 'ADMIN', 'TECHNICIAN']
    },
    {
      title: 'Équipements',
      path: '/equipements',
      icon: Network,
      roles: ['SUPER_ADMIN', 'ADMIN', 'TECHNICIAN']
    },
    {
      title: 'Liaisons Fibre',
      path: '/fibre-paths',
      icon: GitCommit,
      roles: ['SUPER_ADMIN', 'ADMIN', 'TECHNICIAN']
    },
    {
      title: 'Agents & Techniciens',
      path: '/users',
      icon: UserCog,
      roles: ['SUPER_ADMIN', 'ADMIN']
    },
    {
      title: 'Journaux d\'activités',
      path: '/logs',
      icon: FileClock,
      roles: ['SUPER_ADMIN', 'ADMIN']
    }
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(user?.role));

  return (
    <motion.div
      animate={{ width: isCollapsed ? '76px' : '260px' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative flex flex-col h-screen bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-100 shrink-0 z-30"
    >
      {/* Header / Brand */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-2 font-bold text-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent truncate"
            >
              <Activity className="h-6 w-6 text-indigo-500 dark:text-indigo-400 shrink-0" />
              <span className="font-extrabold tracking-tight">FIBRE RÉSEAU</span>
            </motion.div>
          )}
        </AnimatePresence>

        {isCollapsed && (
          <div className="flex items-center justify-center w-full">
            <Activity className="h-6 w-6 text-indigo-500 dark:text-indigo-400" />
          </div>
        )}

        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-5 p-1 rounded-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors shadow-sm"
        >
          <ChevronLeft className={`h-4 w-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* User Info Preview */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800/60 bg-gray-50/50 dark:bg-gray-900/30 flex items-center gap-3 overflow-hidden">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shrink-0 shadow-md shadow-indigo-500/10">
          {user?.firstName?.[0]}{user?.lastName?.[0]}
        </div>
        {!isCollapsed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col truncate"
          >
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 truncate">{user?.firstName} {user?.lastName}</span>
            <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1">
              <UserCheck className="h-3 w-3" />
              {user?.role}
            </span>
          </motion.div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                isActive 
                  ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/5 dark:from-indigo-500/20 dark:to-purple-500/10 border border-indigo-500/20 dark:border-indigo-500/30 text-indigo-600 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white border border-transparent'
              }`}
            >
              <Icon className={`h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-105 ${isActive ? 'text-indigo-500 dark:text-indigo-400' : 'text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200'}`} />
              {!isCollapsed && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="truncate"
                >
                  {item.title}
                </motion.span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer logout */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-sm font-semibold text-red-500 dark:text-red-400 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-300 transition-all duration-200 group border border-transparent hover:border-red-500/20"
        >
          <LogOut className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5" />
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Se déconnecter
            </motion.span>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
