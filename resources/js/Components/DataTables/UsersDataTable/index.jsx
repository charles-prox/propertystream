import { useEffect, useState, useCallback } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    User,
    Chip,
    Tooltip,
    Spinner,
    Button,
} from "@nextui-org/react";
import { axiosInstance, url } from "@/utils/helpers";
import React from "react";
import { EditIcon, InfoIcon } from "./icons";
import { DeleteIcon } from "../SearchFilterWidget/icons";
import { TablePagination } from "../TablePagination";
import EmptySearchContent from "../EmptySearchContent";
import { useTableOptions } from "@/Contexts/TableOptionsContext";
import { router } from "@inertiajs/react";

const statusColorMap = {
    active: "success",
    paused: "danger",
    vacation: "warning",
};

const UsersDataTable = ({ tableId, columns }) => {
    // const { data } = usePage().props;
    const [users, setUsers] = useState({
        rows: [],
        total_users: 0,
        total_pages: 0,
    });
    const { getTableOptions, updateTableOptions } = useTableOptions();
    const tableOptions = getTableOptions(tableId);

    const [loadingState, setLoadingState] = useState("idle");
    const [selectedKeys, setSelectedKeys] = useState(new Set([]));
    const [sortDescriptor, setSortDescriptor] = useState({
        column: "name",
        direction: "ascending",
    });

    useEffect(() => {
        fetchUsers();
    }, [tableOptions]);

    const fetchUsers = () => {
        setLoadingState("loading"); // Set loading state before the request
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
                setLoadingState("idle"); // Reset loading state after the request
            });
    };

    const renderCell = useCallback((user, columnKey) => {
        const cellValue = user["user_id"];

        switch (columnKey) {
            case "name":
                const middleInitial = !!user.middle_name
                    ? user.middle_name[0].toUpperCase() + ". "
                    : "";
                return (
                    <User
                        avatarProps={{
                            size: "md",
                            radius: "lg",
                            fallback: user.first_name[0] + user.last_name[0],
                            src: user.profile_photo_path
                                ? url(user.profile_photo_path)
                                : false,
                            showFallback: true,
                            classNames: {
                                base: `${
                                    user.profile_photo_path
                                        ? "bg-transparent"
                                        : "bg-[#EBF4FF] dark:bg-[#7F9CF5] "
                                } text-[#7F9CF5] dark:text-[#EBF4FF] `,
                            },
                        }}
                        description={
                            <p className="text-bold text-sm capitalize text-default-400">
                                {user.hris_id}
                            </p>
                        }
                        name={
                            user.first_name +
                            " " +
                            middleInitial +
                            user.last_name
                        }
                    />
                );
            case "employment":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize">
                            {user.position}
                        </p>
                        <p className="text-bold text-sm capitalize text-default-400">
                            {user.employment_status.charAt(0).toUpperCase() +
                                user.employment_status.slice(1)}
                        </p>
                    </div>
                );
            case "office":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize">
                            {user.office_name}
                        </p>
                        <p className="text-bold text-sm capitalize text-default-400 max-w-md">
                            {user.office_address}
                        </p>
                    </div>
                );
            case "roles":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize">
                            {user.roles.join(", ")}
                        </p>
                    </div>
                );
            case "status":
                return (
                    <Chip
                        className="capitalize"
                        color={statusColorMap["active"]}
                        size="sm"
                        variant="flat"
                    >
                        {user.account_status.charAt(0).toUpperCase() +
                            user.account_status.slice(1)}
                    </Chip>
                );
            case "actions":
                return (
                    <div className="flex justify-center">
                        <Tooltip content="More info">
                            <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                radius="lg"
                                className="text-lg text-foreground"
                            >
                                <InfoIcon />
                            </Button>
                        </Tooltip>
                        <Tooltip content="Edit user">
                            <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                radius="lg"
                                className="text-lg text-foreground "
                            >
                                <EditIcon />
                            </Button>
                        </Tooltip>
                        <Tooltip color="danger" content="Delete user">
                            <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                radius="lg"
                                color="danger"
                                className="text-lg text-danger"
                                onPress={() => {
                                    router.delete(
                                        route("users.destroy", user.hris_id)
                                    );
                                }}
                            >
                                <DeleteIcon />
                            </Button>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    return (
        <Table
            aria-label="Users data table"
            sortDescriptor={sortDescriptor}
            selectedKeys={selectedKeys}
            selectionMode="multiple"
            onSelectionChange={setSelectedKeys}
            bottomContentPlacement="outside"
            onSortChange={(descriptor) => {
                const direction =
                    descriptor.direction === "ascending" ? "asc" : "desc";

                // Find the column that matches the descriptor.column
                const matchingColumn = columns.find(
                    (col) => col.uid === descriptor.column
                );

                let column;
                if (
                    matchingColumn &&
                    Array.isArray(matchingColumn.dbColumn) &&
                    matchingColumn.dbColumn.length > 0
                ) {
                    // Use the first value in dbColumn array
                    column = matchingColumn.dbColumn[0];
                } else if (
                    matchingColumn &&
                    typeof matchingColumn.dbColumn === "string"
                ) {
                    // If dbColumn is a string, use it directly
                    column = matchingColumn.dbColumn;
                } else {
                    // Fallback to a default column if no match or invalid dbColumn
                    column = "id"; // or any other default column you prefer
                }
                setSortDescriptor(descriptor);
                updateTableOptions(tableId, {
                    sort_by: `${column}:${direction}`,
                });
            }}
            topContent={
                (selectedKeys.size > 0 || selectedKeys === "all") && (
                    <div>
                        <p className="text-default-500 text-sm">
                            Selected{" "}
                            <span>
                                {selectedKeys === "all"
                                    ? users.total_users
                                    : selectedKeys.size}
                            </span>{" "}
                            out of <span>{users.total_users}</span> users
                        </p>
                    </div>
                )
            }
            bottomContent={
                users.total_pages > 0 ? (
                    <TablePagination
                        perPage={tableOptions.per_page}
                        lastPage={users.total_pages}
                        currentPage={tableOptions.current_page}
                        onRowsPerPageChange={(newPerPage) => {
                            updateTableOptions(tableId, {
                                per_page: newPerPage,
                                current_page: "1", // Reset to first page when changing items per page
                            });
                        }}
                        onGoToPageChange={(newPage) => {
                            if (newPage) {
                                updateTableOptions(tableId, {
                                    current_page: newPage,
                                });
                            }
                        }}
                        onPaginationChange={(newPage) => {
                            updateTableOptions(tableId, {
                                current_page: newPage,
                            });
                        }}
                    />
                ) : null
            }
        >
            <TableHeader columns={columns}>
                {(column) => (
                    <TableColumn
                        key={column.uid}
                        align={column.uid === "actions" ? "center" : "start"}
                        allowsSorting={
                            column.uid !== "status" && column.uid !== "actions"
                        }
                    >
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody
                items={users.rows}
                loadingContent={<Spinner />}
                loadingState={loadingState}
                emptyContent={
                    <EmptySearchContent
                        resetTable={() =>
                            updateTableOptions(tableId, { search_key: "" })
                        }
                    />
                }
            >
                {(item) => (
                    <TableRow key={item.user_id}>
                        {(columnKey) => (
                            <TableCell>{renderCell(item, columnKey)}</TableCell>
                        )}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};

export default UsersDataTable;
