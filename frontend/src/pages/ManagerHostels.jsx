import { useState, useEffect } from 'react';
import api from '../api';
import { Building2, Plus, Bed, ChevronRight, Hash, Users, Edit3 } from 'lucide-react';

const ManagerHostels = () => {
    const [hostels, setHostels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedHostel, setSelectedHostel] = useState(null);

    useEffect(() => {
        fetchHostels();
    }, []);

    const fetchHostels = async () => {
        try {
            const res = await api.get('hostel/hostels/');
            setHostels(res.data);
            if (res.data.length > 0) setSelectedHostel(res.data[0]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Hostel & Room Management</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Configure buildings and monitor occupancy.</p>
                </div>
                <button className="btn btn-primary" style={{ gap: '0.5rem' }}>
                    <Plus size={18} /> Add Hostel
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem' }}>
                {/* Hostel List Sidebar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Available Hostels</h3>
                    {hostels.map(h => (
                        <button
                            key={h.id}
                            onClick={() => setSelectedHostel(h)}
                            className="card"
                            style={{
                                padding: '1rem',
                                textAlign: 'left',
                                border: selectedHostel?.id === h.id ? '2px solid var(--primary)' : '1px solid var(--border)',
                                background: selectedHostel?.id === h.id ? '#eff6ff' : '#fff',
                                cursor: 'pointer'
                            }}
                        >
                            <div style={{ fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span>{h.name}</span>
                                <ChevronRight size={16} />
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{h.address}</div>
                        </button>
                    ))}
                    {hostels.length === 0 && <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>No hostels configured.</p>}
                </div>

                {/* Room Grid */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {selectedHostel ? (
                        <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{selectedHostel.name} - Rooms</h2>
                                <button className="btn" style={{ border: '1px solid var(--border)', fontSize: '0.875rem', gap: '0.5rem' }}>
                                    <Plus size={16} /> Add Room
                                </button>
                            </div>

                            {selectedHostel.floors?.length > 0 ? selectedHostel.floors.map(floor => (
                                <div key={floor.id} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: '600', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
                                        Floor {floor.number}
                                    </h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                                        {floor.rooms?.map(room => (
                                            <div key={room.id} className="card" style={{ padding: '1.25rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <div style={{ padding: '0.5rem', background: '#f1f5f9', borderRadius: 'var(--radius)' }}>
                                                            <Hash size={18} />
                                                        </div>
                                                        <span style={{ fontWeight: 'bold' }}>Room {room.number}</span>
                                                    </div>
                                                    <div className={`badge badge-${room.is_available ? 'success' : 'danger'}`} style={{ fontSize: '0.7rem' }}>
                                                        {room.is_available ? 'Available' : 'Full'}
                                                    </div>
                                                </div>

                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                                                        <span style={{ color: 'var(--text-muted)' }}>Type</span>
                                                        <span style={{ fontWeight: '500' }}>{room.room_type.toUpperCase()}</span>
                                                    </div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                                                        <span style={{ color: 'var(--text-muted)' }}>Occupancy</span>
                                                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                                                            {room.beds?.map(bed => (
                                                                <Bed key={bed.id} size={16} color={bed.is_occupied ? 'var(--primary)' : '#e2e8f0'} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                                                        <span style={{ color: 'var(--text-muted)' }}>Rent</span>
                                                        <span style={{ fontWeight: '600' }}>₹{room.rent_amount}</span>
                                                    </div>
                                                </div>

                                                <button className="btn" style={{ width: '100%', marginTop: '1.25rem', border: '1px solid var(--border)', fontSize: '0.8rem', gap: '0.5rem' }}>
                                                    <Edit3 size={14} /> Edit Room
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )) : (
                                <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                    <Building2 size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                                    <p>No floors configured for this hostel.</p>
                                    <button className="btn btn-primary" style={{ marginTop: '1rem' }}>Add First Floor</button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="card" style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
                            Select a hostel to view details.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManagerHostels;
