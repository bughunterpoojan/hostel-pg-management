import { useState, useEffect } from 'react';
import api from '../api';
import usePayment from '../hooks/usePayment';
import { CreditCard, Download, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const StudentPayments = () => {
    const [rents, setRents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRents();
    }, []);

    const fetchRents = async () => {
        try {
            const res = await api.get('activity/rents/');
            setRents(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const { handlePayment } = usePayment(fetchRents);

    const downloadInvoice = (rentId) => {
        window.open(`http://localhost:8000/api/activity/generate-invoice/${rentId}/`, '_blank');
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Rent & Payments</h1>
                <p style={{ color: 'var(--text-muted)' }}>Manage your monthly dues and download receipts.</p>
            </div>

            <div className="card" style={{ padding: '0' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#f8fafc' }}>
                        <tr style={{ textAlign: 'left' }}>
                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)' }}>Month</th>
                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)' }}>Amount</th>
                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)' }}>Due Date</th>
                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)' }}>Status</th>
                            <th style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rents.map((r) => (
                            <tr key={r.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>
                                    {new Date(r.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </td>
                                <td style={{ padding: '1rem 1.5rem' }}>₹{(parseFloat(r.amount) + parseFloat(r.late_fee)).toLocaleString()}</td>
                                <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>{r.due_date}</td>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <span className={`badge badge-${r.status === 'paid' ? 'success' : 'warning'}`}>
                                        {r.status}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                                        {r.status === 'unpaid' ? (
                                            <button
                                                onClick={() => handlePayment(r)}
                                                className="btn btn-primary"
                                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', gap: '0.4rem' }}
                                            >
                                                <CreditCard size={14} /> Pay Now
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => downloadInvoice(r.id)}
                                                className="btn"
                                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', background: '#f1f5f9', gap: '0.4rem' }}
                                            >
                                                <Download size={14} /> Receipt
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {rents.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        No rent records found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentPayments;
