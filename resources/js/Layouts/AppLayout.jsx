import React from "react";

import { usePage } from "@inertiajs/react";
// import SideNavbar from "@/Components/SideNavbar";
import { Button, Spacer } from "@nextui-org/react";
import { useTheme } from "@/Contexts/ThemeContext";
import Sidebar from "@/Components/SideNavbar";
import AppNavbar from "@/Components/AppNavbar";

const AppLayout = ({ children }) => {
    const { theme } = useTheme();
    return (
        <main className={`${theme} text-foreground bg-background`}>
            <div className="flex flex-col h-screen ">
                {/* Navbar */}
                <AppNavbar />

                {/* Main Content */}
                <div className="flex overflow-auto">
                    {/* Sidebar */}
                    <Sidebar />

                    {/* Main Content Area */}
                    <div className="flex-1 overflow-y-auto p-10">
                        {children}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default AppLayout;
