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

    const downloadInvoice = async (rentId) => {
        try {
            const response = await api.get(`activity/generate-invoice/${rentId}/`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `invoice_${rentId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Invoice download failed:', err);
            alert('Failed to download invoice. Please try again.');
        }
    };

    if (loading) return (
        <div style={{ padding: '4rem', textAlign: 'center' }}>
            <div className="animate-spin" style={{ display: 'inline-block', width: '30px', height: '30px', border: '3px solid var(--primary-glow)', borderTopColor: 'var(--primary)', borderRadius: '50%' }}></div>
            <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Loading transactions...</p>
        </div>
    );

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: '800', letterSpacing: '-0.025em', color: 'var(--text-main)' }}>Fee Ledger</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Detailed billing history and upcoming dues.</p>
                </div>
                <div style={{ padding: '0.625rem 1rem', borderRadius: '12px', background: 'var(--primary-glow)', border: '1px solid rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }}></div>
                    <span style={{ fontSize: '0.8125rem', fontWeight: '700', color: 'var(--primary)' }}>Next Billing: Oct 05</span>
                </div>
            </div>

            <div className="card" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0' }}>
                        <thead style={{ background: 'var(--bg-main)' }}>
                            <tr>
                                <th style={{ padding: '1.25rem 2rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Billing Period</th>
                                <th style={{ padding: '1.25rem 2rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Base + Late Fee</th>
                                <th style={{ padding: '1.25rem 2rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cut-off Date</th>
                                <th style={{ padding: '1.25rem 2rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Settlement</th>
                                <th style={{ padding: '1.25rem 2rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rents.map((r, idx) => (
                                <tr key={r.id} style={{
                                    borderBottom: idx === rents.length - 1 ? 'none' : '1px solid var(--border-light)',
                                    transition: 'var(--transition)',
                                    background: r.status === 'unpaid' ? 'rgba(239, 68, 68, 0.02)' : 'transparent'
                                }} className="table-row-hover">
                                    <td style={{ padding: '1.5rem 2rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ padding: '0.625rem', borderRadius: '10px', background: r.status === 'paid' ? 'var(--primary-glow)' : 'rgba(239, 68, 68, 0.1)', color: r.status === 'paid' ? 'var(--primary)' : 'var(--danger)' }}>
                                                <CreditCard size={18} />
                                            </div>
                                            <span style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)' }}>
                                                {new Date(r.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.5rem 2rem' }}>
                                        <div style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '1.0625rem' }}>₹{(parseFloat(r.amount) + parseFloat(r.late_fee)).toLocaleString()}</div>
                                        {parseFloat(r.late_fee) > 0 && <div style={{ fontSize: '0.75rem', color: 'var(--danger)', fontWeight: '600' }}>Incl. ₹{r.late_fee} late fee</div>}
                                    </td>
                                    <td style={{ padding: '1.5rem 2rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-light)', fontSize: '0.9375rem', fontWeight: '600' }}>
                                            <Clock size={14} />
                                            {r.due_date}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.5rem 2rem' }}>
                                        <span className={`badge badge-${r.status === 'paid' ? 'success' : 'warning'}`} style={{
                                            padding: '0.5rem 1rem',
                                            fontSize: '0.75rem',
                                            borderRadius: '10px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.02em',
                                            fontWeight: '800'
                                        }}>
                                            {r.status === 'paid' ? (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                                    <CheckCircle size={12} /> Confirmed
                                                </div>
                                            ) : (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                                                    <AlertCircle size={12} /> Outstanding
                                                </div>
                                            )}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.5rem 2rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                                            {r.status === 'unpaid' ? (
                                                <button
                                                    onClick={() => handlePayment(r)}
                                                    className="btn btn-primary"
                                                    style={{ padding: '0.625rem 1.25rem', fontSize: '0.8125rem', fontWeight: '800', borderRadius: '12px' }}
                                                >
                                                    Secure Payment
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => downloadInvoice(r.id)}
                                                    className="btn btn-hover"
                                                    style={{
                                                        padding: '0.625rem 1.25rem',
                                                        fontSize: '0.8125rem',
                                                        fontWeight: '700',
                                                        background: 'var(--bg-main)',
                                                        border: '1px solid var(--border)',
                                                        borderRadius: '10px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem'
                                                    }}
                                                >
                                                    <Download size={16} /> Receipt
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {rents.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '6rem', background: '#fff' }}>
                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--text-light)' }}>
                            <AlertCircle size={40} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.025em' }}>No Transaction Records</h3>
                        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', fontWeight: '500' }}>Bills will appear here once generated by management.</p>
                    </div>
                )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div className="card" style={{ padding: '1.5rem', background: 'var(--bg-main)', border: '1px dashed var(--border)' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ color: 'var(--primary)' }}><AlertCircle size={20} /></div>
                        <div>
                            <h4 style={{ fontSize: '0.875rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.25rem' }}>Payment Policy</h4>
                            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: '1.6', fontWeight: '500' }}>
                                Standard dues must be cleared by the 5th of every month. A late fee of 2% per day is applicable after the 10th.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="card" style={{ padding: '1.5rem', background: 'var(--bg-main)', border: '1px dashed var(--border)' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ color: 'var(--primary)' }}><CheckCircle size={20} /></div>
                        <div>
                            <h4 style={{ fontSize: '0.875rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.25rem' }}>Secure Transactions</h4>
                            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: '1.6', fontWeight: '500' }}>
                                All payments are processed through encrypted gateways. Receipts are generated instantly upon confirmation.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentPayments;
