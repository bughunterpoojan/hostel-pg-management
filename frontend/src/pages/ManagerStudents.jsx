import { useState, useEffect } from 'react';
import api from '../api';
import { Users, Search, Filter, ShieldCheck, ShieldAlert, MoreVertical, Eye, X, FileText, ExternalLink } from 'lucide-react';

const ManagerStudents = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [processingIds, setProcessingIds] = useState(new Set());

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await api.get('activity/profiles/');
            setStudents(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (id, status) => {
        if (!status && !window.confirm('Are you sure you want to unverify this student? This may affect their access.')) {
            return;
        }

        const previousStudents = [...students];
        setStudents(prev => prev.map(s => s.id === id ? { ...s, is_verified: status } : s));
        setProcessingIds(prev => new Set(prev).add(id));

        try {
            const endpoint = status ? `activity/profiles/${id}/verify/` : `activity/profiles/${id}/unverify/`;
            await api.post(endpoint);
        } catch (err) {
            console.error('Verification error:', err.response?.data || err.message);
            setStudents(previousStudents);
            const errorMsg = err.response?.data ? Object.entries(err.response.data).map(([k, v]) => `${k}: ${v}`).join('\n') : 'Failed to update verification status';
            alert(`Error: ${errorMsg}`);
        } finally {
            setProcessingIds(prev => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
        }
    };

    const filteredStudents = students.filter(s =>
        s.user.username.toLowerCase().includes(search.toLowerCase()) ||
        s.user.email.toLowerCase().includes(search.toLowerCase()) ||
        `${s.user.first_name} ${s.user.last_name}`.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return (
        <div style={{ padding: '4rem', textAlign: 'center' }}>
            <div className="animate-spin" style={{ display: 'inline-block', width: '30px', height: '30px', border: '3px solid var(--primary-glow)', borderTopColor: 'var(--primary)', borderRadius: '50%' }}></div>
            <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Loading student profiles...</p>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: '800', letterSpacing: '-0.025em', color: 'var(--text-main)' }}>Student Directory</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Manage all student registrations and verify documents.</p>
                </div>
            </div>

            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem 2rem', background: '#fff', borderBottom: '1px solid var(--border)', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                        <Search size={18} style={{
                            position: 'absolute',
                            left: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--text-light)'
                        }} />
                        <input
                            type="text"
                            placeholder="Search by name, email or ID..."
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
                    <button className="btn" style={{ border: '1px solid var(--border)', gap: '0.5rem', color: 'var(--text-main)', background: '#fff' }}>
                        <Filter size={18} /> Filter List
                    </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', background: 'var(--bg-main)' }}>
                                <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Identity</th>
                                <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Room Allocation</th>
                                <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verification Status</th>
                                <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Admin Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.length > 0 ? filteredStudents.map((s) => (
                                <tr key={s.id} style={{ borderBottom: '1px solid var(--border)', transition: 'var(--transition)' }}>
                                    <td style={{ padding: '1.5rem 2rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                            <div style={{
                                                width: '44px',
                                                height: '44px',
                                                borderRadius: '12px',
                                                background: 'var(--primary-glow)',
                                                color: 'var(--primary)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: '800',
                                                fontSize: '1rem',
                                                border: '1px solid rgba(99, 102, 241, 0.2)'
                                            }}>
                                                {s.user.username[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '800', fontSize: '0.9375rem', color: 'var(--text-main)' }}>{s.user.first_name} {s.user.last_name}</div>
                                                <div style={{ fontSize: '0.8125rem', color: 'var(--text-light)', fontWeight: '600' }}>{s.user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.5rem 2rem' }}>
                                        {s.current_bed ? (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{ padding: '0.375rem 0.75rem', borderRadius: '8px', background: 'var(--bg-main)', border: '1px solid var(--border)', fontSize: '0.8125rem', fontWeight: '700', color: 'var(--text-main)' }}>
                                                    R - {s.current_bed_details?.room_number || 'N/A'}
                                                </div>
                                                <span style={{ fontSize: '0.8125rem', color: 'var(--text-light)', fontWeight: '600' }}>Bed {s.current_bed_details?.identifier}</span>
                                            </div>
                                        ) : (
                                            <span style={{ fontSize: '0.8125rem', color: '#f59e0b', fontWeight: '700', background: '#fffbeb', padding: '0.375rem 0.75rem', borderRadius: '8px', border: '1px solid #fef3c7' }}>Unallocated</span>
                                        )}
                                    </td>
                                    <td style={{ padding: '1.5rem 2rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            {s.is_verified ? (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)' }}>
                                                    <ShieldCheck size={18} />
                                                    <span className="badge badge-success" style={{ padding: '0.25rem 0.75rem' }}>Verified</span>
                                                </div>
                                            ) : (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f59e0b' }}>
                                                    <ShieldAlert size={18} />
                                                    <span className="badge badge-warning" style={{ padding: '0.25rem 0.75rem' }}>Pending</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.5rem 2rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                                            <button
                                                onClick={() => setSelectedStudent(s)}
                                                className="btn"
                                                style={{ padding: '0.5rem', border: '1px solid var(--border)', background: '#fff' }}
                                                title="View KYC Documents"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            {!s.is_verified ? (
                                                <button
                                                    onClick={() => handleVerify(s.id, true)}
                                                    className="btn btn-primary"
                                                    style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem', minWidth: '100px', opacity: processingIds.has(s.id) ? 0.7 : 1 }}
                                                    disabled={processingIds.has(s.id)}
                                                >
                                                    {processingIds.has(s.id) ? 'Processing...' : 'Verify Now'}
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleVerify(s.id, false)}
                                                    className="btn"
                                                    style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem', minWidth: '100px', border: '1px solid var(--danger)', color: 'var(--danger)', background: 'transparent', opacity: processingIds.has(s.id) ? 0.7 : 1 }}
                                                    disabled={processingIds.has(s.id)}
                                                    onMouseOver={(e) => e.target.style.background = '#fef2f2'}
                                                    onMouseOut={(e) => e.target.style.background = 'transparent'}
                                                >
                                                    {processingIds.has(s.id) ? 'Wait...' : 'Unverify'}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', padding: '5rem' }}>
                                        <Users size={48} style={{ margin: '0 auto 1.5rem', opacity: 0.1, color: 'var(--text-main)' }} />
                                        <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--text-muted)' }}>No students found matching your search</h3>
                                        <p style={{ color: 'var(--text-light)', marginTop: '0.5rem' }}>Try using a different name or email address.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Document Modal */}
                {selectedStudent && (
                    <div style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(15, 23, 42, 0.6)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '1.5rem'
                    }}>
                        <div className="card" style={{
                            width: '100%',
                            maxWidth: '600px',
                            maxHeight: '90vh',
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '0',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                            border: '1px solid #e2e8f0'
                        }}>
                            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-main)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ padding: '0.5rem', borderRadius: '10px', background: 'var(--primary-glow)', color: 'var(--primary)' }}>
                                        <FileText size={20} />
                                    </div>
                                    <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.025em' }}>Document Verification</h2>
                                </div>
                                <button onClick={() => setSelectedStudent(null)} style={{ border: 'none', background: 'var(--bg-main)', color: 'var(--text-light)', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <X size={20} />
                                </button>
                            </div>

                            <div style={{ padding: '2rem', overflowY: 'auto' }}>
                                <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '1.25rem', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)' }}>
                                        {selectedStudent.user.username[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '1.125rem', fontWeight: '800', color: 'var(--text-main)' }}>{selectedStudent.user.first_name} {selectedStudent.user.last_name}</div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '600', marginTop: '0.125rem' }}>{selectedStudent.user.email}</div>
                                    </div>
                                </div>

                                <h3 style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>Uploaded Proofs</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {[
                                        { label: 'Passport Size Photo', url: selectedStudent.photo },
                                        { label: 'Identification Document', url: selectedStudent.id_proof }
                                    ].map((doc, idx) => (
                                        <div key={idx} style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '1.25rem',
                                            background: doc.url ? 'var(--bg-main)' : '#f8fafc',
                                            borderRadius: '12px',
                                            border: '1px solid var(--border)'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{ color: doc.url ? 'var(--primary)' : 'var(--text-light)' }}>
                                                    <FileText size={20} />
                                                </div>
                                                <span style={{ fontSize: '0.9375rem', fontWeight: '700', color: doc.url ? 'var(--text-main)' : 'var(--text-light)' }}>{doc.label}</span>
                                            </div>
                                            {doc.url ? (
                                                <a href={doc.url} target="_blank" rel="noreferrer" className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem', background: '#fff', border: '1px solid var(--border)', gap: '0.5rem', color: 'var(--text-main)' }}>
                                                    <ExternalLink size={14} /> Open File
                                                </a>
                                            ) : (
                                                <span style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-light)', fontStyle: 'italic' }}>Not uploaded</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', background: 'var(--bg-main)' }}>
                                <button
                                    onClick={() => setSelectedStudent(null)}
                                    className="btn btn-primary"
                                    style={{ padding: '0.75rem 2rem', fontSize: '0.9375rem' }}
                                >
                                    Done Reviewing
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManagerStudents;
