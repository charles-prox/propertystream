import React from "react";
import { SearchFilterWidget } from "@/Components/DataTables/SearchFilterWidget";
import { Head, router, usePage } from "@inertiajs/react";
import UsersDataTable from "@/Components/DataTables/UsersDataTable";
import { TableOptionsProvider } from "@/Providers/TableOptionsProvider";
import { Button, Divider } from "@nextui-org/react";
import { AddIcon } from "@/Components/DataTables/SearchFilterWidget/icons";
import { UserManagementForm } from "@/Components/Forms/UserManagementForm";
import { SaveIcon } from "@/Components/Forms/icons";
import { toTitleCase } from "@/utils/helpers";

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
    const [onSubmit, setOnSubmit] = React.useState(false);
    const { action } = usePage().props;

    return (
        <React.Fragment>
            <Head title="Users" />
            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-bold">{`${
                            action ? toTitleCase(action) + " " : ""
                        }User${action ? "" : "s"}`}</h1>
                        <p>
                            {action === "create"
                                ? "Complete the Form Below to Create a User"
                                : action === "edit"
                                ? "Update the User's Account Information"
                                : "Manage User Profiles and Access"}
                        </p>
                    </div>
                    <div className="flex gap-4">
                        {action === "create" || action === "edit" ? (
                            <div className="flex gap-4">
                                <Button
                                    color="default"
                                    onClick={() => router.get(route("users"))}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    color="primary"
                                    startContent={
                                        <SaveIcon
                                            height={20}
                                            width={20}
                                            color={"currentColor"}
                                        />
                                    }
                                    onPress={() => {
                                        setOnSubmit(true);
                                    }}
                                >
                                    Save user
                                </Button>
                            </div>
                        ) : (
                            <>
                                <SearchFilterWidget
                                    tableId={tableId}
                                    columns={columns}
                                />
                                <Divider
                                    orientation="vertical"
                                    className="h-10"
                                />
                                <Button
                                    color="primary"
                                    startContent={
                                        <AddIcon
                                            height={13}
                                            width={13}
                                            color={"currentColor"}
                                        />
                                    }
                                    onClick={() =>
                                        router.get(route("users.create"))
                                    }
                                >
                                    Create User
                                </Button>
                            </>
                        )}
                    </div>
                </div>
                {action === "create" ? (
                    <UserManagementForm onSubmit={onSubmit} />
                ) : (
                    <UsersDataTable tableId={tableId} columns={columns} />
                )}
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
