import { useAuth } from '../context/AuthContext';
import { Bell, Search, Menu } from 'lucide-react';

const Navbar = ({ onToggleSidebar }) => {
    const { user } = useAuth();

    return (
        <nav className="navbar" style={{
            height: '75px',
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 1.5rem',
            position: 'sticky',
            top: 0,
            zIndex: 30,
            boxShadow: '0 1px 3px 0 rgba(0,0,0,0.02)'
        }}>
            <div className="nav-left" style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                <button
                    onClick={onToggleSidebar}
                    style={{
                        padding: '0.625rem',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--text-main)',
                        background: 'var(--bg-main)',
                        display: 'none'
                    }}
                    className="mobile-menu-btn"
                >
                    <Menu size={22} />
                </button>
                <style>{`
                    @media (max-width: 1024px) {
                        .mobile-menu-btn { display: flex !important; }
                        .nav-search { display: none !important; }
                        .navbar { padding: 0 1rem !important; }
                    }
                `}</style>

                <div className="nav-search" style={{ position: 'relative', width: '320px' }}>
                    <Search size={16} style={{
                        position: 'absolute',
                        left: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-light)'
                    }} />
                    <input
                        type="text"
                        placeholder="Search records..."
                        style={{
                            width: '100%',
                            padding: '0.75rem 1rem 0.75rem 2.75rem',
                            borderRadius: '12px',
                            border: '1px solid var(--border)',
                            background: 'var(--bg-main)',
                            fontSize: '0.875rem',
                            transition: 'var(--transition)',
                            outline: 'none'
                        }}
                    />
                </div>
            </div>

            <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button style={{
                    color: 'var(--text-muted)',
                    padding: '0.625rem',
                    borderRadius: '12px',
                    background: 'var(--bg-main)',
                    display: 'flex',
                    border: '1px solid var(--border)'
                }}>
                    <Bell size={18} />
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '1px solid var(--border)', paddingLeft: '1rem' }}>
                    <div className="nav-user-info" style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: '700', fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: 1 }}>{user?.username}</div>
                        <div style={{ marginTop: '0.25rem' }}>
                            <span className="badge" style={{ fontSize: '0.625rem', background: 'var(--primary-glow)', color: 'var(--primary)', border: 'none' }}>
                                {user?.role}
                            </span>
                        </div>
                    </div>
                    <style>{`@media (max-width: 640px) { .nav-user-info { display: none; } }`}</style>
                    <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '14px',
                        background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '800',
                        fontSize: '1.125rem',
                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
                    }}>
                        {user?.username?.[0]?.toUpperCase()}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
