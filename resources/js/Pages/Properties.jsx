import { Head } from "@inertiajs/react";
import React from "react";
import PropertyDataTable from "@/Components/PropertyDataTable";
import { SearchFilterWidget } from "@/Components/DataTables/SearchFilterWidget";

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
    const [searchKey, setSearchKey] = React.useState("");

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
                    <SearchFilterWidget
                        handleSearchKey={(key) => setSearchKey(key)}
                        columns={columns}
                    />
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
