import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Building2, Users, CreditCard, MessageSquare,
    Package, LayoutDashboard, UserCircle, LogOut,
    Home, FileText, Settings, ShieldCheck, PlaneTakeoff
} from 'lucide-react';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const managerMenu = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/manager' },
        { name: 'Students', icon: Users, path: '/manager/students' },
        { name: 'Hostels & Rooms', icon: Building2, path: '/manager/hostels' },
        { name: 'Inventory', icon: Package, path: '/manager/inventory' },
        { name: 'Leaves', icon: PlaneTakeoff, path: '/manager/leaves' },
        { name: 'Complaints', icon: MessageSquare, path: '/manager/complaints' },
    ];

    const studentMenu = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/student' },
        { name: 'My Room', icon: Home, path: '/student/room' },
        { name: 'Payments', icon: CreditCard, path: '/student/payments' },
        { name: 'Leaves', icon: PlaneTakeoff, path: '/student/leaves' },
        { name: 'Complaints', icon: MessageSquare, path: '/student/complaints' },
        { name: 'My Documents', icon: FileText, path: '/student/profile' },
    ];

    const staffMenu = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/staff' },
        { name: 'Complaints', icon: MessageSquare, path: '/staff/complaints' },
    ];

    const menu = user?.role === 'manager' ? managerMenu :
        user?.role === 'staff' ? staffMenu :
            studentMenu;

    return (
        <aside className="sidebar">
            <div style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'var(--primary)',
                    borderRadius: 'var(--radius)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff'
                }}>
                    <Building2 size={24} />
                </div>
                <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>HostelHub</span>
            </div>

            <nav style={{ padding: '0 1rem', flex: 1 }}>
                {menu.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.875rem 1rem',
                            borderRadius: 'var(--radius)',
                            color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                            background: isActive ? '#eff6ff' : 'transparent',
                            textDecoration: 'none',
                            marginBottom: '0.5rem',
                            fontWeight: isActive ? '600' : '500',
                            transition: 'all 0.2s'
                        })}
                    >
                        <item.icon size={20} />
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div style={{ padding: '2rem', borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ width: '40px', height: '40px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <UserCircle size={24} color="var(--text-muted)" />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>{user?.username}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user?.role}</div>
                    </div>
                </div>
                <button
                    onClick={() => { logout(); navigate('/login'); }}
                    className="btn"
                    style={{ width: '100%', border: '1px solid var(--border)', gap: '0.5rem', justifyContent: 'center' }}
                >
                    <LogOut size={18} /> Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
