import { useState, useEffect } from 'react';
import api from '../api';
import { Building2, Plus, Bed, ChevronRight, Hash, Users, Edit3 } from 'lucide-react';

const ManagerHostels = () => {
    const [hostels, setHostels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedHostel, setSelectedHostel] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddHostelModalOpen, setIsAddHostelModalOpen] = useState(false);
    const [isAddFloorModalOpen, setIsAddFloorModalOpen] = useState(false);
    const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);

    const [editingRoom, setEditingRoom] = useState(null);
    const [selectedFloorId, setSelectedFloorId] = useState(null);

    const [hostelForm, setHostelForm] = useState({ name: '', address: '', description: '' });
    const [floorForm, setFloorForm] = useState({ number: '' });
    const [roomForm, setRoomForm] = useState({ number: '', room_type: 'single', rent_amount: '', capacity: 1 });
    const [editForm, setEditForm] = useState({ number: '', room_type: '', rent_amount: '' });

    useEffect(() => {
        fetchHostels();
    }, []);

    const fetchHostels = async () => {
        try {
            const res = await api.get('hostel/hostels/');
            setHostels(res.data);
            if (res.data.length > 0) {
                const currentSelected = selectedHostel ? res.data.find(h => h.id === selectedHostel.id) : res.data[0];
                setSelectedHostel(currentSelected || res.data[0]);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddHostel = async (e) => {
        e.preventDefault();
        try {
            await api.post('hostel/hostels/', hostelForm);
            setIsAddHostelModalOpen(false);
            fetchHostels();
        } catch (err) {
            console.error('Failed to add hostel:', err);
            alert('Failed to add hostel. Please try again.');
        }
    };

    const handleAddFloor = async (e) => {
        e.preventDefault();
        try {
            await api.post('hostel/floors/', { ...floorForm, hostel: selectedHostel.id });
            setIsAddFloorModalOpen(false);
            fetchHostels();
        } catch (err) {
            console.error('Failed to add floor:', err);
            alert('Failed to add floor. Please try again.');
        }
    };

    const handleAddRoom = async (e) => {
        e.preventDefault();
        try {
            await api.post('hostel/rooms/', { ...roomForm, floor: selectedFloorId });
            setIsAddRoomModalOpen(false);
            fetchHostels();
        } catch (err) {
            console.error('Failed to add room:', err);
            alert('Failed to add room. Please try again.');
        }
    };

    const handleEditClick = (room) => {
        setEditingRoom(room);
        setEditForm({
            number: room.number,
            room_type: room.room_type,
            rent_amount: room.rent_amount
        });
        setIsEditModalOpen(true);
    };

    const handleEditRoom = async (e) => {
        e.preventDefault();
        try {
            await api.patch(`hostel/rooms/${editingRoom.id}/`, editForm);
            setIsEditModalOpen(false);
            fetchHostels();
        } catch (err) {
            console.error('Failed to update room:', err);
            alert('Failed to update room. Please try again.');
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
                <button
                    onClick={() => {
                        setHostelForm({ name: '', address: '', description: '' });
                        setIsAddHostelModalOpen(true);
                    }}
                    className="btn btn-primary" style={{ gap: '0.5rem' }}
                >
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
                                <button
                                    onClick={() => {
                                        setFloorForm({ number: (selectedHostel.floors?.length || 0) + 1 });
                                        setIsAddFloorModalOpen(true);
                                    }}
                                    className="btn" style={{ border: '1px solid var(--border)', fontSize: '0.875rem', gap: '0.5rem' }}
                                >
                                    <Plus size={16} /> Add Floor
                                </button>
                            </div>

                            {selectedHostel.floors?.length > 0 ? selectedHostel.floors.map(floor => (
                                <div key={floor.id} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
                                        <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>
                                            Floor {floor.number}
                                        </h3>
                                        <button
                                            onClick={() => {
                                                setSelectedFloorId(floor.id);
                                                setRoomForm({ number: '', room_type: 'single', rent_amount: '', capacity: 1 });
                                                setIsAddRoomModalOpen(true);
                                            }}
                                            className="btn" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', border: '1px solid var(--border)', gap: '0.25rem' }}
                                        >
                                            <Plus size={14} /> Add Room
                                        </button>
                                    </div>
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

                                                <button
                                                    onClick={() => handleEditClick(room)}
                                                    className="btn"
                                                    style={{ width: '100%', marginTop: '1.25rem', border: '1px solid var(--border)', fontSize: '0.8rem', gap: '0.5rem' }}
                                                >
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
                                    <button
                                        onClick={() => {
                                            setFloorForm({ number: 1 });
                                            setIsAddFloorModalOpen(true);
                                        }}
                                        className="btn btn-primary" style={{ marginTop: '1rem' }}
                                    >
                                        Add First Floor
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="card" style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-muted)' }}>
                            Select a hostel to view details.
                        </div>
                    )}
                </div>
                {/* Add Hostel Modal */}
                {isAddHostelModalOpen && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 1000, backdropFilter: 'blur(4px)'
                    }}>
                        <div className="card" style={{ width: '90%', maxWidth: '450px' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Add New Hostel</h2>
                            <form onSubmit={handleAddHostel} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Hostel Name</label>
                                    <input type="text" required className="form-input" value={hostelForm.name}
                                        onChange={(e) => setHostelForm({ ...hostelForm, name: e.target.value })}
                                        style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Address</label>
                                    <input type="text" required className="form-input" value={hostelForm.address}
                                        onChange={(e) => setHostelForm({ ...hostelForm, address: e.target.value })}
                                        style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Description</label>
                                    <textarea rows="3" className="form-input" value={hostelForm.description}
                                        onChange={(e) => setHostelForm({ ...hostelForm, description: e.target.value })}
                                        style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', resize: 'none' }} />
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button type="button" onClick={() => setIsAddHostelModalOpen(false)} className="btn" style={{ flex: 1, border: '1px solid var(--border)' }}>Cancel</button>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Add Hostel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Add Floor Modal */}
                {isAddFloorModalOpen && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 1000, backdropFilter: 'blur(4px)'
                    }}>
                        <div className="card" style={{ width: '90%', maxWidth: '400px' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Add Floor to {selectedHostel?.name}</h2>
                            <form onSubmit={handleAddFloor} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Floor Number</label>
                                    <input type="number" required className="form-input" value={floorForm.number}
                                        onChange={(e) => setFloorForm({ ...floorForm, number: e.target.value })}
                                        style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }} />
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button type="button" onClick={() => setIsAddFloorModalOpen(false)} className="btn" style={{ flex: 1, border: '1px solid var(--border)' }}>Cancel</button>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Add Floor</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Add Room Modal */}
                {isAddRoomModalOpen && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 1000, backdropFilter: 'blur(4px)'
                    }}>
                        <div className="card" style={{ width: '90%', maxWidth: '450px' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Add Room to Floor {selectedHostel?.floors.find(f => f.id === selectedFloorId)?.number}</h2>
                            <form onSubmit={handleAddRoom} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Room Number</label>
                                    <input type="text" required className="form-input" value={roomForm.number}
                                        onChange={(e) => setRoomForm({ ...roomForm, number: e.target.value })}
                                        style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Room Type</label>
                                        <select className="form-input" value={roomForm.room_type}
                                            onChange={(e) => setRoomForm({ ...roomForm, room_type: e.target.value, capacity: e.target.value === 'single' ? 1 : e.target.value === 'double' ? 2 : 3 })}
                                            style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                                            <option value="single">Single</option>
                                            <option value="double">Double</option>
                                            <option value="triple">Triple</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Capacity</label>
                                        <input type="number" readOnly className="form-input" value={roomForm.capacity}
                                            style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: '#f8fafc' }} />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Rent Amount (₹)</label>
                                    <input type="number" required className="form-input" value={roomForm.rent_amount}
                                        onChange={(e) => setRoomForm({ ...roomForm, rent_amount: e.target.value })}
                                        style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }} />
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <button type="button" onClick={() => setIsAddRoomModalOpen(false)} className="btn" style={{ flex: 1, border: '1px solid var(--border)' }}>Cancel</button>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Add Room</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit Room Modal */}
                {isEditModalOpen && (
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
                        backdropFilter: 'blur(4px)'
                    }}>
                        <div className="card" style={{ width: '90%', maxWidth: '450px', position: 'relative' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Edit Room {editingRoom?.number}</h2>
                            <form onSubmit={handleEditRoom} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Room Number</label>
                                    <input
                                        type="text"
                                        required
                                        className="form-input"
                                        value={editForm.number}
                                        onChange={(e) => setEditForm({ ...editForm, number: e.target.value })}
                                        style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Room Type</label>
                                    <select
                                        className="form-input"
                                        value={editForm.room_type}
                                        onChange={(e) => setEditForm({ ...editForm, room_type: e.target.value })}
                                        style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
                                    >
                                        <option value="single">Single</option>
                                        <option value="double">Double</option>
                                        <option value="triple">Triple</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Rent Amount (₹)</label>
                                    <input
                                        type="number"
                                        required
                                        className="form-input"
                                        value={editForm.rent_amount}
                                        onChange={(e) => setEditForm({ ...editForm, rent_amount: e.target.value })}
                                        style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="btn"
                                        style={{ flex: 1, border: '1px solid var(--border)' }}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManagerHostels;
