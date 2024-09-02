import { Head } from "@inertiajs/react";
import { Divider } from "@nextui-org/react";
import React from "react";
import { SearchInput } from "../Components/SearchInput";
import TableFilters from "@/Components/DataTable/TableFilters";
import PropertyDataTable from "@/Components/PropertyDataTable";

const columns = [
    { name: "NAME", uid: "name" },
    { name: "CATEGORY", uid: "category" },
    { name: "ASSIGNED TO", uid: "assigned_to" },
    { name: "PROPERTY TAG", uid: "asset_tag" },
    { name: "SUPPLIER", uid: "supplier" },
    { name: "STATUS", uid: "status" },
    { name: "ACTIONS", uid: "actions" },
];

const Properties = () => {
    const assetsTableFilters = JSON.parse(
        sessionStorage.getItem("assetsTableFilters")
    );
    const [searchKey, setSearchKey] = React.useState("");
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

    const handleSearchReset = () => {
        setSearchKey("");
    };

    return (
        <React.Fragment>
            <Head title="Profile" />
            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-bold">Properties</h1>
                        <p>Manage Your Properties and Generate Receipts</p>
                    </div>
                    <div className="flex gap-4 item-center">
                        <SearchInput
                            handleSearchKey={(key) => setSearchKey(key)}
                        />

                        <Divider orientation="vertical" className="h-10" />
                        <TableFilters
                            columns={columns}
                            assetFilters={filters}
                            onApplyFilters={handleApplyFilters}
                        />
                    </div>
                </div>
                <PropertyDataTable
                    columns={columns}
                    searchKey={searchKey}
                    resetSearch={() => handleSearchReset()}
                />
            </div>
        </React.Fragment>
    );
};

export default Properties;
