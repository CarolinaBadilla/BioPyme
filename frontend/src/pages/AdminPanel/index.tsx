import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

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

export default function AdminPanel() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'users' | 'requests' | 'mapa'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [newUser, setNewUser] = useState({ email: '', password: '', role: 'ASSISTANT', name: '' });

  // --- ESTADOS DINÁMICOS PARA CAPAS Y PUNTOS ---
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [features, setFeatures] = useState<any[]>([]);

  // Estados para formularios
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#3b82f6');
  const [newCategoryIcon, setNewCategoryIcon] = useState('📍');

  const [editingFeature, setEditingFeature] = useState<any | null>(null);
  const [isCreatingFeature, setIsCreatingFeature] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const canManageUsers = user?.role === 'ADMIN';
  const canEditMap = user?.role === 'ADMIN' || user?.role === 'EDITOR' || user?.role === 'ASSISTANT';

  useEffect(() => {
    if (user?.role === 'ADMIN') fetchUsers();
    fetchRequests();
    if (canEditMap) fetchCategories();
  }, []);

  // --- FUNCIONES DE USUARIOS Y SOLICITUDES ---
  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await api.get('/requests');
      setRequests(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const createUser = async () => {
    if (!newUser.email || !newUser.password) return;
    try {
      await api.post('/users', newUser);
      fetchUsers();
      setNewUser({ email: '', password: '', role: 'ASSISTANT', name: '' });
      setSuccess('✅ Usuario creado correctamente');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Error al crear el usuario');
    }
  };

  const deleteUser = async (id: number) => {
    if (window.confirm('¿Eliminar usuario?')) {
      try {
        await api.delete(`/users/${id}`);
        fetchUsers();
      } catch (err) {
        setError('Error al eliminar usuario');
      }
    }
  };

  const approveRequest = async (id: number) => {
    try {
      await api.post(`/requests/${id}/approve`);
      fetchRequests();
    } catch (err) {
      setError('Error al aprobar solicitud');
    }
  };

  const rejectRequest = async (id: number) => {
    const notes = prompt('Motivo del rechazo:');
    if (notes) {
      try {
        await api.post(`/requests/${id}/reject`, { notes });
        fetchRequests();
      } catch (err) {
        setError('Error al rechazar solicitud');
      }
    }
  };

  // --- FUNCIONES DE CAPAS DINÁMICAS ---
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/map-layers/categories');
      setCategories(res.data);
      if (res.data.length > 0 && !selectedCategory) {
        setSelectedCategory(res.data[0]);
        fetchFeatures(res.data[0].id);
      }
    } catch (err) {
      setError('Error al cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  const fetchFeatures = async (categoryId: number) => {
    setLoading(true);
    try {
      const res = await api.get(`/map-layers/full`);
      const cat = res.data.find((c: any) => c.id === categoryId);
      setFeatures(cat ? cat.features : []);
    } catch (err) {
      setError('Error al cargar los puntos');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCategory = (cat: any) => {
    setSelectedCategory(cat);
    setEditingFeature(null);
    setIsCreatingFeature(false);
    fetchFeatures(cat.id);
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName) return;
    try {
      const slug = newCategoryName.toLowerCase().replace(/ /g, '-').normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const res = await api.post('/map-layers/categories', {
        name: newCategoryName,
        slug,
        color: newCategoryColor,
        icon: newCategoryIcon,
      });
      setSuccess('✅ Categoría creada correctamente');
      setNewCategoryName('');
      setIsCreatingCategory(false);
      await fetchCategories();
      handleSelectCategory(res.data);
    } catch (err) {
      setError('Error al crear la categoría (quizá el nombre ya exista)');
    }
  };

  const handleSaveFeature = async (formData: any) => {
    setError(null);
    try {
      const payload = {
        categoryId: selectedCategory.id,
        name: formData.name,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
        properties: {
          direccion: formData.direccion || '',
          localidad: formData.localidad || '',
          departamento: formData.departamento || '',
        }
      };

      if (isCreatingFeature) {
        await api.post('/map-layers/features', payload);
        setSuccess('✅ Punto agregado correctamente');
      } else {
        await api.put(`/map-layers/features/${editingFeature.id}`, payload);
        setSuccess('✅ Punto actualizado correctamente');
      }
      setTimeout(() => setSuccess(null), 3000);
      setIsCreatingFeature(false);
      setEditingFeature(null);
      fetchFeatures(selectedCategory.id);
    } catch (err) {
      setError('Error al guardar el punto');
    }
  };

  const handleDeleteFeature = async (id: number) => {
    if (!window.confirm('¿Eliminar este punto?')) return;
    try {
      await api.delete(`/map-layers/features/${id}`);
      setSuccess('🗑️ Punto eliminado');
      setTimeout(() => setSuccess(null), 3000);
      fetchFeatures(selectedCategory.id);
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

        {/* PESTAÑA: CAPAS DEL MAPA (DINÁMICAS) */}
        {activeTab === 'mapa' && (
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 space-y-4">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div className="flex gap-2 overflow-x-auto pb-2 items-center">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                      selectedCategory?.id === cat.id ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {cat.icon || '📍'} {cat.name}
                  </button>
                ))}
                <button
                  onClick={() => setIsCreatingCategory(!isCreatingCategory)}
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 rounded-lg text-sm font-medium whitespace-nowrap"
                >
                  ✨ Nueva Capa / Categoría
                </button>
              </div>

              {selectedCategory && !isCreatingFeature && !editingFeature && !isCreatingCategory && (
                <button
                  onClick={() => setIsCreatingFeature(true)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold"
                >
                  ➕ Agregar punto a {selectedCategory.name}
                </button>
              )}
            </div>

            {/* Formulario para crear NUEVA CATEGORÍA de mapa */}
            {isCreatingCategory && (
              <form onSubmit={handleCreateCategory} className="bg-slate-700 p-4 rounded-xl space-y-3 border border-emerald-500">
                <h3 className="text-md font-bold text-emerald-400">✨ Crear una nueva capa para el mapa</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Nombre (ej: Hospitales, Bomberos)"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="p-2 bg-slate-600 rounded-lg text-sm text-white"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Emoji libre (ej: 🏥, ⚡, 🔥)"
                    value={newCategoryIcon}
                    onChange={(e) => setNewCategoryIcon(e.target.value)}
                    className="p-2 bg-slate-600 rounded-lg text-sm text-white text-center text-xl"
                    maxLength={2}
                  />
                  <input
                    type="color"
                    placeholder="Color libre"
                    value={newCategoryColor}
                    onChange={(e) => setNewCategoryColor(e.target.value)}
                    className="p-1 h-10 w-full bg-slate-600 rounded-lg cursor-pointer"
                  />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="px-3 py-1.5 bg-emerald-600 rounded-lg text-xs font-bold">Guardar Categoría</button>
                  <button type="button" onClick={() => setIsCreatingCategory(false)} className="px-3 py-1.5 bg-slate-600 rounded-lg text-xs">Cancelar</button>
                </div>
              </form>
            )}

            {success && <div className="bg-green-900/50 border border-green-700 p-3 rounded-lg text-green-400">{success}</div>}
            {error && <div className="bg-red-900/50 border border-red-700 p-3 rounded-lg text-red-400">{error}</div>}

            {loading ? (
              <div className="text-center py-12">Cargando...</div>
            ) : isCreatingFeature || editingFeature ? (
              <DynamicFeatureForm
                initialData={editingFeature || {}}
                isCreating={isCreatingFeature}
                onSave={handleSaveFeature}
                onCancel={() => { setEditingFeature(null); setIsCreatingFeature(false); }}
              />
            ) : selectedCategory ? (
              <DynamicFeatureTable
                features={features}
                onEdit={setEditingFeature}
                onDelete={handleDeleteFeature}
              />
            ) : (
              <div className="text-slate-400 py-8 text-center">Crea una categoría arriba para empezar a cargar puntos.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function DynamicFeatureTable({ features, onEdit, onDelete }: any) {
  return (
    <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-700 sticky top-0 text-xs text-slate-400">
          <tr>
            <th className="p-3">Nombre</th>
            <th className="p-3">Dirección / Localidad</th>
            <th className="p-3">Coordenadas</th>
            <th className="p-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700 text-sm">
          {features.map((item: any) => (
            <tr key={item.id} className="hover:bg-slate-700/50">
              <td className="p-3 font-medium">{item.name}</td>
              <td className="p-3 text-slate-300">{item.properties?.direccion || item.properties?.localidad || '-'}</td>
              <td className="p-3 font-mono text-slate-400">{item.latitude}, {item.longitude}</td>
              <td className="p-3 text-right space-x-2">
                <button onClick={() => onEdit(item)} className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-xs">✏️ Editar</button>
                <button onClick={() => onDelete(item.id)} className="px-2.5 py-1 bg-red-600 hover:bg-red-700 rounded text-xs">🗑️ Borrar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DynamicFeatureForm({ initialData, isCreating, onSave, onCancel }: any) {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    latitude: initialData.latitude || -31.4167,
    longitude: initialData.longitude || -64.1833,
    ...initialData
  });

  // Convertimos el objeto properties existente en un array de pares [{key, value}] para manipularlo fácil
  const initialProperties = initialData.properties || {};
  const [customFields, setCustomFields] = useState<Array<{ key: string; value: string }>>(
    Object.entries(initialProperties).map(([key, value]) => ({ key, value: String(value) }))
  );

  // Función para agregar un nuevo campo vacío
  const handleAddCustomField = () => {
    setCustomFields([...customFields, { key: '', value: '' }]);
  };

  // Función para actualizar un campo personalizado
  const handleCustomFieldChange = (index: number, field: 'key' | 'value', val: string) => {
    const updated = [...customFields];
    updated[index][field] = val;
    setCustomFields(updated);
  };

  // Función para eliminar un campo personalizado
  const handleRemoveCustomField = (index: number) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Reconstruimos el objeto properties a partir de los campos dinámicos
    const propertiesObject: Record<string, string> = {};
    customFields.forEach(item => {
      if (item.key.trim()) {
        propertiesObject[item.key.trim()] = item.value;
      }
    });

    onSave({ 
      ...formData, 
      properties: propertiesObject 
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-700 p-6 rounded-xl space-y-4 shadow-xl">
      <h3 className="text-lg font-bold text-white">
        {isCreating ? '➕ Agregar nuevo punto dinámico' : '✏️ Editar punto dinámico'}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs mb-1 text-slate-300">Nombre de la ubicación *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 bg-slate-600 rounded-lg text-sm text-white"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs mb-1 text-slate-300">Latitud *</label>
            <input
              type="number"
              step="0.000001"
              value={formData.latitude}
              onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
              className="w-full p-2 bg-slate-600 rounded-lg text-sm text-white"
              required
            />
          </div>
          <div>
            <label className="block text-xs mb-1 text-slate-300">Longitud *</label>
            <input
              type="number"
              step="0.000001"
              value={formData.longitude}
              onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
              className="w-full p-2 bg-slate-600 rounded-lg text-sm text-white"
              required
            />
          </div>
        </div>

        {/* SECCIÓN DE CAMPOS DINÁMICOS PERSONALIZADOS */}
        <div className="md:col-span-2 bg-slate-800 p-4 rounded-xl border border-slate-600 space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              📋 Atributos y Datos Personalizados (Opcional)
            </label>
            <button
              type="button"
              onClick={handleAddCustomField}
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition"
            >
              + Agregar Atributo
            </button>
          </div>

          {customFields.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No hay atributos adicionales. Hacé clic en "+ Agregar Atributo" para sumar localidad, dirección, teléfono, etc.</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {customFields.map((field, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Nombre (ej: Localidad)"
                    value={field.key}
                    onChange={(e) => handleCustomFieldChange(index, 'key', e.target.value)}
                    className="w-1/3 p-2 bg-slate-600 rounded-lg text-sm text-white"
                  />
                  <input
                    type="text"
                    placeholder="Valor (ej: Córdoba)"
                    value={field.value}
                    onChange={(e) => handleCustomFieldChange(index, 'value', e.target.value)}
                    className="w-2/3 p-2 bg-slate-600 rounded-lg text-sm text-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveCustomField(index)}
                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs"
                    title="Eliminar atributo"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-semibold text-sm text-white transition">💾 Guardar Punto</button>
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-xl font-semibold text-sm text-white transition">❌ Cancelar</button>
      </div>
    </form>
  );
}