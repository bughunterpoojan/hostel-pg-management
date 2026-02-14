import { useState, useEffect } from 'react';
import api from '../api';
import { MessageSquare, CheckCircle2, Save, Edit, XCircle, Clock } from 'lucide-react';

const StaffDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ status: '', remarks: '' });

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

    const handleUpdate = async (id) => {
        try {
            await api.patch(`activity/complaints/${id}/`, editForm);
            setEditingId(null);
            fetchComplaints();
        } catch (err) {
            alert('Update failed');
        }
    };

    const startEdit = (c) => {
        setEditingId(c.id);
        setEditForm({ status: c.status, remarks: c.remarks || '' });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'resolved': return 'badge-success';
            case 'in_progress': return 'badge-info';
            default: return 'badge-warning';
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Maintenance Staff Dashboard</h1>
                <p style={{ color: 'var(--text-muted)' }}>Manage and resolve assigned complaints.</p>
            </div>

            <div className="card">
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>Assigned Complaints</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {complaints.length > 0 ? complaints.map((c) => (
                        <div key={c.id} className="card" style={{ padding: '1.5rem', border: '1px solid var(--border)', background: c.status === 'resolved' ? '#f8fafc' : '#fff' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', gap: '1.25rem' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: 'var(--radius)',
                                        background: '#f1f5f9',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--primary)'
                                    }}>
                                        <MessageSquare size={20} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>{c.title}</h3>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                            Student: {c.student_name} • Room: {c.room_number || 'N/A'}
                                        </p>
                                        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>{c.description}</p>
                                        {c.remarks && (
                                            <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#eff6ff', borderRadius: '4px', fontSize: '0.875rem' }}>
                                                <span style={{ fontWeight: '600' }}>Remarks:</span> {c.remarks}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                                    <div className={`badge ${getStatusColor(c.status)}`}>
                                        {c.status?.replace('_', ' ') || 'Pending'}
                                    </div>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(c.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>

                            {editingId === c.id ? (
                                <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '500', marginBottom: '0.4rem' }}>Status</label>
                                            <select
                                                value={editForm.status}
                                                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                                className="form-input"
                                                style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="in_progress">In Progress</option>
                                                <option value="resolved">Resolved</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '500', marginBottom: '0.4rem' }}>Work Description / Remarks</label>
                                            <input
                                                type="text"
                                                value={editForm.remarks}
                                                onChange={(e) => setEditForm({ ...editForm, remarks: e.target.value })}
                                                className="form-input"
                                                placeholder="e.g., Replaced the broken part"
                                                style={{ width: '100%', padding: '0.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
                                            />
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button onClick={() => handleUpdate(c.id)} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem', gap: '0.4rem' }}>
                                            <Save size={16} /> Save Changes
                                        </button>
                                        <button onClick={() => setEditingId(null)} className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem', border: '1px solid var(--border)', gap: '0.4rem' }}>
                                            <XCircle size={16} /> Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                c.status !== 'resolved' && (
                                    <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem' }}>
                                        <button onClick={() => startEdit(c)} className="btn btn-primary" style={{ fontSize: '0.8125rem', gap: '0.4rem' }}>
                                            <Edit size={14} /> Update Task
                                        </button>
                                    </div>
                                )
                            )}
                        </div>
                    )) : (
                        <div className="card" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                            <MessageSquare size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                            <p>No complaints assigned yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StaffDashboard;
