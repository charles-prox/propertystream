import { createContext, useContext } from "react";

const SideNavStateContext = createContext();

export const useSideNavState = () => {
    const context = useContext(SideNavStateContext);
    if (!context) {
        throw new Error(
            "useSideNavState must be used within a SideNavStateProvider"
        );
    }
    return context;
};

export default SideNavStateContext;
