import React from "react";
import { Head } from "@inertiajs/react";
import { router, usePage } from "@inertiajs/react";
import PropertyDataTable from "@/Components/Properties/PropertyDataTable";
import { Button, Divider, Input } from "@nextui-org/react";
import { SearchIcon } from "@/Icons/SearchIcon";
import { FilterIcon } from "@/Icons/Properties/FilterIcon";
import TableFilters from "@/Components/Properties/TableFilters";

const Properties = () => {
    const [searchKey, setSearchKey] = React.useState("");
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
                        placeholder="Search user"
                        startContent={<SearchIcon />}
                        className="w-60"
                        classNames={{
                            inputWrapper: "dark:border-white/50",
                        }}
                        value={searchKey}
                        onValueChange={setSearchKey}
                        isClearable
                    />
                    <Divider orientation="vertical" className="h-10" />
                    <TableFilters />
                </div>
            </div>
            {/* Table of properties */}
            <PropertyDataTable />
        </div>
    );
};

export default Properties;
