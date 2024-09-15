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
    Spinner,
    Select,
    SelectItem,
    Button,
    Divider,
} from "@nextui-org/react";
import { router, usePage } from "@inertiajs/react";
import { decodeHtmlEntities } from "@/utils/helpers";
import MoreInfo from "./TableElements/MoreInfo";
import ModalAlert from "../ModalAlert";
import EmptySearchContent from "../DataTables/Modules/EmptySearchContent";
import GenerationDialog from "./TableElements/GenerationDialog";
import DetailsFormDialog from "./TableElements/DetailsFormDialog";
import { PdfIcon } from "./icons";

// Mapping status labels to color codes for displaying in the table
const statusColorMap = {
    deployed: "success",
    deployable: "warning",
    pending: "danger",
    "For Repair": "danger",
    "For Disposal": "danger",
};

const PropertyDataTable = ({ searchKey, columns, resetSearch }) => {
    const { properties, properties_with_details } = usePage().props;

    // Load the table options from session storage on component mount
    const assetsTableOptions = JSON.parse(
        sessionStorage.getItem("assetsTableOptions")
    );

    // Load selected property keys from session storage on component mount
    const selectedProperties = JSON.parse(
        sessionStorage.getItem("selectedProperties")
    );

    // State management for various aspects of the table and dialogs
    const [loadingState, setLoadingState] = useState("idle");
    const [disabledKeys, setDisabledKeys] = useState([]);
    const [currentProperty, setCurrentProperty] = useState(-1);
    const [selectedKeys, setSelectedKeys] = useState({
        keys: selectedProperties
            ? new Set(selectedProperties.keys || [])
            : new Set([]),
        details: selectedProperties ? selectedProperties.details || [] : [],
    });
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
    const [isDialogFormOpen, setIsDialogFormOpen] = useState(false);

    const [sortDescriptor, setSortDescriptor] = useState({
        column: "name",
        direction: "ascending",
    });
    const [tableOptions, setTableOptions] = useState(
        assetsTableOptions || {
            current_page: 1,
            per_page: 10,
            sort_by: "",
            order_by: "",
            search_key: "",
        }
    );

    const pages = Math.ceil(properties.total / tableOptions.per_page);

    // Initialize disabled rows in the table based on the properties' status
    useEffect(() => {
        const newDisabledKeys = properties.rows
            .filter(
                (item) =>
                    item.status_label.status_meta === "deployable" ||
                    item.status_label.status_meta === "pending"
            )
            .map((item) => item.id.toString());
        setDisabledKeys(newDisabledKeys);
    }, [properties]);

    // Save the keys of the selected rows in the session storage
    useEffect(() => {
        const selectedProperties = {
            keys: Array.from(selectedKeys.keys),
            details: selectedKeys.details,
        };

        sessionStorage.setItem(
            "selectedProperties",
            JSON.stringify(selectedProperties)
        );
    }, [selectedKeys]);

    // Execute fetchData function every time there are changes in tableOptions
    useEffect(() => {
        sessionStorage.setItem(
            "assetsTableOptions",
            JSON.stringify(tableOptions)
        );
        fetchData();
    }, [tableOptions]);

    // Update tableOptions every time searchKey is updated
    useEffect(() => {
        if (searchKey) {
            setTableOptions((prevState) => ({
                ...prevState,
                search_key: searchKey,
                current_page: 1,
            }));
        } else {
            handleResetTable();
        }
    }, [searchKey]);

    // Function to fetch/update data from third party api
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

    // Handle changes in table sorting
    const handleTableSort = (descriptor) => {
        const direction = descriptor.direction === "ascending" ? "asc" : "desc";
        const column = descriptor.column;
        setSortDescriptor(descriptor);
        setTableOptions((prevState) => ({
            ...prevState,
            sort_by: column,
            order_by: direction,
        }));
    };

    // Handle row selection
    const handleSelection = (keys) => {
        setCurrentProperty(keys);

        if (disabledKeys.includes(keys.currentKey)) {
            setIsAlertOpen(true);
        } else {
            if (
                keys.currentKey &&
                !properties_with_details.includes(keys.currentKey)
            ) {
                setIsDialogFormOpen(true);
            } else {
                const keysArray = Array.from(keys);

                setSelectedKeys((selectedKeys) => ({
                    ...selectedKeys,
                    keys: keys,
                    details:
                        keys.currentKey !== undefined
                            ? [
                                  ...selectedKeys.details,
                                  properties.rows.find(
                                      (row) =>
                                          row.id === parseInt(keys.currentKey)
                                  ),
                              ]
                            : [
                                  ...selectedKeys.details.filter((detail) =>
                                      keysArray.includes(detail.id.toString())
                                  ),
                              ],
                }));
            }
        }
    };

    // Handle the state of the dialog form
    const handleDialogFormState = (state, key) => {
        if (key) {
            const keysArray = Array.from(key);
            setIsDialogFormOpen(state);
            setSelectedKeys((selectedKeys) => ({
                ...selectedKeys,
                keys: key,
                details:
                    key.currentKey !== undefined
                        ? [
                              ...selectedKeys.details,
                              properties.rows.find(
                                  (row) => row.id === parseInt(key.currentKey)
                              ),
                          ]
                        : [
                              ...selectedKeys.details.filter((detail) =>
                                  keysArray.includes(detail.id.toString())
                              ),
                          ],
            }));
        } else setIsDialogFormOpen(state);
    };

    // Reset the table search
    const handleResetTable = () => {
        resetSearch();
        setTableOptions((prevState) => ({
            ...prevState,
            search_key: "",
        }));
    };

    // Dynamically process and render values in the table cells
    const renderCell = useCallback((item, columnKey) => {
        const cellValue = item.id;

        switch (columnKey) {
            case "name":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize">
                            {decodeHtmlEntities(item.name)}
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
            case "asset_tag":
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

    // Pagination bar component
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

    // Header that shows when at least a row is selected
    const SelectionActions = () => {
        return (
            <div className="flex items-end justify-between">
                <div
                    className={`flex gap-3 items-center ${
                        selectedKeys.keys.size <= 0 && "invisible"
                    } `}
                >
                    <p className={`text-default-500 text-sm `}>
                        Selected{" "}
                        <span>
                            {selectedKeys.keys === "all"
                                ? properties.total
                                : selectedKeys.keys.size}
                        </span>{" "}
                        out of <span> {properties.total}</span> properties
                    </p>
                    <Divider orientation="vertical" className="h-4" />
                    <Button
                        variant="light"
                        color="danger"
                        size="sm"
                        // className="text-default-500"
                        onClick={() =>
                            setSelectedKeys((selectedKeys) => ({
                                ...selectedKeys,
                                keys: new Set([]),
                                details: [],
                            }))
                        }
                    >
                        Unselect All
                    </Button>
                </div>
                <Button
                    size="sm"
                    variant="flat"
                    color="primary"
                    startContent={
                        <PdfIcon width={25} height={25} fill={"currentColor"} />
                    }
                    className={selectedKeys.keys.size <= 0 && "invisible"}
                    onClick={() => setIsGenerateDialogOpen(true)}
                >
                    Generate Form
                </Button>
            </div>
        );
    };

    return (
        <div>
            <Table
                className="property-table"
                aria-label="Property Table"
                selectionMode="multiple"
                bottomContentPlacement="outside"
                topContent={<SelectionActions />}
                bottomContent={<PaginationBar />}
                sortDescriptor={sortDescriptor}
                onSortChange={handleTableSort}
                selectedKeys={[...selectedKeys.keys]}
                onSelectionChange={handleSelection}
            >
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn
                            key={column.uid}
                            align={
                                column.uid === "actions" ? "center" : "start"
                            }
                            allowsSorting={
                                column.uid !== "status" &&
                                column.uid !== "actions"
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
                    emptyContent={
                        <EmptySearchContent
                            resetTable={() => handleResetTable()}
                        />
                    }
                >
                    {(item) => (
                        <TableRow key={item.id}>
                            {(columnKey) => (
                                <TableCell>
                                    {renderCell(item, columnKey)}
                                </TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {/* This component alerts the user that the row is not selectable */}
            <ModalAlert
                isOpen={isAlertOpen}
                setIsAlertOpen={(state) => setIsAlertOpen(state)}
                title={"Oops!"}
                type={"warning"}
                message={
                    <p className="text-default-500 text-sm">
                        We are unable to generate a
                        <span className="font-bold"> PAR</span> or
                        <span className="font-bold"> ICS</span> for a property
                        that has not been deployed.
                    </p>
                }
            />

            {/* This component is a dialog to generate form*/}
            <GenerationDialog
                isOpen={isGenerateDialogOpen}
                setIsDialogOpen={(state) => setIsGenerateDialogOpen(state)}
                selected={{
                    keys: Array.from(selectedKeys.keys),
                    details: selectedKeys.details,
                }}
            />
            {/* This component is a form to add required details to each property before generating the form*/}
            <DetailsFormDialog
                isOpen={isDialogFormOpen}
                setIsDialogOpen={(state, key) => {
                    handleDialogFormState(state, key);
                }}
                property={currentProperty}
            />
        </div>
    );
};

export default PropertyDataTable;
