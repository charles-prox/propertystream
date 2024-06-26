import React from "react";

import { usePage } from "@inertiajs/react";
import AppNavbar from "@/Components/AppNavbar";
import SidebarNav from "@/Components/SidebarNav";
import { useTheme } from "@/ThemeProvider";
import { useSidebarViewState } from "@/SidebarViewStateProvider";
import { Spacer } from "@nextui-org/react";

const AppLayout = ({ children }) => {
    const { component } = usePage();
    const { sidebarView, toggleSidebarView } = useSidebarViewState();
    const theme = useTheme().theme;

    switch (component.startsWith("Auth/")) {
        // if the component is in login, use LoginLayout
        case true:
            return <main>{children}</main>;

        default:
            return (
                <main
                    className={`${theme} text-foreground bg-background flex flex-col h-screen `}
                >
                    <AppNavbar />
                    <div
                        className={`flex flex-grow overflow-auto bg-slate-300/10`}
                    >
                        {/* Side Navbar */}
                        <SidebarNav />
                        <Spacer
                            x={sidebarView === "collapse" ? 16 : 52}
                            className="transition-all delay-150 duration-100"
                        />
                        <div
                            className={`
                                    flex-grow p-10 overflow-y-auto  bg-slate-400/10
                                   `}
                        >
                            {children}
                        </div>
                    </div>
                </main>
            );
    }
};

export default AppLayout;
