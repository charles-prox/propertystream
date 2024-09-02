import React from "react";
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Image,
    Font,
} from "@react-pdf/renderer";
import {
    decodeHtmlEntities,
    getCurrentDate,
    toTitleCase,
} from "@/utils/helpers";

const PropertyAcknowledgementReceipt = ({ formData }) => {
    return (
        <Document title="PAR-1881-0224">
            {formData.map((data, index) => {
                return (
                    <Page key={index} size="A4" style={styles.page}>
                        <View style={styles.page_border}>
                            <View fixed style={styles.header}>
                                <View>
                                    <Image
                                        style={styles.logo}
                                        src="/images/form_header/PhilHealth_Logo.png"
                                    />
                                </View>
                                <View style={styles.header_title}>
                                    <Text style={styles.form_title}>
                                        Property Acknowledgement Receipt
                                    </Text>
                                    <Text style={styles.corp_name}>
                                        Philippine Health Insurance Corporation
                                    </Text>
                                    <Text style={styles.corp_name}>
                                        PhilHealth Regional Office 10
                                    </Text>
                                    <Text style={styles.par_no}>
                                        PAR No. 1881-0224
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.table_head}>
                                <Text
                                    style={[styles.table_col, styles.qty_col]}
                                >
                                    QTY.
                                </Text>
                                <Text
                                    style={[styles.table_col, styles.unit_col]}
                                >
                                    UNIT
                                </Text>
                                <Text
                                    style={[styles.table_col, styles.des_col]}
                                >
                                    Description
                                </Text>
                                <Text
                                    style={[styles.table_col, styles.prop_col]}
                                >
                                    Property Number
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
                                    {"unit"}
                                </Text>
                                <View
                                    style={[styles.table_col, styles.des_col]}
                                >
                                    <Text style={styles.property_detail}>
                                        {toTitleCase(
                                            decodeHtmlEntities(data.name)
                                        )}
                                    </Text>
                                    <Text>Serial No. {data.serial}</Text>
                                    <Text>XXX nothing follows XXX</Text>
                                    <Text style={styles.spacer}></Text>
                                    <Text>Acquired from:</Text>
                                    <Text style={styles.property_detail}>
                                        {data.supplier.name}
                                    </Text>
                                    <Text style={styles.spacer}></Text>
                                    {data.iac_no && (
                                        <View style={styles.subDetailsRow}>
                                            <Text
                                                style={styles.subDetailsLabel}
                                            >
                                                IAC No. :
                                            </Text>
                                            <Text>{data.iac_no}</Text>
                                        </View>
                                    )}
                                    {data.pr_no && (
                                        <View style={styles.subDetailsRow}>
                                            <Text
                                                style={styles.subDetailsLabel}
                                            >
                                                PR No. :
                                            </Text>
                                            <Text>{data.pr_no}</Text>
                                        </View>
                                    )}
                                    {data.si_no && (
                                        <View style={styles.subDetailsRow}>
                                            <Text
                                                style={styles.subDetailsLabel}
                                            >
                                                SI No. :
                                            </Text>
                                            <Text>{data.si_no}</Text>
                                        </View>
                                    )}
                                    {data.dr_no && (
                                        <View style={styles.subDetailsRow}>
                                            <Text
                                                style={styles.subDetailsLabel}
                                            >
                                                DR No. :
                                            </Text>
                                            <Text>{data.dr_no}</Text>
                                        </View>
                                    )}
                                    {data.po_no && (
                                        <View style={styles.subDetailsRow}>
                                            <Text
                                                style={styles.subDetailsLabel}
                                            >
                                                PO No. :
                                            </Text>
                                            <Text>{data.po_no}</Text>
                                        </View>
                                    )}
                                    {data.iar_no && (
                                        <View style={styles.subDetailsRow}>
                                            <Text
                                                style={styles.subDetailsLabel}
                                            >
                                                IAR No. :
                                            </Text>
                                            <Text>{data.iar_no}</Text>
                                        </View>
                                    )}
                                    {data.purchase_cost && (
                                        <View style={styles.subDetailsRow}>
                                            <Text
                                                style={styles.subDetailsLabel}
                                            >
                                                Amount :
                                            </Text>
                                            <Text>Php{data.purchase_cost}</Text>
                                        </View>
                                    )}
                                    {data.purchase_date && (
                                        <Text>
                                            Delivery Date :{" "}
                                            {data.purchase_date.date}
                                        </Text>
                                    )}
                                    {/* <Text>Delivery Date: {data.delivery_date.date}</Text> */}
                                </View>
                                <View
                                    style={[styles.table_col, styles.prop_col]}
                                >
                                    <Text style={styles.property_detail}>
                                        {data.asset_tag}
                                    </Text>
                                    <Text style={styles.spacer}></Text>
                                    <Text>Issued to:</Text>
                                    <Text style={styles.spacer}></Text>
                                    <Text style={styles.property_detail}>
                                        {data.assigned_to.name}
                                    </Text>
                                    {data.location &&
                                        data.location.name !==
                                            data.assigned_to.name && (
                                            <Text>{data.location.name}</Text>
                                        )}
                                </View>
                            </View>
                            <View fixed style={styles.footer}>
                                <View
                                    style={[
                                        styles.signatories,
                                        { borderRight: "1px solid black" },
                                    ]}
                                >
                                    <Text style={styles.disclaimers}>
                                        I acknowledge the responsibility as an
                                        accountable officer to take good care of
                                        the property being issued by reason of
                                        office and/or duty.
                                    </Text>
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
                                            {getCurrentDate()}
                                        </Text>
                                        <Text>Date</Text>
                                    </View>
                                </View>
                                <View style={styles.signatories}>
                                    <Text style={styles.disclaimers}>
                                        The Property Accountable Officer(PAO)
                                        will be held liable if during
                                        inspection, the said item/s could not be
                                        properly presented / accounted.
                                    </Text>
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
                                            {"_____________________"}
                                        </Text>
                                        <Text>Date</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <Text style={styles.footnote}>
                            "Take good care of government property with
                            diligence of a good father of a family"
                        </Text>
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
    page_border: {
        border: "1px solid black",
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
        borderBottom: "1px solid black",
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
        fontSize: 10,
        textTransform: "uppercase",
        fontFamily: "Georgia Bold",
        textAlign: "center",
    },
    table_col: {
        padding: 12,
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
        width: "35%",
    },
    prop_col: {
        flexGrow: 1,
        width: "25%",
    },
    details: {
        fontSize: 10,
        display: "flex",
        flexDirection: "row",
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

export default PropertyAcknowledgementReceipt;
