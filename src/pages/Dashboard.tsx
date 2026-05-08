import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, FileQuestion, CheckCircle, TrendingUp, Clock, PlusCircle } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, trend }: { title: string, value: string | number, icon: any, color: string, trend: string }) => (
  <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', flex: 1, minWidth: '220px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.03)' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
      <div style={{ backgroundColor: `${color}15`, padding: '12px', borderRadius: '12px', color: color }}><Icon size={24} strokeWidth={2.5} /></div>
      <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#10b981', backgroundColor: '#dcfce3', padding: '4px 10px', borderRadius: '20px' }}>{trend}</span>
    </div>
    <div>
      <h3 style={{ margin: '0 0 4px 0', color: '#0f172a', fontSize: '32px', fontWeight: '800', letterSpacing: '-0.5px' }}>{value}</h3>
      <p style={{ margin: 0, color: '#64748b', fontSize: '14px', fontWeight: '600' }}>{title}</p>
    </div>
  </div>
);

const ActivityItem = ({ icon: Icon, title, time, color }: { icon: any, title: string, time: string, color: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 0', borderBottom: '1px solid #f1f5f9' }}>
    <div style={{ backgroundColor: `${color}15`, color: color, padding: '10px', borderRadius: '50%' }}><Icon size={18} strokeWidth={2.5} /></div>
    <div style={{ flex: 1 }}>
      <p style={{ margin: '0 0 4px 0', color: '#334155', fontWeight: '600', fontSize: '14px' }}>{title}</p>
      <p style={{ margin: 0, color: '#94a3b8', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {time}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalQuestions: 0,
    averageScore: "0",
    examsCompleted: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Step 9: Calling the dynamic analytics endpoint
        const res = await axios.get('http://localhost:5000/api/admin/analytics');
        
        // Calculate total exams completed from performance array
        const completed = res.data.performance.reduce((acc: number, curr: any) => acc + curr.count, 0);
        
        setStats({
          totalStudents: res.data.totalStudents,
          totalQuestions: res.data.totalQuestions,
          averageScore: res.data.averageScore,
          examsCompleted: completed
        });
      } catch (err) {
        console.error("Dashboard data fetch failed. Check if server.js is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div style={{ padding: '20px' }}>Loading Dashboard Data...</div>;

  return (
    <div style={{ textAlign: 'left' }}>
      <div style={{ marginBottom: '35px' }}>
        <h2 style={{ margin: '0 0 8px 0', color: '#0f172a', fontSize: '28px', fontWeight: '800' }}>Dashboard Overview</h2>
        <p style={{ margin: 0, color: '#64748b', fontSize: '15px' }}>Live metrics from your Aiven MySQL database.</p>
      </div>

      {/* STAT CARDS - Linked to DB (Step 9) */}
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '40px' }}>
        <StatCard title="Total Students" value={stats.totalStudents} icon={Users} color="#3b82f6" trend="+12% this week" />
        <StatCard title="Exams Completed" value={stats.examsCompleted} icon={CheckCircle} color="#10b981" trend="Live Data" />
        <StatCard title="Questions Bank" value={stats.totalQuestions} icon={FileQuestion} color="#8b5cf6" trend="Total" />
        <StatCard title="Avg Score" value={`${stats.averageScore}%`} icon={TrendingUp} color="#f59e0b" trend="Overall" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div style={{ backgroundColor: 'white', padding: '24px 30px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.03)' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#0f172a', fontSize: '18px', borderBottom: '1px solid #e2e8f0', paddingBottom: '15px' }}>Recent Activity</h3>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <ActivityItem icon={CheckCircle} title="System tracking active exams" time="Just now" color="#10b981" />
            <ActivityItem icon={Users} title="Fetching data from Aiven Cloud" time="Sync complete" color="#3b82f6" />
          </div>
        </div>

        <div style={{ backgroundColor: 'white', padding: '24px 30px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.03)', height: 'fit-content' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#0f172a', fontSize: '18px', borderBottom: '1px solid #e2e8f0', paddingBottom: '15px' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button onClick={() => window.location.href='/questions'} style={{ padding: '14px', backgroundColor: '#eff6ff', color: '#1d4ed8', border: 'none', borderRadius: '8px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}><PlusCircle size={18} /> Add New Question</button>
            <button onClick={() => window.location.href='/exams'} style={{ padding: '14px', backgroundColor: '#f0fdf4', color: '#15803d', border: 'none', borderRadius: '8px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}><FileQuestion size={18} /> Configure New Exam</button>
            <button onClick={() => window.location.href='/students'} style={{ padding: '14px', backgroundColor: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0', borderRadius: '8px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}><Users size={18} /> View Student Reports</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;