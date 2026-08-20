import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

type EntityType = 'ypf' | 'blancas' | 'agroservicios' | 'consorcios' | 'extrusoras' | 'localidades' | 'plantas';

interface EntityConfig {
  label: string;
  endpoint: string;
  icon: string;
  nameKey: string;
}

interface User {
  id: number;
  email: string;
  role: string;
  name: string;
}

interface RequestItem {
  id: number;
  status: string;
  company: { name: string; cuit: string; address: string };
  createdAt: string;
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
  
  // Pestañas Principales
  const [activeTab, setActiveTab] = useState<'users' | 'requests' | 'mapa'>('users');
  
  // Usuarios y Solicitudes
  const [users, setUsers] = useState<User[]>([]);
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [newUser, setNewUser] = useState({ email: '', password: '', role: 'ASSISTANT', name: '' });

  // Entidades del Mapa
  const [entityType, setEntityType] = useState<EntityType>('ypf');
  const [items, setItems] = useState<any[]>([]);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const canManageUsers = user?.role === 'ADMIN';
  const canEditMap = user?.role === 'ADMIN' || user?.role === 'EDITOR' || user?.role === 'ASSISTANT';

  useEffect(() => {
    if (user?.role === 'ADMIN') fetchUsers();
    fetchRequests();
    if (canEditMap) fetchItems(entityType);
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (e) { console.error(e); }
  };

  const fetchRequests = async () => {
    try {
      const res = await api.get('/requests');
      setRequests(res.data);
    } catch (e) { console.error(e); }
  };

  const createUser = async () => {
    if (!newUser.email || !newUser.password) return;
    await api.post('/users', newUser);
    fetchUsers();
    setNewUser({ email: '', password: '', role: 'ASSISTANT', name: '' });
  };

  const deleteUser = async (id: number) => {
    if (window.confirm('¿Eliminar usuario?')) {
      await api.delete(`/users/${id}`);
      fetchUsers();
    }
  };

  const approveRequest = async (id: number) => {
    await api.post(`/requests/${id}/approve`);
    fetchRequests();
  };

  const rejectRequest = async (id: number) => {
    const notes = prompt('Motivo del rechazo:');
    if (notes) await api.post(`/requests/${id}/reject`, { notes });
    fetchRequests();
  };

  const fetchItems = async (targetType: EntityType = entityType) => {
    setLoading(true);
    setError(null);
    try {
      const config = ENTITY_CONFIG[targetType];
      const response = await api.get(`/${config.endpoint}`);
      setItems(response.data);
    } catch (err) {
      setError(`Error 404/500 al cargar ${ENTITY_CONFIG[targetType].label}`);
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
    if (!window.confirm('¿Deseas eliminar este registro?')) return;
    setError(null);
    const config = ENTITY_CONFIG[entityType];

    try {
      await api.delete(`/${config.endpoint}/${id}`);
      setSuccess(`🗑️ Registro eliminado`);
      setTimeout(() => setSuccess(null), 3000);
      await fetchItems(entityType);
    } catch (err) {
      setError('Error al eliminar');
    }
  };

  if (!canEditMap) {
    return <div className="p-8 text-white">No tenés permisos para acceder.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6 text-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>

        {/* 1. SOLAPAS PRINCIPALES DEL PANEL */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {canManageUsers && (
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-xl font-semibold transition ${
                activeTab === 'users' ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300'
              }`}
            >
              👥 Usuarios
            </button>
          )}
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-xl font-semibold transition ${
              activeTab === 'requests' ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300'
            }`}
          >
            📋 Solicitudes ({requests.filter((r) => r.status === 'PENDING').length})
          </button>
          <button
            onClick={() => setActiveTab('mapa')}
            className={`px-4 py-2 rounded-xl font-semibold transition ${
              activeTab === 'mapa' ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300'
            }`}
          >
            🗺️ Capas del Mapa
          </button>
        </div>

        {/* PESTAÑA: USUARIOS */}
        {activeTab === 'users' && canManageUsers && (
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 space-y-6">
            <h2 className="text-xl font-bold">Crear Nuevo Usuario</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                placeholder="Nombre"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="p-2 bg-slate-700 border border-slate-600 rounded-xl text-white"
              />
              <input
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="p-2 bg-slate-700 border border-slate-600 rounded-xl text-white"
              />
              <input
                placeholder="Contraseña"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="p-2 bg-slate-700 border border-slate-600 rounded-xl text-white"
              />
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                className="p-2 bg-slate-700 border border-slate-600 rounded-xl text-white"
              >
                <option value="ASSISTANT">👤 Ayudante</option>
                <option value="EDITOR">✏️ Editor</option>
                <option value="ADMIN">🔑 Administrador</option>
              </select>
              <button
                onClick={createUser}
                className="md:col-span-4 bg-indigo-600 hover:bg-indigo-700 p-2 rounded-xl font-semibold"
              >
                ➕ Crear Usuario
              </button>
            </div>

            <h2 className="text-xl font-bold pt-4">Usuarios Existentes</h2>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {users.map((u) => (
                <div key={u.id} className="flex justify-between items-center p-3 bg-slate-700 rounded-xl">
                  <div>
                    <span className="font-semibold">{u.name || u.email}</span>
                    <span className="ml-3 text-xs bg-indigo-600 px-2 py-0.5 rounded">{u.role}</span>
                    <span className="ml-3 text-sm text-slate-400">{u.email}</span>
                  </div>
                  {u.role !== 'ADMIN' && (
                    <button
                      onClick={() => deleteUser(u.id)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg text-sm"
                    >
                      🗑️ Eliminar
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PESTAÑA: SOLICITUDES */}
        {activeTab === 'requests' && (
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <h2 className="text-xl font-bold mb-4">Solicitudes Pendientes</h2>
            {requests.length === 0 ? (
              <p className="text-slate-400">📭 No hay solicitudes pendientes</p>
            ) : (
              <div className="space-y-3">
                {requests.map((r) => (
                  <div key={r.id} className="p-4 bg-slate-700 rounded-xl flex justify-between items-center">
                    <div>
                      <p className="font-bold">{r.company.name}</p>
                      <p className="text-sm text-slate-300">{r.company.address} - CUIT: {r.company.cuit}</p>
                    </div>
                    {r.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <button onClick={() => approveRequest(r.id)} className="bg-green-600 px-3 py-1 rounded-lg text-sm">✅ Aprobar</button>
                        <button onClick={() => rejectRequest(r.id)} className="bg-red-600 px-3 py-1 rounded-lg text-sm">❌ Rechazar</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PESTAÑA: CAPAS DEL MAPA */}
        {activeTab === 'mapa' && (
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 space-y-4">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div className="flex gap-2 overflow-x-auto pb-2">
                {(Object.keys(ENTITY_CONFIG) as EntityType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => handleTypeChange(type)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                      entityType === type ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {ENTITY_CONFIG[type].icon} {ENTITY_CONFIG[type].label}
                  </button>
                ))}
              </div>

              {!isCreating && !editingItem && (
                <button
                  onClick={() => setIsCreating(true)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold"
                >
                  ➕ Agregar {ENTITY_CONFIG[entityType].label}
                </button>
              )}
            </div>

            {success && <div className="bg-green-900/50 border border-green-700 p-3 rounded-lg text-green-400">{success}</div>}
            {error && <div className="bg-red-900/50 border border-red-700 p-3 rounded-lg text-red-400">{error}</div>}

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
// COMPONENTE TABLA GENÉRICA CON BUSCADOR Y FILTRO DE DEPARTAMENTO
// ============================================
function GenericTable({ items, config, onEdit, onDelete }: any) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deptoFilter, setDeptoFilter] = useState('todos');

  // Extraer lista única de departamentos
  const departamentos: string[] = [
    ...new Set(items.map((i: any) => i.departamento || i.department).filter(Boolean))
  ].sort() as string[];

  const filteredItems = items.filter((item: any) => {
    const name = (item[config.nameKey] || item.nombre || item.name || '').toLowerCase();
    const loc = (item.localidad || '').toLowerCase();
    const matchesSearch = name.includes(searchTerm.toLowerCase()) || loc.includes(searchTerm.toLowerCase());
    const itemDepto = item.departamento || item.department;
    const matchesDepto = deptoFilter === 'todos' || itemDepto === deptoFilter;
    return matchesSearch && matchesDepto;
  });

  return (
    <div>
      {/* 2. BARRA DE BÚSQUEDA Y FILTRO DE DEPARTAMENTO */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="🔍 Buscar por nombre o localidad..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm"
        />
        {departamentos.length > 0 && (
          <select
            value={deptoFilter}
            onChange={(e) => setDeptoFilter(e.target.value)}
            className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm"
          >
            <option value="todos">📍 Todos los departamentos</option>
            {departamentos.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        )}
        <span className="text-sm text-slate-400 self-center">
          {filteredItems.length} registros
        </span>
      </div>

      <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-700 sticky top-0 text-xs text-slate-400">
            <tr>
              <th className="p-3">Nombre</th>
              <th className="p-3">Localidad</th>
              <th className="p-3">Depto</th>
              <th className="p-3">Coordenadas</th>
              <th className="p-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700 text-sm">
            {filteredItems.map((item: any) => (
              <tr key={`${config.endpoint}-${item.id}`} className="hover:bg-slate-700/50">
                <td className="p-3 font-medium">{item[config.nameKey] || item.nombre || item.name || '-'}</td>
                <td className="p-3 text-slate-300">{item.localidad || '-'}</td>
                <td className="p-3 text-slate-300">{item.departamento || item.department || '-'}</td>
                <td className="p-3 font-mono text-slate-400">{item.latitud || item.latitude}, {item.longitud || item.longitude}</td>
                <td className="p-3 text-right space-x-2">
                  <button onClick={() => onEdit(item)} className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-xs">✏️ Editar</button>
                  <button onClick={() => onDelete(item.id)} className="px-2.5 py-1 bg-red-600 hover:bg-red-700 rounded text-xs">🗑️ Borrar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================
// COMPONENTE FORMULARIO CON CAMPOS DINÁMICOS
// ============================================
function GenericForm({ initialData, isCreating, type, onSave, onCancel }: any) {
  const config = ENTITY_CONFIG[type as EntityType];
  const [formData, setFormData] = useState<any>({
    [config.nameKey]: '',
    direccion: '',
    localidad: '',
    departamento: '',
    latitud: -31.4,
    longitud: -64.1,
    tipoNegocio: 'AGROSERVICIO',
    marca: 'INDIVIDUAL',
    ...initialData
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-700 p-6 rounded-xl space-y-4">
      <h3 className="text-lg font-bold">
        {isCreating ? `➕ Agregar ${config.label}` : `✏️ Editando: ${initialData[config.nameKey] || initialData.nombre}`}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs mb-1">Nombre / Razón Social *</label>
          <input
            type="text"
            value={formData[config.nameKey] || ''}
            onChange={(e) => setFormData({ ...formData, [config.nameKey]: e.target.value })}
            className="w-full p-2 bg-slate-600 rounded-lg text-sm text-white"
            required
          />
        </div>
        <div>
          <label className="block text-xs mb-1">Localidad</label>
          <input
            type="text"
            value={formData.localidad || ''}
            onChange={(e) => setFormData({ ...formData, localidad: e.target.value })}
            className="w-full p-2 bg-slate-600 rounded-lg text-sm text-white"
          />
        </div>
        <div>
          <label className="block text-xs mb-1">Departamento</label>
          <input
            type="text"
            value={formData.departamento || ''}
            onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
            className="w-full p-2 bg-slate-600 rounded-lg text-sm text-white"
          />
        </div>

        {/* 4. CAMPOS ADICIONALES PARA AGROSERVICIOS */}
        {type === 'agroservicios' && (
          <>
            <div>
              <label className="block text-xs mb-1">Tipo de Negocio</label>
              <input
                type="text"
                placeholder="AGROSERVICIO"
                value={formData.tipoNegocio || ''}
                onChange={(e) => setFormData({ ...formData, tipoNegocio: e.target.value })}
                className="w-full p-2 bg-slate-600 rounded-lg text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs mb-1">Marca / Bandera</label>
              <input
                type="text"
                placeholder="INDIVIDUAL"
                value={formData.marca || ''}
                onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                className="w-full p-2 bg-slate-600 rounded-lg text-sm text-white"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-xs mb-1">Latitud *</label>
          <input
            type="number"
            step="0.000001"
            value={formData.latitud || formData.latitude || ''}
            onChange={(e) => setFormData({ ...formData, latitud: parseFloat(e.target.value), latitude: parseFloat(e.target.value) })}
            className="w-full p-2 bg-slate-600 rounded-lg text-sm text-white"
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
            className="w-full p-2 bg-slate-600 rounded-lg text-sm text-white"
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