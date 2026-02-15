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

        // Optimistic update
        const previousStudents = [...students];
        setStudents(prev => prev.map(s => s.id === id ? { ...s, is_verified: status } : s));
        setProcessingIds(prev => new Set(prev).add(id));

        try {
            const endpoint = status ? `activity/profiles/${id}/verify/` : `activity/profiles/${id}/unverify/`;
            await api.post(endpoint);
            // Optional: Re-fetch to ensure sync, but the optimistic update already changed the state
            // fetchStudents(); 
        } catch (err) {
            console.error('Verification error:', err.response?.data || err.message);
            // Revert on error
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
        s.user.email.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Student Management</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage student profiles and verification.</p>
                </div>
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
                            placeholder="Search by name or email..."
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
                    <button className="btn" style={{ border: '1px solid var(--border)', gap: '0.5rem' }}>
                        <Filter size={18} /> Filter
                    </button>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#f8fafc' }}>
                        <tr style={{ textAlign: 'left' }}>
                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)' }}>Student</th>
                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)' }}>Room/Bed</th>
                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)' }}>Verification</th>
                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map((s) => (
                            <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem' }}>
                                            {s.user.username[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{s.user.first_name} {s.user.last_name}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    {s.current_bed ? (
                                        <div style={{ fontSize: '0.9rem' }}>
                                            <span style={{ fontWeight: '600' }}>Room {s.current_bed_details?.room_number || 'N/A'}</span>
                                            <span style={{ color: 'var(--text-muted)' }}> • Bed {s.current_bed_details?.identifier}</span>
                                        </div>
                                    ) : (
                                        <span style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: '500' }}>Not Allocated</span>
                                    )}
                                </td>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        {s.is_verified ? (
                                            <ShieldCheck size={16} color="var(--success)" />
                                        ) : (
                                            <ShieldAlert size={16} color="var(--warning)" />
                                        )}
                                        <span className={`badge badge-${s.is_verified ? 'success' : 'warning'}`}>
                                            {s.is_verified ? 'Verified' : 'Pending'}
                                        </span>
                                    </div>
                                </td>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => setSelectedStudent(s)}
                                            className="btn"
                                            style={{ padding: '0.4rem', border: '1px solid var(--border)' }}
                                            title="View Documents"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        {!s.is_verified ? (
                                            <button
                                                onClick={() => handleVerify(s.id, true)}
                                                className="btn btn-primary"
                                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', opacity: processingIds.has(s.id) ? 0.7 : 1 }}
                                                disabled={processingIds.has(s.id)}
                                            >
                                                {processingIds.has(s.id) ? 'Verifying...' : 'Verify Now'}
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleVerify(s.id, false)}
                                                className="btn"
                                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', border: '1px solid var(--danger)', color: 'var(--danger)', opacity: processingIds.has(s.id) ? 0.7 : 1 }}
                                                disabled={processingIds.has(s.id)}
                                            >
                                                {processingIds.has(s.id) ? 'Updating...' : 'Unverify'}
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* Document Modal */}
                {selectedStudent && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '1rem'
                    }}>
                        <div style={{
                            background: '#fff',
                            borderRadius: 'var(--radius)',
                            width: '100%',
                            maxWidth: '600px',
                            maxHeight: '90vh',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>Student Documents</h2>
                                <button onClick={() => setSelectedStudent(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '0.5rem' }}>
                                    <X size={24} />
                                </button>
                            </div>
                            <div style={{ padding: '1.5rem', overflowY: 'auto' }}>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Student Profile</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                            {selectedStudent.user.username[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '600' }}>{selectedStudent.user.first_name} {selectedStudent.user.last_name}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{selectedStudent.user.email}</div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Uploaded Documents</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {selectedStudent.photo && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <FileText size={20} color="var(--primary)" />
                                                    <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>Profile Photo</span>
                                                </div>
                                                <a href={selectedStudent.photo} target="_blank" rel="noreferrer" className="btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', border: '1px solid var(--border)', gap: '0.4rem' }}>
                                                    <ExternalLink size={14} /> View
                                                </a>
                                            </div>
                                        )}
                                        {selectedStudent.id_proof && (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <FileText size={20} color="var(--primary)" />
                                                    <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>ID Proof</span>
                                                </div>
                                                <a href={selectedStudent.id_proof} target="_blank" rel="noreferrer" className="btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', border: '1px solid var(--border)', gap: '0.4rem' }}>
                                                    <ExternalLink size={14} /> View
                                                </a>
                                            </div>
                                        )}
                                        {(!selectedStudent.photo && !selectedStudent.id_proof) && (
                                            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', background: '#f8fafc', borderRadius: 'var(--radius)', border: '1px dashed var(--border)' }}>
                                                No profile documents uploaded.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManagerStudents;
