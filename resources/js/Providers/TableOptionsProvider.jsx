import React, { useState, useEffect } from "react";
import TableOptionsContext from "@/Contexts/TableOptionsContext";

const defaultOptions = {
    current_page: "1",
    per_page: "10",
    sort_by: "id:asc",
    search_key: "",
};

export const TableOptionsProvider = ({ children }) => {
    const [tableOptions, setTableOptions] = useState(() => {
        const storedOptions = sessionStorage.getItem("tableOptions");
        return storedOptions ? JSON.parse(storedOptions) : {};
    });

    useEffect(() => {
        sessionStorage.setItem("tableOptions", JSON.stringify(tableOptions));
    }, [tableOptions]);

    const getTableOptions = (tableId) => {
        return tableOptions[tableId] || { ...defaultOptions };
    };

    const updateTableOptions = (tableId, newOptions) => {
        setTableOptions((prevOptions) => ({
            ...prevOptions,
            [tableId]: {
                ...getTableOptions(tableId),
                ...newOptions,
            },
        }));
    };

    return (
        <TableOptionsContext.Provider
            value={{ getTableOptions, updateTableOptions }}
        >
            {children}
        </TableOptionsContext.Provider>
    );
};
