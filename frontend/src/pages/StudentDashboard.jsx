import { useEffect, useState } from 'react';
import {
    Home, CreditCard, MessageSquare, PlaneTakeoff,
    MapPin, CheckCircle2, Clock, AlertCircle, Phone, Mail
} from 'lucide-react';

const StudentDashboard = () => {
    const [data, setData] = useState({
        room: { number: '101', bed: 'A', type: 'Double', floor: '1st' },
        rent: { amount: 5000, status: 'unpaid', dueDate: '20-Feb-2026' },
        complaints: [
            { id: 1, title: 'Fan not working', status: 'pending', date: '12 Feb' }
        ]
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Student Dashboard</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Everything you need for your stay.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button className="btn btn-primary" style={{ gap: '0.5rem' }}>
                        <MessageSquare size={18} /> New Complaint
                    </button>
                    <button className="btn" style={{ background: '#fff', border: '1px solid var(--border)', gap: '0.5rem' }}>
                        <PlaneTakeoff size={18} /> Apply Leave
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {/* Room Info */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', borderRadius: 'var(--radius)', background: '#eff6ff', color: 'var(--primary)' }}>
                            <Home size={24} />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Active Allocation</div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Room {data.room.number} - Bed {data.room.bed}</div>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius)' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Room Type</div>
                            <div style={{ fontWeight: '600' }}>{data.room.type}</div>
                        </div>
                        <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: 'var(--radius)' }}>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Floor</div>
                            <div style={{ fontWeight: '600' }}>{data.room.floor}</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        <MapPin size={16} />
                        <span>Boys Hostel, Block A</span>
                    </div>
                </div>

                {/* Rent Status */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', borderRadius: 'var(--radius)', background: '#fff7ed', color: '#f97316' }}>
                            <CreditCard size={24} />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Monthly Rent</div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>₹{data.rent.amount.toLocaleString()}</div>
                        </div>
                    </div>
                    <div style={{ padding: '1rem', background: '#fff7ed', borderRadius: 'var(--radius)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: '0.75rem', color: '#9a3412' }}>Due Date</div>
                            <div style={{ fontWeight: '600', color: '#9a3412' }}>{data.rent.dueDate}</div>
                        </div>
                        <button className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}>Pay Now</button>
                    </div>
                    <div style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock size={16} color="var(--text-muted)" />
                        <span style={{ color: 'var(--text-muted)' }}>Status: </span>
                        <span className={`badge badge-${data.rent.status === 'paid' ? 'success' : 'warning'}`}>{data.rent.status}</span>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                {/* Recent Complaints */}
                <div className="card">
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.5rem' }}>My Complaints</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '0.75rem 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Title</th>
                                <th style={{ padding: '0.75rem 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Date</th>
                                <th style={{ padding: '0.75rem 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.complaints.map(c => (
                                <tr key={c.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '1rem 0', fontWeight: '500' }}>{c.title}</td>
                                    <td style={{ padding: '1rem 0', fontSize: '0.875rem' }}>{c.date}</td>
                                    <td style={{ padding: '1rem 0' }}>
                                        <span className={`badge badge-${c.status === 'resolved' ? 'success' : 'warning'}`}>{c.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Quick Help */}
                <div className="card" style={{ background: 'var(--primary)', color: '#fff' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Need Help?</h3>
                    <p style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '1.5rem' }}>Contact the manager or raise a complaint for any maintenance issues.</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Phone size={16} />
                            </div>
                            <span>+91 98765 43210</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Mail size={16} />
                            </div>
                            <span>support@hostelhub.com</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
