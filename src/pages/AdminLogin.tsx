import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const AdminLogin = () => {
  const [loginMethod, setLoginMethod] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginMethod === 'otp') {
      setError('OTP login is currently under development.');
      return;
    }
    
    if (email === 'madhubabukolla@gmail.com' && password === 'madhubabu@12345') {
      localStorage.setItem('adminAuth', 'true');
      navigate('/dashboard');
    } else {
      setError('Invalid admin credentials');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'sans-serif' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '25px' }}>
        {/* UPDATED LOGO PATH: Points directly to public/arms-logo.png */}
        <img 
          src="/arms-logo.png" 
          alt="ARMS Logo" 
          style={{ height: '60px', marginBottom: '10px' }} 
          onError={(e) => { e.currentTarget.style.display = 'none'; }} 
        />
        <p style={{ color: '#64748b', margin: 0, fontSize: '15px' }}>Sign in to access your admin portal</p>
      </div>

      <div style={{ backgroundColor: 'white', padding: '35px 40px', borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.06)', width: '100%', maxWidth: '400px', boxSizing: 'border-box' }}>
        <h2 style={{ margin: '0 0 5px 0', color: '#0f172a', fontSize: '22px' }}>Welcome back</h2>
        <p style={{ margin: '0 0 25px 0', color: '#64748b', fontSize: '14px' }}>Choose your preferred login method</p>

        <div style={{ display: 'flex', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '8px', marginBottom: '25px' }}>
          <button onClick={() => setLoginMethod('email')} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', transition: 'all 0.2s', backgroundColor: loginMethod === 'email' ? 'white' : 'transparent', color: loginMethod === 'email' ? '#0f172a' : '#64748b', boxShadow: loginMethod === 'email' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}>
            Email & Password
          </button>
          <button onClick={() => setLoginMethod('otp')} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', transition: 'all 0.2s', backgroundColor: loginMethod === 'otp' ? 'white' : 'transparent', color: loginMethod === 'otp' ? '#0f172a' : '#64748b', boxShadow: loginMethod === 'otp' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}>
            OTP Login
          </button>
        </div>

        {error && <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '6px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box', fontSize: '14px', color: '#334155', backgroundColor: '#f8fafc' }} placeholder="admin@arms.com" />
          </div>

          {loginMethod === 'email' && (
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '12px 40px 12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box', fontSize: '14px', color: '#334155', backgroundColor: '#f8fafc' }} placeholder="admin123" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '12px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: 0 }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}

          <button type="submit" style={{ backgroundColor: '#4f46e5', color: 'white', padding: '14px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px', marginTop: '10px', transition: 'background-color 0.2s', letterSpacing: '0.5px' }}>
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;