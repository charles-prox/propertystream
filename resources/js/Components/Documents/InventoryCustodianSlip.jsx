import {
    Document,
    Font,
    Image,
    Page,
    StyleSheet,
    Text,
    View,
} from "@react-pdf/renderer";
import React from "react";

export const InventoryCustodianSlip = ({ formData }) => {
    return (
        <Document title={"ICS-0924-158"}>
            {formData.map((data, index) => {
                return (
                    <Page key={index} size="A4" style={styles.page}>
                        <View style={styles.page_content}>
                            <View fixed style={styles.header}>
                                <View>
                                    <Image
                                        style={styles.logo}
                                        src="/images/form_header/PhilHealth_Logo.png"
                                    />
                                </View>
                                <View style={styles.header_title}>
                                    <Text style={styles.form_title}>
                                        Inventory Custodian Slip
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.ics_date}>
                                <View style={styles.ics_date_item}>
                                    <Text style={styles.ics_date_label}>
                                        ICS No.:
                                    </Text>
                                    <Text
                                        style={{
                                            textDecoration: "underline",
                                            width: 100,
                                        }}
                                    >
                                        {data.form_number}
                                    </Text>
                                </View>
                                <View style={styles.ics_date_item}>
                                    <Text style={styles.ics_date_label}>
                                        Date:
                                    </Text>
                                    <Text
                                        style={{
                                            textDecoration: "underline",
                                            width: 100,
                                        }}
                                    >
                                        {new Date().toLocaleDateString("en-US")}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.table_head}>
                                <Text
                                    style={[styles.table_col, styles.qty_col]}
                                >
                                    Qty.
                                </Text>
                                <Text
                                    style={[styles.table_col, styles.unit_col]}
                                >
                                    Unit
                                </Text>
                                <Text
                                    style={[styles.table_col, styles.des_col]}
                                >
                                    Item Description
                                </Text>
                                <Text
                                    style={[
                                        styles.table_col,
                                        styles.unit_cost_col,
                                    ]}
                                >
                                    Unit Cost
                                </Text>
                                <Text
                                    style={[
                                        styles.table_col,
                                        styles.item_no_col,
                                    ]}
                                >
                                    Inventory Item No./ Property No.
                                </Text>
                                <Text
                                    style={[
                                        styles.table_col,
                                        styles.location_col,
                                    ]}
                                >
                                    Location
                                </Text>
                                <Text
                                    style={[
                                        styles.table_col,
                                        styles.estimated_life_col,
                                    ]}
                                >
                                    Useful Life (yrs)
                                </Text>
                            </View>
                            <View style={styles.details}>
                                <Text
                                    style={[styles.table_col, styles.qty_col]}
                                >
                                    {"1"}
                                </Text>
                                <Text
                                    style={[styles.table_col, styles.unit_col]}
                                >
                                    {"pc"}
                                </Text>
                                <View
                                    style={[styles.table_col, styles.des_col]}
                                >
                                    <Text>{data.name}</Text>
                                    <Text>{data.model.name}</Text>
                                    <Text>{"Serial # " + data.serial}</Text>
                                </View>
                                <Text
                                    style={[
                                        styles.table_col,
                                        styles.unit_cost_col,
                                    ]}
                                >
                                    {parseFloat(data.purchase_cost)
                                        .toFixed(2)
                                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                </Text>
                                <Text
                                    style={[
                                        styles.table_col,
                                        styles.item_no_col,
                                    ]}
                                >
                                    {data.asset_tag}
                                </Text>
                                <Text
                                    style={[
                                        styles.table_col,
                                        styles.location_col,
                                    ]}
                                >
                                    {data.location &&
                                        data.location.name !==
                                            data.assigned_to.name && (
                                            <Text>{data.location.name}</Text>
                                        )}
                                </Text>
                                <Text
                                    style={[
                                        styles.table_col,
                                        styles.estimated_life_col,
                                    ]}
                                >
                                    {data.useful_time}
                                </Text>
                            </View>
                            <View style={styles.subdetails_container}>
                                <View style={styles.subdetails}>
                                    <Text style={styles.subdetail_label}>
                                        End-user:{" "}
                                    </Text>
                                    <Text style={styles.subdetail_val}>
                                        {data.assigned_to.name}
                                    </Text>
                                </View>
                                <View style={styles.subdetails}>
                                    <Text style={styles.subdetail_label}>
                                        Remarks:{" "}
                                    </Text>
                                    <Text style={styles.subdetail_val}>
                                        {data.remarks}
                                    </Text>
                                </View>
                                <View style={styles.subdetails}>
                                    <Text style={styles.subdetail_label}>
                                        Supplier:{" "}
                                    </Text>
                                    <Text style={styles.subdetail_val}>
                                        {data.supplier.name}
                                    </Text>
                                </View>
                                <View style={styles.subdetails}>
                                    <Text style={styles.subdetail_label}>
                                        PO. NO./ APR No.:{" "}
                                    </Text>
                                    <Text style={styles.subdetail_val}>
                                        {data.po_no + "/" + data.pr_no}
                                    </Text>
                                </View>
                                <View style={styles.subdetails}>
                                    <Text style={styles.subdetail_label}>
                                        SI/DR no.:{" "}
                                    </Text>
                                    <Text style={styles.subdetail_val}>
                                        {data.si_no + "/" + data.dr_no}
                                    </Text>
                                </View>
                                <View style={styles.subdetails}>
                                    <Text style={styles.subdetail_label}>
                                        IAR No.:{" "}
                                    </Text>
                                    <Text style={styles.subdetail_val}>
                                        {data.iar_no}
                                    </Text>
                                </View>
                            </View>
                            <View fixed style={styles.footer}>
                                <View style={[styles.signatories]}>
                                    <Text>Received by:</Text>
                                    <View style={styles.signatures}>
                                        <Text style={styles.signatures_name}>
                                            {data.assigned_to.type === "user"
                                                ? data.assigned_to.name.toUpperCase()
                                                : data.assigned_to.type ===
                                                  "location"
                                                ? data.assigned_to.user_name.toUpperCase()
                                                : "_________________"}
                                        </Text>
                                        <Text>Signature Over Printed Name</Text>
                                        <Text style={styles.signatures_detail}>
                                            {data.assigned_to.jobtitle ||
                                                "__________________"}
                                        </Text>
                                        <Text>Position</Text>
                                        <Text style={styles.signatures_detail}>
                                            {data.location.name}
                                        </Text>
                                        <Text>Office</Text>
                                        <Text style={styles.signatures_detail}>
                                            {"_________________"}
                                        </Text>
                                        <Text>Date</Text>
                                    </View>
                                </View>
                                <View style={styles.signatories}>
                                    <Text>Received from:</Text>
                                    <View style={styles.signatures}>
                                        <Text style={styles.signatures_name}>
                                            {"GLADYS A. ELTANAL"}
                                        </Text>
                                        <Text>Signature Over Printed Name</Text>
                                        <Text style={styles.signatures_detail}>
                                            {"Administrative Officer III"}
                                        </Text>
                                        <Text>Position</Text>
                                        <Text style={styles.signatures_detail}>
                                            {"General Services Unit"}
                                        </Text>
                                        <Text>Office</Text>
                                        <Text style={styles.signatures_detail}>
                                            {"_________________"}
                                        </Text>
                                        <Text>Date</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Page>
                );
            })}
        </Document>
    );
};

// Register font
Font.register({
    family: "Georgia Bold",
    src: "/fonts/Georgia_bold.ttf",
});
Font.register({
    family: "Georgia Regular",
    src: "/fonts/Georgia_regular.ttf",
});
Font.register({
    family: "Georgia Italic",
    src: "/fonts/Georgia_italic.ttf",
});

// Create styles
const styles = StyleSheet.create({
    spacer: {
        padding: 15,
    },
    page: {
        padding: 40,
    },
    ics_date: {
        paddingTop: 20,
        paddingBottom: 20,
        display: "flex",
        alignItems: "flex-end",
    },
    ics_date_item: {
        display: "flex",
        flexDirection: "row",
    },
    ics_date_label: {
        width: 50,
    },
    page_content: {
        width: "100%",
        fontFamily: "Georgia Regular",
        fontSize: 10,
    },
    logo: {
        height: 45,
        padding: 5,
    },
    header: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        border: "1px solid black",
        fontFamily: "Georgia Bold",
    },
    header_title: {
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 10,
        textTransform: "uppercase",
        flexGrow: 1,
    },
    par_no: {
        flexGrow: 1,
        marginLeft: "auto",
        fontSize: 10,
        marginTop: 15,
    },
    form_title: {
        marginBottom: 10,
    },
    corp_name: {
        lineHeight: 1.3,
    },
    table_head: {
        display: "flex",
        flexDirection: "row",
        fontSize: 8,
        textTransform: "capitalize",
        fontFamily: "Georgia Bold",
        textAlign: "center",
        border: "1px solid black",
    },
    table_col: {
        padding: 5,
        borderBottom: "1px solid black",
        lineHeight: 1.3,
    },
    qty_col: {
        borderRight: "1px solid black",
        width: "10%",
        textAlign: "center",
    },
    unit_col: {
        borderRight: "1px solid black",
        width: "10%",
        textAlign: "center",
    },
    des_col: {
        flexGrow: 1,
        borderRight: "1px solid black",
        width: "38%",
        display: "flex",
        flexDirection: "column",
    },
    unit_cost_col: {
        borderRight: "1px solid black",
        flexGrow: 1,
        width: "12%",
    },
    item_no_col: {
        borderRight: "1px solid black",
        flexGrow: 1,
        width: "25%",
    },
    estimated_life_col: {
        flexGrow: 1,
        width: "10%",
    },
    location_col: {
        borderRight: "1px solid black",
        flexGrow: 1,
        width: "25%",
    },
    details: {
        fontSize: 10,
        display: "flex",
        flexDirection: "row",
        borderRight: "1px solid black",
        borderLeft: "1px solid black",
    },
    subdetails_container: {
        padding: 10,
    },
    subdetails: {
        display: "flex",
        flexDirection: "row",
    },
    subdetail_label: {
        width: 100,
        padding: 5,
    },
    subdetail_val: {
        padding: 5,
    },
    property_detail: {
        fontFamily: "Georgia Bold",
    },
    subDetailsRow: {
        display: "flex",
        flexDirection: "row",
    },
    subDetailsLabel: {
        width: 60,
    },
    footer: {
        display: "flex",
        flexDirection: "row",
        fontSize: 10,
        paddingTop: 20,
    },
    footnote: {
        fontFamily: "Georgia Italic",
        fontSize: 8,
        textAlign: "center",
    },
    signatories: {
        flexGrow: 1,
        display: "flex",
        width: "50%",
        padding: 10,
    },
    disclaimers: {
        paddingBottom: 15,
        fontSize: 9,
        lineHeight: 1.15,
    },
    signatures: {
        textAlign: "center",
        lineHeight: 1.2,
    },
    signatures_name: {
        textTransform: "uppercase",
        paddingTop: 20,
        fontFamily: "Georgia Bold",
        textDecoration: "underline",
    },
    signatures_detail: {
        paddingTop: 10,
        textDecoration: "underline",
    },
});
