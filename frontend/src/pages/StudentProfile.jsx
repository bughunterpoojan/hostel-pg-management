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

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>My Profile</h1>

            <div className="card" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                    <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        background: '#f1f5f9',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '4px solid #fff',
                        boxShadow: 'var(--shadow)'
                    }}>
                        {profile?.photo ? (
                            <img src={profile.photo} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <User size={64} color="var(--text-muted)" />
                        )}
                    </div>
                    <label style={{
                        position: 'absolute',
                        bottom: '0',
                        right: '0',
                        background: 'var(--primary)',
                        color: '#fff',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        border: '2px solid #fff'
                    }}>
                        <Camera size={16} />
                        <input type="file" hidden onChange={(e) => handleFileUpload(e, 'photo')} disabled={uploading} />
                    </label>
                </div>

                <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{profile?.user?.first_name} {profile?.user?.last_name}</h2>
                    <p style={{ color: 'var(--text-muted)' }}>{profile?.user?.email}</p>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <span className={`badge badge-${profile?.is_verified ? 'success' : 'warning'}`}>
                            {profile?.is_verified ? 'Verified Student' : 'Verification Pending'}
                        </span>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="card">
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Personal Details</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Username</label>
                            <div style={{ fontWeight: '500' }}>{profile?.user?.username}</div>
                        </div>
                        <div>
                            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Phone</label>
                            <div style={{ fontWeight: '500' }}>{profile?.user?.phone || 'Not provided'}</div>
                        </div>
                        <div>
                            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Roll No / ID</label>
                            <div style={{ fontWeight: '500' }}>STU-{profile?.id?.toString().padStart(4, '0')}</div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Documents</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {profile?.documents?.length > 0 ? (
                            profile.documents.map(doc => (
                                <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                        <FileText size={18} color="var(--primary)" />
                                        <span style={{ fontSize: '0.875rem' }}>{doc.doc_type.toUpperCase()}</span>
                                    </div>
                                    <span className={`badge badge-${doc.status === 'approved' ? 'success' : 'warning'}`}>
                                        {doc.status}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>No documents uploaded yet.</p>
                        )}

                        <label className="btn" style={{
                            background: '#f8fafc',
                            border: '1px dashed var(--border)',
                            marginTop: '0.5rem',
                            display: 'flex',
                            gap: '0.5rem',
                            color: 'var(--primary)',
                            cursor: 'pointer'
                        }}>
                            <Upload size={18} />
                            <span>{uploading ? 'Uploading...' : 'Upload Aadhar / ID'}</span>
                            <input type="file" hidden onChange={(e) => handleFileUpload(e, 'doc')} disabled={uploading} />
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentProfile;
