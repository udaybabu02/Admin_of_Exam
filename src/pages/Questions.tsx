import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, UploadCloud, Loader2 } from 'lucide-react';
import axios from 'axios';

interface Question {
  id: number; subject: string; question_text: string; difficulty: string; marks: number;
  option_a: string; option_b: string; option_c: string; option_d: string; correct_answer: string;
}

const Questions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [bulkText, setBulkText] = useState("");
  const [loading, setLoading] = useState(false);

  const initialForm = { subject: 'Java', difficulty: 'Medium', marks: 1, question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_answer: 'Option A' };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => { fetchQuestions(); }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/questions`);
      setQuestions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching questions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/questions/${editingId}`, formData);
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/questions`, formData);
      }
      setShowForm(false); setEditingId(null); setFormData(initialForm); fetchQuestions();
    } catch (err) {
      alert("Failed to save question.");
    }
  };

  const handleBulkUpload = async () => {
    try {
      const parsed = JSON.parse(bulkText);
      await axios.post(`${import.meta.env.VITE_API_URL}/api/questions/bulk`, { questions: parsed });
      alert("Set imported successfully!");
      setBulkText(""); fetchQuestions();
    } catch (e) { alert("Invalid JSON format!"); }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Delete this question?")) {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/questions/${id}`);
      fetchQuestions();
    }
  };

  return (
    <div style={{ textAlign: 'left' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>Manage Questions</h2>
        <button onClick={() => {setShowForm(!showForm); setEditingId(null); setFormData(initialForm);}} style={{ backgroundColor: '#2563eb', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          {showForm ? 'Cancel' : 'Add Question'}
        </button>
      </div>

      {!showForm && (
        <div style={{ backgroundColor: '#f1f5f9', padding: '20px', borderRadius: '12px', marginBottom: '30px', border: '2px dashed #cbd5e1' }}>
          <h4 style={{ margin: '0 0 10px 0' }}><UploadCloud size={18} /> Bulk Import (Set-wise)</h4>
          <textarea 
            value={bulkText} onChange={(e) => setBulkText(e.target.value)}
            placeholder='Paste JSON array here... [ {"subject": "Java", ...} ]'
            style={{ width: '100%', height: '80px', borderRadius: '6px', padding: '10px', fontFamily: 'monospace' }}
          />
          <button onClick={handleBulkUpload} style={{ marginTop: '10px', backgroundColor: '#0f172a', color: 'white', padding: '8px 15px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Upload Set</button>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSave} style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', marginBottom: '30px', display: 'grid', gap: '15px' }}>
            <input placeholder="Subject" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} required style={{padding: '8px', borderRadius: '4px', border: '1px solid #ccc'}}/>
            <textarea placeholder="Question Text" value={formData.question_text} onChange={e => setFormData({...formData, question_text: e.target.value})} required style={{padding: '8px', borderRadius: '4px', border: '1px solid #ccc'}}/>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
                <input placeholder="Option A" value={formData.option_a} onChange={e => setFormData({...formData, option_a: e.target.value})} required style={{padding: '8px', borderRadius: '4px', border: '1px solid #ccc'}}/>
                <input placeholder="Option B" value={formData.option_b} onChange={e => setFormData({...formData, option_b: e.target.value})} required style={{padding: '8px', borderRadius: '4px', border: '1px solid #ccc'}}/>
                <input placeholder="Option C" value={formData.option_c} onChange={e => setFormData({...formData, option_c: e.target.value})} required style={{padding: '8px', borderRadius: '4px', border: '1px solid #ccc'}}/>
                <input placeholder="Option D" value={formData.option_d} onChange={e => setFormData({...formData, option_d: e.target.value})} required style={{padding: '8px', borderRadius: '4px', border: '1px solid #ccc'}}/>
            </div>
            <select value={formData.correct_answer} onChange={e => setFormData({...formData, correct_answer: e.target.value})} style={{padding: '8px', borderRadius: '4px', border: '1px solid #ccc'}}>
                <option>Option A</option><option>Option B</option><option>Option C</option><option>Option D</option>
            </select>
          <button type="submit" style={{ backgroundColor: '#16a34a', color: 'white', padding: '12px 25px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>{editingId ? 'Update' : 'Save'} Question</button>
        </form>
      )}

      {loading ? (
        <div style={{textAlign: 'center', padding: '40px'}}><Loader2 className="animate-spin" /> Loading Questions...</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden' }}>
            <thead style={{ backgroundColor: '#f8fafc' }}>
            <tr>
                <th style={{ padding: '15px' }}>Subject</th>
                <th style={{ padding: '15px' }}>Question</th>
                <th style={{ padding: '15px' }}>Actions</th>
            </tr>
            </thead>
            <tbody>
            {questions?.length > 0 ? questions.map(q => (
                <tr key={q.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                <td style={{ padding: '15px' }}>{q.subject}</td>
                <td style={{ padding: '15px' }}>{q.question_text}</td>
                <td style={{ padding: '15px' }}>
                    <button onClick={() => { setFormData(q); setEditingId(q.id); setShowForm(true); }} style={{ marginRight: '10px', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}><Edit size={18}/></button>
                    <button onClick={() => handleDelete(q.id)} style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={18}/></button>
                </td>
                </tr>
            )) : <tr><td colSpan={3} style={{padding: '20px', textAlign: 'center'}}>No questions found.</td></tr>}
            </tbody>
        </table>
      )}
    </div>
  );
};

export default Questions;