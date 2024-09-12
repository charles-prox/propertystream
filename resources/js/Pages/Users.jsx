import React from "react";
import { SearchFilterWidget } from "@/Components/DataTables/SearchFilterWidget";
import { Head } from "@inertiajs/react";
import UsersDataTable from "@/Components/DataTables/UsersDataTable";
import { TableOptionsProvider } from "@/Providers/TableOptionsProvider";

const columns = [
    { name: "NAME", uid: "name", dbColumn: ["first_name", "last_name"] },
    {
        name: "EMPLOYMENT",
        uid: "employment",
        dbColumn: ["position", "employment_status"],
    },
    {
        name: "OFFICE",
        uid: "office",
        dbColumn: ["office_name", "office_address"],
    },
    { name: "ROLES", uid: "roles", dbColumn: ["roles"] },
    { name: "STATUS", uid: "status", dbColumn: ["account_status"] },
    { name: "ACTIONS", uid: "actions", dbColumn: null },
];

const UsersContent = () => {
    const tableId = "users";

    return (
        <React.Fragment>
            <Head title="Users" />
            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-bold">Users</h1>
                        <p>Manage User Profiles and Access</p>
                    </div>
                    <SearchFilterWidget tableId={tableId} columns={columns} />
                </div>
                <UsersDataTable tableId={tableId} columns={columns} />
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
