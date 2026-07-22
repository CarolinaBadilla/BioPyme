import { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

interface User {
  id: number;
  email: string;
  role: string;
  name: string;
}

interface Request {
  id: number;
  status: string;
  company: { name: string; cuit: string; address: string };
  createdAt: string;
}

interface Estacion {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string | null;
  latitud: number;
  longitud: number;
  localidad: string | null;
  departamento: string | null;
}

export default function AdminPanel() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'requests' | 'estaciones'>('users');
  const [newUser, setNewUser] = useState({ email: '', password: '', role: 'ASSISTANT', name: '' });

  // Estados para estaciones
  const [estaciones, setEstaciones] = useState<Estacion[]>([]);
  const [estacionesTipo, setEstacionesTipo] = useState<'ypf' | 'blancas'>('ypf');
  const [editingEstacion, setEditingEstacion] = useState<Estacion | null>(null);
  const [loadingEstaciones, setLoadingEstaciones] = useState(false);
  const [estacionesError, setEstacionesError] = useState<string | null>(null);
  const [estacionesSuccess, setEstacionesSuccess] = useState<string | null>(null);

  const canEditEstaciones = user?.role === 'ADMIN' || user?.role === 'EDITOR' || user?.role === 'ASSISTANT';
  const canManageUsers = user?.role === 'ADMIN';

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchUsers();
    }
    fetchRequests();
    if (canEditEstaciones) {
      fetchEstaciones();
    }
  }, []);

  const fetchEstaciones = async () => {
    setLoadingEstaciones(true);
    setEstacionesError(null);
    try {
      const endpoint = estacionesTipo === 'ypf' ? 'ypf' : 'estaciones-blancas';
      const response = await api.get(`/${endpoint}`);
      setEstaciones(response.data);
    } catch (err) {
      setEstacionesError('Error al cargar las estaciones');
      console.error(err);
    } finally {
      setLoadingEstaciones(false);
    }
  };

  const handleSaveEstacion = async (estacion: Estacion) => {
    setEstacionesError(null);
    setEstacionesSuccess(null);
    try {
      const endpoint = estacionesTipo === 'ypf' ? 'ypf' : 'estaciones-blancas';
      await api.put(`/${endpoint}/${estacion.id}`, estacion);
      
      setEstacionesSuccess('✅ Estación actualizada correctamente');
      setTimeout(() => setEstacionesSuccess(null), 3000);
      
      await fetchEstaciones();
      setEditingEstacion(null);
    } catch (err) {
      setEstacionesError('Error al guardar los cambios');
      console.error(err);
    }
  };

  const handleTipoChange = (tipo: 'ypf' | 'blancas') => {
    setEstacionesTipo(tipo);
    setEditingEstacion(null);
    fetchEstaciones();
  };

  const fetchUsers = async () => {
    const res = await api.get('/users');
    setUsers(res.data);
  };

  const fetchRequests = async () => {
    const res = await api.get('/requests');
    setRequests(res.data);
  };

  const createUser = async () => {
    await api.post('/users', newUser);
    fetchUsers();
    setNewUser({ email: '', password: '', role: 'ASSISTANT', name: '' });
  };

  const deleteUser = async (id: number) => {
    await api.delete(`/users/${id}`);
    fetchUsers();
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

  if (user?.role !== 'ADMIN' && user?.role !== 'ASSISTANT' && user?.role !== 'EDITOR') {
    return <div className="p-8 text-white">No tenés permiso para acceder a esta página.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Panel de Administración</h1>
          {user?.role === 'ADMIN' && (
            <span className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-full">Admin</span>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {canManageUsers && (
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-xl font-semibold transition ${
                activeTab === 'users'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              👥 Usuarios
            </button>
          )}
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-xl font-semibold transition ${
              activeTab === 'requests'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            📋 Solicitudes ({requests.filter(r => r.status === 'PENDING').length})
          </button>
          {canEditEstaciones && (
            <button
              onClick={() => setActiveTab('estaciones')}
              className={`px-4 py-2 rounded-xl font-semibold transition ${
                activeTab === 'estaciones'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              🗺️ Estaciones
            </button>
          )}
        </div>

        {/* ===== TAB: USUARIOS ===== */}
        {activeTab === 'users' && canManageUsers && (
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">Crear nuevo usuario</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
              <input
                placeholder="Nombre"
                value={newUser.name}
                onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                className="p-2 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400"
              />
              <input
                placeholder="Email"
                value={newUser.email}
                onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                className="p-2 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400"
              />
              <input
                placeholder="Contraseña"
                type="password"
                value={newUser.password}
                onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                className="p-2 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400"
              />
              <select
                value={newUser.role}
                onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                className="p-2 bg-slate-700 border border-slate-600 rounded-xl text-white"
              >
                <option value="ASSISTANT">👤 Ayudante</option>
                <option value="EDITOR">✏️ Editor</option>
                <option value="ADMIN">🔑 Administrador</option>
              </select>
              <button
                onClick={createUser}
                className="md:col-span-4 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-xl transition"
              >
                ➕ Crear usuario
              </button>
            </div>

            <h2 className="text-xl font-bold text-white mb-4">Usuarios existentes</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {users.map(u => (
                <div key={u.id} className="flex justify-between items-center p-3 bg-slate-700 rounded-xl">
                  <div>
                    <span className="font-semibold text-white">{u.name || u.email}</span>
                    <span className={`ml-3 px-2 py-0.5 rounded text-xs ${
                      u.role === 'ADMIN' ? 'bg-indigo-600 text-white' :
                      u.role === 'EDITOR' ? 'bg-blue-600 text-white' :
                      'bg-slate-600 text-slate-300'
                    }`}>
                      {u.role}
                    </span>
                    <span className="text-slate-400 ml-3 text-sm">{u.email}</span>
                  </div>
                  {u.role !== 'ADMIN' && (
                    <button
                      onClick={() => deleteUser(u.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg transition text-sm"
                    >
                      🗑️ Eliminar
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== TAB: SOLICITUDES ===== */}
        {activeTab === 'requests' && (
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">Solicitudes de empresas</h2>
            {requests.length === 0 ? (
              <p className="text-slate-400 text-center py-8">📭 No hay solicitudes pendientes</p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {requests.map(r => (
                  <div key={r.id} className="p-4 bg-slate-700 rounded-xl">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-white">{r.company.name}</span>
                        <span className="text-slate-400 ml-3 text-sm">CUIT: {r.company.cuit}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        r.status === 'PENDING' ? 'bg-yellow-600 text-yellow-100' :
                        r.status === 'APPROVED' ? 'bg-green-600 text-green-100' :
                        'bg-red-600 text-red-100'
                      }`}>
                        {r.status}
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm mt-1">{r.company.address}</p>
                    <p className="text-slate-500 text-xs mt-1">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                    {r.status === 'PENDING' && (
                      <div className="flex gap-3 mt-3">
                        <button
                          onClick={() => approveRequest(r.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg transition text-sm"
                        >
                          ✅ Aprobar
                        </button>
                        <button
                          onClick={() => rejectRequest(r.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg transition text-sm"
                        >
                          ❌ Rechazar
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== TAB: ESTACIONES ===== */}
        {activeTab === 'estaciones' && canEditEstaciones && (
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">🗺️ Editar Estaciones</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => handleTipoChange('ypf')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    estacionesTipo === 'ypf'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  🔵 YPF
                </button>
                <button
                  onClick={() => handleTipoChange('blancas')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    estacionesTipo === 'blancas'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  ⚪ Bandera Blanca
                </button>
                <button
                  onClick={fetchEstaciones}
                  className="px-3 py-1.5 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition text-sm"
                >
                  🔄 Actualizar
                </button>
              </div>
            </div>

            {/* Mensajes */}
            {estacionesSuccess && (
              <div className="bg-green-900/50 border border-green-700 rounded-lg p-3 mb-4">
                <p className="text-green-400">{estacionesSuccess}</p>
              </div>
            )}
            {estacionesError && (
              <div className="bg-red-900/50 border border-red-700 rounded-lg p-3 mb-4">
                <p className="text-red-400">{estacionesError}</p>
              </div>
            )}

            {loadingEstaciones ? (
              <div className="flex justify-center items-center py-12">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : editingEstacion ? (
              <EstacionForm
                estacion={editingEstacion}
                onSave={handleSaveEstacion}
                onCancel={() => setEditingEstacion(null)}
                tipo={estacionesTipo}
              />
            ) : (
              <EstacionesList
                estaciones={estaciones}
                onEdit={setEditingEstacion}
                tipo={estacionesTipo}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// COMPONENTE: EstacionesList
// ============================================
function EstacionesList({ estaciones, onEdit, tipo }: any) {
  const [searchTerm, setSearchTerm] = useState('');
  const [departamentoFilter, setDepartamentoFilter] = useState('todos');

const departamentos: string[] = [...new Set(
    estaciones.map((e: any) => e.departamento).filter((d: any) => d !== null && d !== undefined)
  )].sort() as string[];
  
  const filtered = estaciones.filter((e: any) => {
    const matchSearch = e.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (e.localidad && e.localidad.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchDepto = departamentoFilter === 'todos' || e.departamento === departamentoFilter;
    return matchSearch && matchDepto;
  });

  if (estaciones.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        <p className="text-lg">📭 No hay estaciones cargadas</p>
        <p className="text-sm mt-2">Las estaciones se cargan desde el backend</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="🔍 Buscar por nombre o localidad..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={departamentoFilter}
          onChange={(e) => setDepartamentoFilter(e.target.value)}
          className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="todos">📍 Todos los departamentos</option>
          {departamentos.map((depto: string) => (
            <option key={depto} value={depto}>{depto}</option>
          ))}
        </select>
        <span className="text-sm text-slate-400 self-center">
          {filtered.length} estaciones
        </span>
      </div>

      <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
        <table className="w-full">
          <thead className="bg-slate-700 sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Nombre</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Dirección</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Localidad</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Depto.</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Coordenadas</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {filtered.map((estacion: any) => (
              <tr key={estacion.id} className="hover:bg-slate-700/50 transition">
                <td className="px-4 py-3 text-sm font-medium text-white">{estacion.nombre}</td>
                <td className="px-4 py-3 text-sm text-slate-300">{estacion.direccion}</td>
                <td className="px-4 py-3 text-sm text-slate-300">{estacion.localidad || '-'}</td>
                <td className="px-4 py-3 text-sm text-slate-300">{estacion.departamento || '-'}</td>
                <td className="px-4 py-3 text-sm font-mono text-slate-400">
                  {estacion.latitud}, {estacion.longitud}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => onEdit(estacion)}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg transition"
                  >
                    ✏️ Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          No hay estaciones que coincidan con los filtros
        </div>
      )}
    </div>
  );
}

// ============================================
// COMPONENTE: EstacionForm
// ============================================
function EstacionForm({ estacion, onSave, onCancel, tipo }: any) {
  const [formData, setFormData] = useState(estacion);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: name === 'latitud' || name === 'longitud' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.nombre.trim()) {
      setError('El nombre es obligatorio');
      return;
    }

    if (isNaN(formData.latitud) || formData.latitud < -90 || formData.latitud > 90) {
      setError('La latitud debe ser un número entre -90 y 90');
      return;
    }

    if (isNaN(formData.longitud) || formData.longitud < -180 || formData.longitud > 180) {
      setError('La longitud debe ser un número entre -180 y 180');
      return;
    }

    setIsSaving(true);
    onSave(formData);
    setIsSaving(false);
  };

  return (
    <div className="bg-slate-700 rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">
          ✏️ Editando: {estacion.nombre}
        </h3>
        <span className="text-xs text-slate-400">ID: {estacion.id}</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-900/50 border border-red-700 rounded-lg p-3">
            <p className="text-red-400 text-sm">❌ {error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Nombre <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Dirección
            </label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Teléfono
            </label>
            <input
              type="text"
              name="telefono"
              value={formData.telefono || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Localidad
            </label>
            <input
              type="text"
              name="localidad"
              value={formData.localidad || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Departamento
            </label>
            <input
              type="text"
              name="departamento"
              value={formData.departamento || ''}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="bg-slate-600/50 border border-slate-500 rounded-xl p-4">
            <p className="text-xs text-slate-400 font-medium mb-2">📍 Coordenadas</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Latitud *</label>
                <input
                  type="number"
                  name="latitud"
                  step="0.000001"
                  value={formData.latitud}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Longitud *</label>
                <input
                  type="number"
                  name="longitud"
                  step="0.000001"
                  value={formData.longitud}
                  onChange={handleChange}
                  className="w-full px-3 py-1.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-slate-600">
          <button
            type="submit"
            disabled={isSaving}
            className={`px-6 py-2 bg-indigo-600 text-white font-medium rounded-xl transition ${
              isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'
            }`}
          >
            {isSaving ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                Guardando...
              </>
            ) : (
              '💾 Guardar cambios'
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-slate-600 text-slate-300 font-medium rounded-xl hover:bg-slate-500 transition"
          >
            ❌ Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}