import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Edit2, 
  Trash2, 
  ChevronUp, 
  ChevronDown,
  ArrowUpDown,
  Filter
} from 'lucide-react';

const DataTable = ({
  columns,
  data = [],
  onAdd,
  onEdit,
  onDelete,
  isLoading = false,
  searchPlaceholder = "Rechercher...",
  searchFields = [],
  addLabel = "Ajouter",
  title = "",
  description = "",
  deleteLabel = "Supprimer"
}) => {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Reset pagination on search
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Get unique statuses present in data
  const uniqueStatuses = useMemo(() => {
    const statuses = new Set();
    data.forEach(item => {
      if (item.status) {
        statuses.add(item.status);
      }
    });
    return Array.from(statuses);
  }, [data]);

  const getStatusLabel = (status) => {
    switch (status) {
      case 'ACTIVE': return 'Actif';
      case 'MAINTENANCE': return 'Maintenance';
      case 'INACTIVE': return 'Inactif';
      case 'CUT': return 'Coupé';
      case 'SUSPENDED': return 'Suspendu';
      case 'TERMINATED': return 'Résilier (Inactif)';
      default: return status;
    }
  };

  // Sorting handler
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter & Sort Data
  const processedData = useMemo(() => {
    let result = [...data];

    // Filter by status dropdown
    if (statusFilter !== 'ALL') {
      result = result.filter(item => item.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm.trim() !== '') {
      result = result.filter(item => {
        return searchFields.some(field => {
          const value = item[field];
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(searchTerm.toLowerCase());
        });
      });
    }

    // Sort by config
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        // Handle nested fields if any (simple path lookup like obj.sub.field)
        if (sortConfig.key.includes('.')) {
          aVal = sortConfig.key.split('.').reduce((obj, key) => obj?.[key], a);
          bVal = sortConfig.key.split('.').reduce((obj, key) => obj?.[key], b);
        }

        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;

        if (typeof aVal === 'string') {
          return sortConfig.direction === 'asc' 
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        } else {
          return sortConfig.direction === 'asc'
            ? aVal - bVal
            : bVal - aVal;
        }
      });
    }

    return result;
  }, [data, searchTerm, statusFilter, searchFields, sortConfig]);

  // Pagination bounds
  const totalItems = processedData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processedData.slice(start, start + pageSize);
  }, [processedData, currentPage, pageSize]);

  return (
    <div className="w-full bg-white dark:bg-gray-900/40 rounded-2xl border border-gray-200 dark:border-gray-800 backdrop-blur-md overflow-hidden shadow-sm">
      
      {/* Table Action Header */}
      <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gray-50/50 dark:bg-gray-900/20">
        <div>
          {title && <h2 className="text-lg font-bold text-gray-850 dark:text-gray-100">{title}</h2>}
          {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
        </div>
        
        <div className="flex items-center gap-3 self-end md:self-auto">
          {/* Status filter dropdown */}
          {uniqueStatuses.length > 0 && (
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-9.5 rounded-xl bg-gray-100 dark:bg-gray-950 border border-gray-250 dark:border-gray-800 px-3 text-xs text-gray-700 dark:text-gray-200 focus:outline-none focus:border-indigo-500 font-semibold cursor-pointer"
            >
              <option value="ALL">Tous les statuts</option>
              {uniqueStatuses.map(status => (
                <option key={status} value={status}>
                  {getStatusLabel(status)}
                </option>
              ))}
            </select>
          )}

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder={searchPlaceholder}
              className="h-9.5 w-56 sm:w-64 rounded-xl bg-gray-100 dark:bg-gray-950 border border-gray-250 dark:border-gray-800 pl-10 pr-4 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all font-semibold"
            />
          </div>

          {/* Add Data Button */}
          {onAdd && (
            <button
              onClick={onAdd}
              className="flex items-center gap-1.5 h-9.5 px-4 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-550 shadow-md shadow-indigo-650/10 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Plus className="h-4.5 w-4.5" />
              <span>{addLabel}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/40 text-gray-500 dark:text-gray-400 font-bold text-xs uppercase tracking-wider">
              {columns.map((col) => (
                <th 
                  key={col.key} 
                  className={`p-4 select-none ${col.sortable ? 'cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors' : ''}`}
                  onClick={() => col.sortable && requestSort(col.key)}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.header}</span>
                    {col.sortable && (
                      <span className="text-gray-400 dark:text-gray-650">
                        {sortConfig.key === col.key ? (
                          sortConfig.direction === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
                        ) : (
                          <ArrowUpDown className="h-3 w-3 opacity-40 hover:opacity-100" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="p-4 text-right font-bold">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800/60 text-sm text-gray-700 dark:text-gray-300">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="p-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"></div>
                    <span className="text-xs text-gray-550 dark:text-gray-500">Chargement des données...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="p-12 text-center text-gray-450 dark:text-gray-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Filter className="h-10 w-10 text-gray-300 dark:text-gray-700" />
                    <span className="text-sm font-semibold">Aucun enregistrement trouvé</span>
                    <span className="text-xs text-gray-400 dark:text-gray-600">Essayez d'ajuster votre recherche ou d'ajouter une nouvelle entrée.</span>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <tr 
                  key={row.id || rowIndex} 
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/20 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="p-4 align-middle">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="p-4 text-right align-middle">
                      <div className="flex items-center justify-end gap-1.5">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            className="p-1.5 rounded-lg border border-gray-250 dark:border-gray-850 bg-white dark:bg-gray-900/40 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                            title="Modifier"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(row)}
                            className="p-1.5 rounded-lg border border-red-200 dark:border-gray-850 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 dark:text-red-400 hover:text-red-650 dark:hover:text-red-300 transition-colors"
                            title={typeof deleteLabel === 'function' ? deleteLabel(row) : deleteLabel}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalItems > 0 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-gray-550 dark:text-gray-500">
            Affichage de <span className="font-semibold text-gray-800 dark:text-gray-300">{Math.min(totalItems, (currentPage - 1) * pageSize + 1)}</span> à{" "}
            <span className="font-semibold text-gray-800 dark:text-gray-300">{Math.min(totalItems, currentPage * pageSize)}</span> sur{" "}
            <span className="font-semibold text-gray-800 dark:text-gray-300">{totalItems}</span> entrées
          </div>

          <div className="flex items-center gap-4">
            {/* Page Size Selector */}
            <div className="flex items-center gap-1.5 text-xs text-gray-450 dark:text-gray-450">
              <span>Lignes:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white dark:bg-gray-950 border border-gray-250 dark:border-gray-800 rounded-lg px-2 py-1 text-xs text-gray-700 dark:text-gray-200 focus:outline-none focus:border-indigo-500 font-semibold"
              >
                {[5, 10, 20, 50].map(sz => (
                  <option key={sz} value={sz}>{sz}</option>
                ))}
              </select>
            </div>

            {/* Pagination buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-gray-250 dark:border-gray-850 bg-white dark:bg-gray-900/40 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              <div className="text-xs text-gray-500 dark:text-gray-450 font-semibold">
                Page <span className="font-semibold text-gray-800 dark:text-gray-200">{currentPage}</span> sur <span className="font-semibold text-gray-800 dark:text-gray-200">{totalPages}</span>
              </div>

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-gray-250 dark:border-gray-850 bg-white dark:bg-gray-900/40 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
