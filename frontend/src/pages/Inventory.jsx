import { useState, useEffect } from 'react';
import api from '../api';
import { Package, Plus, Trash2, Edit3, MapPin, Hash, Search, CheckCircle2, AlertTriangle } from 'lucide-react';

const Inventory = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [formData, setFormData] = useState({
        item_name: '',
        quantity: 1,
        condition: 'good',
        description: '',
        room: ''
    });

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const res = await api.get('inventory/items/');
            setItems(res.data);
        } catch (err) {
            console.error('Failed to fetch inventory:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await api.patch(`inventory/items/${editingItem.id}/`, formData);
            } else {
                await api.post('inventory/items/', formData);
            }
            setIsModalOpen(false);
            fetchInventory();
        } catch (err) {
            console.error('Submission error:', err);
            alert('Failed to save inventory item.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Permanent removal. Confirm?')) return;
        try {
            await api.delete(`inventory/items/${id}/`);
            fetchInventory();
        } catch (err) {
            console.error('Delete error:', err);
            alert('Failed to delete item.');
        }
    };

    const getConditionStyle = (cond) => {
        switch (cond) {
            case 'new': return { color: 'var(--success)', glow: 'var(--success-glow)', icon: <CheckCircle2 size={14} /> };
            case 'good': return { color: 'var(--primary)', glow: 'var(--primary-glow)', icon: <CheckCircle2 size={14} /> };
            case 'damaged': return { color: 'var(--warning)', glow: 'var(--warning-glow)', icon: <AlertTriangle size={14} /> };
            case 'missing': return { color: 'var(--danger)', glow: 'var(--danger-glow)', icon: <AlertTriangle size={14} /> };
            default: return { color: 'var(--text-muted)', glow: 'var(--bg-main)', icon: null };
        }
    };

    const filteredItems = items.filter(item =>
        item.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.room_number && item.room_number.toString().includes(searchQuery))
    );

    if (loading) return (
        <div style={{ padding: '4rem', textAlign: 'center' }}>
            <div className="animate-spin" style={{ display: 'inline-block', width: '30px', height: '30px', border: '3px solid var(--primary-glow)', borderTopColor: 'var(--primary)', borderRadius: '50%' }}></div>
            <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Scanning assets...</p>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: '800', letterSpacing: '-0.025em', color: 'var(--text-main)' }}>Inventory Registry</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Manage physical assets and equipment conditions.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingItem(null);
                        setFormData({ item_name: '', quantity: 1, condition: 'good', description: '', room: '' });
                        setIsModalOpen(true);
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
                    <Plus size={20} /> Provision Item
                </button>
            </div>

            <div style={{ display: 'flex', gap: '1rem', background: 'var(--card-bg)', padding: '0.75rem 1.25rem', borderRadius: '14px', border: '1px solid var(--border)', maxWidth: '400px', width: '100%', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <Search size={18} style={{ color: 'var(--text-light)' }} />
                <input
                    type="text"
                    placeholder="Search by name or room..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ background: 'transparent', border: 'none', outline: 'none', width: '100%', color: 'var(--text-main)', fontWeight: '600', fontSize: '0.875rem' }}
                />
            </div>

            <div className="card" style={{ padding: '0', overflow: 'hidden', background: 'var(--card-bg)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border)' }}>
                            <th style={{ textAlign: 'left', padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Inventory Item</th>
                            <th style={{ textAlign: 'left', padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Qty</th>
                            <th style={{ textAlign: 'left', padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                            <th style={{ textAlign: 'left', padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Placement</th>
                            <th style={{ textAlign: 'right', padding: '1.25rem 1.5rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Management</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredItems.map((item, idx) => {
                            const style = getConditionStyle(item.condition);
                            return (
                                <tr key={item.id} className="table-row-hover" style={{ borderBottom: idx === filteredItems.length - 1 ? 'none' : '1px solid var(--border-light)' }}>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ padding: '0.75rem', background: 'var(--primary-glow)', color: 'var(--primary)', borderRadius: '12px' }}>
                                                <Package size={20} />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.9375rem' }}>{item.item_name}</div>
                                                {item.description && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.125rem' }}>{item.description}</div>}
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <span style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '0.875rem' }}>{item.quantity}</span>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <span style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.375rem',
                                            padding: '0.375rem 0.75rem',
                                            borderRadius: '8px',
                                            fontSize: '0.75rem',
                                            fontWeight: '800',
                                            textTransform: 'uppercase',
                                            background: style.glow,
                                            color: style.color
                                        }}>
                                            {item.condition}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                                            <MapPin size={14} />
                                            <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                                                {item.room_number ? `Room ${item.room_number}` : 'Central Storage'}
                                            </span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                                            <button
                                                onClick={() => {
                                                    setEditingItem(item);
                                                    setFormData({
                                                        item_name: item.item_name,
                                                        quantity: item.quantity,
                                                        condition: item.condition,
                                                        description: item.description || '',
                                                        room: item.room || ''
                                                    });
                                                    setIsModalOpen(true);
                                                }}
                                                className="btn btn-hover"
                                                style={{ padding: '0.5rem', borderRadius: '10px', background: 'var(--bg-main)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
                                            >
                                                <Edit3 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="btn btn-hover"
                                                style={{ padding: '0.5rem', borderRadius: '10px', background: 'var(--bg-main)', border: '1px solid var(--border)', color: 'var(--danger)' }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {filteredItems.length === 0 && (
                    <div style={{ padding: '5rem 2rem', textAlign: 'center' }}>
                        <Package size={48} style={{ opacity: 0.1, margin: '0 auto 1.5rem' }} />
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '800', color: 'var(--text-main)' }}>No Match Found</h3>
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontWeight: '500' }}>Refine your search parameters or register new assets.</p>
                    </div>
                )}
            </div>

            {/* Procurement / Edit Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(15, 23, 42, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 2000, backdropFilter: 'blur(8px)', animation: 'fadeIn 0.3s ease-out'
                }}>
                    <div className="card" style={{ width: '90%', maxWidth: '500px', padding: '2rem', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                            <div style={{ padding: '0.625rem', borderRadius: '12px', background: 'var(--primary-glow)', color: 'var(--primary)' }}>
                                {editingItem ? <Edit3 size={24} /> : <Plus size={24} />}
                            </div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)' }}>
                                {editingItem ? 'Edit Asset Specs' : 'Provision Asset'}
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Asset Nomenclature</label>
                                <input type="text" required className="form-input" value={formData.item_name}
                                    onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
                                    placeholder="e.g., King size bed frame"
                                    style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '14px', border: '1.5px solid var(--border)', fontSize: '0.9375rem', fontWeight: '600' }} />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Initial Count</label>
                                    <input type="number" required className="form-input" value={formData.quantity}
                                        onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                                        style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '14px', border: '1.5px solid var(--border)', fontSize: '0.9375rem', fontWeight: '800' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Condition</label>
                                    <select className="form-input" value={formData.condition}
                                        onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                                        style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '14px', border: '1.5px solid var(--border)', fontSize: '0.9375rem', fontWeight: '700' }}>
                                        <option value="new">Factory New</option>
                                        <option value="good">Operational (Good)</option>
                                        <option value="damaged">Maintenance Needed</option>
                                        <option value="missing">Not Accounted For</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Asset Placement (Room ID)</label>
                                <input type="text" className="form-input" value={formData.room}
                                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                                    placeholder="Leave blank for Storage"
                                    style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '14px', border: '1.5px solid var(--border)', fontSize: '0.9375rem', fontWeight: '600' }} />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Specifications / Notes</label>
                                <textarea rows="2" className="form-input" value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Material, brand, or damage details..."
                                    style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '1.5px solid var(--border)', fontSize: '0.9375rem', fontWeight: '500', resize: 'none' }} />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-hover" style={{ flex: 1, padding: '1rem', borderRadius: '14px', fontWeight: '800', background: 'var(--bg-main)', border: '1px solid var(--border)' }}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '1rem', borderRadius: '14px', fontWeight: '800' }}>
                                    {editingItem ? 'Save Specs' : 'Register Asset'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};


export default Inventory;
