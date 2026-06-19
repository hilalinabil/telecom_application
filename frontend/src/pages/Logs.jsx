import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  User, 
  Search, 
  Activity, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  Clock, 
  Database, 
  UserCheck, 
  AlertCircle,
  FileClock
} from 'lucide-react';

const Logs = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [logs, setLogs] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  // Fetch all users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setUsersLoading(true);
        const res = await api.get('/users');
        setUsers(res.data || []);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger la liste des agents.");
      } finally {
        setUsersLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Fetch logs when a user is selected
  useEffect(() => {
    if (!selectedUser) {
      setLogs([]);
      return;
    }

    const fetchLogs = async () => {
      try {
        setLogsLoading(true);
        const res = await api.get(`/logs/user/matricule/${selectedUser.matricule}`);
        // Sort logs descending by timestamp
        const sortedLogs = (res.data || []).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setLogs(sortedLogs);
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des journaux de cet agent.");
      } finally {
        setLogsLoading(false);
      }
    };
    fetchLogs();
  }, [selectedUser]);

  // Filter users list based on search query
  const filteredUsers = users.filter(u => 
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.matricule.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getActionStyles = (action) => {
    switch (action) {
      case 'CREATE':
        return {
          icon: PlusCircle,
          colorClass: 'text-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/30',
          badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25'
        };
      case 'UPDATE':
        return {
          icon: Edit3,
          colorClass: 'text-indigo-500 bg-indigo-500/10 dark:bg-indigo-500/20 border-indigo-500/30',
          badgeClass: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/25'
        };
      case 'DELETE':
        return {
          icon: Trash2,
          colorClass: 'text-rose-500 bg-rose-500/10 dark:bg-rose-500/20 border-rose-500/30',
          badgeClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25'
        };
      default:
        return {
          icon: Activity,
          colorClass: 'text-gray-500 bg-gray-500/10 dark:bg-gray-500/20 border-gray-500/30',
          badgeClass: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/25'
        };
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-[calc(100vh-120px)] flex flex-col">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white uppercase flex items-center gap-2">
            <FileClock className="h-6 w-6 text-indigo-500" />
            Journaux d'activités
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Supervisez les interventions et les modifications d'infrastructures réalisées par chaque technicien.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl border border-red-500/20 bg-red-500/5 text-red-500 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="h-4.5 w-4.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Body */}
      <div className="flex-1 flex gap-6 min-h-0">
        
        {/* Left Side: Users List */}
        <div className="w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex flex-col gap-4 shrink-0 shadow-sm">
          
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-450 dark:text-gray-500" />
            <input 
              type="text"
              placeholder="Rechercher un agent..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-xl bg-gray-50 dark:bg-gray-950 border border-gray-250 dark:border-gray-850 text-xs text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-all font-semibold"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            {usersLoading ? (
              <div className="flex flex-col gap-2 p-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-14 rounded-xl bg-gray-100 dark:bg-gray-950 animate-pulse"></div>
                ))}
              </div>
            ) : filteredUsers.length === 0 ? (
              <p className="text-xs text-center text-gray-400 py-8">Aucun agent trouvé.</p>
            ) : (
              filteredUsers.map((u) => {
                const isSelected = selectedUser?.id === u.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => setSelectedUser(u)}
                    className={`w-full text-left p-3 rounded-xl border flex items-center gap-3 transition-all duration-200 ${
                      isSelected 
                        ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/5 dark:from-indigo-500/20 dark:to-purple-500/10 border-indigo-500/30 text-indigo-900 dark:text-white shadow-inner'
                        : 'bg-white dark:bg-gray-900 border-transparent hover:bg-gray-50 dark:hover:bg-gray-950/50 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-sm shrink-0">
                      {u.firstName?.[0]}{u.lastName?.[0]}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col">
                      <span className="text-xs font-bold truncate">
                        {u.firstName} {u.lastName}
                      </span>
                      <span className="text-[10px] font-mono text-indigo-500 dark:text-indigo-400 mt-0.5 truncate">{u.matricule}</span>
                      <span className="text-[9px] text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-0.5 font-medium">{u.role}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Logs Timeline */}
        <div className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl flex flex-col p-6 min-w-0 shadow-sm overflow-hidden">
          
          {!selectedUser ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-4 border border-indigo-500/25">
                <User className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 uppercase">Aucun agent sélectionné</h3>
              <p className="text-xs text-gray-450 dark:text-gray-500 max-w-xs mt-2">
                Sélectionnez un technicien dans le panneau latéral pour examiner son historique opérationnel.
              </p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-h-0">
              
              {/* Selected User Header */}
              <div className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-800 pb-4 mb-6">
                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-sm shrink-0">
                  {selectedUser.firstName?.[0]}{selectedUser.lastName?.[0]}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400">{selectedUser.matricule}</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                      {selectedUser.role}
                    </span>
                  </div>
                </div>
              </div>

              {/* Logs Content list */}
              <div className="flex-1 overflow-y-auto pr-2">
                {logsLoading ? (
                  <div className="space-y-4 py-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex gap-4 animate-pulse">
                        <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 shrink-0"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-40 bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
                          <div className="h-8 w-full bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : logs.length === 0 ? (
                  <div className="text-center py-16 text-gray-400 flex flex-col items-center justify-center gap-3">
                    <Clock className="h-8 w-8 text-gray-300 dark:text-gray-700" />
                    <p className="text-xs">Aucun journal d'activité enregistré pour cet agent.</p>
                  </div>
                ) : (
                  <div className="relative pl-6 border-l-2 border-gray-150 dark:border-gray-800 ml-3 space-y-6 pb-6">
                    {logs.map((log) => {
                      const styles = getActionStyles(log.action);
                      const Icon = styles.icon;
                      
                      return (
                        <div key={log.id} className="relative">
                          {/* Dot / Icon */}
                          <div className={`absolute -left-[37px] top-0.5 h-8 w-8 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center shadow-md ${styles.colorClass}`}>
                            <Icon className="h-4 w-4" />
                          </div>

                          {/* Log card */}
                          <div className="bg-gray-50/50 dark:bg-gray-950/40 border border-gray-150 dark:border-gray-800/80 rounded-2xl p-4 transition-all hover:bg-gray-50 dark:hover:bg-gray-950/80">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-150 dark:border-gray-800/60 pb-2 mb-2.5">
                              
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${styles.badgeClass}`}>
                                  {log.action}
                                </span>
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-gray-500 dark:text-gray-450 uppercase tracking-wider">
                                  <Database className="h-3.5 w-3.5" />
                                  {log.targetType}
                                </span>
                              </div>

                              <span className="text-[10px] font-mono text-gray-400 dark:text-gray-500 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(log.timestamp).toLocaleString()}
                              </span>

                            </div>

                            <p className="text-xs text-gray-700 dark:text-gray-250 leading-relaxed font-semibold">
                              {log.details}
                            </p>

                            {log.targetId && (
                              <div className="mt-2.5 text-[9px] font-mono text-gray-400 dark:text-gray-500">
                                TARGET ID: {log.targetId}
                              </div>
                            )}

                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default Logs;
