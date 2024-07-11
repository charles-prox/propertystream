import React from "react";
import { Head } from "@inertiajs/react";
import { router, usePage } from "@inertiajs/react";
import PropertyDataTable from "@/Components/Properties/PropertyDataTable";

const Properties = () => {
    return (
        <div>
            <Head title="Properties" />
            <div className="flex justify-between items-center w-full mb-2">
                <h1 className="text-4xl">Property Record</h1>
                {/* <div className="flex gap-4">
                  <Input
                      id="user-search"
                      name="user-search"
                      variant="bordered"
                      placeholder="Search user"
                      startContent={<SearchIcon />}
                      className="w-60"
                      classNames={{
                          inputWrapper: "dark:border-white/50",
                      }}
                      value={searchKey}
                      onValueChange={setSearchKey}
                      isClearable
                  />
                  <RegisterUser />
              </div> */}
            </div>
            {/* Table of properties */}
            <PropertyDataTable />
        </div>
    );
};

export default Properties;
