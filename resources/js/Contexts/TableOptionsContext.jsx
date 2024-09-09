import { createContext, useContext } from "react";

const TableOptionsContext = createContext();

export const useTableOptions = () => {
    const context = useContext(TableOptionsContext);
    if (!context) {
        throw new Error(
            "useTableOptions must be used within a TableOptionsProvider"
        );
    }
    return context;
};

export default TableOptionsContext;
