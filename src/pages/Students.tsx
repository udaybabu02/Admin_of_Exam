import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, FileText, RefreshCw } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  mobile: string;
  id_type: string;
  user_id_value: string;
  hall_ticket: string;
}

interface Result {
  id: number;
  student_name: string;
  exam_id: string;
  score_percentage: number;
  status: string;
  total_questions: number;
  correct_count: number;
  wrong_count: number;
  created_at: string;
}

const Students = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'results'>('results');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Step 7 & 8: Fetching users and results from the backend
      const [usersRes, resultsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/users'),
        axios.get('http://localhost:5000/api/admin/results')
      ]);
      setUsers(usersRes.data);
      setResults(resultsRes.data);
    } catch (err) {
      setError("Could not connect to the server. Ensure the backend is running on port 5000.");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'left' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Student Management & Results</h2>
        <button onClick={fetchData} style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 15px', borderRadius: '6px', border: '1px solid #cbd5e1', cursor: 'pointer', backgroundColor: 'white' }}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {error && <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '6px', marginBottom: '20px', border: '1px solid #f87171' }}>{error}</div>}

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
        <button onClick={() => setActiveTab('results')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: activeTab === 'results' ? '#2563eb' : 'transparent', color: activeTab === 'results' ? 'white' : '#475569', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          <FileText size={18} /> Exam Results
        </button>
        <button onClick={() => setActiveTab('users')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: activeTab === 'users' ? '#2563eb' : 'transparent', color: activeTab === 'users' ? 'white' : '#475569', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          <Users size={18} /> Registered Students
        </button>
      </div>

      {loading ? (
        <p style={{ color: '#64748b' }}>Loading data from Aiven Cloud...</p>
      ) : (
        <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              {activeTab === 'results' ? (
                <tr>
                  <th style={{ padding: '15px' }}>Student Name</th>
                  <th style={{ padding: '15px' }}>Exam ID</th>
                  <th style={{ padding: '15px' }}>Score</th>
                  <th style={{ padding: '15px' }}>Correct/Wrong</th>
                  <th style={{ padding: '15px' }}>Status</th>
                </tr>
              ) : (
                <tr>
                  <th style={{ padding: '15px' }}>Name</th>
                  <th style={{ padding: '15px' }}>Email</th>
                  <th style={{ padding: '15px' }}>Mobile</th>
                  <th style={{ padding: '15px' }}>Hall Ticket / ID</th>
                </tr>
              )}
            </thead>
            <tbody>
              {activeTab === 'results' ? (
                results.length > 0 ? results.map((r) => (
                  <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '15px', fontWeight: 'bold' }}>{r.student_name}</td>
                    <td style={{ padding: '15px', color: '#64748b' }}>{r.exam_id}</td>
                    <td style={{ padding: '15px', fontWeight: 'bold' }}>{r.score_percentage}%</td>
                    <td style={{ padding: '15px' }}><span style={{ color: '#16a34a' }}>{r.correct_count}</span> / <span style={{ color: '#dc2626' }}>{r.wrong_count}</span></td>
                    <td style={{ padding: '15px' }}><span style={{ backgroundColor: r.status === 'PASSED' ? '#dcfce7' : '#fee2e2', color: r.status === 'PASSED' ? '#166534' : '#991b1b', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>{r.status}</span></td>
                  </tr>
                )) : <tr><td colSpan={5} style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>No exam results found.</td></tr>
              ) : (
                users.length > 0 ? users.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '15px', fontWeight: 'bold' }}>{u.name}</td>
                    <td style={{ padding: '15px' }}>{u.email}</td>
                    <td style={{ padding: '15px' }}>{u.mobile}</td>
                    <td style={{ padding: '15px', color: '#64748b' }}>{u.hall_ticket || u.user_id_value}</td>
                  </tr>
                )) : <tr><td colSpan={4} style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>No registered students found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Students;