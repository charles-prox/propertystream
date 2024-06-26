import { useEffect, useState, useCallback } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Pagination,
    User,
    Chip,
    Tooltip,
    Spinner,
    Select,
    SelectItem,
    Button,
} from "@nextui-org/react";
import { router, usePage } from "@inertiajs/react";
import { InfoIcon } from "@/Icons/TableIcons/InfoIcon";
import { DeleteIcon } from "@/Icons/TableIcons/DeleteIcon";
import { EditIcon } from "@/Icons/TableIcons/EditIcon";
import debounce from "lodash/debounce";
import { asset } from "@/utils";

const columns = [
    { name: "NAME", uid: "name" },
    { name: "EMPLOYMENT", uid: "employment" },
    { name: "STATUS", uid: "status" },
    { name: "ACTIONS", uid: "actions" },
];
const statusColorMap = {
    active: "success",
    paused: "danger",
    vacation: "warning",
};

const tabledDefaults = {
    current_page: "1",
    per_page: "10",
    sort_by: "id:asc",
    search_key: "",
};

const DataTable = ({ searchKey }) => {
    const { users } = usePage().props;
    const storedTableOptions = JSON.parse(
        sessionStorage.getItem("tableOptions")
    );
    const [loadingState, setLoadingState] = useState("idle");
    const [selectedKeys, setSelectedKeys] = useState(new Set([]));
    const [sortDescriptor, setSortDescriptor] = useState({
        column: "name",
        direction: "ascending",
    });
    const [requestData, setRequestData] = useState(
        storedTableOptions || tabledDefaults
    );

    // Watch for changes in searchKey prop and apply the changes to requestData using lodash throttle/debounce
    useEffect(() => {
        const debounceSearch = debounce(() => {
            setRequestData((prevState) => ({
                ...prevState,
                search_key: searchKey,
            }));
        }, 1000);

        debounceSearch();

        return () => {
            debounceSearch.cancel(); // Cancel the throttle/debounce when component unmounts
        };
    }, [searchKey, setRequestData]);

    useEffect(() => {
        sessionStorage.setItem("tableOptions", JSON.stringify(requestData));
        fetchUsers();
    }, [requestData]);

    const fetchUsers = () => {
        router.get(route("users.index"), requestData, {
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
        const cellValue = user["id"];

        switch (columnKey) {
            case "name":
                const middleInitial = !!user.middle_name
                    ? user.middle_name[0].toUpperCase() + ". "
                    : "";
                return (
                    <User
                        avatarProps={{
                            radius: "lg",
                            fallback:
                                "https://i.pravatar.cc/150?u=a042581f4e29026024d",
                            src: asset("avatar1.jpg"),
                        }}
                        description={user.hris_id}
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
                    <div className="relative flex items-center">
                        <Tooltip content="More info">
                            <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                radius="lg"
                                className="text-lg text-default-400 "
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
                                className="text-lg text-default-400 "
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
                console.log("descriptor: " + JSON.stringify(descriptor));
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
                    <div className="flex w-full justify-between">
                        <div className="flex justify-center items-center ">
                            <p className="text-default-500 pr-1">
                                Rows per page:
                            </p>
                            <Select
                                aria-label="Number of users per page"
                                size="sm"
                                className="w-20"
                                defaultSelectedKeys={[
                                    requestData.per_page.toString(),
                                ]}
                                onSelectionChange={(keys) => {
                                    setRequestData((prevState) => ({
                                        ...prevState,
                                        per_page: keys.currentKey,
                                    }));
                                }}
                            >
                                {[5, 10, 25, 50].map((num) => (
                                    <SelectItem textValue={num} key={num}>
                                        {num}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>

                        <Pagination
                            isCompact
                            showControls
                            showShadow
                            color="primary"
                            page={
                                users.current_page || requestData.current_page
                            }
                            total={users.last_page}
                            onChange={(page) =>
                                setRequestData((prevState) => ({
                                    ...prevState,
                                    current_page: page,
                                }))
                            }
                        />
                    </div>
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
                emptyContent={"No users found."}
            >
                {(item) => (
                    <TableRow key={item.id}>
                        {(columnKey) => (
                            <TableCell>{renderCell(item, columnKey)}</TableCell>
                        )}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};

export default DataTable;
