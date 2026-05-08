import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, HelpCircle, FileText, Users, LogOut } from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/login');
  };

  // NavItem sub-component defined within AdminLayout
  const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => {
    const isActive = location.pathname === to;
    return (
      <Link to={to} style={{ 
        color: isActive ? 'white' : '#cbd5e1', 
        backgroundColor: isActive ? '#334155' : 'transparent',
        textDecoration: 'none', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px', 
        padding: '12px 16px', 
        borderRadius: '8px', 
        fontWeight: isActive ? 'bold' : 'normal',
        transition: 'all 0.2s'
      }}>
        <Icon size={20} color={isActive ? '#60a5fa' : '#cbd5e1'} /> {label}
      </Link>
    );
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', fontFamily: 'sans-serif', margin: 0, padding: 0 }}>
      
      {/* SIDEBAR */}
      <div style={{ width: '260px', backgroundColor: '#0f172a', color: 'white', padding: '24px', display: 'flex', flexDirection: 'column', borderRight: '1px solid #1e293b', height: '100vh', position: 'fixed', left: 0, top: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '50px' }}>
          
          {/* UPDATED LOGO PATH: Points directly to public/arms-logo.png */}
          <img 
            src="/arms-logo.png" 
            alt="ARMS Logo" 
            style={{ height: '36px', borderRadius: '4px', backgroundColor: 'white', padding: '2px' }} 
            onError={(e) => { 
                e.currentTarget.style.display = 'none'; 
            }} 
          />
          <h2 style={{ margin: 0, color: 'white', fontSize: '1.2rem', letterSpacing: '0.5px' }}>Admin Portal</h2>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem to="/questions" icon={HelpCircle} label="Manage Questions" />
          <NavItem to="/exams" icon={FileText} label="Configure Exams" />
          <NavItem to="/students" icon={Users} label="Student Results" />
        </nav>

        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', backgroundColor: 'transparent', border: '1px solid #334155', color: '#f87171', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}>
          <LogOut size={20} /> Sign Out
        </button>
      </div>

      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', minHeight: '100vh', marginLeft: '260px' }}>
        <header style={{ backgroundColor: 'white', padding: '20px 30px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: '#334155', fontSize: '1.2rem' }}>Exam Management System</h3>
          <div style={{ height: '35px', width: '35px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#64748b' }}>A</div>
        </header>
        
        <main style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;