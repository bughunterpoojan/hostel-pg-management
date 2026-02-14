import { useState, useEffect } from 'react';
import api from '../api';
import { Home, Users, CheckCircle, Info, MapPin, Box } from 'lucide-react';

const StudentRoom = () => {
    const [roomData, setRoomData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRoom();
    }, []);

    const fetchRoom = async () => {
        try {
            const res = await api.get('activity/profiles/');
            if (res.data.length > 0 && res.data[0].current_bed) {
                setRoomData(res.data[0].current_bed_details);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>My Room Details</h1>
                <p style={{ color: 'var(--text-muted)' }}>Information about your current stay and allocation.</p>
            </div>

            {roomData ? (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
                        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', gap: '1.25rem' }}>
                                    <div style={{ padding: '1rem', background: '#eff6ff', color: 'var(--primary)', borderRadius: 'var(--radius)' }}>
                                        <Home size={32} />
                                    </div>
                                    <div>
                                        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Room {roomData.room_number}</h2>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Bed Identifier: {roomData.identifier}</p>
                                    </div>
                                </div>
                                <span className="badge badge-success">Active Allocation</span>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                                <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius)' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Floor</div>
                                    <div style={{ fontWeight: '600' }}>1st Floor</div>
                                </div>
                                <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius)' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hostel</div>
                                    <div style={{ fontWeight: '600' }}>Main Block</div>
                                </div>
                                <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius)' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Type</div>
                                    <div style={{ fontWeight: '600' }}>Double Share</div>
                                </div>
                            </div>

                            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Box size={18} color="var(--primary)" />
                                    Included Amenities
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                    {['Personal Almirah', 'Study Table & Chair', 'High-Speed WiFi', 'Ceiling Fan', 'Attached Balcony'].map(item => (
                                        <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                                            <CheckCircle size={14} color="var(--success)" />
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Users size={18} color="var(--primary)" />
                                Roommates
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {[
                                    { name: 'Amit Sahni', status: 'In Room', phone: '+91 91234 56789' },
                                ].map(r => (
                                    <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', background: '#f8fafc', borderRadius: 'var(--radius)' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.8rem' }}>
                                            {r.name[0]}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>{r.name}</div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{r.status}</div>
                                        </div>
                                    </div>
                                ))}
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                                    Respect the privacy and rules shared by the hostel management.
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="card" style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
                    <Info size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                    <p>You have not been allocated a room yet.</p>
                    <p style={{ fontSize: '0.875rem' }}>Please complete your profile and document verification first.</p>
                </div>
            )}
        </div>
    );
};

export default StudentRoom;
