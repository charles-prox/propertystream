import React from "react";
import { TableOptionsProvider } from "@/Providers/TableOptionsProvider";
import PropertiesContent from "./content";

const PropertiesPage = () => {
    return (
        <TableOptionsProvider>
            <PropertiesContent />
        </TableOptionsProvider>
    );
};

export default PropertiesPage;
