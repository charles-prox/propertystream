import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";
import { FilterIcon, AddIcon, DeleteIcon, EraserIcon, SaveIcon } from "./icons";
import {
    Button,
    Popover,
    PopoverTrigger,
    PopoverContent,
    Input,
    Badge,
    Spacer,
} from "@nextui-org/react";
import React, { useState, useEffect, useCallback } from "react";
import { useTheme } from "@/Contexts/ThemeContext";
import { useTableOptions } from "@/Contexts/TableOptionsContext";

const TableFilters = ({ tableId, columns }) => {
    const { getTableOptions, updateTableOptions } = useTableOptions();
    const tableOptions = getTableOptions(tableId);
    const [filters, setFilters] = useState(null);
    const [errors, setErrors] = useState([]);
    const { theme } = useTheme();

    useEffect(() => {
        if (Array.isArray(tableOptions.filters)) {
            setFilters(tableOptions.filters);
        } else {
            setFilters(null);
        }
    }, [tableOptions.filters]);

    // Keep useCallback here as it depends on `columns` which might change
    const handleColumnChange = useCallback(
        (index, newValue) => {
            setFilters((prevFilters) => {
                const newFilters = [...prevFilters];
                const column = columns.find((col) => col.uid === newValue);
                newFilters[index] = {
                    uid: column.uid,
                    name: column.name,
                    dbColumn: column.dbColumn,
                    value: newFilters[index]?.value || "",
                };
                return newFilters;
            });
        },
        [columns]
    );

    // These simple functions don't need useCallback
    const handleValueChange = (index, newValue) => {
        setFilters((prevFilters) => {
            const newFilters = [...prevFilters];
            newFilters[index] = { ...newFilters[index], value: newValue };
            return newFilters;
        });
    };

    const addFilters = () => {
        if (filters) {
            setFilters((prevFilters) => [
                ...prevFilters,
                { uid: "", name: "", dbColumn: [], value: "" },
            ]);
        } else {
            setFilters([{ uid: "", name: "", dbColumn: [], value: "" }]);
        }
    };

    const removeFilter = (index) => {
        setFilters((prevFilters) => prevFilters.filter((_, i) => i !== index));
    };

    // Keep useCallback for functions that use props or context values
    const removeAllFilter = useCallback(() => {
        setFilters(null);
        updateTableOptions(tableId, { filters: null });
    }, [tableId, updateTableOptions]);

    const applyFilters = useCallback(() => {
        const validFilters = filters.filter(
            (filter) => filter.uid && filter.value
        );
        updateTableOptions(tableId, {
            filters: validFilters,
            current_page: "1",
        });
    }, [filters, tableId, updateTableOptions]);

    // Force update filters when filter is empty
    useEffect(() => {
        if (filters) {
            if (filters.length === 0 && tableOptions.filters !== null) {
                updateTableOptions(tableId, { filters: null });
            }
        }
    }, [filters, tableId, updateTableOptions, tableOptions.filters]);

    return (
        <div>
            <Popover
                placement="bottom"
                triggerType="grid"
                className={`${theme} text-foreground`}
            >
                <Badge
                    content={filters && filters.length}
                    size="lg"
                    color="warning"
                    placement="top-left"
                    isInvisible={filters ? filters.length <= 0 : true}
                >
                    <PopoverTrigger>
                        <Button
                            startContent={
                                <FilterIcon
                                    width={20}
                                    height={20}
                                    fill="none"
                                />
                            }
                            color="primary"
                        >
                            Filters
                        </Button>
                    </PopoverTrigger>
                </Badge>
                <PopoverContent>
                    <div className="py-4 px-3 flex flex-col gap-3 items-center ">
                        {!filters ? (
                            <div className="flex flex-col gap-3 items-center w-80">
                                <p>No existing filters yet.</p>
                                <Button
                                    startContent={
                                        <AddIcon
                                            width={10}
                                            height={10}
                                            color={"#fff"}
                                        />
                                    }
                                    size="sm"
                                    color="primary"
                                    onClick={addFilters}
                                >
                                    Add filter
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="flex flex-col gap-3 items-center ">
                                    {filters &&
                                        filters.map((filter, index) => (
                                            <div
                                                key={index}
                                                className="flex items-start gap-2 "
                                            >
                                                <Autocomplete
                                                    key={`column-${index}`}
                                                    id={`column-${index}`}
                                                    name={`column-${index}`}
                                                    aria-labelledby="Column to filter"
                                                    placeholder="Column"
                                                    size="sm"
                                                    defaultItems={columns}
                                                    disabledKeys={["actions"]}
                                                    defaultSelectedKey={
                                                        filter.uid
                                                            ? filter.uid
                                                            : null
                                                    }
                                                    selectedKeys={
                                                        filter.uid
                                                            ? filter.uid
                                                            : null
                                                    }
                                                    menuTrigger="input"
                                                    isInvalid={
                                                        errors[index]
                                                            ? errors[index]
                                                                  .column
                                                            : false
                                                    }
                                                    errorMessage={
                                                        errors[index] &&
                                                        "You can't leave this field empty."
                                                    }
                                                    onSelectionChange={(
                                                        selectedKey
                                                    ) => {
                                                        handleColumnChange(
                                                            index,
                                                            selectedKey
                                                        );
                                                    }}
                                                    color="default"
                                                >
                                                    {(item) =>
                                                        item.uid !==
                                                            "actions" && (
                                                            <AutocompleteItem
                                                                key={item.uid}
                                                                value={item.uid}
                                                            >
                                                                {item.name}
                                                            </AutocompleteItem>
                                                        )
                                                    }
                                                </Autocomplete>
                                                <Input
                                                    id={`filter-value-${index}`}
                                                    name={`filter-value-${index}`}
                                                    placeholder="Value"
                                                    size="sm"
                                                    value={filter.value}
                                                    isInvalid={
                                                        errors[index]
                                                            ? errors[index]
                                                                  .value
                                                            : false
                                                    }
                                                    errorMessage={
                                                        errors[index] &&
                                                        "You can't leave this field empty."
                                                    }
                                                    onChange={(e) =>
                                                        handleValueChange(
                                                            index,
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <Button
                                                    isIconOnly
                                                    color="danger"
                                                    size="sm"
                                                    onClick={() =>
                                                        removeFilter(index)
                                                    }
                                                    variant="flat"
                                                >
                                                    <DeleteIcon />
                                                </Button>
                                            </div>
                                        ))}
                                </div>
                                <Spacer y={1} />
                                <div className="flex gap-3 justify-between w-full">
                                    <div className="flex gap-3">
                                        <Button
                                            size="sm"
                                            color="warning"
                                            onClick={addFilters}
                                            variant="flat"
                                            startContent={
                                                <AddIcon
                                                    width={10}
                                                    height={10}
                                                    color={"currentColor"}
                                                />
                                            }
                                        >
                                            Add Filter
                                        </Button>
                                        <Button
                                            size="sm"
                                            color="danger"
                                            onClick={removeAllFilter}
                                            variant="flat"
                                            startContent={
                                                <EraserIcon
                                                    width={12}
                                                    height={12}
                                                />
                                            }
                                        >
                                            Clear All
                                        </Button>
                                    </div>
                                    <Button
                                        size="sm"
                                        color="primary"
                                        onClick={applyFilters}
                                        startContent={
                                            <SaveIcon
                                                fill="currentColor"
                                                width={15}
                                                height={15}
                                            />
                                        }
                                    >
                                        Apply All
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default TableFilters;
