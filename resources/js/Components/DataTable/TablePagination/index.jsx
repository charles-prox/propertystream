import {
    Autocomplete,
    AutocompleteItem,
    Divider,
    Pagination,
    Select,
    SelectItem,
} from "@nextui-org/react";
import React from "react";

export const TablePagination = ({
    perPage,
    lastPage,
    currentPage,
    paginationPage,
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
                        defaultSelectedKeys={[perPage]}
                        onSelectionChange={(keys) => {
                            onRowsPerPageChange(keys);
                        }}
                    >
                        {[5, 10, 25, 50].map((num) => (
                            <SelectItem textValue={num} key={num}>
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
                        aria-labelledby="Got to page"
                        className="w-20"
                        size="sm"
                        selectedKey={currentPage}
                        isClearable={false}
                        onSelectionChange={(keys) => onGoToPageChange(keys)}
                    >
                        {Array.from({ length: lastPage }, (_, i) =>
                            (i + 1).toString()
                        ).map((num) => (
                            <AutocompleteItem textValue={num} key={num}>
                                {num}
                            </AutocompleteItem>
                        ))}
                    </Autocomplete>
                </div>
            </div>

            <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={paginationPage}
                total={lastPage}
                onChange={(page) => onPaginationChange(page)}
            />
        </div>
    );
};
