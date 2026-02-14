import { useState, useEffect } from 'react';
import api from '../api';
import { Package, Plus, Trash2, Edit, AlertTriangle, CheckCircle2 } from 'lucide-react';

const Inventory = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [itemForm, setItemForm] = useState({ item_name: '', quantity: 1, condition: 'good', description: '', room: '' });

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const res = await api.get('inventory/items/');
            console.log('Inventory data fetched:', res.data);
            setItems(res.data);
        } catch (err) {
            console.error('Failed to fetch inventory:', err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        try {
            await api.post('inventory/items/', itemForm);
            setIsAddModalOpen(false);
            fetchInventory();
        } catch (err) {
            console.error('Failed to add item:', err);
            alert('Failed to add item. Please check the fields.');
        }
    };

    const handleEditItem = async (e) => {
        e.preventDefault();
        try {
            await api.patch(`inventory/items/${editingItem.id}/`, itemForm);
            setIsEditModalOpen(false);
            fetchInventory();
        } catch (err) {
            console.error('Failed to update item:', err);
            alert('Failed to update item.');
        }
    };

    const handleDeleteItem = async (id) => {
        if (!window.confirm('Are you sure you want to delete this item?')) return;
        try {
            await api.delete(`inventory/items/${id}/`);
            fetchInventory();
        } catch (err) {
            console.error('Failed to delete item:', err);
            alert('Failed to delete item.');
        }
    };

    const openEditModal = (item) => {
        setEditingItem(item);
        setItemForm({
            item_name: item.item_name,
            quantity: item.quantity,
            condition: item.condition,
            description: item.description || '',
            room: item.room || ''
        });
        setIsEditModalOpen(true);
    };

    const getConditionColor = (cond) => {
        switch (cond) {
            case 'new': return 'badge-success';
            case 'good': return 'badge-info';
            case 'damaged': return 'badge-warning';
            case 'missing': return 'badge-danger';
            default: return 'badge-secondary';
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Hostel Inventory</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Track and manage furniture, appliances, and assets.</p>
                </div>
                <button
                    onClick={() => {
                        setItemForm({ item_name: '', quantity: 1, condition: 'good', description: '', room: '' });
                        setIsAddModalOpen(true);
                    }}
                    className="btn btn-primary" style={{ gap: '0.5rem' }}
                >
                    <Plus size={18} /> Add Item
                </button>
            </div>

            <div className="card" style={{ padding: '0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#f8fafc' }}>
                        <tr style={{ textAlign: 'left' }}>
                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)' }}>Item Name</th>
                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)' }}>Quantity</th>
                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)' }}>Condition</th>
                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)' }}>Allocation</th>
                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{ padding: '0.5rem', background: '#f1f5f9', borderRadius: 'var(--radius)' }}>
                                            <Package size={18} color="var(--primary)" />
                                        </div>
                                        <span style={{ fontWeight: '600' }}>{item.item_name}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '1rem 1.5rem' }}>{item.quantity}</td>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <span className={`badge ${getConditionColor(item.condition)}`}>
                                        {item.condition}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>
                                    {item.room_number ? `Room ${item.room_number}` : 'Unallocated'}
                                </td>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => openEditModal(item)}
                                            className="btn" style={{ padding: '0.4rem', border: '1px solid var(--border)' }}
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteItem(item.id)}
                                            className="btn" style={{ padding: '0.4rem', border: '1px solid var(--border)', color: 'var(--danger)' }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {items.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                        <Package size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                        <p>No inventory items found.</p>
                    </div>
                )}
            </div>
            {/* Add/Edit Modal */}
            {(isAddModalOpen || isEditModalOpen) && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000, backdropFilter: 'blur(4px)'
                }}>
                    <div className="card" style={{ width: '90%', maxWidth: '450px' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                            {isAddModalOpen ? 'Add New Item' : `Edit ${editingItem?.item_name}`}
                        </h2>
                        <form onSubmit={isAddModalOpen ? handleAddItem : handleEditItem} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Item Name</label>
                                <input type="text" required className="form-input" value={itemForm.item_name}
                                    onChange={(e) => setItemForm({ ...itemForm, item_name: e.target.value })}
                                    style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Quantity</label>
                                    <input type="number" required className="form-input" value={itemForm.quantity}
                                        onChange={(e) => setItemForm({ ...itemForm, quantity: e.target.value })}
                                        style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Condition</label>
                                    <select className="form-input" value={itemForm.condition}
                                        onChange={(e) => setItemForm({ ...itemForm, condition: e.target.value })}
                                        style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                                        <option value="new">New</option>
                                        <option value="good">Good</option>
                                        <option value="damaged">Damaged</option>
                                        <option value="missing">Missing</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Description</label>
                                <textarea rows="2" className="form-input" value={itemForm.description}
                                    onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                                    style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', resize: 'none' }} />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button type="button" onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} className="btn" style={{ flex: 1, border: '1px solid var(--border)' }}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                                    {isAddModalOpen ? 'Add Item' : 'Save Changes'}
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
