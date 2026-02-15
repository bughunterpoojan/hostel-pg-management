import { useState, useEffect } from 'react';
import api from '../api';
import { User, Camera, FileText, CheckCircle, Clock, AlertCircle, Upload } from 'lucide-react';

const StudentProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('activity/profiles/');
            if (res.data.length > 0) {
                setProfile(res.data[0]);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append(type === 'photo' ? 'photo' : 'file', file);
        if (type === 'doc') formData.append('doc_type', 'aadhar');

        try {
            if (type === 'photo') {
                await api.patch(`activity/profiles/${profile.id}/`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('activity/documents/', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            fetchProfile();
        } catch (err) {
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    if (loading) return (
        <div style={{ padding: '4rem', textAlign: 'center' }}>
            <div className="animate-spin" style={{ display: 'inline-block', width: '30px', height: '30px', border: '3px solid var(--primary-glow)', borderTopColor: 'var(--primary)', borderRadius: '50%' }}></div>
            <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Fetching your profile...</p>
        </div>
    );

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            <div className="profile-header-card" style={{
                padding: '2.5rem',
                background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
                color: '#fff',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '24px',
                border: 'none',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}>
                <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '300px', height: '300px', background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)', opacity: 0.15 }}></div>

                <div className="profile-content" style={{ display: 'flex', gap: '2.5rem', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                        <div style={{
                            width: '140px',
                            height: '140px',
                            borderRadius: '24px',
                            background: 'rgba(255,255,255,0.05)',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1.5px solid rgba(255,255,255,0.15)',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 15px 30px rgba(0,0,0,0.25)'
                        }}>
                            {profile?.photo ? (
                                <img src={profile.photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <User size={70} color="rgba(255,255,255,0.2)" />
                            )}
                        </div>
                        <label className="btn-hover" style={{
                            position: 'absolute',
                            bottom: '-8px',
                            right: '-8px',
                            background: 'var(--primary)',
                            color: '#fff',
                            width: '40px',
                            height: '40px',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            border: '3.5px solid #1e1b4b',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                            transition: 'var(--transition)'
                        }}>
                            <Camera size={18} />
                            <input type="file" hidden onChange={(e) => handleFileUpload(e, 'photo')} disabled={uploading} />
                        </label>
                    </div>

                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                            <h2 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.025em' }}>{profile?.user?.first_name} {profile?.user?.last_name}</h2>
                            {profile?.is_verified && <CheckCircle size={24} style={{ color: '#818cf8' }} />}
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', fontWeight: '500' }}>{profile?.user?.email}</p>
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
                            <div style={{ padding: '0.5rem 0.875rem', borderRadius: '10px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: profile?.is_verified ? '#10b981' : '#f59e0b' }}></div>
                                <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.025em' }}>
                                    {profile?.is_verified ? 'Verified Active' : 'Pending Verification'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <style>{`
                    @media (max-width: 640px) {
                        .profile-content { flex-direction: column; text-align: center; gap: 1.5rem !important; }
                        .profile-header-card { padding: 2rem 1.5rem !important; }
                    }
                `}</style>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                <div className="card" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                        <div style={{ padding: '0.5rem', borderRadius: '10px', background: 'var(--bg-main)', color: 'var(--primary)' }}>
                            <User size={20} />
                        </div>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '800', color: 'var(--text-main)' }}>Account Information</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {[
                            { label: 'Username', value: profile?.user?.username, icon: <AlertCircle size={16} /> },
                            { label: 'Primary Contact', value: profile?.user?.phone || 'Not Configured', icon: <Clock size={16} /> },
                            { label: 'Unique Identifier', value: `STU-${profile?.id?.toString().padStart(4, '0')}`, icon: <FileText size={16} /> }
                        ].map((item, idx) => (
                            <div key={idx} style={{
                                padding: '1rem 1.25rem',
                                borderRadius: '14px',
                                background: 'var(--bg-main)',
                                border: '1px solid var(--border-light)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>{item.label}</div>
                                    <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '1rem' }}>{item.value}</div>
                                </div>
                                <div style={{ color: 'var(--text-light)' }}>{item.icon}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                        <div style={{ padding: '0.5rem', borderRadius: '10px', background: 'var(--bg-main)', color: 'var(--primary)' }}>
                            <FileText size={20} />
                        </div>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '800', color: 'var(--text-main)' }}>KYC Documents</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {profile?.documents?.length > 0 ? (
                            profile.documents.map(doc => (
                                <div key={doc.id} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '1rem 1.25rem',
                                    borderRadius: '14px',
                                    border: '1px solid var(--border)',
                                    background: '#fff'
                                }}>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <div style={{ color: 'var(--primary)' }}>
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <span style={{ fontSize: '0.9375rem', fontWeight: '800', color: 'var(--text-main)' }}>{doc.doc_type.toUpperCase()}</span>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: '600' }}>Uploaded on {new Date().toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    <span className={`badge badge-${doc.status === 'approved' ? 'success' : 'warning'}`} style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>
                                        {doc.status}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', padding: '2rem', background: 'var(--bg-main)', borderRadius: '16px', border: '1.5px dashed var(--border)' }}>
                                <AlertCircle size={32} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '600' }}>No identity documents found.</p>
                            </div>
                        )}

                        <label className="btn" style={{
                            background: 'var(--primary-glow)',
                            border: '1.5px dashed var(--primary-light)',
                            marginTop: '0.5rem',
                            padding: '1.25rem',
                            borderRadius: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: 'var(--primary)',
                            cursor: 'pointer',
                            transition: 'var(--transition)'
                        }}>
                            <Upload size={24} />
                            <span style={{ fontWeight: '800', fontSize: '0.875rem' }}>{uploading ? 'Processing File...' : 'Upload Identification Document'}</span>
                            <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>Aadhar Card, Passport or PAN (Max 5MB)</span>
                            <input type="file" hidden onChange={(e) => handleFileUpload(e, 'doc')} disabled={uploading} />
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;
