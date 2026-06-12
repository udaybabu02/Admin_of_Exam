import { useState, useEffect } from 'react';
import { Settings, Power, PowerOff, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
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
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => { 
    fetchExams(); 
  }, []);

  const fetchExams = async () => {
    setLoading(true);
    try {
      // 🚀 FIXED: Hardcoded to bypass the stubborn .env file
      const res = await axios.get(`https://examportal-backend-xbw5.onrender.com/api/admin/exams`);
      setExams(Array.isArray(res.data) ? res.data : []);
    } catch (err) { 
      console.error("Error fetching exam configurations:", err); 
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    setUpdatingId(id);
    try {
      // 🚀 FIXED: Hardcoded to bypass the stubborn .env file
      await axios.put(`https://examportal-backend-xbw5.onrender.com/api/admin/exams/${id}/toggle`, { 
        is_active: !currentStatus 
      });
      await fetchExams(); 
    } catch (err) {
      alert("Failed to update exam status. Check backend connection.");
    } finally {
      setUpdatingId(null);
    }
  };

  const activeExamsCount = exams?.filter(e => e.is_active).length || 0;

  return (
    <div style={{ padding: '20px', textAlign: 'left' }}>
      {/* GLOBAL STATUS BANNER */}
      <div style={{ 
        backgroundColor: '#f8fafc', 
        padding: '20px', 
        borderRadius: '12px', 
        border: '1px solid #e2e8f0', 
        marginBottom: '30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h2 style={{ margin: '0 0 5px 0', color: '#0f172a' }}>Exam Visibility Controller</h2>
          <p style={{ color: '#64748b', margin: 0 }}>
            Select one, two, or all subjects. Active subjects instantly appear as available modules on the student portal.
          </p>
        </div>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          backgroundColor: activeExamsCount > 0 ? '#ecfdf5' : '#fff1f1', 
          padding: '10px 18px', 
          borderRadius: '30px',
          border: `1px solid ${activeExamsCount > 0 ? '#a7f3d0' : '#fecaca'}`
        }}>
          {activeExamsCount > 0 ? <CheckCircle2 size={18} color="#059669" /> : <AlertCircle size={18} color="#dc2626" />}
          <span style={{ fontWeight: 'bold', color: activeExamsCount > 0 ? '#065f46' : '#991b1b' }}>
            {activeExamsCount} {activeExamsCount === 1 ? 'Subject' : 'Subjects'} Active Online
          </span>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
          <Loader2 className="animate-spin" style={{ display: 'inline', marginRight: '8px' }} /> 
          Loading live exam structural states...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {exams?.length > 0 ? exams.map((exam) => (
            <div 
              key={exam.id} 
              style={{ 
                backgroundColor: 'white', 
                borderRadius: '12px', 
                padding: '25px', 
                boxShadow: exam.is_active ? '0 10px 15px -3px rgba(79, 70, 229, 0.1)' : '0 1px 3px rgba(0,0,0,0.05)', 
                border: exam.is_active ? '2px solid #4f46e5' : '1px solid #f1f5f9',
                transition: 'all 0.2s ease-in-out',
                position: 'relative'
              }}
            >
              {/* TOP HEADER PIN */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <span style={{ 
                  backgroundColor: exam.is_active ? '#dcfce7' : '#fee2e2', 
                  color: exam.is_active ? '#166534' : '#991b1b', 
                  padding: '6px 14px', 
                  borderRadius: '20px', 
                  fontSize: '12px', 
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span style={{ 
                    width: '6px', 
                    height: '6px', 
                    borderRadius: '50%', 
                    backgroundColor: exam.is_active ? '#22c55e' : '#ef4444',
                    display: 'inline-block' 
                  }}/>
                  {exam.is_active ? 'Visible to Students' : 'Hidden from Students'}
                </span>
                <Settings size={18} color={exam.is_active ? "#4f46e5" : "#94a3b8"} />
              </div>
              
              {/* SUBJECT DISPLAY */}
              <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', color: '#1e293b' }}>
                {exam.subject || 'Subject'} Examination
              </h3>
              
              {/* DESCRIPTION PANEL */}
              <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#64748b' }}>
                {exam.is_active 
                  ? `Students can currently log in and take the ${exam.total_questions}-question ${exam.subject || 'assigned'} assessment.` 
                  : `The ${exam.subject || 'assigned'} exam option is hidden from selection panels.`
                }
              </p>
              
              {/* METRICS DISCLOSURE BLOCK */}
              <div style={{ 
                display: 'flex', 
                backgroundColor: '#f8fafc', 
                padding: '12px 15px', 
                borderRadius: '8px', 
                gap: '30px', 
                marginBottom: '25px',
                border: '1px solid #f1f5f9'
              }}>
                <div>
                  <small style={{ color: '#64748b', display: 'block', fontSize: '11px', fontWeight: 'bold' }}>RANDOM CUTLIST</small>
                  <strong style={{ fontSize: '16px', color: '#0f172a' }}>{exam.total_questions} Questions</strong>
                </div>
                <div>
                  <small style={{ color: '#64748b', display: 'block', fontSize: '11px', fontWeight: 'bold' }}>ALLOTTED RUNTIME</small>
                  <strong style={{ fontSize: '16px', color: '#0f172a' }}>{exam.duration_minutes} Minutes</strong>
                </div>
              </div>

              {/* TOGGLE WORK BUTTON */}
              <button 
                onClick={() => toggleStatus(exam.id, exam.is_active)}
                disabled={updatingId === exam.id}
                style={{ 
                  width: '100%',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '8px', 
                  padding: '12px', 
                  borderRadius: '8px', 
                  border: 'none',
                  backgroundColor: exam.is_active ? '#fee2e2' : '#4f46e5', 
                  color: exam.is_active ? '#991b1b' : 'white', 
                  cursor: updatingId === exam.id ? 'not-allowed' : 'pointer', 
                  fontWeight: 'bold',
                  boxShadow: exam.is_active ? 'none' : '0 4px 6px -1px rgba(79, 70, 229, 0.2)',
                  transition: 'background-color 0.15s ease'
                }}
              >
                {updatingId === exam.id ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : exam.is_active ? (
                  <>
                    <PowerOff size={16}/> Turn Off & Hide Exam
                  </>
                ) : (
                  <>
                    <Power size={16}/> Turn On & Publish Exam
                  </>
                )}
              </button>
            </div>
          )) : (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
              No standardized subject profiles loaded in the exams table database.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Exams;