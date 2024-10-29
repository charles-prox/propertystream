import React, { useState, useCallback, useEffect } from "react";
import TableOptionsContext from "@/Contexts/TableOptionsContext";

const defaultOptions = {
    current_page: "1",
    per_page: "10",
    sort_by: "id:asc",
    search_key: "",
    filters: [],
};

export const TableOptionsProvider = ({ children }) => {
    const [tableOptions, setTableOptions] = useState(() => {
        const storedOptions = sessionStorage.getItem("tableOptions");
        return storedOptions ? JSON.parse(storedOptions) : {};
    });

    useEffect(() => {
        if (Object.keys(tableOptions).length > 0) {
            sessionStorage.setItem(
                "tableOptions",
                JSON.stringify(tableOptions)
            );
        }
    }, [tableOptions]);

    const getTableOptions = useCallback(
        (tableId) => {
            if (!tableOptions[tableId]) {
                // If the tableId doesn't exist, initialize it with default options
                setTableOptions((prev) => ({
                    ...prev,
                    [tableId]: { ...defaultOptions },
                }));
                return { ...defaultOptions };
            }
            return tableOptions[tableId];
        },
        [tableOptions]
    );

    const updateTableOptions = useCallback((tableId, newOptions) => {
        setTableOptions((prevOptions) => {
            const currentOptions = prevOptions[tableId] || {
                ...defaultOptions,
            };

            const updatedOptions = {
                ...currentOptions,
                ...newOptions,
            };

            // Only update if there are actual changes
            if (
                JSON.stringify(currentOptions) !==
                JSON.stringify(updatedOptions)
            ) {
                return {
                    ...prevOptions,
                    [tableId]: updatedOptions,
                };
            }
            return prevOptions;
        });
    }, []);

    return (
        <TableOptionsContext.Provider
            value={{ getTableOptions, updateTableOptions }}
        >
            {children}
        </TableOptionsContext.Provider>
    );
};
