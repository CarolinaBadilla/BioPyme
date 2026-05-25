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

export default function AdminPanel() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'requests'>('users');
  const [newUser, setNewUser] = useState({ email: '', password: '', role: 'ASSISTANT', name: '' });

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchUsers();
    }
    fetchRequests();
  }, []);

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

  if (user?.role !== 'ADMIN' && user?.role !== 'ASSISTANT') {
    return <div className="p-8 text-white">No tenés permiso para acceder a esta página.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Panel de Administración</h1>

        <div className="flex gap-4 mb-6">
          <button onClick={() => setActiveTab('users')} className={`px-6 py-2 rounded-xl font-semibold ${activeTab === 'users' ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300'}`}>👥 Usuarios</button>
          <button onClick={() => setActiveTab('requests')} className={`px-6 py-2 rounded-xl font-semibold ${activeTab === 'requests' ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300'}`}>📋 Solicitudes</button>
        </div>

        {/* Tabla de Usuarios */}
        {activeTab === 'users' && user?.role === 'ADMIN' && (
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">Crear nuevo usuario</h2>
            <div className="grid grid-cols-4 gap-3 mb-6">
              <input placeholder="Nombre" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} className="p-2 bg-slate-700 border border-slate-600 rounded-xl text-white" />
              <input placeholder="Email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} className="p-2 bg-slate-700 border border-slate-600 rounded-xl text-white" />
              <input placeholder="Contraseña" type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} className="p-2 bg-slate-700 border border-slate-600 rounded-xl text-white" />
              <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })} className="p-2 bg-slate-700 border border-slate-600 rounded-xl text-white">
                <option value="ASSISTANT">Ayudante</option>
                <option value="ADMIN">Administrador</option>
              </select>
              <button onClick={createUser} className="bg-indigo-600 text-white p-2 rounded-xl">Crear</button>
            </div>

            <h2 className="text-xl font-bold text-white mb-4">Usuarios existentes</h2>
            <div className="space-y-2">
              {users.map(u => (
                <div key={u.id} className="flex justify-between items-center p-3 bg-slate-700 rounded-xl">
                  <div><span className="font-semibold text-white">{u.name || u.email}</span><span className="text-slate-400 ml-3">{u.role}</span><span className="text-slate-500 ml-3">{u.email}</span></div>
                  <button onClick={() => deleteUser(u.id)} className="bg-red-600 text-white px-3 py-1 rounded-lg">Eliminar</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabla de Solicitudes */}
        {activeTab === 'requests' && (
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">Solicitudes de empresas</h2>
            {requests.map(r => (
              <div key={r.id} className="mb-4 p-4 bg-slate-700 rounded-xl">
                <div><span className="font-bold text-white">{r.company.name}</span><span className="text-slate-400 ml-3">CUIT: {r.company.cuit}</span></div>
                <p className="text-slate-300 text-sm">{r.company.address}</p>
                <p className="text-sm mt-2">Estado: <span className={`font-semibold ${r.status === 'PENDING' ? 'text-yellow-400' : r.status === 'APPROVED' ? 'text-green-400' : 'text-red-400'}`}>{r.status}</span></p>
                {r.status === 'PENDING' && (
                  <div className="flex gap-3 mt-3">
                    <button onClick={() => approveRequest(r.id)} className="bg-green-600 text-white px-4 py-1.5 rounded-lg">✅ Aprobar</button>
                    <button onClick={() => rejectRequest(r.id)} className="bg-red-600 text-white px-4 py-1.5 rounded-lg">❌ Rechazar</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}