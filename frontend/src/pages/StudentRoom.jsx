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

    if (loading) return (
        <div style={{ padding: '4rem', textAlign: 'center' }}>
            <div className="animate-spin" style={{ display: 'inline-block', width: '30px', height: '30px', border: '3px solid var(--primary-glow)', borderTopColor: 'var(--primary)', borderRadius: '50%' }}></div>
            <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Locating your room...</p>
        </div>
    );

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: '800', letterSpacing: '-0.025em', color: 'var(--text-main)' }}>Living Space</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Your current room allocation and roommate details.</p>
                </div>
            </div>

            {roomData ? (
                <div className="room-layout" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem' }}>
                    <style>{`
                        @media (max-width: 1024px) {
                            .room-layout { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
                        }
                    `}</style>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div className="card" style={{ padding: '2.5rem', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: '-40px', right: '-40px', opacity: 0.03, color: 'var(--primary)' }}>
                                <Home size={200} />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                                <div style={{ display: 'flex', gap: '1.5rem' }}>
                                    <div style={{ padding: '1rem', background: 'var(--primary-glow)', color: 'var(--primary)', borderRadius: '18px', border: '1px solid var(--primary-light)' }}>
                                        <Home size={36} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.8125rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Allocation</div>
                                        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '0.25rem' }}>Room {roomData.room_number}</h2>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }}></div>
                                            <span style={{ fontSize: '0.9375rem', color: 'var(--text-light)', fontWeight: '600' }}>Active Occupancy • Bed {roomData.identifier}</span>
                                        </div>
                                    </div>
                                </div>
                                <span className="badge badge-success" style={{ padding: '0.5rem 1rem' }}>Premium Stay</span>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1.25rem', marginTop: '2.5rem' }}>
                                {[
                                    { label: 'Level', value: '1st Floor', icon: <MapPin size={16} /> },
                                    { label: 'Hostel Unit', value: 'Block-A Premium', icon: <Box size={16} /> },
                                    { label: 'Capacity', value: 'Double Sharing', icon: <Users size={16} /> }
                                ].map((stat, idx) => (
                                    <div key={idx} style={{ padding: '1.25rem', background: 'var(--bg-main)', borderRadius: '16px', border: '1px solid var(--border-light)', flex: 1 }}>
                                        <div style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>{stat.icon}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>{stat.label}</div>
                                        <div style={{ fontWeight: '800', color: 'var(--text-main)', marginTop: '0.125rem' }}>{stat.value}</div>
                                    </div>
                                ))}
                            </div>

                            <div style={{ borderTop: '1.5px dashed var(--border)', marginTop: '2.5rem', paddingTop: '2rem' }}>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{ padding: '0.5rem', borderRadius: '8px', background: 'var(--primary-glow)', color: 'var(--primary)' }}>
                                        <CheckCircle size={18} />
                                    </div>
                                    Room Standard Amenities
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                                    {['Premium Walnut Bed', 'Ergonomic Study Station', 'High-Speed Mesh WiFi', 'Ambient Lighting', 'Attached Washroom', 'Window View'].map(item => (
                                        <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9375rem', color: 'var(--text-main)', fontWeight: '600', padding: '0.75rem 1rem', background: 'var(--bg-main)', borderRadius: '12px' }}>
                                            <CheckCircle size={16} style={{ color: '#10b981' }} />
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div className="card" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                                <div style={{ padding: '0.5rem', borderRadius: '10px', background: 'var(--bg-main)', color: 'var(--primary)' }}>
                                    <Users size={20} />
                                </div>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: '800', color: 'var(--text-main)' }}>Roommate Profile</h3>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {[
                                    { name: 'Amit Sahni', status: 'In Room', phone: '+91 91234 56789', email: 'amit.s@example.com' },
                                ].map(r => (
                                    <div key={r.name} style={{
                                        padding: '1.5rem',
                                        background: '#fff',
                                        borderRadius: '20px',
                                        border: '1px solid var(--border)',
                                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.25rem' }}>
                                            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '1.125rem' }}>
                                                {r.name[0]}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-main)' }}>{r.name}</div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--success)', fontWeight: '700' }}>
                                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}></div>
                                                    {r.status}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: '600' }}>{r.phone}</div>
                                            <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: '600' }}>{r.email}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div style={{
                                marginTop: '2rem',
                                padding: '1.25rem',
                                background: 'var(--bg-main)',
                                borderRadius: '16px',
                                border: '1px solid var(--border-light)',
                                display: 'flex',
                                gap: '1rem'
                            }}>
                                <Info size={20} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: '500', lineHeight: '1.5' }}>
                                    Roommates are assigned based on your preferences. Contact management for any change requests.
                                </p>
                            </div>
                        </div>

                        <div className="card" style={{ padding: '2rem', background: 'var(--bg-main)', border: '1px dashed var(--border)' }}>
                            <h4 style={{ fontSize: '0.875rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '1rem' }}>Hostel Rules</h4>
                            <ul style={{ paddingLeft: '1.25rem', fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontWeight: '500' }}>
                                <li>No loud music after 10 PM</li>
                                <li>Maintain cleanliness in the room</li>
                                <li>No cooking inside the rooms</li>
                                <li>Visitors not allowed after 8 PM</li>
                            </ul>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="card" style={{ textAlign: 'center', padding: '6rem', border: '2px dashed var(--border)', background: 'transparent' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--text-light)' }}>
                        <Home size={40} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.025em' }}>Awaiting Room Assignment</h2>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.75rem', maxWidth: '400px', margin: '0.75rem auto 0', lineHeight: '1.6' }}>
                        Your registration is complete. Our team is currently preparing the best available living space for you.
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2.5rem' }}>
                        <div style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', background: 'var(--primary-glow)', color: 'var(--primary)', fontWeight: '700', fontSize: '0.875rem' }}>
                            Account Verified
                        </div>
                        <div style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', background: 'var(--bg-main)', color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.875rem', border: '1px solid var(--border)' }}>
                            Allocation Pending
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentRoom;
