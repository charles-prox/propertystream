import { InventoryCustodianSlip } from "@/Components/Documents/InventoryCustodianSlip";
import { PDFViewer } from "@react-pdf/renderer";
import React from "react";

const Reports = () => {
    return (
        <div>
            <PDFViewer width={"100%"} height={1000}>
                <InventoryCustodianSlip />
            </PDFViewer>
        </div>
    );
};

export default Reports;
