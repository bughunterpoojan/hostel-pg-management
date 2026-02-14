import { useAuth } from '../context/AuthContext';
import { Bell, Search } from 'lucide-react';

const Navbar = () => {
    const { user } = useAuth();

    return (
        <nav className="navbar" style={{
            height: '64px',
            background: '#fff',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem',
            position: 'sticky',
            top: 0,
            zIndex: 10
        }}>
            <div className="nav-left" style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                <div style={{ position: 'relative', width: '300px' }}>
                    <Search size={18} style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)'
                    }} />
                    <input
                        type="text"
                        placeholder="Search..."
                        style={{
                            width: '100%',
                            padding: '0.5rem 1rem 0.5rem 2.5rem',
                            borderRadius: 'var(--radius)',
                            border: '1px solid var(--border)',
                            background: '#f8fafc'
                        }}
                    />
                </div>
            </div>

            <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <button style={{ color: 'var(--text-muted)' }}>
                    <Bell size={20} />
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>{user?.username}</div>
                        <div className={`badge badge-info`} style={{ fontSize: '0.7rem' }}>{user?.role}</div>
                    </div>
                    <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'var(--primary)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '600'
                    }}>
                        {user?.username?.[0]?.toUpperCase()}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
