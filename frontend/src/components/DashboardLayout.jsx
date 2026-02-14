import Sidebar from './Sidebar';
import Navbar from './Navbar';

const DashboardLayout = ({ children }) => {
    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content" style={{ display: 'flex', flexDirection: 'column' }}>
                <Navbar />
                <main style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
