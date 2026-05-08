import { useState, useEffect } from 'react';
import { Plus, Settings, Trash2, Power, PowerOff } from 'lucide-react';
import axios from 'axios';

interface Exam {
  id: number;
  subject: string;
  total_questions: number;
  duration_minutes: number;
  is_active: boolean;
}

const Exams = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [, setShowAddModal] = useState(false);
  const [] = useState({ subject: '', duration_minutes: 30, total_questions: 10 });

  useEffect(() => { fetchExams(); }, []);

  const fetchExams = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/exams');
      setExams(res.data);
    } catch (err) { console.error("Error fetching exams"); }
  };


  const toggleStatus = async (id: number, currentStatus: boolean) => {
    await axios.put(`http://localhost:5000/api/admin/exams/${id}/toggle`, { is_active: !currentStatus });
    fetchExams();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Remove this exam?")) {
      await axios.delete(`http://localhost:5000/api/exams/${id}`);
      fetchExams();
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ margin: 0 }}>Configure Exams</h2>
          <p style={{ color: '#64748b' }}>Manage assessment rules and active status.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#4f46e5', color: 'white', padding: '12px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
        >
          <Plus size={18} /> Create New Exam
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {exams.map((exam) => (
          <div key={exam.id} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <span style={{ backgroundColor: exam.is_active ? '#dcfce7' : '#fee2e2', color: exam.is_active ? '#166534' : '#991b1b', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                ● {exam.is_active ? 'Active' : 'Disabled'}
              </span>
              <Settings size={18} color="#94a3b8" />
            </div>
            
            <h3 style={{ margin: '0 0 20px 0' }}>{exam.subject} Exam</h3>
            
            <div style={{ display: 'flex', gap: '40px', marginBottom: '25px' }}>
              <div>
                <small style={{ color: '#64748b', display: 'block' }}>QUESTIONS</small>
                <strong style={{ fontSize: '18px' }}>{exam.total_questions}</strong>
              </div>
              <div>
                <small style={{ color: '#64748b', display: 'block' }}>TIME LIMIT</small>
                <strong style={{ fontSize: '18px' }}>{exam.duration_minutes} min</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => toggleStatus(exam.id, exam.is_active)}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', borderRadius: '8px', border: '1px solid #f1f5f9', backgroundColor: '#fff7ed', color: '#c2410c', cursor: 'pointer', fontWeight: '600' }}
              >
                {exam.is_active ? <PowerOff size={16}/> : <Power size={16}/>}
                {exam.is_active ? 'Disable' : 'Enable'}
              </button>
              <button 
                onClick={() => handleDelete(exam.id)}
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #fee2e2', backgroundColor: '#fff1f1', color: '#dc2626', cursor: 'pointer' }}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Exams;