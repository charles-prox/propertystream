import React from "react";
import {
    Select as NextuiSelect,
    SelectItem,
    Autocomplete,
    AutocompleteItem,
} from "@nextui-org/react";
import { getTailwindWidthClass, toTitleCase } from "@/Utils/helpers";

const Select = ({
    selectedKeys,
    selectionMode = "single",
    startContent,
    endContent,
    isRequired,
    name,
    label,
    labelPlacement = "inside",
    placeholder,
    color = "default",
    errorMessage,
    maxWidthClass = "min-w-64",
    autocomplete = false,
    items,
    keyField,
    labelField,
    valueField,
    menuTrigger,
    isClearable,
    onSelectionChange,
    isDisabled,
}) => {
    return (
        <>
            {autocomplete ? (
                <Autocomplete
                    name={name}
                    id={name}
                    defaultItems={items}
                    defaultSelectedKey={selectedKeys}
                    label={label}
                    labelPlacement={labelPlacement}
                    placeholder={placeholder}
                    variant="bordered"
                    inputProps={{
                        classNames: {
                            label: "text-black dark:text-white/90 font-bold",
                            inputWrapper: "border-slate-400",
                            base: maxWidthClass
                                ? getTailwindWidthClass(maxWidthClass)
                                : "", // pass maxWidth if provided
                        },
                    }}
                    isClearable={isClearable}
                    menuTrigger={menuTrigger}
                    onSelectionChange={onSelectionChange}
                    isRequired={isRequired}
                    isInvalid={!!errorMessage} // Pass the error state
                    color={!!errorMessage ? "danger" : color}
                    errorMessage={errorMessage}
                    startContent={startContent}
                    endContent={endContent}
                    isDisabled={isDisabled}
                    allowsEmptyCollection
                >
                    {(item) => (
                        <AutocompleteItem key={item[keyField]}>
                            {item[labelField]}
                        </AutocompleteItem>
                    )}
                </Autocomplete>
            ) : (
                <NextuiSelect
                    label={label}
                    variant="bordered"
                    selectionMode={selectionMode}
                    placeholder={placeholder}
                    labelPlacement={labelPlacement}
                    selectedKeys={selectedKeys}
                    onSelectionChange={onSelectionChange} // Use onChange here
                    isRequired={isRequired} // Add required prop if needed
                    isInvalid={!!errorMessage} // Pass the error state
                    errorMessage={errorMessage}
                    startContent={startContent}
                    endContent={endContent}
                    classNames={{
                        label: "text-black dark:text-white/90 font-bold",
                        trigger: "border-slate-400",
                        base: maxWidthClass
                            ? getTailwindWidthClass(maxWidthClass)
                            : "", // pass maxWidth if provided
                    }}
                >
                    {Array.from(items ?? []).map((item) => (
                        <SelectItem
                            key={item[keyField]}
                            value={item[valueField]}
                        >
                            {toTitleCase(item[labelField])}
                        </SelectItem>
                    ))}
                </NextuiSelect>
            )}
        </>
    );
};

export default Select;
