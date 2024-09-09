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
import { router, usePage } from "@inertiajs/react";
import { url } from "@/utils/helpers";
import React from "react";
import { EditIcon, InfoIcon } from "./icons";
import { DeleteIcon } from "../DataTable/SearchFilterWidget/icons";
import { TablePagination } from "../DataTable/TablePagination";
import EmptySearchContent from "../EmptySearchContent";

const columns = [
    { name: "NAME", uid: "name" },
    { name: "EMPLOYMENT", uid: "employment" },
    { name: "OFFICE", uid: "office" },
    { name: "ROLES", uid: "roles" },
    { name: "STATUS", uid: "status" },
    { name: "ACTIONS", uid: "actions" },
];
const statusColorMap = {
    active: "success",
    paused: "danger",
    vacation: "warning",
};

const UsersDataTable = ({ searchKey, resetSearch, tableOptions }) => {
    const { users } = usePage().props;

    const [loadingState, setLoadingState] = useState("idle");
    const [selectedKeys, setSelectedKeys] = useState(new Set([]));
    const [sortDescriptor, setSortDescriptor] = useState({
        column: "name",
        direction: "ascending",
    });

    // console.log("storedTableOptions:" + JSON.stringify(storedTableOptions));
    const [requestData, setRequestData] = useState(tableOptions);

    // Watch for changes in searchKey prop and apply the changes to requestData using lodash throttle/debounce
    useEffect(() => {
        if (searchKey) {
            setRequestData((prevState) => ({
                ...prevState,
                search_key: searchKey,
                current_page: "1",
            }));
        } else {
            handleResetTable();
        }
    }, [searchKey]);

    useEffect(() => {
        sessionStorage.setItem("tableOptions", JSON.stringify(requestData));
        fetchUsers();
    }, [requestData]);

    useEffect(() => {
        console.log("resetSearch: " + resetSearch);
        resetSearch && handleResetTable();
    }, [resetSearch]);

    // Reset the table search
    const handleResetTable = () => {
        setRequestData((prevState) => ({
            ...prevState,
            search_key: "",
        }));
    };

    const fetchUsers = () => {
        // @ts-ignore
        router.get(route("users"), requestData, {
            only: ["users"],
            preserveState: true,
            preserveScroll: true,
            onStart: () => {
                setLoadingState("loading");
            },
            onFinish: () => {
                setLoadingState("idle");
            },
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
            onSortChange={(descriptor) => {
                const direction =
                    descriptor.direction === "ascending" ? "asc" : "desc";
                const column =
                    descriptor.column === "name"
                        ? "first_name"
                        : descriptor.column === "employment"
                        ? "position"
                        : // : descriptor.column === "status"
                          // ? "account_status"
                          "first_name";
                setSortDescriptor(descriptor);
                console.log("11234121");
                setRequestData((prevState) => ({
                    ...prevState,
                    sort_by: column + ":" + direction,
                }));
            }}
            selectedKeys={selectedKeys}
            selectionMode="multiple"
            onSelectionChange={setSelectedKeys}
            topContent={
                (selectedKeys.size > 0 || selectedKeys === "all") && (
                    <div>
                        <p className="text-default-500 text-sm">
                            Selected{" "}
                            <span>
                                {selectedKeys === "all"
                                    ? users.total
                                    : selectedKeys.size}
                            </span>{" "}
                            out of <span>{users.total}</span> users
                        </p>
                    </div>
                )
            }
            bottomContentPlacement="outside"
            bottomContent={
                users.last_page > 0 ? (
                    <TablePagination
                        perPage={requestData.per_page.toString()}
                        lastPage={users.last_page}
                        paginationPage={
                            users.current_page || requestData.current_page
                        }
                        currenPage={
                            users.current_page.toString() ||
                            requestData.current_page.toString()
                        }
                        onRowsPerPageChange={(keys) => {
                            setRequestData((prevState) => ({
                                ...prevState,
                                per_page: keys.currentKey,
                            }));
                        }}
                        onGoToPageChange={(keys) => {
                            keys &&
                                setRequestData((prevState) => ({
                                    ...prevState,
                                    current_page: keys,
                                }));
                        }}
                        onPaginationChange={(page) => {
                            setRequestData((prevState) => ({
                                ...prevState,
                                current_page: page,
                            }));
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
                items={users.data}
                loadingContent={<Spinner />}
                loadingState={loadingState}
                emptyContent={
                    <EmptySearchContent resetTable={() => handleResetTable()} />
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
