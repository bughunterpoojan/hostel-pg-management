import { useState, useEffect } from 'react';
import api from '../api';
import { PlaneTakeoff, Plus, Calendar, Clock, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

const LeaveApplications = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        start_date: '',
        end_date: '',
        reason: ''
    });

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            const res = await api.get('activity/leaves/');
            setLeaves(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('activity/leaves/', formData);
            setFormData({ start_date: '', end_date: '', reason: '' });
            setShowForm(false);
            fetchLeaves();
        } catch (err) {
            console.error('Submission error:', err.response?.data || err.message);
            let errorMsg = 'Failed to submit application';
            if (err.response?.data) {
                if (typeof err.response.data === 'object') {
                    errorMsg = Object.entries(err.response.data).map(([k, v]) => `${k}: ${v}`).join('\n');
                } else if (typeof err.response.data === 'string') {
                    // Extract title from HTML if possible
                    const match = err.response.data.match(/<title>(.*?)<\/title>/);
                    errorMsg = match ? match[1] : 'Server Error (HTML response)';
                }
            }
            alert(`Error: ${errorMsg}`);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Leave Applications</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Apply for leave or track your application status.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn btn-primary"
                    style={{ gap: '0.5rem' }}
                >
                    {showForm ? 'Cancel' : <><Plus size={18} /> Apply for Leave</>}
                </button>
            </div>

            {showForm && (
                <div className="card" style={{ maxWidth: '600px' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.5rem' }}>New Leave Application</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Start Date</label>
                                <input
                                    type="date"
                                    required
                                    className="form-input"
                                    value={formData.start_date}
                                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                    style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>End Date</label>
                                <input
                                    type="date"
                                    required
                                    className="form-input"
                                    value={formData.end_date}
                                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                    style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
                                />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Reason for Leave</label>
                            <textarea
                                required
                                rows="4"
                                className="form-input"
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                placeholder="e.g., Visiting home for festival..."
                                style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', resize: 'vertical' }}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem', gap: '0.5rem', justifyContent: 'center' }}>
                            Submit Application
                        </button>
                    </form>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {leaves.length > 0 ? (
                    <div className="card" style={{ padding: '0' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ background: '#f8fafc' }}>
                                <tr style={{ textAlign: 'left' }}>
                                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)' }}>Duration</th>
                                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)' }}>Reason</th>
                                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)' }}>Applied On</th>
                                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaves.map((l) => (
                                    <tr key={l.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <Calendar size={16} color="var(--primary)" />
                                                <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{l.start_date} to {l.end_date}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>{l.reason}</td>
                                        <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                            {new Date(l.applied_at).toLocaleDateString()}
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <span className={`badge badge-${l.status === 'approved' ? 'success' : l.status === 'rejected' ? 'danger' : 'warning'}`}>
                                                {l.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="card" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                        <FileText size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                        <p>No leave applications found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeaveApplications;
