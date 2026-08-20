import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

type EntityType = 'ypf' | 'blancas' | 'agroservicios' | 'consorcios' | 'extrusoras' | 'localidades' | 'plantas';

interface EntityConfig {
  label: string;
  endpoint: string;
  icon: string;
  nameKey: string; // Campo principal para el título/nombre
}

const ENTITY_CONFIG: Record<EntityType, EntityConfig> = {
  ypf: { label: 'YPF', endpoint: 'ypf', icon: '🔵', nameKey: 'nombre' },
  blancas: { label: 'Bandera Blanca', endpoint: 'estaciones-blancas', icon: '⚪', nameKey: 'nombre' },
  agroservicios: { label: 'Agroservicios', endpoint: 'agroservicios', icon: '🌾', nameKey: 'nombre' },
  consorcios: { label: 'Consorcios Camineros', endpoint: 'consorcios-camineros', icon: '🚜', nameKey: 'nombre' },
  extrusoras: { label: 'Extrusoras de Soja', endpoint: 'extrusoras-soja', icon: '🌱', nameKey: 'razonSocial' },
  localidades: { label: 'Localidades', endpoint: 'localidades', icon: '🏙️', nameKey: 'nombre' },
  plantas: { label: 'Plantas', endpoint: 'companies', icon: '🏭', nameKey: 'name' },
};

export default function AdminPanel() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'requests' | 'mapa'>('mapa');

  // Estados para entidades del mapa
  const [entityType, setEntityType] = useState<EntityType>('ypf');
  const [items, setItems] = useState<any[]>([]);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const canEdit = user?.role === 'ADMIN' || user?.role === 'EDITOR' || user?.role === 'ASSISTANT';

  useEffect(() => {
    if (activeTab === 'mapa' && canEdit) {
      fetchItems(entityType);
    }
  }, [activeTab]);

  const fetchItems = async (targetType: EntityType = entityType) => {
    setLoading(true);
    setError(null);
    try {
      const config = ENTITY_CONFIG[targetType];
      const response = await api.get(`/${config.endpoint}`);
      setItems(response.data);
    } catch (err) {
      setError(`Error al cargar ${ENTITY_CONFIG[targetType].label}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (type: EntityType) => {
    setItems([]);
    setEntityType(type);
    setEditingItem(null);
    setIsCreating(false);
    fetchItems(type);
  };

  const handleSave = async (data: any) => {
    setError(null);
    setSuccess(null);
    const config = ENTITY_CONFIG[entityType];

    try {
      if (isCreating) {
        await api.post(`/${config.endpoint}`, data);
        setSuccess(`✅ ${config.label} creada correctamente`);
      } else {
        await api.put(`/${config.endpoint}/${data.id}`, data);
        setSuccess(`✅ ${config.label} actualizada correctamente`);
      }
      
      setTimeout(() => setSuccess(null), 3000);
      await fetchItems(entityType);
      setEditingItem(null);
      setIsCreating(false);
    } catch (err) {
      setError('Error al guardar los cambios');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este registro?')) return;
    setError(null);
    const config = ENTITY_CONFIG[entityType];

    try {
      await api.delete(`/${config.endpoint}/${id}`);
      setSuccess(`🗑️ Registro eliminado correctamente`);
      setTimeout(() => setSuccess(null), 3000);
      await fetchItems(entityType);
    } catch (err) {
      setError('Error al eliminar el registro');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Selector de sub-categorías del mapa */}
        {activeTab === 'mapa' && canEdit && (
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <div className="flex gap-2 overflow-x-auto pb-2 max-w-full">
                {(Object.keys(ENTITY_CONFIG) as EntityType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => handleTypeChange(type)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                      entityType === type
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {ENTITY_CONFIG[type].icon} {ENTITY_CONFIG[type].label}
                  </button>
                ))}
              </div>

              {!isCreating && !editingItem && (
                <button
                  onClick={() => setIsCreating(true)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition text-sm font-semibold"
                >
                  ➕ Agregar {ENTITY_CONFIG[entityType].label}
                </button>
              )}
            </div>

            {/* Mensajes de Alerta */}
            {success && <div className="bg-green-900/50 border border-green-700 p-3 rounded-lg mb-4 text-green-400">{success}</div>}
            {error && <div className="bg-red-900/50 border border-red-700 p-3 rounded-lg mb-4 text-red-400">{error}</div>}

            {/* Renderizado de Vistas */}
            {loading ? (
              <div className="text-center py-12">Cargando datos...</div>
            ) : isCreating || editingItem ? (
              <GenericForm
                initialData={editingItem || {}}
                isCreating={isCreating}
                type={entityType}
                onSave={handleSave}
                onCancel={() => { setEditingItem(null); setIsCreating(false); }}
              />
            ) : (
              <GenericTable
                items={items}
                config={ENTITY_CONFIG[entityType]}
                onEdit={setEditingItem}
                onDelete={handleDelete}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// COMPONENTE TABLA GENÉRICA CON BOTÓN BORRAR
// ============================================
function GenericTable({ items, config, onEdit, onDelete }: any) {
  return (
    <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-700 sticky top-0">
          <tr>
            <th className="p-3 text-xs text-slate-400">Nombre / Razón Social</th>
            <th className="p-3 text-xs text-slate-400">Localidad</th>
            <th className="p-3 text-xs text-slate-400">Coordenadas</th>
            <th className="p-3 text-xs text-slate-400 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700">
          {items.map((item: any) => (
            <tr key={`${config.endpoint}-${item.id}`} className="hover:bg-slate-700/50">
              <td className="p-3 text-sm font-medium">{item[config.nameKey] || item.nombre || item.name || '-'}</td>
              <td className="p-3 text-sm text-slate-300">{item.localidad || item.departamento || '-'}</td>
              <td className="p-3 text-sm font-mono text-slate-400">{item.latitud || item.latitude}, {item.longitud || item.longitude}</td>
              <td className="p-3 text-sm text-right space-x-2">
                <button onClick={() => onEdit(item)} className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs">✏️ Editar</button>
                <button onClick={() => onDelete(item.id)} className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs">🗑️ Borrar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================
// COMPONENTE FORMULARIO GENÉRICO (CREAR/EDITAR)
// ============================================
function GenericForm({ initialData, isCreating, type, onSave, onCancel }: any) {
  const config = ENTITY_CONFIG[type as EntityType];
  const [formData, setFormData] = useState<any>({
    [config.nameKey]: '',
    direccion: '',
    localidad: '',
    latitud: -31.4,
    longitud: -64.1,
    ...initialData
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-700 p-6 rounded-xl space-y-4">
      <h3 className="text-lg font-bold">
        {isCreating ? `➕ Agregar ${config.label}` : `✏️ Editando: ${initialData[config.nameKey]}`}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs mb-1">Nombre / Razón Social *</label>
          <input
            type="text"
            value={formData[config.nameKey] || ''}
            onChange={(e) => setFormData({ ...formData, [config.nameKey]: e.target.value })}
            className="w-full p-2 bg-slate-600 rounded-lg text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-xs mb-1">Localidad</label>
          <input
            type="text"
            value={formData.localidad || ''}
            onChange={(e) => setFormData({ ...formData, localidad: e.target.value })}
            className="w-full p-2 bg-slate-600 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="block text-xs mb-1">Latitud *</label>
          <input
            type="number"
            step="0.000001"
            value={formData.latitud || formData.latitude || ''}
            onChange={(e) => setFormData({ ...formData, latitud: parseFloat(e.target.value), latitude: parseFloat(e.target.value) })}
            className="w-full p-2 bg-slate-600 rounded-lg text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-xs mb-1">Longitud *</label>
          <input
            type="number"
            step="0.000001"
            value={formData.longitud || formData.longitude || ''}
            onChange={(e) => setFormData({ ...formData, longitud: parseFloat(e.target.value), longitude: parseFloat(e.target.value) })}
            className="w-full p-2 bg-slate-600 rounded-lg text-sm"
            required
          />
        </div>
      </div>
      <div className="flex gap-2 pt-4">
        <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-semibold text-sm">💾 Guardar</button>
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-xl font-semibold text-sm">❌ Cancelar</button>
      </div>
    </form>
  );
}