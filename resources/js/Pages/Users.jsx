import React from "react";
import { SearchFilterWidget } from "@/Components/DataTables/Modules/SearchFilterWidget";
import { Head, router, usePage } from "@inertiajs/react";
import UsersDataTable from "@/Components/DataTables/UsersDataTable";
import { TableOptionsProvider } from "@/Providers/TableOptionsProvider";
import { Button, Divider } from "@nextui-org/react";
import { AddIcon } from "@/Components/DataTables/Modules/SearchFilterWidget/icons";
import { UserManagementForm } from "@/Components/Forms/UserManagementForm";
import { SaveIcon } from "@/Components/Forms/icons";
import { axiosInstance, toTitleCase } from "@/utils/helpers";
import ModalAlert from "@/Components/ModalAlert";
import { useTableOptions } from "@/Contexts/TableOptionsContext";

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
    const { getTableOptions } = useTableOptions();
    const tableOptions = getTableOptions(tableId);
    const [alertOptions, setAlertOptions] = React.useState({
        isOpen: false,
        type: "",
        title: "",
        message: "",
        autoClose: true,
    });

    const [onSubmit, setOnSubmit] = React.useState(false);
    const [loadingState, setLoadingState] = React.useState(false);
    const { action, result, user } = usePage().props;
    const [users, setUsers] = React.useState({
        rows: [],
        total_users: 0,
        total_pages: 0,
    });

    const onEdit = (user) => {
        console.log("onEdit: ", user);
        router.get(route("users.edit", user));
    };

    const onDelete = (user) => {
        axiosInstance
            .delete(route("users.destroy", user))
            .then((response) => {
                // console.log("User deleted:", response.data);
                setAlertOptions({
                    isOpen: true,
                    type: "success",
                    title: "User Deleted",
                    message: "The user has been successfully deleted.",
                });
                fetchUsers();
            })
            .catch((error) => {
                console.error("Error deleting user:", error);
            });
    };

    const fetchUsers = () => {
        setLoadingState(true); // Set loading state before the request
        axiosInstance
            .post(route("users.search"), tableOptions)
            .then((response) => {
                // console.log("response: ", response);
                setUsers(response.data);
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
            })
            .finally(() => {
                setLoadingState(false); // Reset loading state after the request
            });
    };

    React.useEffect(() => {
        if (result === "success") {
            if (action === "create") {
                setAlertOptions({
                    isOpen: true,
                    type: "success",
                    title: "User Created",
                    message: "The user has been successfully created.",
                });
            }
            if (action === "edit") {
                setAlertOptions({
                    isOpen: true,
                    type: "success",
                    title: "User Updated",
                    message: "The user has been successfully updated.",
                });
            }
        }
    }, [result]);

    React.useEffect(() => {
        fetchUsers();
    }, [tableOptions]);

    return (
        <React.Fragment>
            <Head title="Users" />
            <ModalAlert
                isOpen={alertOptions.isOpen}
                setIsAlertOpen={(state) =>
                    setAlertOptions({ ...alertOptions, isOpen: state })
                }
                type={alertOptions.type}
                title={alertOptions.title}
                message={alertOptions.message}
                autoClose={alertOptions.autoClose}
            />
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
                {action === "create" || action === "edit" ? (
                    <UserManagementForm onSubmit={onSubmit} user={user} />
                ) : (
                    <UsersDataTable
                        tableId={tableId}
                        tableOptions={tableOptions}
                        columns={columns}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        data={users}
                        isLoading={loadingState}
                    />
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
