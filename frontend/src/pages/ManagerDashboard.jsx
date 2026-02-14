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
    ArcElement
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
    Legend
);

const StatCard = ({ title, value, icon: Icon, trend, color }) => (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius)',
                background: `${color}15`,
                color: color
            }}>
                <Icon size={24} />
            </div>
            {trend && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '0.75rem',
                    color: trend > 0 ? 'var(--success)' : 'var(--danger)',
                    fontWeight: '600'
                }}>
                    {trend > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {Math.abs(trend)}%
                </div>
            )}
        </div>
        <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{title}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.25rem' }}>{value}</div>
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
        // Mock data for demo, in real app fetch from API
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
            borderColor: 'var(--primary)',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            fill: true,
            tension: 0.4
        }]
    };

    const occupancyData = {
        labels: ['Occupied', 'Vacant'],
        datasets: [{
            data: [85, 15],
            backgroundColor: ['var(--primary)', '#e2e8f0'],
            borderWidth: 0
        }]
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Dashboard Overview</h1>
                <p style={{ color: 'var(--text-muted)' }}>Welcome back, here's what's happening today.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                <StatCard title="Total Students" value={stats.totalStudents} icon={Users} trend={12} color="#2563eb" />
                <StatCard title="Occupied Rooms" value={stats.occupiedRooms} icon={Building2} trend={5} color="#8b5cf6" />
                <StatCard title="Monthly Revenue" value={`₹${stats.monthlyRevenue.toLocaleString()}`} icon={CreditCard} trend={8} color="#059669" />
                <StatCard title="Pending Complaints" value={stats.pendingComplaints} icon={MessageSquare} trend={-2} color="#ef4444" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Revenue Trends</h3>
                        <div className="badge badge-success">Live Updates</div>
                    </div>
                    <div style={{ height: '300px' }}>
                        <Line data={revenueData} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>

                <div className="card">
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.5rem' }}>Occupancy Rate</h3>
                    <div style={{ height: '200px', position: 'relative' }}>
                        <Doughnut data={occupancyData} options={{ cutout: '75%', maintainAspectRatio: false }} />
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.occupancyRate}%</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Occupied</div>
                        </div>
                    </div>
                    <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Total Capacity</span>
                            <span style={{ fontWeight: '600' }}>60 Beds</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Available</span>
                            <span style={{ fontWeight: '600' }}>9 Beds</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.5rem' }}>Recent Activity</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {[
                        { user: 'Rahul Verma', action: 'applied for Leave', date: '2 hours ago', status: 'pending' },
                        { user: 'Amit Sahni', action: 'submited a Complaint', date: '5 hours ago', status: 'new' },
                        { user: 'Sneha Gupta', action: 'paid Monthly Rent', date: 'Yesterday', status: 'confirmed' }
                    ].map((activity, i) => (
                        <div key={i} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingBottom: '1rem',
                            borderBottom: i === 2 ? 'none' : '1px solid var(--border)'
                        }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <User size={20} color="var(--text-muted)" />
                                </div>
                                <div>
                                    <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{activity.user}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{activity.action} • {activity.date}</div>
                                </div>
                            </div>
                            <div className={`badge badge-${activity.status === 'confirmed' ? 'success' : 'warning'}`}>
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
