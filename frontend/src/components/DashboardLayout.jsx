import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const DashboardLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="dashboard-layout">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="main-content">
                <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
                <main>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
