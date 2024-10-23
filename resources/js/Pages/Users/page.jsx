import React from "react";
import { TableOptionsProvider } from "@/Providers/TableOptionsProvider";
import UsersContent from "./content";

const UsersPage = () => {
    return (
        <TableOptionsProvider>
            <UsersContent />
        </TableOptionsProvider>
    );
};

export default UsersPage;
