import { Head, router, usePage } from "@inertiajs/react";
import React from "react";
import PropertyDataTable from "@/Components/DataTables/PropertyDataTable";
import { SearchFilterWidget } from "@/Components/DataTables/Modules/SearchFilterWidget";
import { useTableOptions } from "@/Contexts/TableOptionsContext";
import { TableOptionsProvider } from "@/Providers/TableOptionsProvider";
import { axiosInstance } from "@/Utils/helpers";

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
    const [propertiesWithDetails, setPropertiesWithDetails] = React.useState(
        []
    );
    const [properties, setProperties] = React.useState({
        rows: [],
        total: 0,
        total_pages: 0,
    });

    const [loadingState, setLoadingState] = React.useState("idle");

    // Function to fetch/update data from third party api
    const fetchData = () => {
        setLoadingState("loading");
        axiosInstance
            .post(route("properties.get"), tableOptions)
            .then((response) => {
                // console.log("response: ", response.data.propertiesWithDetails);
                setProperties(response.data.properties);
                setPropertiesWithDetails(response.data.propertiesWithDetails);
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
            })
            .finally(() => {
                setLoadingState("idle"); // Reset loading state after the request
            });
    };

    React.useEffect(() => {
        fetchData();
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

                    <SearchFilterWidget tableId={tableId} columns={columns} />
                </div>
                <PropertyDataTable
                    tableId={tableId}
                    tableOptions={tableOptions}
                    columns={columns}
                    data={properties}
                    isLoading={loadingState}
                    propertiesWithDetails={propertiesWithDetails}
                    updateTable={fetchData}
                />
            </div>
        </React.Fragment>
    );
};

const Properties = () => {
    return (
        <TableOptionsProvider>
            <PropertiesContent />
        </TableOptionsProvider>
    );
};

export default Properties;
