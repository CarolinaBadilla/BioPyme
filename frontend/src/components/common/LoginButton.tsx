import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export default function LoginButton() {
  const [showModal, setShowModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [cuit, setCuit] = useState('');
  const [address, setAddress] = useState('');
  const { user, login, register, logout, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      await login(email, password);
      if (user) setShowModal(false);
    } else {
      await register({ email, password, companyName, cuit, address });
      if (user) setShowModal(false);
    }
  };

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-emerald-100">👤 {user.email.split('@')[0]}</span>
        {user.role === 'ADMIN' && <a href="/admin" className="text-emerald-200 hover:text-white text-sm">Admin</a>}
        <button onClick={logout} className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg transition text-sm">Salir</button>
      </div>
    );
  }

  return (
    <>
      <button onClick={() => setShowModal(true)} className="bg-white/20 hover:bg-white/30 text-white px-4 py-1.5 rounded-lg transition text-sm font-medium">🔐 Ingresar</button>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-96 p-5">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-800">{isLogin ? 'Ingresar' : 'Registrar'}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-xl">✖</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
              <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" required />
              {!isLogin && (
                <>
                  <input placeholder="Empresa" value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg text-sm" required />
                  <input placeholder="CUIT" value={cuit} onChange={e => setCuit(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg text-sm" required />
                  <input placeholder="Dirección" value={address} onChange={e => setAddress(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg text-sm" required />
                </>
              )}
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg text-sm shadow-sm">{loading ? '...' : (isLogin ? 'Ingresar' : 'Registrar')}</button>
              <p className="text-center text-xs text-slate-500">
                {isLogin ? '¿No tenés cuenta?' : '¿Ya tenés cuenta?'}
                <button type="button" onClick={() => setIsLogin(!isLogin)} className="ml-1 text-emerald-600 font-medium">{isLogin ? 'Registrate' : 'Ingresá'}</button>
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}