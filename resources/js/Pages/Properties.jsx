import React from "react";
import { Head } from "@inertiajs/react";
import PropertyDataTable from "@/Components/Properties/PropertyDataTable";
import { Button, Divider, Input } from "@nextui-org/react";
import { SearchIcon } from "@/Icons/SearchIcon";
import TableFilters from "@/Components/Properties/TableFilters";

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
    const [tempSearchKey, setTempSearchKey] = React.useState("");
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

    const handleSearch = () => {
        setSearchKey(tempSearchKey);
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            setSearchKey(tempSearchKey);
        }
    };

    const handleSearchReset = () => {
        setTempSearchKey("");
        setSearchKey("");
    };

    return (
        <div>
            <Head title="Properties" />
            <div className="flex justify-between items-center w-full mb-2">
                <h1 className="text-4xl">Property Record</h1>
                <div className="flex gap-4 item-center">
                    <Input
                        id="user-search"
                        name="user-search"
                        variant="bordered"
                        placeholder="Search property.."
                        classNames={{
                            inputWrapper: "dark:border-white/50",
                        }}
                        value={tempSearchKey}
                        onValueChange={setTempSearchKey}
                        onKeyDown={handleKeyDown}
                        // isClearable
                        endContent={
                            <Button
                                isIconOnly
                                radius="full"
                                variant="light"
                                size="sm"
                                onClick={handleSearch}
                            >
                                <SearchIcon />
                            </Button>
                        }
                    />

                    <Divider orientation="vertical" className="h-10" />
                    <TableFilters
                        columns={columns}
                        assetFilters={filters}
                        onApplyFilters={handleApplyFilters}
                    />
                </div>
            </div>
            {/* Table of properties */}
            <PropertyDataTable
                columns={columns}
                searchKey={searchKey}
                resetSearch={() => handleSearchReset()}
            />
        </div>
    );
};

export default Properties;
