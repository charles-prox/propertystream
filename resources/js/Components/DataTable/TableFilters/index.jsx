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
import React from "react";
import { useTheme } from "@/ThemeProvider";

const TableFilters = ({ columns, assetFilters, onApplyFilters }) => {
    const [filters, setFilters] = React.useState(assetFilters);
    const [errors, setErrors] = React.useState([]);
    const { theme } = useTheme();

    const handleColumnChange = (index, newValue) => {
        const newFilters = [...filters];
        newFilters[index].column = newValue;
        setFilters(newFilters);
    };

    const handleValueChange = (index, newValue) => {
        const newFilters = [...filters];
        newFilters[index].value = newValue;
        setFilters(newFilters);
    };

    const addFilters = () => {
        setFilters([...filters, { column: "", value: "" }]);
    };
    const removeFilter = (index) => {
        const newFilters = filters.filter((_, i) => i !== index);
        setFilters(newFilters);
    };

    const removeAllFilter = () => {
        setFilters([]);
    };

    const applyFilters = () => {
        const newErrors = {};
        let isValid = true;

        filters.forEach((filter, index) => {
            newErrors[index] = { column: false, value: false };
            if (!filter.column) {
                newErrors[index].column = true;
                isValid = false;
            }
            if (!filter.value) {
                newErrors[index].value = true;
                isValid = false;
            }
        });

        setErrors(newErrors);

        if (isValid) {
            setErrors([]);
            onApplyFilters(filters);
        }
    };

    // Force update filters when filter is empty
    React.useEffect(() => {
        filters.length <= 0 && onApplyFilters([]);
    }, [filters]);

    return (
        <div>
            <Popover
                placement="bottom"
                triggerType="grid"
                className={`${theme} text-foreground`}
            >
                <Badge
                    content={assetFilters.length}
                    size="lg"
                    color="warning"
                    placement="top-left"
                    isInvisible={assetFilters.length <= 0}
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
                        {filters.length <= 0 ? (
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
                                    onClick={() => addFilters()}
                                >
                                    Add filter
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="flex flex-col gap-3 items-center ">
                                    {filters.map((filter, index) => (
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
                                                selectedKey={filter.column}
                                                menuTrigger="input"
                                                isInvalid={
                                                    errors[index]
                                                        ? errors[index].column
                                                        : false
                                                }
                                                errorMessage={
                                                    errors[index] &&
                                                    "You can't leave this field empty."
                                                }
                                                onSelectionChange={(key) => {
                                                    handleColumnChange(
                                                        index,
                                                        key
                                                    );
                                                }}
                                                color="default"
                                            >
                                                {(item) =>
                                                    item.uid !== "actions" && (
                                                        <AutocompleteItem
                                                            key={item.uid}
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
                                                        ? errors[index].value
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
                                            onClick={() => addFilters()}
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
