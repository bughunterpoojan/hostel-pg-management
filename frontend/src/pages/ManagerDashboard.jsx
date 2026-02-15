import { useEffect, useState } from 'react';
import api from '../api';
import {
    Users, Building2, MessageSquare, CreditCard,
    ArrowUpRight, ArrowDownRight, TrendingUp, User
} from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const StatCard = ({ title, value, icon: Icon, trend, color }) => (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{
                padding: '0.875rem',
                borderRadius: '14px',
                background: `${color}10`,
                color: color,
                border: `1px solid ${color}20`
            }}>
                <Icon size={26} />
            </div>
            {trend && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    padding: '0.375rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    background: trend > 0 ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                    color: trend > 0 ? '#10b981' : '#ef4444',
                    fontWeight: '700'
                }}>
                    {trend > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {Math.abs(trend)}%
                </div>
            )}
        </div>
        <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</div>
            <div style={{ fontSize: '1.75rem', fontWeight: '800', marginTop: '0.375rem', color: 'var(--text-main)', letterSpacing: '-0.025em' }}>{value}</div>
        </div>
        <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', opacity: 0.03, color: color }}>
            <Icon size={100} />
        </div>
    </div>
);

const ManagerDashboard = () => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        occupiedRooms: 0,
        pendingComplaints: 0,
        monthlyRevenue: 0,
        occupancyRate: 0,
    });

    useEffect(() => {
        // Mock data for demo
        setStats({
            totalStudents: 48,
            occupiedRooms: 18,
            pendingComplaints: 5,
            monthlyRevenue: 245000,
            occupancyRate: 85,
        });
    }, []);

    const revenueData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Monthly Revenue',
            data: [180000, 210000, 195000, 240000, 230000, 245000],
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#fff',
            pointBorderColor: '#6366f1',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
        }]
    };

    const occupancyData = {
        labels: ['Occupied', 'Vacant'],
        datasets: [{
            data: [85, 15],
            backgroundColor: ['#6366f1', '#f1f5f9'],
            hoverBackgroundColor: ['#4f46e5', '#e2e8f0'],
            borderWidth: 0,
            spacing: 2
        }]
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: '800', letterSpacing: '-0.025em', color: 'var(--text-main)' }}>Management Overview</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Key insights into your hostel's performance and operations.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <div className="badge badge-success" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'currentColor', animation: 'pulse 2s infinite' }}></div>
                        Live Operations
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
                <StatCard title="Active Students" value={stats.totalStudents} icon={Users} trend={12} color="#6366f1" />
                <StatCard title="Beds Occupied" value={stats.occupiedRooms} icon={Building2} trend={5} color="#8b5cf6" />
                <StatCard title="Monthly Revenue" value={`₹${(stats.monthlyRevenue / 1000).toFixed(1)}k`} icon={CreditCard} trend={8} color="#10b981" />
                <StatCard title="Open Issues" value={stats.pendingComplaints} icon={MessageSquare} trend={-2} color="#f43f5e" />
            </div>

            <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '2rem' }}>
                <style>{`
                    @media (max-width: 1280px) {
                        .dashboard-grid { grid-template-columns: 1fr !important; }
                    }
                `}</style>
                <div className="card" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.025em' }}>Revenue Performance</h3>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Growth comparison over the last 6 months</p>
                        </div>
                        <select style={{ padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', outline: 'none', background: '#fff', fontSize: '0.875rem', fontWeight: '600' }}>
                            <option>Last 6 Months</option>
                            <option>Year to Date</option>
                        </select>
                    </div>
                    <div style={{ height: '320px' }}>
                        <Line
                            data={revenueData}
                            options={{
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: {
                                    y: {
                                        grid: { color: 'rgba(0,0,0,0.03)', drawBorder: false },
                                        ticks: { color: 'var(--text-light)', font: { size: 11, weight: '600' } }
                                    },
                                    x: {
                                        grid: { display: false },
                                        ticks: { color: 'var(--text-light)', font: { size: 11, weight: '600' } }
                                    }
                                }
                            }}
                        />
                    </div>
                </div>

                <div className="card" style={{ padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.025em', marginBottom: '2.5rem' }}>Hostel Capacity</h3>
                    <div style={{ height: '220px', position: 'relative' }}>
                        <Doughnut
                            data={occupancyData}
                            options={{
                                cutout: '78%',
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } }
                            }}
                        />
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-main)', letterSpacing: '-0.05em' }}>{stats.occupancyRate}%</div>
                            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-light)', textTransform: 'uppercase' }}>Occupied</div>
                        </div>
                    </div>
                    <div style={{ marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: '#6366f1' }}></div>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', fontWeight: '600' }}>Occupied Beds</span>
                            </div>
                            <span style={{ fontWeight: '800', color: 'var(--text-main)' }}>51 Units</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: '#f1f5f9' }}></div>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', fontWeight: '600' }}>Available Units</span>
                            </div>
                            <span style={{ fontWeight: '800', color: 'var(--text-main)' }}>9 Units</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.025em' }}>Real-time Activities</h3>
                    <button style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.875rem' }}>View History Logs</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {[
                        { user: 'Rahul Verma', action: 'applied for Leave', date: '2 hours ago', status: 'pending', id: 'RV-102' },
                        { user: 'Amit Sahni', action: 'submitted a Complaint', date: '5 hours ago', status: 'new', id: 'AS-404' },
                        { user: 'Sneha Gupta', action: 'paid Monthly Rent', date: 'Yesterday', status: 'confirmed', id: 'SG-205' }
                    ].map((activity, i) => (
                        <div key={i} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '1.25rem 1.5rem',
                            background: i % 2 === 0 ? 'var(--bg-main)' : 'transparent',
                            borderRadius: 'var(--radius)'
                        }}>
                            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                                <div style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '12px',
                                    background: '#fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--text-muted)',
                                    border: '1px solid var(--border-light)',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                }}>
                                    <User size={20} />
                                </div>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{ fontWeight: '800', fontSize: '0.9375rem', color: 'var(--text-main)' }}>{activity.user}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: '600' }}>#{activity.id}</div>
                                    </div>
                                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.125rem' }}>
                                        {activity.action} <span style={{ color: 'var(--text-light)' }}>• {activity.date}</span>
                                    </div>
                                </div>
                            </div>
                            <div className={`badge badge-${activity.status === 'confirmed' ? 'success' : 'warning'}`} style={{ minWidth: '100px', textAlign: 'center' }}>
                                {activity.status}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ManagerDashboard;
