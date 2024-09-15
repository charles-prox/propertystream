import {
    Autocomplete,
    AutocompleteItem,
    Divider,
    Pagination as NextUIPagination,
    Select,
    SelectItem,
} from "@nextui-org/react";
import React from "react";

export const Pagination = ({
    perPage,
    lastPage,
    currentPage,
    onRowsPerPageChange,
    onGoToPageChange,
    onPaginationChange,
}) => {
    return (
        <div className="flex w-full justify-between">
            <div className="flex gap-3">
                <div className="flex justify-center items-center ">
                    <p className="text-default-500 pr-1">Rows per page:</p>
                    <Select
                        aria-label="Number of users per page"
                        size="sm"
                        className="w-20"
                        selectedKeys={[perPage]}
                        onSelectionChange={(keys) => {
                            const newPerPage = Array.from(keys)[0];
                            onRowsPerPageChange(newPerPage);
                        }}
                    >
                        {["5", "10", "25", "50"].map((num) => (
                            <SelectItem key={num} value={num}>
                                {num}
                            </SelectItem>
                        ))}
                    </Select>
                </div>
                <Divider orientation="vertical" />
                <div className="flex justify-center items-center ">
                    <p className="text-default-500 pr-1">Go to page:</p>
                    <Autocomplete
                        id="gotopage"
                        name="gotopage"
                        aria-labelledby="Go to page"
                        className="w-20"
                        size="sm"
                        selectedKey={currentPage.toString()}
                        isClearable={false}
                        onSelectionChange={(key) => {
                            onGoToPageChange(key);
                        }}
                    >
                        {Array.from({ length: lastPage }, (_, i) =>
                            (i + 1).toString()
                        ).map((num) => (
                            <AutocompleteItem key={num} value={num}>
                                {num}
                            </AutocompleteItem>
                        ))}
                    </Autocomplete>
                </div>
            </div>

            <NextUIPagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={parseInt(currentPage)}
                total={lastPage}
                onChange={(page) => {
                    onPaginationChange(page.toString());
                }}
            />
        </div>
    );
};
