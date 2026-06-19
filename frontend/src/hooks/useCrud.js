import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export const useCrud = (endpoint) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(endpoint);
      // Backend may return data directly or nested
      setData(Array.isArray(response.data) ? response.data : response.data.content || []);
    } catch (err) {
      console.error(`Error fetching data from ${endpoint}:`, err);
      setError(`Erreur lors de la récupération des données.`);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  const createItem = async (itemData) => {
    try {
      const response = await api.post(endpoint, itemData);
      setData((prev) => [...prev, response.data]);
      return { success: true, data: response.data };
    } catch (err) {
      console.error(`Error creating item at ${endpoint}:`, err);
      return { 
        success: false, 
        error: err.response?.data?.message || "Erreur lors de l'enregistrement de la donnée." 
      };
    }
  };

  const updateItem = async (id, itemData) => {
    try {
      const response = await api.put(`${endpoint}/${id}`, itemData);
      setData((prev) => prev.map((item) => (item.id === id ? response.data : item)));
      return { success: true, data: response.data };
    } catch (err) {
      console.error(`Error updating item at ${endpoint}/${id}:`, err);
      return { 
        success: false, 
        error: err.response?.data?.message || "Erreur lors de la modification de la donnée." 
      };
    }
  };

  const deleteItem = async (id) => {
    try {
      await api.delete(`${endpoint}/${id}`);
      setData((prev) => prev.filter((item) => item.id !== id));
      return { success: true };
    } catch (err) {
      console.error(`Error deleting item at ${endpoint}/${id}:`, err);
      return { 
        success: false, 
        error: err.response?.data?.message || "Erreur lors de la suppression." 
      };
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refresh: fetchData,
    createItem,
    updateItem,
    deleteItem,
  };
};
