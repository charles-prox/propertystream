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
    const [filters, setFilters] = useState([]);
    const [errors, setErrors] = useState([]);
    const { theme } = useTheme();

    useEffect(() => {
        if (Array.isArray(tableOptions.filters)) {
            setFilters(tableOptions.filters);
        } else {
            setFilters([]);
        }
    }, [tableOptions.filters]);

    const handleColumnChange = useCallback(
        (index, newValue) => {
            setFilters((prevFilters) => {
                const newFilters = [...prevFilters];
                const column = columns.find((col) => col.uid === newValue);

                if (column) {
                    newFilters[index] = {
                        uid: column.uid,
                        name: column.name,
                        dbColumn: column.dbColumn,
                        value: newFilters[index]?.value || "",
                    };
                } else {
                    newFilters[index] = {
                        uid: "",
                        name: "",
                        dbColumn: [],
                        value: newFilters[index]?.value || "",
                    };
                }
                return newFilters;
            });
        },
        [columns]
    );

    const handleValueChange = (index, newValue) => {
        setFilters((prevFilters) => {
            const newFilters = [...prevFilters];
            newFilters[index] = { ...newFilters[index], value: newValue };
            return newFilters;
        });
    };

    const addFilters = () => {
        setFilters((prevFilters) => [
            ...prevFilters,
            { uid: "", name: "", dbColumn: [], value: "" },
        ]);
    };

    const removeFilter = (index) => {
        setFilters((prevFilters) => {
            const newFilters = prevFilters.filter((_, i) => i !== index);
            updateTableOptions(tableId, {
                filters: newFilters,
                current_page: "1",
            });
            return newFilters;
        });
    };

    const removeAllFilter = useCallback(() => {
        setFilters([]);
        setErrors([]);
        updateTableOptions(tableId, { filters: [], current_page: "1" });
    }, []);

    const applyFilters = useCallback(() => {
        const validFilters = filters.filter(
            (filter) =>
                (filter.uid && filter.value) || Array.isArray(filter.value)
        );

        // Only update table options when applying filters
        updateTableOptions(tableId, {
            filters: validFilters,
            current_page: "1",
        });
    }, [filters, tableId, updateTableOptions]);

    return (
        <div>
            <Popover
                placement="bottom"
                triggerType="grid"
                className={`${theme} text-foreground`}
            >
                <Badge
                    content={filters.length}
                    size="lg"
                    color="warning"
                    placement="top-left"
                    isInvisible={filters.length <= 0}
                >
                    <PopoverTrigger>
                        <Button color="primary" isIconOnly>
                            <FilterIcon width={20} height={20} fill="none" />
                        </Button>
                    </PopoverTrigger>
                </Badge>
                <PopoverContent>
                    <div className="py-4 px-3 flex flex-col gap-3 items-center ">
                        {filters.length === 0 ? (
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
                                    {filters.map((filter, index) => {
                                        const selectedKeys = filters.map(
                                            (f) => f.uid
                                        );
                                        return (
                                            <div
                                                key={index}
                                                className="flex items-start gap-2 "
                                            >
                                                <Autocomplete
                                                    aria-label="column"
                                                    id={`column-${index}`}
                                                    name={`column-${index}`}
                                                    placeholder="Column"
                                                    size="sm"
                                                    defaultItems={columns}
                                                    disabledKeys={[
                                                        "actions",
                                                        ...selectedKeys,
                                                    ]}
                                                    defaultSelectedKey={
                                                        filter.uid || null
                                                    }
                                                    selectedKeys={
                                                        filter.uid || null
                                                    }
                                                    menuTrigger="input"
                                                    isInvalid={
                                                        errors[index]?.column
                                                    }
                                                    errorMessage={
                                                        errors[index]?.column &&
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
                                                    aria-label="value"
                                                    id={`filter-value-${index}`}
                                                    name={`filter-value-${index}`}
                                                    placeholder="Value"
                                                    size="sm"
                                                    value={filter.value}
                                                    isInvalid={
                                                        errors[index]?.value
                                                    }
                                                    errorMessage={
                                                        errors[index]?.value &&
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
                                        );
                                    })}
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
