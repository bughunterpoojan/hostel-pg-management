import { useState, useEffect } from 'react';
import api from '../api';
import { MessageSquare, Plus, AlertCircle, Clock, CheckCircle2, User, Send } from 'lucide-react';

const Complaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newComplaint, setNewComplaint] = useState({ title: '', description: '' });

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const res = await api.get('activity/complaints/');
            setComplaints(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('activity/complaints/', newComplaint);
            setNewComplaint({ title: '', description: '' });
            setShowForm(false);
            alert('Complaint submitted successfully! 🛠️');
            fetchComplaints();
        } catch (err) {
            console.error('Complaint submission error:', err.response?.data || err.message);
            const errorMsg = err.response?.data ? Object.entries(err.response.data).map(([k, v]) => `${k}: ${v}`).join('\n') : 'Failed to submit complaint';
            alert(`Error: ${errorMsg}`);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Complaint Management</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Report and track maintenance issues.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn btn-primary"
                    style={{ gap: '0.5rem' }}
                >
                    {showForm ? 'Cancel' : <><Plus size={18} /> New Complaint</>}
                </button>
            </div>

            {showForm && (
                <div className="card" style={{ maxWidth: '600px' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.5rem' }}>Raise a New Issue</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Subject / Title</label>
                            <input
                                type="text"
                                required
                                className="form-input"
                                value={newComplaint.title}
                                onChange={(e) => setNewComplaint({ ...newComplaint, title: e.target.value })}
                                placeholder="e.g., Water leakage in bathroom"
                                style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Description</label>
                            <textarea
                                required
                                rows="4"
                                className="form-input"
                                value={newComplaint.description}
                                onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
                                placeholder="Describe the issue in detail..."
                                style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', resize: 'vertical' }}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem', gap: '0.5rem' }}>
                            <Send size={18} /> Submit Complaint
                        </button>
                    </form>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {complaints.length > 0 ? complaints.map((c) => (
                    <div key={c.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                            <div style={{
                                padding: '0.75rem',
                                borderRadius: 'var(--radius)',
                                background: '#f1f5f9',
                                color: 'var(--primary)'
                            }}>
                                <MessageSquare size={24} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>{c.title}</h3>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{c.description}</p>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    <span>Reported on {new Date(c.created_at).toLocaleDateString()}</span>
                                    {c.assigned_to_name && <span>Assigned to: {c.assigned_to_name}</span>}
                                </div>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                            <span className={`badge badge-${c.status === 'resolved' ? 'success' : c.status === 'in_progress' ? 'info' : 'warning'}`}>
                                {c.status?.replace('_', ' ') || 'Pending'}
                            </span>
                            {c.remarks && (
                                <div style={{ fontSize: '0.75rem', fontStyle: 'italic', maxWidth: '200px', color: 'var(--text-muted)' }}>
                                    "{c.remarks}"
                                </div>
                            )}
                        </div>
                    </div>
                )) : (
                    <div className="card" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                        <MessageSquare size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                        <p>No complaints found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Complaints;
