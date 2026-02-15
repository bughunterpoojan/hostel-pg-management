import { useState, useEffect } from 'react';
import api from '../api';
import { MessageSquare, Plus, AlertCircle, Clock, CheckCircle2, User, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Complaints = () => {
    const { user } = useAuth();
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
            fetchComplaints();
        } catch (err) {
            console.error('Complaint submission error:', err.response?.data || err.message);
            let errorMsg = 'Failed to submit complaint';
            if (err.response?.data) {
                errorMsg = typeof err.response.data === 'object'
                    ? Object.entries(err.response.data).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join('\n')
                    : err.response.data;
            }
            alert(`Error: ${errorMsg}`);
        }
    };

    if (loading) return (
        <div style={{ padding: '4rem', textAlign: 'center' }}>
            <div className="animate-spin" style={{ display: 'inline-block', width: '30px', height: '30px', border: '3px solid var(--primary-glow)', borderTopColor: 'var(--primary)', borderRadius: '50%' }}></div>
            <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Loading records...</p>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: '800', letterSpacing: '-0.025em', color: 'var(--text-main)' }}>Complaint Records</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Track and manage all maintenance requests.</p>
                </div>
                {user?.role !== 'manager' && (
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="btn btn-primary"
                        style={{ padding: '0.75rem 1.5rem', borderRadius: '14px', fontWeight: '700', fontSize: '0.875rem' }}
                    >
                        {showForm ? 'Cancel Request' : <><Plus size={20} /> <span className="hide-mobile">New Complaint</span><span className="show-mobile">New</span></>}
                    </button>
                )}
            </div>
            <style>{`
                @media (max-width: 640px) {
                    .hide-mobile { display: none; }
                    .show-mobile { display: inline; }
                }
                @media (min-width: 641px) {
                    .show-mobile { display: none; }
                }
            `}</style>

            {showForm && (
                <div className="card" style={{ maxWidth: '600px', padding: '2rem', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                        <div style={{ padding: '0.625rem', borderRadius: '12px', background: 'var(--primary-glow)', color: 'var(--primary)' }}>
                            <Plus size={24} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>Raise a New Issue</h3>
                    </div>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Subject / Issue Title</label>
                            <input
                                type="text"
                                required
                                value={newComplaint.title}
                                onChange={(e) => setNewComplaint({ ...newComplaint, title: e.target.value })}
                                placeholder="e.g., Water leakage in bathroom B-204"
                                style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', border: '1.5px solid var(--border)', fontSize: '0.9375rem', fontWeight: '600', outline: 'none' }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Detailed Description</label>
                            <textarea
                                required
                                rows="4"
                                value={newComplaint.description}
                                onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
                                placeholder="Describe the issue clearly..."
                                style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1.5px solid var(--border)', resize: 'vertical', fontSize: '0.9375rem', fontWeight: '500', lineHeight: '1.6', outline: 'none' }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ padding: '1rem', fontSize: '1rem', fontWeight: '800', borderRadius: '12px' }}>
                            <Send size={18} /> Submit Maintenance Request
                        </button>
                    </form>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {complaints.length > 0 ? complaints.map((c) => (
                    <div key={c.id} className="card complaint-item" style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1.5rem 2rem',
                        gap: '1.5rem'
                    }}>
                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flex: 1 }}>
                            <div style={{
                                width: '52px',
                                height: '52px',
                                borderRadius: '14px',
                                background: 'var(--primary-glow)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--primary)',
                                border: '1px solid rgba(99, 102, 241, 0.2)',
                                flexShrink: 0
                            }}>
                                <MessageSquare size={24} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.01em' }}>{c.title}</h3>
                                <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)', marginTop: '0.25rem', lineHeight: '1.5' }}>{c.description}</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-light)' }}>
                                        <Clock size={14} />
                                        <span>Reported on {new Date(c.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                    {c.assigned_to_name && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-light)' }}>
                                            <User size={14} />
                                            <span>Staff: {c.assigned_to_name}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-end', minWidth: '160px' }}>
                            <span className={`badge badge-${c.status === 'resolved' ? 'success' : c.status === 'in_progress' ? 'info' : 'warning'}`}>
                                {c.status?.replace('_', ' ') || 'Pending'}
                            </span>
                            {c.remarks && (
                                <div style={{
                                    fontSize: '0.8125rem',
                                    fontStyle: 'italic',
                                    color: 'var(--text-muted)',
                                    paddingLeft: '1rem',
                                    borderLeft: '2px solid var(--border)',
                                    maxWidth: '220px',
                                    textAlign: 'left'
                                }}>
                                    "{c.remarks}"
                                </div>
                            )}
                        </div>
                        <style>{`
                            @media (max-width: 768px) {
                                .complaint-item { flex-direction: column; align-items: flex-start !important; padding: 1.5rem !important; }
                                .complaint-item div:last-child { text-align: left !important; align-items: flex-start !important; min-width: auto !important; }
                            }
                        `}</style>
                    </div>
                )) : (
                    <div className="card" style={{ textAlign: 'center', padding: '5rem', background: 'transparent', border: '2px dashed var(--border)' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--text-light)' }}>
                            <MessageSquare size={32} />
                        </div>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--text-muted)' }}>No maintenance requests found</h3>
                        <p style={{ color: 'var(--text-light)', marginTop: '0.5rem' }}>All your reported issues will appear here for tracking.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Complaints;
