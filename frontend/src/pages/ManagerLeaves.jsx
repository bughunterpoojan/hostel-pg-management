import { useState, useEffect } from 'react';
import api from '../api';
import { FileText, CheckCircle2, XCircle, Search, Filter, Calendar, Clock } from 'lucide-react';

const ManagerLeaves = () => {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

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

    const handleAction = async (id, status) => {
        try {
            await api.patch(`activity/leaves/${id}/`, { status });
            fetchLeaves();
        } catch (err) {
            console.error('Action failed:', err.response?.data || err.message);
            alert(`Action failed: ${JSON.stringify(err.response?.data) || err.message}`);
        }
    };

    const filteredLeaves = leaves.filter(l =>
        l.student_name?.toLowerCase().includes(search.toLowerCase()) ||
        l.reason.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return (
        <div style={{ padding: '4rem', textAlign: 'center' }}>
            <div className="animate-spin" style={{ display: 'inline-block', width: '30px', height: '30px', border: '3px solid var(--primary-glow)', borderTopColor: 'var(--primary)', borderRadius: '50%' }}></div>
            <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Fetching leave requests...</p>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: '800', letterSpacing: '-0.025em', color: 'var(--text-main)' }}>Leave Approvals</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Review and manage student out-of-station requests.</p>
                </div>
            </div>

            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem 2rem', background: '#fff', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
                        <Search size={18} style={{
                            position: 'absolute',
                            left: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--text-light)'
                        }} />
                        <input
                            type="text"
                            placeholder="Find student or reason..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem 0.75rem 2.5rem',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--border)',
                                outline: 'none',
                                transition: 'var(--transition)'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                        />
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', background: 'var(--bg-main)' }}>
                                <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Student Details</th>
                                <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Duration</th>
                                <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Reason</th>
                                <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                                <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Management</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLeaves.length > 0 ? filteredLeaves.map((l) => (
                                <tr key={l.id} style={{ borderBottom: '1px solid var(--border)', transition: 'var(--transition)' }}>
                                    <td style={{ padding: '1.5rem 2rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-glow)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.875rem' }}>
                                                {l.student_name?.[0]}
                                            </div>
                                            <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.9375rem' }}>{l.student_name}</div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.5rem 2rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-main)' }}>
                                                <Calendar size={14} style={{ color: 'var(--primary)' }} />
                                                <span>{new Date(l.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - {new Date(l.end_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: '600' }}>
                                                <Clock size={14} />
                                                <span>Applied on {new Date(l.created_at || Date.now()).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.5rem 2rem', fontSize: '0.9375rem', color: 'var(--text-muted)', maxWidth: '280px', lineHeight: '1.5' }}>{l.reason}</td>
                                    <td style={{ padding: '1.5rem 2rem' }}>
                                        <span className={`badge badge-${l.status === 'approved' ? 'success' : l.status === 'rejected' ? 'danger' : 'warning'}`}>
                                            {l.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.5rem 2rem', textAlign: 'right' }}>
                                        {l.status === 'pending' ? (
                                            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                                                <button
                                                    onClick={() => handleAction(l.id, 'approved')}
                                                    className="btn btn-primary"
                                                    style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem' }}
                                                >
                                                    <CheckCircle2 size={16} /> Approve
                                                </button>
                                                <button
                                                    onClick={() => handleAction(l.id, 'rejected')}
                                                    className="btn"
                                                    style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem', border: '1px solid var(--danger)', color: 'var(--danger)', background: 'transparent' }}
                                                    onMouseOver={(e) => e.target.style.background = '#fef2f2'}
                                                    onMouseOut={(e) => e.target.style.background = 'transparent'}
                                                >
                                                    <XCircle size={16} /> Reject
                                                </button>
                                            </div>
                                        ) : (
                                            <span style={{ fontSize: '0.8125rem', fontWeight: '700', color: 'var(--text-light)', fontStyle: 'italic' }}>No actions required</span>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-light)' }}>
                                        <FileText size={48} style={{ margin: '0 auto 1.5rem', opacity: 0.2 }} />
                                        <h3 style={{ fontSize: '1.125rem', fontWeight: '700' }}>No leave requests found</h3>
                                        <p style={{ marginTop: '0.5rem' }}>Any student leave applications will appear here.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManagerLeaves;
