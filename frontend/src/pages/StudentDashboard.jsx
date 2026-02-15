import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import usePayment from '../hooks/usePayment';
import {
    Home, CreditCard, MessageSquare, PlaneTakeoff,
    MapPin, CheckCircle2, Clock, AlertCircle, Phone, Mail
} from 'lucide-react';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        room: { number: 'N/A', bed: 'N/A', type: 'N/A', floor: 'N/A' },
        rent: null,
        complaints: []
    });

    const fetchData = async () => {
        try {
            const [profileRes, rentsRes, complaintsRes] = await Promise.all([
                api.get('activity/profiles/'),
                api.get('activity/rents/'),
                api.get('activity/complaints/')
            ]);

            const profile = profileRes.data[0];
            const unpaidRent = rentsRes.data.find(r => r.status === 'unpaid');
            const recentComplaints = complaintsRes.data.slice(0, 5);

            setData({
                room: profile?.current_bed_details ? {
                    number: profile.current_bed_details.room_number,
                    bed: profile.current_bed_details.identifier,
                    type: profile.current_bed_details.room_type,
                    floor: `Floor ${profile.current_bed_details.floor_number}`,
                    hostel: profile.current_bed_details.hostel_name
                } : { number: 'N/A', bed: 'N/A', type: 'N/A', floor: 'N/A', hostel: 'N/A' },
                rent: unpaidRent || (rentsRes.data.length > 0 ? rentsRes.data[0] : null),
                complaints: recentComplaints
            });
        } catch (err) {
            console.error('Failed to fetch dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const { handlePayment } = usePayment(fetchData);

    if (loading) return (
        <div style={{ padding: '4rem', textAlign: 'center' }}>
            <div className="animate-spin" style={{ display: 'inline-block', width: '30px', height: '30px', border: '3px solid var(--primary-glow)', borderTopColor: 'var(--primary)', borderRadius: '50%' }}></div>
            <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Preparing your dashboard...</p>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: '800', letterSpacing: '-0.025em', color: 'var(--text-main)' }}>Welcome back!</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Here's what's happening with your stay today.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => navigate('/student/complaints')}
                        className="btn btn-primary"
                        style={{ padding: '0.75rem 1.25rem', fontSize: '0.875rem' }}
                    >
                        <MessageSquare size={18} /> <span className="hide-tablet">Raise Complaint</span><span className="show-tablet">Complaint</span>
                    </button>
                    <button
                        onClick={() => navigate('/student/leaves')}
                        className="btn"
                        style={{ background: '#fff', border: '1px solid var(--border)', color: 'var(--text-main)', padding: '0.75rem 1.25rem', fontSize: '0.875rem' }}
                    >
                        <PlaneTakeoff size={18} /> <span className="hide-tablet">Apply for Leave</span><span className="show-tablet">Leave</span>
                    </button>
                    <style>{`
                        @media (max-width: 640px) {
                            .hide-tablet { display: none; }
                            .show-tablet { display: inline; }
                        }
                        @media (min-width: 641px) {
                            .show-tablet { display: none; }
                        }
                    `}</style>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                {/* Room Info */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.05 }}>
                        <Home size={120} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <div style={{ padding: '0.875rem', borderRadius: '14px', background: 'var(--primary-glow)', color: 'var(--primary)' }}>
                            <Home size={26} />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Allocation</div>
                            <div style={{ fontSize: '1.375rem', fontWeight: '800', color: 'var(--text-main)' }}>Room {data.room.number} • {data.room.bed}</div>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem' }}>
                        <div style={{ padding: '1rem', background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Type</div>
                            <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{data.room.type}</div>
                        </div>
                        <div style={{ padding: '1rem', background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Location</div>
                            <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{data.room.floor}</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0 0.5rem' }}>
                        <MapPin size={16} color="var(--primary)" />
                        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)' }}>{data.room.hostel || 'Main Hostel Complex'}</span>
                    </div>
                </div>

                {/* Rent Status */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.05 }}>
                        <CreditCard size={100} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <div style={{ padding: '0.875rem', borderRadius: '14px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' }}>
                            <CreditCard size={26} />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Outstanding Rent</div>
                            <div style={{ fontSize: '1.375rem', fontWeight: '800', color: 'var(--text-main)' }}>
                                ₹{data.rent ? (parseFloat(data.rent.amount) + parseFloat(data.rent.late_fee)).toLocaleString() : '0.00'}
                            </div>
                        </div>
                    </div>

                    {data.rent && data.rent.status === 'unpaid' ? (
                        <div style={{
                            padding: '1.25rem',
                            background: 'linear-gradient(135deg, #fffbeb 0%, #fff',
                            borderRadius: 'var(--radius)',
                            border: '1px solid #fde68a',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#92400e' }}>Due In</div>
                                <div style={{ fontWeight: '800', color: '#92400e', fontSize: '1.125rem' }}>{data.rent.due_date}</div>
                            </div>
                            <button
                                onClick={() => handlePayment(data.rent)}
                                className="btn btn-primary"
                                style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}
                            >
                                Pay Now
                            </button>
                        </div>
                    ) : (
                        <div style={{
                            padding: '1.25rem',
                            background: 'linear-gradient(135deg, #ecfdf5 0%, #fff)',
                            borderRadius: 'var(--radius)',
                            border: '1px solid #a7f3d0',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#065f46' }}>Status</div>
                                <div style={{ fontWeight: '800', color: '#065f46', fontSize: '1.125rem' }}>Fully Paid</div>
                            </div>
                            <button
                                onClick={() => navigate('/student/payments')}
                                className="btn"
                                style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem', background: '#fff', border: '1px solid #a7f3d0', color: '#065f46' }}
                            >
                                History
                            </button>
                        </div>
                    )}
                    <div style={{ fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0 0.5rem' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: data.rent?.status === 'paid' ? 'var(--success)' : 'var(--warning)' }}></div>
                        <span style={{ fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{data.rent?.status || 'Active'}</span>
                        <span style={{ color: 'var(--text-light)' }}>• No pending fines</span>
                    </div>
                </div>
            </div>

            <div className="dashboard-main-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
                <style>{`
                    @media (max-width: 1024px) {
                        .dashboard-main-grid { grid-template-columns: 1fr !important; }
                    }
                `}</style>
                {/* Recent Complaints */}
                <div className="card" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.025em' }}>Recent Complaints</h3>
                        <button
                            onClick={() => navigate('/student/complaints')}
                            style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--primary)', textDecoration: 'underline', textUnderlineOffset: '4px' }}
                        >
                            View All
                        </button>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.75rem' }}>
                            <thead>
                                <tr style={{ textAlign: 'left' }}>
                                    <th style={{ padding: '0 1rem', color: 'var(--text-light)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>Description</th>
                                    <th style={{ padding: '0 1rem', color: 'var(--text-light)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>Created</th>
                                    <th style={{ padding: '0 1rem', color: 'var(--text-light)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.complaints.length > 0 ? data.complaints.map(c => (
                                    <tr key={c.id} style={{ background: 'var(--bg-main)', borderRadius: 'var(--radius)' }}>
                                        <td style={{ padding: '1.25rem 1rem', fontWeight: '700', color: 'var(--text-main)', borderTopLeftRadius: 'var(--radius)', borderBottomLeftRadius: 'var(--radius)' }}>{c.title}</td>
                                        <td style={{ padding: '1.25rem 1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                            {new Date(c.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td style={{ padding: '1.25rem 1rem', borderTopRightRadius: 'var(--radius)', borderBottomRightRadius: 'var(--radius)' }}>
                                            <span className={`badge badge-${c.status === 'resolved' ? 'success' : 'warning'}`}>
                                                {c.status}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="3" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>No recent complaints found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Support Card */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="card" style={{ background: 'var(--bg-sidebar)', color: '#fff', border: 'none', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', opacity: 0.1, color: '#fff' }}>
                            <AlertCircle size={100} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1rem', color: '#fff' }}>Quick Assistance</h3>
                        <p style={{ fontSize: '0.9375rem', opacity: 0.7, marginBottom: '2rem', lineHeight: '1.6' }}>Got an emergency or stuck somewhere? Our support team is available 24/7 to help you out.</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.2)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: '600' }}>Call Manager</div>
                                    <div style={{ fontWeight: '700' }}>+91 98765 43210</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(14, 165, 233, 0.2)', color: 'var(--info)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: '600' }}>Email Support</div>
                                    <div style={{ fontWeight: '700' }}>support@hostelhub.com</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
