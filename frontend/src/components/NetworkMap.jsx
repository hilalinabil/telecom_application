import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  Database, 
  Server, 
  GitMerge, 
  Inbox, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Info,
  Layers
} from 'lucide-react';

// Create glowing SVG Leaflet DivIcons
const createCustomIcon = (type, status) => {
  let color = '#10b981'; // Active - Green
  if (status === 'INACTIVE') color = '#6b7280'; // Inactive - Grey
  if (status === 'MAINTENANCE') color = '#f97316'; // Maintenance - Orange
  if (status === 'CUT') color = '#ef4444'; // Cut/Broken - Red

  let svgContent = '';
  
  if (type === 'DATACENTER') {
    svgContent = `
      <div class="relative flex items-center justify-center w-8 h-8 rounded-full border border-gray-800 bg-gray-950 shadow-lg shadow-black/80 transition-all duration-300 hover:scale-125">
        <div class="absolute inset-0 rounded-full opacity-25 animate-ping" style="background-color: ${color}"></div>
        <div class="absolute -inset-1 rounded-full opacity-20" style="background-color: ${color}"></div>
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/>
          <rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
          <line x1="6" y1="6" x2="6.01" y2="6"/>
          <line x1="6" y1="18" x2="6.01" y2="18"/>
        </svg>
      </div>
    `;
  } else if (type === 'REPARTITEUR') {
    svgContent = `
      <div class="relative flex items-center justify-center w-8 h-8 rounded-lg border border-gray-800 bg-gray-950 shadow-lg shadow-black/80 transition-all duration-300 hover:scale-125">
        <div class="absolute -inset-0.5 rounded-lg opacity-25" style="background-color: ${color}"></div>
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 10h16M4 14h16M4 6h16M4 18h16"/>
        </svg>
      </div>
    `;
  } else if (type === 'SPLITTER') {
    svgContent = `
      <div class="relative flex items-center justify-center w-7 h-7 rounded-md border border-gray-800 bg-gray-950 shadow-lg shadow-black/80 transition-all duration-300 hover:scale-125">
        <div class="absolute -inset-0.5 rounded-md opacity-20" style="background-color: ${color}"></div>
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
      </div>
    `;
  } else if (type === 'CLIENT_BOX') {
    svgContent = `
      <div class="relative flex items-center justify-center w-7 h-7 rounded-xl border border-gray-800 bg-gray-950 shadow-lg shadow-black/80 transition-all duration-300 hover:scale-125">
        <div class="absolute -inset-0.5 rounded-xl opacity-20" style="background-color: ${color}"></div>
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      </div>
    `;
  }

  return L.divIcon({
    html: svgContent,
    className: 'custom-div-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
};

// Helper component to center and fit bounds dynamically
const ChangeView = ({ bounds, defaultCenter }) => {
  const map = useMap();
  React.useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    } else if (defaultCenter) {
      map.setView(defaultCenter, 12);
    }
  }, [bounds, defaultCenter, map]);
  return null;
};

const getPathColor = (status) => {
  switch (status) {
    case 'ACTIVE': return '#10b981'; // Green
    case 'MAINTENANCE': return '#f97316'; // Orange
    case 'CUT': return '#ef4444'; // Red
    case 'INACTIVE': return '#6b7280'; // Grey
    default: return '#6b7280';
  }
};

const NetworkMap = ({
  nodes,
  fibrePaths,
  onUpdateNodeStatus,
  onUpdatePathStatus
}) => {
  const { user } = useAuth();
  const [selectedElement, setSelectedElement] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const canEdit = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN' || user?.role === 'TECHNICIAN';

  // Handle marker selection
  const handleSelectNode = (type, node) => {
    setSelectedElement({
      elementType: 'node',
      type,
      id: node.id,
      name: node.name,
      status: node.status,
      details: node,
      // Compute ports usage metrics
      totalPorts: node.nbPorts || node.totalPorts || node.capacity || node.nbOutputs || 0,
      usedPorts: node.usedPorts || node.usedCapacity || node.usedOutputs || 0,
      availablePorts: node.availablePorts || (node.capacity - node.usedCapacity) || node.availableOutputs || 0
    });
  };

  // Handle polyline selection
  const handleSelectPath = (path) => {
    setSelectedElement({
      elementType: 'path',
      id: path.id,
      name: path.cableReference || `Chemin Fibre #${path.id.substring(0, 8)}`,
      status: path.status,
      details: path,
      totalPorts: path.coreCount || 0,
      usedPorts: path.usedCores || 0,
      availablePorts: path.availableCores || 0
    });
  };

  // Handle Status Update Action
  const handleStatusChange = async (newStatus) => {
    if (!selectedElement) return;
    setIsUpdatingStatus(true);

    let res;
    if (selectedElement.elementType === 'node') {
      res = await onUpdateNodeStatus(selectedElement.type, selectedElement.id, newStatus);
    } else {
      res = await onUpdatePathStatus(selectedElement.id, newStatus);
    }

    setIsUpdatingStatus(false);
    if (res.success) {
      setSelectedElement(prev => ({
        ...prev,
        status: newStatus,
        details: { ...prev.details, status: newStatus }
      }));
    } else {
      alert(res.error || "Une erreur est survenue lors de la mise à jour.");
    }
  };

  // Center position for default mapping (somewhere central to the installation, default: Paris/Casablanca coordinate area depending on seed data)
  const defaultCenter = [48.8566, 2.3522]; // Paris default

  // Calculate dynamic center if nodes are loaded
  const dynamicCenter = React.useMemo(() => {
    const all = [
      ...nodes.datacenters,
      ...nodes.repartiteurs,
      ...nodes.splitters,
      ...nodes.clientBoxes
    ];
    if (all.length > 0) {
      const avgLat = all.reduce((sum, n) => sum + (n.latitude || 0), 0) / all.length;
      const avgLng = all.reduce((sum, n) => sum + (n.longitude || 0), 0) / all.length;
      return [avgLat, avgLng];
    }
    return defaultCenter;
  }, [nodes]);

  // Calculate bounding box for loaded markers to auto-zoom/center
  const bounds = React.useMemo(() => {
    const all = [
      ...nodes.datacenters,
      ...nodes.repartiteurs,
      ...nodes.splitters,
      ...nodes.clientBoxes
    ];
    const latLngs = all
      .filter(n => n.latitude && n.longitude)
      .map(n => L.latLng(n.latitude, n.longitude));
    if (latLngs.length > 0) {
      return L.latLngBounds(latLngs);
    }
    return null;
  }, [nodes]);

  return (
    <div className="relative w-full h-[calc(100vh-8.5rem)] rounded-2xl overflow-hidden border border-gray-800 shadow-2xl flex">
      
      {/* Leaflet Map */}
      <div className="flex-1 h-full z-10">
        <MapContainer 
          center={dynamicCenter} 
          zoom={12} 
          scrollWheelZoom={true} 
          className="w-full h-full"
        >
          {/* Using dark theme tile layers */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          <ChangeView bounds={bounds} defaultCenter={dynamicCenter} />

          {/* Render Datacenters */}
          {nodes.datacenters.map((dc) => (
            dc.latitude && dc.longitude && (
              <Marker
                key={dc.id}
                position={[dc.latitude, dc.longitude]}
                icon={createCustomIcon('DATACENTER', dc.status)}
                eventHandlers={{
                  click: () => handleSelectNode('DATACENTER', dc)
                }}
              />
            )
          ))}

          {/* Render Repartiteurs */}
          {nodes.repartiteurs.map((rep) => (
            rep.latitude && rep.longitude && (
              <Marker
                key={rep.id}
                position={[rep.latitude, rep.longitude]}
                icon={createCustomIcon('REPARTITEUR', rep.status)}
                eventHandlers={{
                  click: () => handleSelectNode('REPARTITEUR', rep)
                }}
              />
            )
          ))}

          {/* Render Splitters */}
          {nodes.splitters.map((split) => (
            split.latitude && split.longitude && (
              <Marker
                key={split.id}
                position={[split.latitude, split.longitude]}
                icon={createCustomIcon('SPLITTER', split.status)}
                eventHandlers={{
                  click: () => handleSelectNode('SPLITTER', split)
                }}
              />
            )
          ))}

          {/* Render Client Boxes */}
          {nodes.clientBoxes.map((cb) => (
            cb.latitude && cb.longitude && (
              <Marker
                key={cb.id}
                position={[cb.latitude, cb.longitude]}
                icon={createCustomIcon('CLIENT_BOX', cb.status)}
                eventHandlers={{
                  click: () => handleSelectNode('CLIENT_BOX', cb)
                }}
              />
            )
          ))}

          {/* Render Polylines (Fibre Paths) */}
          {fibrePaths.map((path) => (
            <Polyline
              key={path.id}
              positions={[path.sourceCoords, path.destCoords]}
              color={getPathColor(path.status)}
              weight={4}
              opacity={0.85}
              dashArray={path.status === 'MAINTENANCE' ? "8, 8" : undefined}
              eventHandlers={{
                click: () => handleSelectPath(path),
                mouseover: (e) => {
                  e.target.setStyle({ weight: 6, opacity: 1.0 });
                },
                mouseout: (e) => {
                  e.target.setStyle({ weight: 4, opacity: 0.85 });
                }
              }}
            />
          ))}
        </MapContainer>
      </div>

      {/* Floating Map Legend */}
      <div className="absolute bottom-4 left-4 z-20 bg-gray-950/95 border border-gray-800 rounded-xl p-3.5 backdrop-blur-md text-xs shadow-xl space-y-2">
        <h4 className="font-semibold text-gray-200 flex items-center gap-1.5 border-b border-gray-800 pb-1.5">
          <Layers className="h-3.5 w-3.5 text-indigo-400" /> Légende Réseau
        </h4>
        <div className="space-y-1 text-gray-400 font-medium">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500 inline-block"></span>
            <span>Actif (Opérationnel)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500/20 border border-orange-500 inline-block"></span>
            <span>En Maintenance</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500 inline-block"></span>
            <span>Fibre Coupée / Incident</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gray-600/20 border border-gray-500 inline-block"></span>
            <span>Inactif</span>
          </div>
        </div>
      </div>

      {/* Side Slide-out Drawer Panel */}
      <div 
        className={`absolute top-0 right-0 h-full w-96 z-25 bg-gray-950/95 border-l border-gray-800 backdrop-blur-lg shadow-2xl transition-transform duration-300 transform flex flex-col p-6 text-gray-200 ${
          selectedElement ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {selectedElement && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-5">
              <div className="flex items-center gap-2">
                {selectedElement.elementType === 'node' ? (
                  selectedElement.type === 'DATACENTER' ? <Database className="h-5 w-5 text-indigo-400" /> :
                  selectedElement.type === 'REPARTITEUR' ? <Server className="h-5 w-5 text-purple-400" /> :
                  selectedElement.type === 'SPLITTER' ? <GitMerge className="h-5 w-5 text-pink-400" /> :
                  <Inbox className="h-5 w-5 text-sky-400" />
                ) : (
                  <Zap className="h-5 w-5 text-amber-400" />
                )}
                <div>
                  <h3 className="font-bold text-sm tracking-tight text-white uppercase">{selectedElement.type || 'FIBRE'}</h3>
                  <span className="text-[10px] text-gray-500 font-mono">ID: {selectedElement.id.substring(0, 12)}...</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedElement(null)}
                className="p-1 rounded-lg border border-gray-800 bg-gray-900/60 hover:bg-gray-800 hover:text-white transition-colors"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Core Info */}
            <div className="flex-1 overflow-y-auto space-y-5 pr-1">
              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Nom de l'élément</label>
                <p className="text-base font-bold text-white mt-0.5">{selectedElement.name}</p>
              </div>

              {/* Status Pill */}
              <div>
                <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Statut Actuel</label>
                <div className="mt-1.5 flex">
                  {selectedElement.status === 'ACTIVE' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Actif
                    </span>
                  )}
                  {selectedElement.status === 'MAINTENANCE' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/25">
                      <AlertTriangle className="h-3.5 w-3.5" /> En Maintenance
                    </span>
                  )}
                  {selectedElement.status === 'CUT' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/25">
                      <XCircle className="h-3.5 w-3.5" /> Fibre Coupée
                    </span>
                  )}
                  {selectedElement.status === 'INACTIVE' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-500/10 text-gray-400 border border-gray-500/25">
                      <Info className="h-3.5 w-3.5" /> Inactif
                    </span>
                  )}
                </div>
              </div>

              {/* Port or Core Capacity Metrics */}
              {selectedElement.totalPorts > 0 && (
                <div className="bg-gray-900/60 rounded-xl border border-gray-800/80 p-4 space-y-3.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-gray-300">
                    <span>Occupation des ports/cœurs</span>
                    <span>
                      {selectedElement.usedPorts} / {selectedElement.totalPorts}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 w-full bg-gray-950 rounded-full overflow-hidden border border-gray-800">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${(selectedElement.usedPorts / selectedElement.totalPorts) * 100}%` }}
                    ></div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-gray-500 font-medium">Utilisé:</span>
                      <p className="font-bold text-gray-200 text-sm mt-0.5">{selectedElement.usedPorts}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 font-medium">Disponible:</span>
                      <p className="font-bold text-indigo-400 text-sm mt-0.5">{selectedElement.availablePorts}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Geo Coordinates */}
              {selectedElement.elementType === 'node' && (
                <div className="grid grid-cols-2 gap-4 bg-gray-900/30 rounded-xl p-3 border border-gray-900 text-xs text-gray-400">
                  <div>
                    <span className="text-gray-500">Latitude</span>
                    <p className="font-mono mt-0.5 text-gray-300">{selectedElement.details.latitude?.toFixed(6)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Longitude</span>
                    <p className="font-mono mt-0.5 text-gray-300">{selectedElement.details.longitude?.toFixed(6)}</p>
                  </div>
                </div>
              )}

              {/* Specific details */}
              <div className="space-y-3 bg-gray-900/30 rounded-xl p-4 border border-gray-900/60 text-xs">
                <h4 className="font-bold text-gray-300 border-b border-gray-800 pb-1.5">Caractéristiques</h4>
                
                {selectedElement.type === 'DATACENTER' && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between"><span className="text-gray-500">Adresse:</span> <span className="text-gray-200 font-semibold">{selectedElement.details.location}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Description:</span> <span className="text-gray-200">{selectedElement.details.description || 'N/A'}</span></div>
                  </div>
                )}

                {selectedElement.type === 'REPARTITEUR' && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between"><span className="text-gray-500">IP Adresse:</span> <span className="text-gray-200 font-mono">{selectedElement.details.ipAddress || 'N/A'}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Zone de couverture:</span> <span className="text-gray-200">{selectedElement.details.zone || 'N/A'}</span></div>
                  </div>
                )}

                {selectedElement.type === 'SPLITTER' && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between"><span className="text-gray-500">Ratio de split:</span> <span className="text-gray-200 font-semibold">{selectedElement.details.ratio}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Répartiteur source:</span> <span className="text-indigo-400 font-mono text-[10px]">{selectedElement.details.repartiteurId}</span></div>
                  </div>
                )}

                {selectedElement.type === 'CLIENT_BOX' && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between"><span className="text-gray-500">Type de boitier:</span> <span className="text-gray-200 font-semibold">{selectedElement.details.type}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Splitter parent:</span> <span className="text-indigo-400 font-mono text-[10px]">{selectedElement.details.splitterId}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Zone de service:</span> <span className="text-gray-200">{selectedElement.details.zone}</span></div>
                  </div>
                )}

                {selectedElement.elementType === 'path' && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between"><span className="text-gray-500">Type de fibre:</span> <span className="text-gray-200">{selectedElement.details.fibreType}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Longueur du câble:</span> <span className="text-gray-200 font-semibold">{selectedElement.details.lengthMeters?.toFixed(1)} mètres</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Source:</span> <span className="text-gray-300 font-medium">{selectedElement.details.sourceType}</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Destination:</span> <span className="text-gray-300 font-medium">{selectedElement.details.destinationType}</span></div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Bar (Update Status) */}
            {canEdit && (
              <div className="border-t border-gray-800 pt-5 mt-5">
                <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Changer le statut</label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button 
                    disabled={isUpdatingStatus || selectedElement.status === 'ACTIVE'}
                    onClick={() => handleStatusChange('ACTIVE')}
                    className="h-9 rounded-xl border border-emerald-500/25 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10 active:scale-[0.98] disabled:opacity-30 disabled:pointer-events-none transition-all text-xs font-semibold"
                  >
                    Actif
                  </button>
                  <button 
                    disabled={isUpdatingStatus || selectedElement.status === 'MAINTENANCE'}
                    onClick={() => handleStatusChange('MAINTENANCE')}
                    className="h-9 rounded-xl border border-orange-500/25 bg-orange-500/5 text-orange-400 hover:bg-orange-500/10 active:scale-[0.98] disabled:opacity-30 disabled:pointer-events-none transition-all text-xs font-semibold"
                  >
                    Maintenance
                  </button>
                  
                  {selectedElement.elementType === 'path' ? (
                    <button 
                      disabled={isUpdatingStatus || selectedElement.status === 'CUT'}
                      onClick={() => handleStatusChange('CUT')}
                      className="h-9 rounded-xl border border-red-500/25 bg-red-500/5 text-red-400 hover:bg-red-500/10 active:scale-[0.98] disabled:opacity-30 disabled:pointer-events-none transition-all text-xs font-semibold col-span-2"
                    >
                      Signaler Coupure (Coupé)
                    </button>
                  ) : (
                    <button 
                      disabled={isUpdatingStatus || selectedElement.status === 'INACTIVE'}
                      onClick={() => handleStatusChange('INACTIVE')}
                      className="h-9 rounded-xl border border-gray-500/25 bg-gray-500/5 text-gray-400 hover:bg-gray-500/10 active:scale-[0.98] disabled:opacity-30 disabled:pointer-events-none transition-all text-xs font-semibold col-span-2"
                    >
                      Inactif
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
};

export default NetworkMap;
