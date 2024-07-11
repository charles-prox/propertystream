import React from "react";
import {
    PDFViewer,
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Image,
    Font,
} from "@react-pdf/renderer";

const PropertyAcknowledgementReceipt = () => {
    return (
        <PDFViewer width={"100%"} height={"100%"} showToolbar={true}>
            <Document title="PAR-1881-0224">
                <Page size="A4" style={styles.page}>
                    <View style={styles.page_border}>
                        <View fixed style={styles.header}>
                            <View>
                                <Image
                                    style={styles.logo}
                                    src="/PhilHealth_Logo.png"
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
                            <Text style={[styles.table_col, styles.qty_col]}>
                                QTY.
                            </Text>
                            <Text style={[styles.table_col, styles.unit_col]}>
                                UNIT
                            </Text>
                            <Text style={[styles.table_col, styles.des_col]}>
                                Description
                            </Text>
                            <Text style={[styles.table_col, styles.prop_col]}>
                                Property Number
                            </Text>
                        </View>
                        <View style={styles.details}>
                            <Text style={[styles.table_col, styles.qty_col]}>
                                {"1"}
                            </Text>
                            <Text style={[styles.table_col, styles.unit_col]}>
                                {"unit"}
                            </Text>
                            <View style={[styles.table_col, styles.des_col]}>
                                <Text style={styles.property_detail}>
                                    {"HP Laser Enterprise M611 dr"}
                                </Text>
                                <Text>Serial No. {"CNBRS1G0V3"}</Text>
                                <Text>XXX nothing follows XXX</Text>
                                <Text style={styles.spacer}></Text>
                                <Text>Acquired from:</Text>
                                <Text style={styles.property_detail}>
                                    {"DATAWORLD COMPUTER CENTER"}
                                </Text>
                                <Text style={styles.spacer}></Text>
                                <Text>PR No.: {"2309PR-899-09-21-2023"}</Text>
                                <Text>Amount.: Php{"87,990.00"}</Text>
                                <Text>
                                    Delivery Date: {"February 22, 2024"}
                                </Text>
                            </View>
                            <View style={[styles.table_col, styles.prop_col]}>
                                <Text style={styles.property_detail}>
                                    {"15-0224IT1407046"}
                                </Text>
                                <Text style={styles.spacer}></Text>
                                <Text>Issued to:</Text>
                                <Text style={styles.spacer}></Text>
                                <Text style={styles.property_detail}>
                                    {"LHIO Iligan"}
                                </Text>
                                <Text>
                                    {
                                        "GF Gonzalez-Gimeno Bldg IV, Macapagal Ave., Iligan City"
                                    }
                                </Text>
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
                                    accountable officer to take good care of the
                                    property being issued by reason of office
                                    and/or duty.
                                </Text>
                                <Text>Received by:</Text>
                                <View style={styles.signatures}>
                                    <Text style={styles.signatures_name}>
                                        {"ALEKSander A. ALI"}
                                    </Text>
                                    <Text>Signature Over Printed Name</Text>
                                    <Text style={styles.signatures_detail}>
                                        {"Fiscal Controller I"}
                                    </Text>
                                    <Text>Position</Text>
                                    <Text style={styles.signatures_detail}>
                                        {"LHIO Iligan"}
                                    </Text>
                                    <Text>Office</Text>
                                    <Text style={styles.signatures_detail}>
                                        {"02/12/2024"}
                                    </Text>
                                    <Text>Date</Text>
                                </View>
                            </View>
                            <View style={styles.signatories}>
                                <Text style={styles.disclaimers}>
                                    The Property Accountable Officer(PAO) will
                                    be held liable if during inspection, the
                                    said item/s could not be properly presented
                                    / accounted.
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
                                        {"02/12/2024"}
                                    </Text>
                                    <Text>Date</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </Page>
            </Document>
        </PDFViewer>
    );
};

// Register font
Font.register({
    family: "Georgia Bold",
    src: "/fonts/georgia_bold.ttf",
});
Font.register({
    family: "Georgia Regular",
    src: "/fonts/Georgia.ttf",
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
    footer: {
        display: "flex",
        flexDirection: "row",
        fontSize: 10,
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
