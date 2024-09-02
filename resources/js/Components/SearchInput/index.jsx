import React from "react";
import { Button, Input } from "@nextui-org/react";
import { SearchIcon } from "./icons";

export const SearchInput = ({ handleSearchKey }) => {
    const [tempSearchKey, setTempSearchKey] = React.useState("");
    const handleSearch = () => {
        handleSearchKey(tempSearchKey);
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleSearchKey(tempSearchKey);
        }
    };

    return (
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
            // isClearable
            endContent={
                <Button
                    isIconOnly
                    radius="full"
                    variant="light"
                    size="sm"
                    onClick={handleSearch}
                >
                    <SearchIcon />
                </Button>
            }
        />
    );
};
