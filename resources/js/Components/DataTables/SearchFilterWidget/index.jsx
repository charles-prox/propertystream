import React from "react";
import { SearchInput } from "./SearchInput";
import { Divider } from "@nextui-org/react";
import TableFilters from "./TableFilters";
import { useTableOptions } from "@/Contexts/TableOptionsContext";

export const SearchFilterWidget = ({ tableId, columns }) => {
    const { getTableOptions, updateTableOptions } = useTableOptions();
    const tableOptions = getTableOptions(tableId);

    const handleSearchKey = (key) => {
        updateTableOptions(tableId, { search_key: key, current_page: "1" });
    };

    const handleResetSearch = () => {
        updateTableOptions(tableId, { search_key: "", current_page: "1" });
    };

    return (
        <div className="flex gap-4 items-center">
            <SearchInput
                handleSearchKey={handleSearchKey}
                handleInputClear={handleResetSearch}
                value={tableOptions.search_key}
            />

            <Divider orientation="vertical" className="h-10" />
            <TableFilters tableId={tableId} columns={columns} />
        </div>
    );
};
