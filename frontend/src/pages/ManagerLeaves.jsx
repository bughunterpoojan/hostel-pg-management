import { useState, useEffect } from 'react';
import api from '../api';
import { FileText, CheckCircle2, XCircle, Search, Filter, Calendar } from 'lucide-react';

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

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Leave Approvals</h1>
                <p style={{ color: 'var(--text-muted)' }}>Review and respond to out-of-station requests.</p>
            </div>

            <div className="card" style={{ padding: '0' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '1rem' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search size={18} style={{
                            position: 'absolute',
                            left: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--text-muted)'
                        }} />
                        <input
                            type="text"
                            placeholder="Search by student or reason..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.625rem 1rem 0.625rem 2.5rem',
                                borderRadius: 'var(--radius)',
                                border: '1px solid var(--border)',
                                outline: 'none'
                            }}
                        />
                    </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#f8fafc' }}>
                        <tr style={{ textAlign: 'left' }}>
                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)' }}>Student</th>
                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)' }}>Duration</th>
                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)' }}>Reason</th>
                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)' }}>Status</th>
                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLeaves.map((l) => (
                            <tr key={l.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>{l.student_name}</td>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                        <Calendar size={14} color="var(--primary)" />
                                        <span>{l.start_date} to {l.end_date}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>{l.reason}</td>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <span className={`badge badge-${l.status === 'approved' ? 'success' : l.status === 'rejected' ? 'danger' : 'warning'}`}>
                                        {l.status}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    {l.status === 'pending' && (
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => handleAction(l.id, 'approved')}
                                                className="btn btn-primary"
                                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', gap: '0.4rem' }}
                                            >
                                                <CheckCircle2 size={14} /> Approve
                                            </button>
                                            <button
                                                onClick={() => handleAction(l.id, 'rejected')}
                                                className="btn"
                                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', border: '1px solid var(--danger)', color: 'var(--danger)', gap: '0.4rem' }}
                                            >
                                                <XCircle size={14} /> Reject
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManagerLeaves;
