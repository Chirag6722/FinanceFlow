import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div className="flex min-h-screen bg-background text-text-primary font-sans selection:bg-primary/30">
            <Sidebar isOpen={sidebarOpen} onClose={toggleSidebar} />
            <main className="flex-1 flex flex-col min-w-0 ml-0 md:ml-64 transition-all duration-300">
                <Header toggleSidebar={toggleSidebar} />
                <div className="flex-1 p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto space-y-8">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Layout;
