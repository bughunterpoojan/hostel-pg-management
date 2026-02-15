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

    if (loading) return (
        <div style={{ padding: '4rem', textAlign: 'center' }}>
            <div className="animate-spin" style={{ display: 'inline-block', width: '30px', height: '30px', border: '3px solid var(--primary-glow)', borderTopColor: 'var(--primary)', borderRadius: '50%' }}></div>
            <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Building layouts...</p>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: '800', letterSpacing: '-0.025em', color: 'var(--text-main)' }}>Building Architecture</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Configure physical assets and manage room hierarchies across units.</p>
                </div>
                <button
                    onClick={() => {
                        setHostelForm({ name: '', address: '', description: '' });
                        setIsAddHostelModalOpen(true);
                    }}
                    className="btn btn-primary"
                    style={{
                        padding: '0.75rem 1.5rem',
                        borderRadius: '14px',
                        fontWeight: '800',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        boxShadow: 'var(--shadow-lg)',
                        fontSize: '0.875rem'
                    }}
                >
                    <Plus size={20} /> <span className="hide-mobile">Add New Building</span><span className="show-mobile">Add</span>
                </button>
            </div>

            <div className="hostel-layout" style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '2rem', alignItems: 'start' }}>
                <style>{`
                    @media (max-width: 1024px) {
                        .hostel-layout { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
                        .hide-mobile { display: none; }
                        .show-mobile { display: inline; }
                    }
                    @media (min-width: 1025px) {
                        .show-mobile { display: none; }
                    }
                `}</style>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', paddingLeft: '0.5rem' }}>Hostel Units</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {hostels.map(h => (
                            <button
                                key={h.id}
                                onClick={() => setSelectedHostel(h)}
                                style={{
                                    padding: '1.25rem',
                                    textAlign: 'left',
                                    borderRadius: '20px',
                                    border: '1.5px solid',
                                    borderColor: selectedHostel?.id === h.id ? 'var(--primary)' : 'var(--border)',
                                    background: selectedHostel?.id === h.id ? 'var(--primary-glow)' : 'var(--card-bg)',
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                <div style={{ position: 'relative', zIndex: 1 }}>
                                    <div style={{ fontWeight: '800', color: selectedHostel?.id === h.id ? 'var(--primary)' : 'var(--text-main)', fontSize: '1rem' }}>{h.name}</div>
                                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem', fontWeight: '500' }}>{h.address}</div>
                                </div>
                                <div style={{
                                    opacity: selectedHostel?.id === h.id ? 1 : 0,
                                    transform: `translateX(${selectedHostel?.id === h.id ? '0' : '10px'})`,
                                    transition: 'all 0.3s ease',
                                    color: 'var(--primary)'
                                }}>
                                    <ChevronRight size={20} />
                                </div>
                            </button>
                        ))}
                    </div>
                    {hostels.length === 0 && (
                        <div style={{ padding: '2rem', textAlign: 'center', border: '1.5px dashed var(--border)', borderRadius: '20px', color: 'var(--text-muted)' }}>
                            <Building2 size={32} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
                            <p style={{ fontSize: '0.875rem', fontWeight: '600' }}>No buildings found.</p>
                        </div>
                    )}
                </div>

                {/* Main Configuration Interface */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {selectedHostel ? (
                        <>
                            <div className="card" style={{ padding: '2.5rem', background: 'var(--card-bg)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                                        <div style={{ padding: '1rem', background: 'var(--primary-glow)', color: 'var(--primary)', borderRadius: '18px' }}>
                                            <Building2 size={32} />
                                        </div>
                                        <div>
                                            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)' }}>{selectedHostel.name}</h2>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', marginTop: '0.25rem', fontWeight: '500' }}>{selectedHostel.floors?.length || 0} Floors • {selectedHostel.address}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setFloorForm({ number: (selectedHostel.floors?.length || 0) + 1 });
                                            setIsAddFloorModalOpen(true);
                                        }}
                                        className="btn btn-hover"
                                        style={{
                                            background: 'var(--bg-main)',
                                            border: '1px solid var(--border)',
                                            padding: '0.75rem 1.25rem',
                                            borderRadius: '14px',
                                            fontWeight: '700',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}
                                    >
                                        <Plus size={18} /> New Floor
                                    </button>
                                </div>

                                <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                                    {selectedHostel.floors?.length > 0 ? selectedHostel.floors.map(floor => (
                                        <div key={floor.id}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1.5px solid var(--border-light)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--text-main)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: '800' }}>
                                                        {floor.number}
                                                    </div>
                                                    <h3 style={{ fontSize: '1.125rem', fontWeight: '800', color: 'var(--text-main)' }}>Level {floor.number}</h3>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        setSelectedFloorId(floor.id);
                                                        setRoomForm({ number: '', room_type: 'single', rent_amount: '', capacity: 1 });
                                                        setIsAddRoomModalOpen(true);
                                                    }}
                                                    className="btn btn-hover"
                                                    style={{
                                                        fontSize: '0.8125rem',
                                                        fontWeight: '700',
                                                        padding: '0.5rem 1rem',
                                                        borderRadius: '10px',
                                                        background: 'var(--bg-main)',
                                                        border: '1px solid var(--border)',
                                                        gap: '0.375rem'
                                                    }}
                                                >
                                                    <Plus size={14} /> Add Room
                                                </button>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
                                                {floor.rooms?.map(room => (
                                                    <div key={room.id} className="card" style={{ padding: '1.5rem', border: '1px solid var(--border-light)', position: 'relative' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                                <div style={{ color: 'var(--primary)' }}>
                                                                    <Hash size={20} />
                                                                </div>
                                                                <span style={{ fontSize: '1.125rem', fontWeight: '800', color: 'var(--text-main)' }}>{room.number}</span>
                                                            </div>
                                                            <span className={`badge badge-${room.is_available ? 'success' : 'danger'}`} style={{
                                                                fontSize: '0.6875rem',
                                                                padding: '0.375rem 0.75rem',
                                                                borderRadius: '8px',
                                                                fontWeight: '800',
                                                                textTransform: 'uppercase'
                                                            }}>
                                                                {room.is_available ? 'Available' : 'Occupied'}
                                                            </span>
                                                        </div>

                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: '600' }}>Variant</span>
                                                                <span style={{ fontSize: '0.8125rem', fontWeight: '800', color: 'var(--text-main)', background: 'var(--bg-main)', padding: '0.25rem 0.5rem', borderRadius: '6px' }}>{room.room_type.toUpperCase()}</span>
                                                            </div>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: '600' }}>Beds</span>
                                                                <div style={{ display: 'flex', gap: '0.375rem' }}>
                                                                    {room.beds?.map(bed => (
                                                                        <div key={bed.id} style={{
                                                                            width: '24px',
                                                                            height: '24px',
                                                                            borderRadius: '6px',
                                                                            background: bed.is_occupied ? 'var(--primary-glow)' : 'var(--bg-main)',
                                                                            color: bed.is_occupied ? 'var(--primary)' : 'var(--border)',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                            border: '1px solid',
                                                                            borderColor: bed.is_occupied ? 'var(--primary-light)' : 'var(--border)'
                                                                        }} title={bed.is_occupied ? 'Occupied' : 'Vacant'}>
                                                                            <Bed size={14} />
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: '600' }}>Monthly Rent</span>
                                                                <span style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)' }}>₹{parseFloat(room.rent_amount).toLocaleString()}</span>
                                                            </div>
                                                        </div>

                                                        <button
                                                            onClick={() => handleEditClick(room)}
                                                            className="btn btn-hover"
                                                            style={{
                                                                width: '100%',
                                                                marginTop: '1.5rem',
                                                                padding: '0.625rem',
                                                                fontSize: '0.8125rem',
                                                                fontWeight: '700',
                                                                borderRadius: '10px',
                                                                background: 'var(--bg-main)',
                                                                border: '1px solid var(--border)',
                                                                gap: '0.5rem',
                                                                justifyContent: 'center'
                                                            }}
                                                        >
                                                            <Edit3 size={14} /> Configure
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )) : (
                                        <div style={{ textAlign: 'center', padding: '5rem 2rem', border: '1.5px dashed var(--border)', borderRadius: '25px', background: 'var(--bg-main)' }}>
                                            <Building2 size={48} style={{ opacity: 0.2, margin: '0 auto 1.5rem' }} />
                                            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.025em' }}>Empty Structure</h3>
                                            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontWeight: '500' }}>Initialize floors to start allocating rooms.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="card" style={{ textAlign: 'center', padding: '8rem 2rem', color: 'var(--text-muted)' }}>
                            <Building2 size={64} style={{ opacity: 0.1, margin: '0 auto 1.5rem' }} />
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>Select a Building</h3>
                            <p style={{ marginTop: '0.5rem', fontWeight: '500' }}>Choose a unit from the sidebar to manage architecture.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modals - using shared glassmorphic style */}
            {(isAddHostelModalOpen || isAddFloorModalOpen || isAddRoomModalOpen || isEditModalOpen) && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(15, 23, 42, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 2000, backdropFilter: 'blur(8px)', animation: 'fadeIn 0.3s ease-out'
                }}>
                    <div className="card" style={{ width: '90%', maxWidth: '500px', padding: '2rem', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', maxHeight: '90vh', overflowY: 'auto' }}>
                        {isAddHostelModalOpen && (
                            <>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                                    <div style={{ padding: '0.625rem', borderRadius: '12px', background: 'var(--primary-glow)', color: 'var(--primary)' }}>
                                        <Building2 size={24} />
                                    </div>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)' }}>New Building Entity</h2>
                                </div>
                                <form onSubmit={handleAddHostel} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Building Name</label>
                                        <input type="text" required className="form-input" value={hostelForm.name}
                                            onChange={(e) => setHostelForm({ ...hostelForm, name: e.target.value })}
                                            placeholder="e.g., Emerald Heights"
                                            style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '14px', border: '1.5px solid var(--border)', fontSize: '0.9375rem', fontWeight: '600' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Street Address</label>
                                        <input type="text" required className="form-input" value={hostelForm.address}
                                            onChange={(e) => setHostelForm({ ...hostelForm, address: e.target.value })}
                                            placeholder="Full physical location"
                                            style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '14px', border: '1.5px solid var(--border)', fontSize: '0.9375rem', fontWeight: '600' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Property Notes</label>
                                        <textarea rows="3" className="form-input" value={hostelForm.description}
                                            onChange={(e) => setHostelForm({ ...hostelForm, description: e.target.value })}
                                            placeholder="Specific details or amenities..."
                                            style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '1.5px solid var(--border)', fontSize: '0.9375rem', fontWeight: '500', resize: 'none' }} />
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                        <button type="button" onClick={() => setIsAddHostelModalOpen(false)} className="btn btn-hover" style={{ flex: 1, padding: '1rem', borderRadius: '14px', fontWeight: '800', background: 'var(--bg-main)', border: '1px solid var(--border)' }}>Cancel</button>
                                        <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '1rem', borderRadius: '14px', fontWeight: '800' }}>Create Building</button>
                                    </div>
                                </form>
                            </>
                        )}

                        {isAddFloorModalOpen && (
                            <>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)' }}>Provision New level</h2>
                                </div>
                                <form onSubmit={handleAddFloor} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Floor Index</label>
                                        <input type="number" required className="form-input" value={floorForm.number}
                                            onChange={(e) => setFloorForm({ ...floorForm, number: e.target.value })}
                                            style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '14px', border: '1.5px solid var(--border)', fontSize: '1.125rem', fontWeight: '800', textAlign: 'center' }} />
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                        <button type="button" onClick={() => setIsAddFloorModalOpen(false)} className="btn btn-hover" style={{ flex: 1, padding: '1rem', borderRadius: '14px', fontWeight: '800', background: 'var(--bg-main)', border: '1px solid var(--border)' }}>Discard</button>
                                        <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '1rem', borderRadius: '14px', fontWeight: '800' }}>Confirm Layer</button>
                                    </div>
                                </form>
                            </>
                        )}

                        {isAddRoomModalOpen && (
                            <>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)' }}>Designate Room</h2>
                                </div>
                                <form onSubmit={handleAddRoom} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Identification Number</label>
                                        <input type="text" required className="form-input" value={roomForm.number}
                                            onChange={(e) => setRoomForm({ ...roomForm, number: e.target.value })}
                                            placeholder="e.g., 204-B"
                                            style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '14px', border: '1.5px solid var(--border)', fontSize: '0.9375rem', fontWeight: '800' }} />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Room Variant</label>
                                            <select className="form-input" value={roomForm.room_type}
                                                onChange={(e) => setRoomForm({ ...roomForm, room_type: e.target.value, capacity: e.target.value === 'single' ? 1 : e.target.value === 'double' ? 2 : 3 })}
                                                style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '14px', border: '1.5px solid var(--border)', fontSize: '0.9375rem', fontWeight: '700' }}>
                                                <option value="single">Single</option>
                                                <option value="double">Double</option>
                                                <option value="triple">Triple</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Auto Capacity</label>
                                            <input type="number" readOnly className="form-input" value={roomForm.capacity}
                                                style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '14px', border: '1.5px solid var(--border)', background: 'var(--bg-main)', fontSize: '0.9375rem', fontWeight: '800', textAlign: 'center' }} />
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Standard Rate (₹)</label>
                                        <div style={{ position: 'relative' }}>
                                            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontWeight: '800', color: 'var(--text-muted)' }}>₹</span>
                                            <input type="number" required className="form-input" value={roomForm.rent_amount}
                                                onChange={(e) => setRoomForm({ ...roomForm, rent_amount: e.target.value })}
                                                style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 2.25rem', borderRadius: '14px', border: '1.5px solid var(--border)', fontSize: '1rem', fontWeight: '800' }} />
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                        <button type="button" onClick={() => setIsAddRoomModalOpen(false)} className="btn btn-hover" style={{ flex: 1, padding: '1rem', borderRadius: '14px', fontWeight: '800', background: 'var(--bg-main)', border: '1px solid var(--border)' }}>Cancel</button>
                                        <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '1rem', borderRadius: '14px', fontWeight: '800' }}>Add to Level</button>
                                    </div>
                                </form>
                            </>
                        )}

                        {isEditModalOpen && (
                            <>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                                    <div style={{ padding: '0.625rem', borderRadius: '12px', background: 'var(--primary-glow)', color: 'var(--primary)' }}>
                                        <Edit3 size={24} />
                                    </div>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)' }}>Modify {editingRoom?.number}</h2>
                                </div>
                                <form onSubmit={handleEditRoom} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Room Identifier</label>
                                        <input type="text" required className="form-input" value={editForm.number}
                                            onChange={(e) => setEditForm({ ...editForm, number: e.target.value })}
                                            style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '14px', border: '1.5px solid var(--border)', fontSize: '0.9375rem', fontWeight: '800' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Occupancy Configuration</label>
                                        <select className="form-input" value={editForm.room_type}
                                            onChange={(e) => setEditForm({ ...editForm, room_type: e.target.value })}
                                            style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '14px', border: '1.5px solid var(--border)', fontSize: '0.9375rem', fontWeight: '700' }}>
                                            <option value="single">Single Layout</option>
                                            <option value="double">Double Layout</option>
                                            <option value="triple">Triple Layout</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Adjusted Rent (₹)</label>
                                        <div style={{ position: 'relative' }}>
                                            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontWeight: '800', color: 'var(--text-muted)' }}>₹</span>
                                            <input type="number" required className="form-input" value={editForm.rent_amount}
                                                onChange={(e) => setEditForm({ ...editForm, rent_amount: e.target.value })}
                                                style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 2.25rem', borderRadius: '14px', border: '1.5px solid var(--border)', fontSize: '1rem', fontWeight: '800' }} />
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                        <button type="button" onClick={() => setIsEditModalOpen(false)} className="btn btn-hover" style={{ flex: 1, padding: '1rem', borderRadius: '14px', fontWeight: '800', background: 'var(--bg-main)', border: '1px solid var(--border)' }}>Cancel</button>
                                        <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '1rem', borderRadius: '14px', fontWeight: '800' }}>Save Specs</button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagerHostels;
