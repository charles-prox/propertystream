import React, { useState, useEffect } from "react";
import { Button, Input } from "@nextui-org/react";
import { SearchIcon } from "./icons";

export const SearchInput = ({ handleSearchKey, handleInputClear, value }) => {
    const [tempSearchKey, setTempSearchKey] = useState(value || "");

    useEffect(() => {
        setTempSearchKey(value || "");
    }, [value]);

    const handleSearch = () => {
        handleSearchKey(tempSearchKey);
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleSearchKey(tempSearchKey);
        }
    };

    const handleClear = () => {
        setTempSearchKey("");
        handleInputClear();
    };

    return (
        <div className="flex gap-1 items-center">
            <Input
                id="user-search"
                name="user-search"
                variant="bordered"
                placeholder="Search property.."
                classNames={{
                    inputWrapper: "dark:border-white/50",
                }}
                value={tempSearchKey}
                onValueChange={setTempSearchKey}
                onKeyDown={handleKeyDown}
                onClear={handleClear}
                isClearable
            />
            <Button
                isIconOnly
                radius="lg"
                color="primary"
                onClick={handleSearch}
            >
                <SearchIcon />
            </Button>
        </div>
    );
};
