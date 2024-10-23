import { useEffect, useState, useCallback } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    Spinner,
    Button,
    Divider,
} from "@nextui-org/react";
import { decodeHtmlEntities } from "@/Utils/helpers";
import MoreInfo from "./TableElements/MoreInfo";
import EmptySearchContent from "../Modules/EmptySearchContent";
import GenerationDialog from "./TableElements/GenerationDialog";
import DetailsFormDialog from "./TableElements/DetailsFormDialog";
import { PdfIcon } from "./icons";
import { useTableOptions } from "@/Contexts/TableOptionsContext";
import { Pagination } from "../Modules/Pagination";
import ModalAlert from "@/Components/ModalAlert";

// Mapping status labels to color codes for displaying in the table
const statusColorMap = {
    deployed: "success",
    deployable: "warning",
    pending: "danger",
    "For Repair": "danger",
    "For Disposal": "danger",
};

const PropertyDataTable = ({
    tableId,
    tableOptions,
    data: properties,
    columns,
    isLoading,
    propertiesWithDetails: properties_with_details,
    updateTable,
}) => {
    const { updateTableOptions } = useTableOptions();

    // Load selected property keys from session storage on component mount
    const selectedProperties = JSON.parse(
        sessionStorage.getItem("selectedProperties")
    );

    // State management for various aspects of the table and dialogs
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

    // Handle changes in table sorting
    const handleTableSort = (descriptor) => {
        const direction = descriptor.direction === "ascending" ? "asc" : "desc";
        const column = descriptor.column;
        setSortDescriptor(descriptor);
        updateTableOptions(tableId, {
            sort_by: `${column}:${direction}`,
        });
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
            updateTable();
        } else setIsDialogFormOpen(state);
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
        return properties.total_pages > 0 ? (
            <Pagination
                perPage={tableOptions.per_page}
                lastPage={properties.total_pages}
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
        ) : null;
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
                    loadingState={isLoading}
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
                properties={properties}
            />
        </div>
    );
};

export default PropertyDataTable;
