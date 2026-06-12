import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, UploadCloud, Loader2, BookOpen } from 'lucide-react';
import axios from 'axios';

interface Question {
  id: number; subject: string; question_text: string; difficulty: string; marks: number;
  option_a: string; option_b: string; option_c: string; option_d: string; correct_answer: string;
}

const Questions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  // Requirement 1: Subject State (Defaults to Java)
  const [selectedSubject, setSelectedSubject] = useState<'Java' | 'Python' | 'Aptitude'>('Java');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [bulkText, setBulkText] = useState("");
  const [loading, setLoading] = useState(false);

  const initialForm = { difficulty: 'Medium', marks: 1, question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_answer: 'Option A' };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => { 
    fetchQuestions(); 
  }, [selectedSubject]); // Re-fetch or filter automatically when the active subject changes

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/questions`);
      const allQuestions = Array.isArray(res.data) ? res.data : [];
      
      // Requirement 3: Filter table view to show ONLY the selected subject's questions
      const filtered = allQuestions.filter(
        (q: Question) => q.subject.toLowerCase() === selectedSubject.toLowerCase()
      );
      setQuestions(filtered);
    } catch (err) {
      console.error("Error fetching questions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    // Inject the active subject into the single-question payload dynamically
    const payload = { ...formData, subject: selectedSubject };
    try {
      if (editingId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/questions/${editingId}`, payload);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/questions`, payload);
      }
      setShowForm(false); setEditingId(null); setFormData(initialForm); fetchQuestions();
    } catch (err) {
      alert("Failed to save question.");
    }
  };

  const handleBulkUpload = async () => {
    try {
      const parsed = JSON.parse(bulkText);
      if (!Array.isArray(parsed)) {
        alert("JSON must be an array of questions!");
        return;
      }

      // Requirement 2: Dynamically overwrite or force the current active subject onto the bulk items
      const standardizedQuestions = parsed.map(q => ({
        ...q,
        subject: selectedSubject // Force current selected subject context
      }));

      await axios.post(`${import.meta.env.VITE_API_URL}/api/questions/bulk`, { questions: standardizedQuestions });
      alert(`${selectedSubject} questions imported successfully!`);
      setBulkText(""); fetchQuestions();
    } catch (e) { 
      alert("Invalid JSON format! Please check your commas and brackets."); 
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Delete this question permanently?")) {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/questions/${id}`);
      fetchQuestions();
    }
  };

  return (
    <div style={{ textAlign: 'left' }}>
      {/* SUBJECT SELECTION PANEL */}
      <div style={{ backgroundColor: 'white', padding: '15px 20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <BookOpen size={20} color="#2563eb" />
          <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#1e293b' }}>Active Subject Workspace:</span>
          <select 
            value={selectedSubject} 
            onChange={(e) => setSelectedSubject(e.target.value as any)}
            style={{ padding: '8px 16px', borderRadius: '8px', border: '2px solid #2563eb', backgroundColor: '#f8fafc', fontWeight: 'bold', color: '#2563eb', cursor: 'pointer', outline: 'none' }}
          >
            <option value="Java">Java Environment</option>
            <option value="Python">Python Environment</option>
            <option value="Aptitude">Aptitude Environment</option>
          </select>
        </div>
        
        <button onClick={() => {setShowForm(!showForm); setEditingId(null); setFormData(initialForm);}} style={{ backgroundColor: showForm ? '#475569' : '#2563eb', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          {showForm ? 'Cancel Form' : `Add Single ${selectedSubject} Question`}
        </button>
      </div>

      {/* BULK IMPORT SECTION - Context-Aware */}
      {!showForm && (
        <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', marginBottom: '30px', border: '2px dashed #cbd5e1' }}>
          <h4 style={{ margin: '0 0 5px 0', display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a' }}>
            <UploadCloud size={18} /> Bulk Import Set into <span style={{color: '#2563eb', fontWeight: 'bold'}}>{selectedSubject}</span>
          </h4>
          <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#64748b' }}>
            The system will automatically assign the subject tag <strong>"{selectedSubject}"</strong> to all matching objects pasted here.
          </p>
          <textarea 
            value={bulkText} onChange={(e) => setBulkText(e.target.value)}
            placeholder={`Paste JSON array here... [ {"question_text": "Sample context?", "option_a": "..."}, {...} ]`}
            style={{ width: '100%', height: '90px', borderRadius: '6px', padding: '10px', fontFamily: 'monospace', border: '1px solid #cbd5e1' }}
          />
          <button onClick={handleBulkUpload} style={{ marginTop: '10px', backgroundColor: '#0f172a', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
            Upload into {selectedSubject} List
          </button>
        </div>
      )}

      {/* SINGLE QUESTION ENTRY/EDIT FORM */}
      {showForm && (
        <form onSubmit={handleSave} style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', marginBottom: '30px', display: 'grid', gap: '15px' }}>
          <h3 style={{ margin: '0 0 10px 0' }}>{editingId ? 'Modify' : 'Compose'} {selectedSubject} Question</h3>
          
          <textarea placeholder="Write your question body here..." value={formData.question_text} onChange={e => setFormData({...formData, question_text: e.target.value})} required style={{padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', minHeight: '60px'}}/>
          
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
            <input placeholder="Option A" value={formData.option_a} onChange={e => setFormData({...formData, option_a: e.target.value})} required style={{padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1'}}/>
            <input placeholder="Option B" value={formData.option_b} onChange={e => setFormData({...formData, option_b: e.target.value})} required style={{padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1'}}/>
            <input placeholder="Option C" value={formData.option_c} onChange={e => setFormData({...formData, option_c: e.target.value})} required style={{padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1'}}/>
            <input placeholder="Option D" value={formData.option_d} onChange={e => setFormData({...formData, option_d: e.target.value})} required style={{padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1'}}/>
          </div>
          
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
            <div>
              <label style={{fontSize: '13px', color: '#64748b', display: 'block', marginBottom: '4px'}}>Correct Target Answer</label>
              <select value={formData.correct_answer} onChange={e => setFormData({...formData, correct_answer: e.target.value})} style={{padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '100%'}}>
                <option value="Option A">Option A</option>
                <option value="Option B">Option B</option>
                <option value="Option C">Option C</option>
                <option value="Option D">Option D</option>
              </select>
            </div>
            <div>
              <label style={{fontSize: '13px', color: '#64748b', display: 'block', marginBottom: '4px'}}>Difficulty Setting</label>
              <select value={formData.difficulty} onChange={e => setFormData({...formData, difficulty: e.target.value})} style={{padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '100%'}}>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>
          
          <button type="submit" style={{ backgroundColor: '#16a34a', color: 'white', padding: '12px 25px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}>
            Commit {editingId ? 'Updates' : 'New Question'}
          </button>
        </form>
      )}

      {/* FILTERED QUESTION VIEW TABLE */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h3 style={{ margin: 0 }}>Showing Live {selectedSubject} Registry ({questions.length} Total)</h3>
      </div>

      {loading ? (
        <div style={{textAlign: 'center', padding: '40px', color: '#64748b'}}><Loader2 className="animate-spin" style={{display:'inline', marginRight:'8px'}} /> Sorting database items...</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <tr>
              <th style={{ padding: '15px', width: '80px' }}>ID</th>
              <th style={{ padding: '15px', width: '120px' }}>Subject</th>
              <th style={{ padding: '15px' }}>Question Prompt</th>
              <th style={{ padding: '15px', width: '100px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.length > 0 ? questions.map(q => (
              <tr key={q.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                <td style={{ padding: '15px', color: '#64748b' }}>{q.id}</td>
                <td style={{ padding: '15px' }}>
                  <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '4px 8px', borderRadius: '6px', fontSize: '13px', fontWeight: 'bold' }}>{q.subject}</span>
                </td>
                <td style={{ padding: '15px', fontWeight: '500' }}>{q.question_text}</td>
                <td style={{ padding: '15px', textAlign: 'center' }}>
                  <button onClick={() => { setFormData(q); setEditingId(q.id); setShowForm(true); }} style={{ marginRight: '12px', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}><Edit size={18}/></button>
                  <button onClick={() => handleDelete(q.id)} style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={18}/></button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} style={{padding: '40px', textAlign: 'center', color: '#94a3b8'}}>
                  No active database records found under the <strong>"{selectedSubject}"</strong> label.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Questions;