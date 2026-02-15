import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Building2, Users, CreditCard, MessageSquare,
    Package, LayoutDashboard, UserCircle, LogOut,
    Home, FileText, Settings, ShieldCheck, PlaneTakeoff
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
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
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    onClick={onClose}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(15, 23, 42, 0.4)',
                        backdropFilter: 'blur(4px)',
                        zIndex: 40,
                        transition: 'var(--transition)'
                    }}
                />
            )}

            <aside className={`sidebar ${isOpen ? 'mobile-open' : ''}`} style={{
                background: 'var(--bg-sidebar)',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                width: '280px',
                position: 'fixed',
                left: 0,
                top: 0,
                zIndex: 50,
                transition: 'var(--transition)',
                transform: isOpen ? 'translateX(0)' : 'translateX(-100%)'
            }}>
                <style>{`
                    @media (min-width: 1025px) {
                        .sidebar {
                            transform: translateX(0) !important;
                            position: sticky !important;
                        }
                    }
                `}</style>
                <div style={{ padding: '2.5rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        width: '38px',
                        height: '38px',
                        background: 'linear-gradient(135deg, #818cf8, #4f46e5)',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                    }}>
                        <Building2 size={22} color="white" />
                    </div>
                    <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.025em', color: '#fff' }}>AcmeHostel</span>
                </div>

                <nav style={{ padding: '0 0.75rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {menu.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            onClick={() => { if (window.innerWidth <= 1024) onClose(); }}
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '0.875rem 1rem',
                                borderRadius: 'var(--radius-sm)',
                                color: isActive ? '#fff' : 'rgba(255, 255, 255, 0.45)',
                                background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                                textDecoration: 'none',
                                fontSize: '0.875rem',
                                fontWeight: isActive ? '600' : '500',
                                transition: 'all 0.2s ease',
                                borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent'
                            })}
                        >
                            <item.icon size={18} style={{ opacity: 1 }} />
                            <span>{item.name}</span>
                        </NavLink>
                    ))}
                </nav>

                <div style={{ padding: '1.5rem', background: 'rgba(0, 0, 0, 0.2)', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        marginBottom: '1.5rem',
                        padding: '0.5rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(255, 255, 255, 0.03)'
                    }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                            border: '2px solid rgba(99, 102, 241, 0.3)'
                        }}>
                            {user?.profile_photo ? (
                                <img src={user.profile_photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <UserCircle size={24} color="rgba(255, 255, 255, 0.8)" />
                            )}
                        </div>
                        <div>
                            <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#fff' }}>{user?.username}</div>
                            <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'capitalize' }}>{user?.role}</div>
                        </div>
                    </div>
                    <button
                        onClick={() => { logout(); navigate('/login'); }}
                        className="btn"
                        style={{
                            width: '100%',
                            background: 'rgba(239, 68, 68, 0.05)',
                            color: '#f87171',
                            border: '1px solid rgba(239, 68, 68, 0.15)',
                            gap: '0.5rem',
                            justifyContent: 'center'
                        }}
                    >
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
