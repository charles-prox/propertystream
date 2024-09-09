import React from "react";
import { SearchFilterWidget } from "@/Components/DataTable/SearchFilterWidget";
import { Head } from "@inertiajs/react";
import UsersDataTable from "@/Components/UsersDataTable";
import { useTableOptions } from "@/Contexts/TableOptionsContext";
import { TableOptionsProvider } from "@/Providers/TableOptionsProvider";

const UsersContent = () => {
    const { getTableOptions, updateTableOptions } = useTableOptions();
    const usersTableOptions = getTableOptions("users");

    const handleSearchKey = (tableId) => (key) => {
        updateTableOptions(tableId, { search_key: key, current_page: "1" });
    };

    const handleResetSearch = (tableId) => () => {
        updateTableOptions(tableId, { search_key: "", current_page: "1" });
    };

    return (
        <React.Fragment>
            <Head title="Profile" />
            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-bold">Users</h1>
                        <p>Manage User Profiles and Access</p>
                    </div>
                    <SearchFilterWidget
                        handleSearchKey={handleSearchKey("users")}
                        handleResetSearch={handleResetSearch("users")}
                        columns={[]}
                    />
                </div>
                <UsersDataTable
                    tableId="users"
                    tableOptions={usersTableOptions}
                    updateTableOptions={(newOptions) =>
                        updateTableOptions("users", newOptions)
                    }
                />
            </div>
        </React.Fragment>
    );
};

const Users = () => {
    return (
        <TableOptionsProvider>
            <UsersContent />
        </TableOptionsProvider>
    );
};

export default Users;
