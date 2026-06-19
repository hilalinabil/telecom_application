import { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../services/api';

export const useNetworkMap = () => {
  const [nodes, setNodes] = useState({
    datacenters: [],
    repartiteurs: [],
    splitters: [],
    clientBoxes: [],
  });
  const [fibrePaths, setFibrePaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNetworkData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        datacentersRes,
        repartiteursRes,
        splittersRes,
        clientBoxesRes,
        fibrePathsRes
      ] = await Promise.all([
        api.get('/datacenters').catch(() => ({ data: [] })),
        api.get('/repartiteurs').catch(() => ({ data: [] })),
        api.get('/splitters').catch(() => ({ data: [] })),
        api.get('/client-boxes').catch(() => ({ data: [] })),
        api.get('/fibre-paths').catch(() => ({ data: [] }))
      ]);

      setNodes({
        datacenters: Array.isArray(datacentersRes.data) ? datacentersRes.data : datacentersRes.data.content || [],
        repartiteurs: Array.isArray(repartiteursRes.data) ? repartiteursRes.data : repartiteursRes.data.content || [],
        splitters: Array.isArray(splittersRes.data) ? splittersRes.data : splittersRes.data.content || [],
        clientBoxes: Array.isArray(clientBoxesRes.data) ? clientBoxesRes.data : clientBoxesRes.data.content || [],
      });

      setFibrePaths(Array.isArray(fibrePathsRes.data) ? fibrePathsRes.data : fibrePathsRes.data.content || []);
    } catch (err) {
      console.error('Error fetching network map data:', err);
      setError('Erreur lors du chargement des données géographiques du réseau.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Update status of any node in local state and API
  const updateNodeStatus = async (type, id, newStatus) => {
    let endpoint = '';
    switch (type.toLowerCase()) {
      case 'datacenter':
        endpoint = '/datacenters';
        break;
      case 'repartiteur':
      case 'olt':
        endpoint = '/repartiteurs';
        break;
      case 'splitter':
        endpoint = '/splitters';
        break;
      case 'clientbox':
      case 'client_box':
      case 'boiteclient':
      case 'boite_client':
        endpoint = '/client-boxes';
        break;
      default:
        return { success: false, error: 'Type d\'équipement inconnu' };
    }

    try {
      // First get current item to update its status while keeping other fields
      const currentItemRes = await api.get(`${endpoint}/${id}`);
      const updatedItem = { ...currentItemRes.data, status: newStatus };
      
      const response = await api.put(`${endpoint}/${id}`, updatedItem);
      
      // Update local state
      setNodes((prev) => {
        const key = type.toLowerCase() === 'olt' ? 'repartiteurs' : 
                    type.toLowerCase() === 'clientbox' || type.toLowerCase() === 'boiteclient' || type.toLowerCase() === 'client_box' ? 'clientBoxes' : 
                    `${type.toLowerCase()}s`;
        
        return {
          ...prev,
          [key]: prev[key].map((item) => (item.id === id ? response.data : item)),
        };
      });

      return { success: true, data: response.data };
    } catch (err) {
      console.error('Error updating node status:', err);
      return { 
        success: false, 
        error: err.response?.data?.message || 'Erreur lors de la mise à jour du statut.' 
      };
    }
  };

  // Update status of a fiber path
  const updatePathStatus = async (id, newStatus) => {
    try {
      const currentItemRes = await api.get(`/fibre-paths/${id}`);
      const updatedItem = { ...currentItemRes.data, status: newStatus };
      const response = await api.put(`/fibre-paths/${id}`, updatedItem);
      
      setFibrePaths((prev) => prev.map((path) => (path.id === id ? response.data : path)));
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Error updating path status:', err);
      return { 
        success: false, 
        error: err.response?.data?.message || 'Erreur lors de la mise à jour du chemin de fibre.' 
      };
    }
  };

  // Create a fast coordinate lookup table: key is `TYPE_ID`, value is `[latitude, longitude]`
  const coordinateLookup = useMemo(() => {
    const lookup = {};
    
    nodes.datacenters.forEach(d => {
      if (d.latitude && d.longitude) lookup[`DATACENTER_${d.id}`] = [d.latitude, d.longitude];
    });
    nodes.repartiteurs.forEach(r => {
      if (r.latitude && r.longitude) lookup[`REPARTITEUR_${r.id}`] = [r.latitude, r.longitude];
    });
    nodes.splitters.forEach(s => {
      if (s.latitude && s.longitude) lookup[`SPLITTER_${s.id}`] = [s.latitude, s.longitude];
    });
    nodes.clientBoxes.forEach(c => {
      if (c.latitude && c.longitude) lookup[`CLIENT_BOX_${c.id}`] = [c.latitude, c.longitude];
    });

    return lookup;
  }, [nodes]);

  // Combine fiber paths with coordinates
  const pathsWithCoords = useMemo(() => {
    return fibrePaths.map(path => {
      const sourceKey = `${path.sourceType}_${path.sourceId}`;
      const destKey = `${path.destinationType}_${path.destinationId}`;
      const sourceCoords = coordinateLookup[sourceKey];
      const destCoords = coordinateLookup[destKey];

      return {
        ...path,
        sourceCoords,
        destCoords,
        isValid: !!(sourceCoords && destCoords)
      };
    }).filter(path => path.isValid);
  }, [fibrePaths, coordinateLookup]);

  useEffect(() => {
    fetchNetworkData();
  }, [fetchNetworkData]);

  return {
    nodes,
    fibrePaths: pathsWithCoords,
    loading,
    error,
    refresh: fetchNetworkData,
    updateNodeStatus,
    updatePathStatus
  };
};
