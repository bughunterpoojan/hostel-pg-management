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
                    const match = err.response.data.match(/<title>(.*?)<\/title>/);
                    errorMsg = match ? match[1] : 'Server Error (HTML response)';
                }
            }
            alert(`Error: ${errorMsg}`);
        }
    };

    if (loading) return (
        <div style={{ padding: '4rem', textAlign: 'center' }}>
            <div className="animate-spin" style={{ display: 'inline-block', width: '30px', height: '30px', border: '3px solid var(--primary-glow)', borderTopColor: 'var(--primary)', borderRadius: '50%' }}></div>
            <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Retrieving records...</p>
        </div>
    );

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: '800', letterSpacing: '-0.025em', color: 'var(--text-main)' }}>Leave Ledger</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Formal requests for weekend exits or vacation periods.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className={`btn ${showForm ? '' : 'btn-primary'}`}
                    style={{
                        padding: '0.75rem 1.5rem',
                        borderRadius: '14px',
                        fontWeight: '800',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        boxShadow: showForm ? 'none' : 'var(--shadow-lg)',
                        background: showForm ? 'var(--bg-main)' : undefined,
                        border: showForm ? '1px solid var(--border)' : undefined,
                        color: showForm ? 'var(--text-main)' : undefined,
                        fontSize: '0.875rem'
                    }}
                >
                    {showForm ? 'Close Portal' : <><Plus size={20} /> <span className="hide-mobile">New Application</span><span className="show-mobile">Apply</span></>}
                </button>
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
                <div className="card" style={{ maxWidth: '600px', margin: '0 auto', width: '100%', padding: '2rem', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)', animation: 'slideDown 0.3s ease-out' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                        <div style={{ padding: '0.625rem', borderRadius: '12px', background: 'var(--primary-glow)', color: 'var(--primary)' }}>
                            <PlaneTakeoff size={24} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>Draft Leave Request</h3>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Travel Start</label>
                                <div style={{ position: 'relative' }}>
                                    <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }}>
                                        <Calendar size={18} />
                                    </div>
                                    <input
                                        type="date"
                                        required
                                        className="form-input"
                                        value={formData.start_date}
                                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                        style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 3rem', borderRadius: '14px', border: '1.5px solid var(--border)', fontSize: '0.9375rem', fontWeight: '600' }}
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Return Path</label>
                                <div style={{ position: 'relative' }}>
                                    <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }}>
                                        <Calendar size={18} />
                                    </div>
                                    <input
                                        type="date"
                                        required
                                        className="form-input"
                                        value={formData.end_date}
                                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                        style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 3rem', borderRadius: '14px', border: '1.5px solid var(--border)', fontSize: '0.9375rem', fontWeight: '600' }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>Reason for Absence</label>
                            <textarea
                                required
                                rows="4"
                                className="form-input"
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                placeholder="State clearly the purpose of your leave (e.g., Family Emergency, Festival, Academic Seminar)..."
                                style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '1.5px solid var(--border)', resize: 'none', fontSize: '0.9375rem', fontWeight: '500', lineHeight: '1.6' }}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ padding: '1rem', gap: '0.75rem', justifyContent: 'center', borderRadius: '14px', fontWeight: '800', fontSize: '1rem' }}>
                            Submit Form to Management
                        </button>
                    </form>
                </div>
            )}

            <div className="card" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0' }}>
                        <thead style={{ background: 'var(--bg-main)' }}>
                            <tr>
                                <th style={{ padding: '1.25rem 2rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Duration</th>
                                <th style={{ padding: '1.25rem 2rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Justification</th>
                                <th style={{ padding: '1.25rem 2rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Applied Time</th>
                                <th style={{ padding: '1.25rem 2rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verification Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaves.map((l, idx) => (
                                <tr key={l.id} style={{ borderBottom: idx === leaves.length - 1 ? 'none' : '1px solid var(--border-light)' }} className="table-row-hover">
                                    <td style={{ padding: '1.5rem 2rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ padding: '0.625rem', borderRadius: '10px', background: 'var(--primary-glow)', color: 'var(--primary)' }}>
                                                <Calendar size={18} />
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.9375rem', fontWeight: '700', color: 'var(--text-main)' }}>{l.start_date}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: '600' }}>thru {l.end_date}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.5rem 2rem' }}>
                                        <p style={{ fontSize: '0.9375rem', color: 'var(--text-main)', fontWeight: '500', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.reason}</p>
                                    </td>
                                    <td style={{ padding: '1.5rem 2rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-light)', fontSize: '0.875rem', fontWeight: '600' }}>
                                            <Clock size={14} />
                                            {new Date(l.applied_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.5rem 2rem', textAlign: 'right' }}>
                                        <span className={`badge badge-${l.status === 'approved' ? 'success' : l.status === 'rejected' ? 'danger' : 'warning'}`} style={{
                                            padding: '0.5rem 1rem',
                                            fontSize: '0.75rem',
                                            borderRadius: '10px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.025em',
                                            fontWeight: '800'
                                        }}>
                                            {l.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {leaves.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '6rem', background: '#fff' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--text-light)' }}>
                            <PlaneTakeoff size={40} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.025em' }}>History is Empty</h3>
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontWeight: '500' }}>Apply for your first leave using the button above.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeaveApplications;
