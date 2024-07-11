import { useEffect, useState, useCallback } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Pagination,
    Chip,
    Tooltip,
    Spinner,
    Select,
    SelectItem,
    Button,
} from "@nextui-org/react";
import { router, usePage } from "@inertiajs/react";
import { PdfIcon } from "@/Icons/TableIcons/PdfIcon";
import debounce from "lodash/debounce";
import he from "he";
import MoreInfo from "./MoreInfo";

const columns = [
    { name: "NAME", uid: "property_name" },
    { name: "CATEGORY", uid: "category" },
    { name: "ASSIGNED TO", uid: "assigned_to" },
    { name: "PROPERTY TAG", uid: "property_tag" },
    { name: "SUPPLIER", uid: "supplier" },
    { name: "STATUS", uid: "status" },
    { name: "ACTIONS", uid: "actions" },
];
const statusColorMap = {
    deployed: "success",
    deployable: "warning",
    pending: "danger",
    "For Repair": "danger",
    "For Disposal": "danger",
};

const maxSelections = 10;

const PropertyDataTable = ({ searchKey }) => {
    const { properties } = usePage().props;
    const [loadingState, setLoadingState] = useState("idle");
    const [selectedKeys, setSelectedKeys] = useState(new Set([]));
    const assetsTableOptions = JSON.parse(
        sessionStorage.getItem("assetsTableOptions")
    );
    const [tableOptions, setTableOptions] = useState(
        assetsTableOptions || {
            current_page: 1,
            per_page: 10,
            sort_by: "id:asc",
            search_key: "",
        }
    );

    const pages = Math.ceil(properties.total / tableOptions.per_page);

    // Execute fetchData function every time there are changes in tableOptions
    useEffect(() => {
        sessionStorage.setItem(
            "assetsTableOptions",
            JSON.stringify(tableOptions)
        );
        fetchData();
    }, [tableOptions]);

    const fetchData = () => {
        router.get(route("properties"), tableOptions, {
            only: ["properties"],
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

    const renderCell = useCallback((item, columnKey) => {
        const cellValue = item.id;

        switch (columnKey) {
            case "property_name":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize">
                            {he.decode(he.decode(item.name))}
                        </p>
                        <p className="text-bold text-sm capitalize text-default-400">
                            {item.serial}
                        </p>
                    </div>
                );
            case "category":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm ">
                            {item.model["name"]}
                        </p>
                        {item.category["name"] !== item.model["name"] && (
                            <p className="text-bold text-sm text-default-400">
                                {item.category["name"]}
                            </p>
                        )}
                    </div>
                );
            case "assigned_to":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize">
                            {item.assigned_to
                                ? item.assigned_to["name"]
                                : "---"}
                        </p>
                        {item.assigned_to &&
                            item.assigned_to["name"] !==
                                item.location["name"] && (
                                <p className="text-bold text-sm text-default-400">
                                    {item.location["name"]}
                                </p>
                            )}
                    </div>
                );
            case "property_tag":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize">
                            {item.asset_tag}
                        </p>
                    </div>
                );
            case "supplier":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm ">
                            {item.supplier ? item.supplier["name"] : "---"}
                        </p>
                    </div>
                );
            case "status":
                return (
                    <div className="flex gap-1">
                        <Chip
                            color={
                                statusColorMap[item.status_label.status_meta]
                            }
                            size="sm"
                            variant="flat"
                        >
                            {item.status_label.status_meta
                                .charAt(0)
                                .toUpperCase() +
                                item.status_label.status_meta.slice(1)}
                        </Chip>
                        {item.status_label.name !== "Ready to Deploy" && (
                            <Chip
                                color={statusColorMap[item.status_label.name]}
                                size="sm"
                                variant="flat"
                            >
                                {item.status_label.name}
                            </Chip>
                        )}
                    </div>
                );
            case "actions":
                return <MoreInfo item={item} />;
            default:
                return cellValue;
        }
    }, []);

    const PaginationBar = () => {
        return (
            <div className="flex w-full justify-between">
                <div className="flex justify-center items-center ">
                    <p className="text-default-500 pr-1">Rows per page:</p>
                    <Select
                        aria-label="Number of users per page"
                        size="sm"
                        className="w-20"
                        defaultSelectedKeys={[tableOptions.per_page.toString()]}
                        onSelectionChange={(keys) => {
                            setTableOptions((prevState) => ({
                                ...prevState,
                                per_page: keys.currentKey,
                                current_page:
                                    tableOptions.current_page <=
                                    Math.ceil(
                                        properties.total / keys.currentKey
                                    )
                                        ? tableOptions.current_page
                                        : Math.ceil(
                                              properties.total / keys.currentKey
                                          ),
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
                    page={tableOptions.current_page}
                    total={pages}
                    onChange={(page) =>
                        setTableOptions((prevState) => ({
                            ...prevState,
                            current_page: page,
                        }))
                    }
                />
            </div>
        );
    };

    const SelectionActions = () => {
        return (
            <div className="flex items-end justify-between">
                <p
                    className={`text-default-500 text-sm ${
                        selectedKeys.size <= 0 && "invisible"
                    }`}
                >
                    Selected{" "}
                    <span>
                        {selectedKeys === "all"
                            ? properties.total
                            : selectedKeys.size}
                    </span>{" "}
                    out of <span>{properties.total}</span> properties
                </p>
                <Button
                    size="sm"
                    variant="bordered"
                    color="primary"
                    startContent={
                        <PdfIcon width={25} height={25} fill={"#14b8a5"} />
                    }
                    className={selectedKeys.size <= 0 && "invisible"}
                >
                    Generate Form
                </Button>
            </div>
        );
    };

    return (
        <Table
            className="property-table"
            aria-label="Property Table"
            selectionMode="multiple"
            bottomContentPlacement="outside"
            onSelectionChange={setSelectedKeys}
            topContent={<SelectionActions />}
            bottomContent={<PaginationBar />}
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
                items={properties.rows}
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

export default PropertyDataTable;
