import { useState } from 'react';
import api from '../../services/api';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    email: '', password: '', companyName: '', cuit: '', address: '', latitude: '', longitude: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/auth/register/manager', {
      ...formData,
      latitude: parseFloat(formData.latitude) || null,
      longitude: parseFloat(formData.longitude) || null,
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-slate-800 rounded-2xl p-8 text-center">
        <div className="text-6xl mb-4">📨</div>
        <h3 className="text-xl font-bold text-white mb-2">¡Solicitud enviada!</h3>
        <p className="text-slate-300">Tu solicitud será revisada por un administrador. Recibirás un email cuando sea aprobada.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-2xl p-6 max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-white mb-4">Solicitar aparecer en el mapa</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input placeholder="Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full p-2 bg-slate-700 border border-slate-600 rounded-xl text-white" required />
        <input placeholder="Contraseña" type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full p-2 bg-slate-700 border border-slate-600 rounded-xl text-white" required />
        <input placeholder="Nombre de la empresa" value={formData.companyName} onChange={e => setFormData({ ...formData, companyName: e.target.value })} className="w-full p-2 bg-slate-700 border border-slate-600 rounded-xl text-white" required />
        <input placeholder="CUIT" value={formData.cuit} onChange={e => setFormData({ ...formData, cuit: e.target.value })} className="w-full p-2 bg-slate-700 border border-slate-600 rounded-xl text-white" required />
        <input placeholder="Dirección" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full p-2 bg-slate-700 border border-slate-600 rounded-xl text-white" required />
        <div className="grid grid-cols-2 gap-3">
          <input placeholder="Latitud (opcional)" value={formData.latitude} onChange={e => setFormData({ ...formData, latitude: e.target.value })} className="p-2 bg-slate-700 border border-slate-600 rounded-xl text-white" />
          <input placeholder="Longitud (opcional)" value={formData.longitude} onChange={e => setFormData({ ...formData, longitude: e.target.value })} className="p-2 bg-slate-700 border border-slate-600 rounded-xl text-white" />
        </div>
        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-xl font-semibold">Enviar solicitud</button>
      </form>
    </div>
  );
}