import { useState, useEffect } from 'react';
import api from '../api';
import { Package, Plus, Trash2, Edit, AlertTriangle, CheckCircle2 } from 'lucide-react';

const Inventory = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const res = await api.get('inventory/items/');
            setItems(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
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
                <button className="btn btn-primary" style={{ gap: '0.5rem' }}>
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
                                        <button className="btn" style={{ padding: '0.4rem', border: '1px solid var(--border)' }}><Edit size={16} /></button>
                                        <button className="btn" style={{ padding: '0.4rem', border: '1px solid var(--border)', color: 'var(--danger)' }}><Trash2 size={16} /></button>
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
        </div>
    );
};

export default Inventory;
