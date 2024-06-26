// SidebarViewStateContext.js
import React, {
    createContext,
    useState,
    useContext,
    useEffect,
    useCallback,
} from "react";

const SidebarViewStateContext = createContext();

export const useSidebarViewState = () => useContext(SidebarViewStateContext);

export const SidebarViewStateProvider = ({ children }) => {
    const [sidebarView, setSidebarView] = useState(() => {
        return localStorage.getItem("sidebarview") || "expand";
    });

    const toggleSidebarView = useCallback(() => {
        const newSidebarView = sidebarView === "expand" ? "collapse" : "expand";
        setSidebarView(newSidebarView);
        localStorage.setItem("sidebarview", newSidebarView);
    }, [sidebarView]);

    useEffect(() => {
        const savedSidebarView = localStorage.getItem("sidebarview");
        if (savedSidebarView) {
            setSidebarView(savedSidebarView);
        }
    }, []);

    return (
        <SidebarViewStateContext.Provider
            value={{ sidebarView, toggleSidebarView }}
        >
            {children}
        </SidebarViewStateContext.Provider>
    );
};
