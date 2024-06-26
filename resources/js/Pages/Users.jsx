import { useState } from "react";
import { Input } from "@nextui-org/react";
import { Head } from "@inertiajs/react";
import { SearchIcon } from "@/Icons/SearchIcon";
import DataTable from "@/Components/DataTable";
import RegisterUser from "@/Components/Users/RegisterUser";

const Users = () => {
    const [searchKey, setSearchKey] = useState("");
    return (
        <div>
            <Head title="Users" />
            <div className="flex justify-between items-center w-full mb-2">
                <h1 className="text-4xl">Manage Users</h1>
                <div className="flex gap-4">
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
                </div>
            </div>
            {/* Table of users */}
            <DataTable searchKey={searchKey} />
        </div>
    );
};

export default Users;
