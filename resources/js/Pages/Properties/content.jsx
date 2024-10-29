import React from "react";
import { Head } from "@inertiajs/react";
import PropertyDataTable from "@/Components/DataTables/PropertyDataTable";
import { SearchFilterWidget } from "@/Components/DataTables/Modules/SearchFilterWidget";
import { useTableOptions } from "@/Contexts/TableOptionsContext";
import useFetch from "@/Hooks/useFetch";

const columns = [
    { name: "NAME", uid: "name" },
    { name: "CATEGORY", uid: "category" },
    { name: "ASSIGNED TO", uid: "assigned_to" },
    { name: "PROPERTY TAG", uid: "asset_tag" },
    { name: "SUPPLIER", uid: "supplier" },
    { name: "STATUS", uid: "status" },
    { name: "ACTIONS", uid: "actions" },
];

const PropertiesContent = () => {
    const tableId = "properties";
    const { getTableOptions } = useTableOptions();
    const tableOptions = getTableOptions(tableId);
    // const { properties, properties_with_details } = usePage().props;

    const {
        data: data,
        loading: loadingState,
        error: error,
        refetch,
    } = useFetch(
        route("properties.get"),
        {
            propertiesWithDetails: [],
            properties: { rows: [], total_users: 0, total_pages: 0 },
        },
        "POST",
        tableOptions
    );

    React.useEffect(() => {
        refetch();
    }, [tableOptions]);

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
                        tableId={tableId}
                        columns={columns}
                        showFilter={false}
                    />
                </div>
                <PropertyDataTable
                    tableId={tableId}
                    tableOptions={tableOptions}
                    columns={columns}
                    data={data.properties}
                    isLoading={loadingState}
                    propertiesWithDetails={data.propertiesWithDetails}
                    updateTable={refetch}
                />
            </div>
        </React.Fragment>
    );
};

export default PropertiesContent;
