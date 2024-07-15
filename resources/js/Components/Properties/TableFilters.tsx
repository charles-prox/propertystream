import { FilterIcon } from "@/Icons/Properties/FilterIcon";
import {
    Autocomplete,
    AutocompleteSection,
    AutocompleteItem,
} from "@nextui-org/autocomplete";
import {
    Button,
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@nextui-org/react";
import { color } from "framer-motion";
import React from "react";

const animals = [
    {
        label: "Cat",
        value: "cat",
        description: "The second most popular pet in the world",
    },
    {
        label: "Dog",
        value: "dog",
        description: "The most popular pet in the world",
    },
    {
        label: "Elephant",
        value: "elephant",
        description: "The largest land animal",
    },
    { label: "Lion", value: "lion", description: "The king of the jungle" },
    { label: "Tiger", value: "tiger", description: "The largest cat species" },
    {
        label: "Giraffe",
        value: "giraffe",
        description: "The tallest land animal",
    },
    {
        label: "Dolphin",
        value: "dolphin",
        description:
            "A widely distributed and diverse group of aquatic mammals",
    },
    {
        label: "Penguin",
        value: "penguin",
        description: "A group of aquatic flightless birds",
    },
    {
        label: "Zebra",
        value: "zebra",
        description: "A several species of African equids",
    },
    {
        label: "Shark",
        value: "shark",
        description:
            "A group of elasmobranch fish characterized by a cartilaginous skeleton",
    },
    {
        label: "Whale",
        value: "whale",
        description: "Diverse group of fully aquatic placental marine mammals",
    },
    {
        label: "Otter",
        value: "otter",
        description: "A carnivorous mammal in the subfamily Lutrinae",
    },
    {
        label: "Crocodile",
        value: "crocodile",
        description: "A large semiaquatic reptile",
    },
];

const TableFilters = () => {
    return (
        <div>
            <Popover placement="bottom">
                <PopoverTrigger>
                    <Button
                        startContent={
                            <FilterIcon width={20} height={20} fill="none" />
                        }
                        color="primary"
                    >
                        Filter
                    </Button>
                </PopoverTrigger>
                <PopoverContent>
                    <div className="flex gap-3 py-2">
                        <Autocomplete
                            key={"column"}
                            label="Select column to filter"
                            className="max-w-xs"
                        >
                            {animals.map((animal) => (
                                <AutocompleteItem
                                    key={animal.value}
                                    value={animal.value}
                                >
                                    {animal.label}
                                </AutocompleteItem>
                            ))}
                        </Autocomplete>
                        <Autocomplete
                            key={"value"}
                            label="Select column value"
                            className="max-w-xs"
                        >
                            {animals.map((animal) => (
                                <AutocompleteItem
                                    key={animal.value}
                                    value={animal.value}
                                >
                                    {animal.label}
                                </AutocompleteItem>
                            ))}
                        </Autocomplete>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default TableFilters;
