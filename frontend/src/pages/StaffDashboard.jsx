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

    if (loading) return (
        <div style={{ padding: '4rem', textAlign: 'center' }}>
            <div className="animate-spin" style={{ display: 'inline-block', width: '30px', height: '30px', border: '3px solid var(--primary-glow)', borderTopColor: 'var(--primary)', borderRadius: '50%' }}></div>
            <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Updating your task list...</p>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: '800', letterSpacing: '-0.025em', color: 'var(--text-main)' }}>Maintenance Console</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Manage and track your assigned technical tasks.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ padding: '0.625rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.625rem', background: '#fff' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite' }}></div>
                        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-main)' }}>SYSTEM ONLINE</span>
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                    <div style={{ padding: '0.625rem', borderRadius: '12px', background: 'var(--primary-glow)', color: 'var(--primary)' }}>
                        <Clock size={24} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.025em' }}>Assigned Workload</h2>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{complaints.filter(c => c.status !== 'resolved').length} issues require attention</p>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {complaints.length > 0 ? complaints.map((c) => (
                        <div key={c.id} className="card" style={{
                            padding: '1.5rem 2rem',
                            border: '1px solid var(--border)',
                            background: c.status === 'resolved' ? 'var(--bg-main)' : '#fff',
                            transition: 'var(--transition)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', gap: '1.5rem', flex: 1 }}>
                                    <div style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '14px',
                                        background: 'var(--bg-main)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--primary)',
                                        border: '1px solid var(--border-light)'
                                    }}>
                                        <MessageSquare size={22} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <h3 style={{ fontSize: '1.125rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.01em' }}>{c.title}</h3>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: '700' }}>#{c.id.toString().padStart(4, '0')}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem', fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                                            <span>Student: {c.student_name}</span>
                                            <span>•</span>
                                            <span>Room: {c.room_number || 'N/A'}</span>
                                        </div>
                                        <p style={{ fontSize: '0.9375rem', marginTop: '1rem', color: 'var(--text-main)', lineHeight: '1.6' }}>{c.description}</p>

                                        {c.remarks && (
                                            <div style={{
                                                marginTop: '1.25rem',
                                                padding: '1rem 1.25rem',
                                                background: 'var(--bg-main)',
                                                borderRadius: '12px',
                                                fontSize: '0.875rem',
                                                border: '1px solid var(--border)',
                                                display: 'flex',
                                                gap: '0.75rem',
                                                color: 'var(--text-muted)'
                                            }}>
                                                <Edit size={16} />
                                                <span><span style={{ fontWeight: '800', color: 'var(--text-main)' }}>Latest Update:</span> {c.remarks}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-end', minWidth: '140px' }}>
                                    <div className={`badge ${getStatusColor(c.status)}`}>
                                        {c.status?.replace('_', ' ') || 'Pending'}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: '600' }}>
                                        <Clock size={12} />
                                        <span>{new Date(c.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                    </div>
                                </div>
                            </div>

                            {editingId === c.id ? (
                                <div style={{
                                    marginTop: '2rem',
                                    paddingTop: '2rem',
                                    borderTop: '1.5px dashed var(--border)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1.5rem'
                                }}>
                                    <div className="actions-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.625rem' }}>Progress</label>
                                            <select
                                                value={editForm.status}
                                                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1.5px solid var(--border)', background: '#fff', outline: 'none', fontWeight: '600', color: 'var(--text-main)', fontSize: '0.875rem' }}
                                            >
                                                <option value="pending">🟡 Pending</option>
                                                <option value="in_progress">🔵 In Progress</option>
                                                <option value="resolved">🟢 Resolved</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.625rem' }}>Remarks</label>
                                            <input
                                                type="text"
                                                value={editForm.remarks}
                                                onChange={(e) => setEditForm({ ...editForm, remarks: e.target.value })}
                                                placeholder="Action taken..."
                                                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1.5px solid var(--border)', background: '#fff', outline: 'none', fontSize: '0.875rem' }}
                                                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                                                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                                            />
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                        <button onClick={() => setEditingId(null)} className="btn" style={{ padding: '0.75rem 1.5rem', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                                            <XCircle size={18} /> Discard Changes
                                        </button>
                                        <button onClick={() => handleUpdate(c.id)} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
                                            <Save size={18} /> Update & Sync Task
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                c.status !== 'resolved' && (
                                    <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                                        <button onClick={() => startEdit(c)} className="btn" style={{
                                            padding: '0.625rem 1.25rem',
                                            fontSize: '0.875rem',
                                            gap: '0.5rem',
                                            background: '#fff',
                                            border: '1px solid var(--border)',
                                            color: 'var(--primary)',
                                            fontWeight: '700'
                                        }}>
                                            <Edit size={16} /> Edit Progress Note
                                        </button>
                                        <button
                                            onClick={() => {
                                                setEditForm({ status: 'resolved', remarks: 'Work completed as requested.' });
                                                handleUpdate(c.id);
                                            }}
                                            className="btn btn-primary"
                                            style={{ fontSize: '0.875rem', gap: '0.5rem', padding: '0.625rem 1.25rem' }}
                                        >
                                            <CheckCircle2 size={16} /> Mark as Resolved
                                        </button>
                                    </div>
                                )
                            )}
                        </div>
                    )) : (
                        <div className="card" style={{ textAlign: 'center', padding: '6rem', background: 'transparent', border: '2px dashed var(--border)' }}>
                            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--text-light)' }}>
                                <MessageSquare size={36} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-light)' }}>No active complaints assigned</h3>
                            <p style={{ color: 'var(--text-light)', marginTop: '0.5rem' }}>All issues assigned to you will be listed here for management.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StaffDashboard;
