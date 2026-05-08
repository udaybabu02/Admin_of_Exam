import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, UploadCloud } from 'lucide-react';
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

  const initialForm = { subject: 'Java', difficulty: 'Medium', marks: 1, question_text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_answer: 'Option A' };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => { fetchQuestions(); }, []);

  const fetchQuestions = async () => {
    // UPDATED URL
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/questions`);
    setQuestions(res.data);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      // UPDATED URL
      await axios.put(`${import.meta.env.VITE_API_URL}/api/questions/${editingId}`, formData);
    } else {
      // UPDATED URL
      await axios.post(`${import.meta.env.VITE_API_URL}/api/questions`, formData);
    }
    setShowForm(false); setEditingId(null); setFormData(initialForm); fetchQuestions();
  };

  const handleBulkUpload = async () => {
    try {
      const parsed = JSON.parse(bulkText);
      // UPDATED URL
      await axios.post(`${import.meta.env.VITE_API_URL}/api/questions/bulk`, { questions: parsed });
      alert("Set imported successfully!");
      setBulkText(""); fetchQuestions();
    } catch (e) { alert("Invalid JSON format!"); }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Delete?")) {
      // UPDATED URL
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/questions/${id}`);
      fetchQuestions();
    }
  };

  return (
    <div style={{ textAlign: 'left' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>Manage Questions</h2>
        <button onClick={() => setShowForm(!showForm)} style={{ backgroundColor: '#2563eb', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          {showForm ? 'Cancel' : 'Add Question'}
        </button>
      </div>

      {/* BULK IMPORT SECTION */}
      {!showForm && (
        <div style={{ backgroundColor: '#f1f5f9', padding: '20px', borderRadius: '12px', marginBottom: '30px', border: '2px dashed #cbd5e1' }}>
          <h4 style={{ margin: '0 0 10px 0' }}><UploadCloud size={18} /> Bulk Import (Set-wise)</h4>
          <textarea 
            value={bulkText} onChange={(e) => setBulkText(e.target.value)}
            placeholder='Paste JSON array here... [ {"subject": "Java", ...}, {...} ]'
            style={{ width: '100%', height: '80px', borderRadius: '6px', padding: '10px', fontFamily: 'monospace' }}
          />
          <button onClick={handleBulkUpload} style={{ marginTop: '10px', backgroundColor: '#0f172a', color: 'white', padding: '8px 15px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Upload Set</button>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSave} style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
          {/* ... Existing Form Fields ... */}
          <button type="submit" style={{ backgroundColor: '#16a34a', color: 'white', padding: '12px 25px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Save</button>
        </form>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden' }}>
        <thead style={{ backgroundColor: '#f8fafc' }}>
          <tr>
            <th style={{ padding: '15px' }}>ID</th>
            <th style={{ padding: '15px' }}>Subject</th>
            <th style={{ padding: '15px' }}>Question</th>
            <th style={{ padding: '15px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions.map(q => (
            <tr key={q.id} style={{ borderTop: '1px solid #f1f5f9' }}>
              <td style={{ padding: '15px' }}>{q.id}</td>
              <td style={{ padding: '15px' }}>{q.subject}</td>
              <td style={{ padding: '15px' }}>{q.question_text}</td>
              <td style={{ padding: '15px' }}>
                <button onClick={() => { setFormData(q); setEditingId(q.id); setShowForm(true); }} style={{ marginRight: '10px', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}><Edit size={18}/></button>
                <button onClick={() => handleDelete(q.id)} style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={18}/></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Questions;