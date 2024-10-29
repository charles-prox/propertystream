import React, { useCallback } from "react";
import { SearchInput } from "./SearchInput";
import TableFilters from "./TableFilters";
import { useTableOptions } from "@/Contexts/TableOptionsContext";

export const SearchFilterWidget = ({ tableId, columns, showFilter = true }) => {
    const { getTableOptions, updateTableOptions } = useTableOptions();
    const tableOptions = getTableOptions(tableId);

    const handleSearchKey = useCallback(
        (key) => {
            updateTableOptions(tableId, { search_key: key, current_page: "1" });
        },
        [tableId, updateTableOptions]
    );

    const handleResetSearch = useCallback(() => {
        updateTableOptions(tableId, { search_key: "", current_page: "1" });
    }, [tableId, updateTableOptions]);

    return (
        <div className="flex gap-2 items-center">
            <SearchInput
                handleSearchKey={handleSearchKey}
                handleInputClear={handleResetSearch}
                value={tableOptions.search_key}
            />

            {showFilter && <TableFilters tableId={tableId} columns={columns} />}
        </div>
    );
};
