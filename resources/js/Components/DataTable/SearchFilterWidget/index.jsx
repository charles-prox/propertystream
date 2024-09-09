import React from "react";
import { SearchInput } from "./SearchInput";
import { Divider } from "@nextui-org/react";
import TableFilters from "./TableFilters";

export const SearchFilterWidget = ({
    handleSearchKey,
    handleResetSearch,
    columns,
}) => {
    const assetsTableFilters = JSON.parse(
        sessionStorage.getItem("assetsTableFilters")
    );
    const [filters, setFilters] = React.useState(assetsTableFilters || []);
    // Function to save applied filters in localstorage and apply it on query
    const handleApplyFilters = (newFilters) => {
        setFilters(newFilters);
        // Save the filters value to local storage to avoid reset of values when refreshing
        sessionStorage.setItem(
            "assetsTableFilters",
            JSON.stringify(newFilters)
        );
    };

    return (
        <div className="flex gap-4 item-center">
            <SearchInput
                handleSearchKey={(key) => handleSearchKey(key)}
                handleInputClear={() => handleResetSearch()}
            />

            <Divider orientation="vertical" className="h-10" />
            <TableFilters
                columns={columns}
                assetFilters={filters}
                onApplyFilters={handleApplyFilters}
            />
        </div>
    );
};
