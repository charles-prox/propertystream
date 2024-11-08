import React, { useRef } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Progress,
    Divider,
} from "@nextui-org/react";
import { PDFDownloadLink, BlobProvider } from "@react-pdf/renderer";
import { axiosInstance } from "@/Utils/axios";
import { useTheme } from "@/Contexts/ThemeContext";
import { CloseIcon } from "@/Components/Alert/icons";
import { PdfIcon, PrintIcon, SaveIcon, ViewIcon } from "../icons";
import PropertyAcknowledgementReceipt from "@/Components/Documents/PropertyAcknowledgementReceipt";
import { InventoryCustodianSlip } from "@/Components/Documents/InventoryCustodianSlip";

const GenerationDialog = ({ isOpen, setIsDialogOpen, selected, user }) => {
    const [loadingData, setLoadingData] = React.useState(false);
    const [formData, setFormData] = React.useState([]);
    const { theme } = useTheme();
    const iframeRef = useRef(null);
    const cost_threshold = 50000;

    const printPDF = (url) => {
        const iframe = iframeRef.current;
        if (iframe) {
            iframe.src = url;
            iframe.onload = () => {
                iframe.contentWindow.print();
            };
        }
    };

    const handleFetchingData = async () => {
        try {
            // Making a POST request with Axios
            const response = await axiosInstance.post(
                route("properties.selected"),
                {
                    selected: selected.details.map((item) => ({
                        key: item.id,
                        receipt_type: item.receipt_type,
                    })),
                    user_id: user.hris_id,
                }
            );

            // Combine and process the data
            const combinedData = response.data
                .filter((item) => selected.keys.includes(item.property_id))
                .map((item) => {
                    const matchingItem = selected.details.find(
                        (secondItem) =>
                            secondItem.id === parseInt(item.property_id)
                    );
                    return { ...item, ...matchingItem };
                });

            // Update state with the combined data
            setLoadingData(false);
            setFormData(combinedData);
        } catch (error) {
            console.error("Error making request:", error);
        }
    };

    React.useEffect(() => {
        if (isOpen) {
            setLoadingData(true);
            handleFetchingData();
        }
    }, [isOpen]);

    return (
        <>
            <Modal
                isOpen={isOpen}
                placement={"top"}
                size="2xl"
                className={`${theme} text-foreground`}
                closeButton={
                    <Button
                        variant="flat"
                        isIconOnly
                        onPress={() => setIsDialogOpen(false)}
                    >
                        <CloseIcon />
                    </Button>
                }
            >
                <ModalContent>
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Generating Forms
                            <p className="text-sm text-default-500 font-normal">
                                Please wait while we process the data to
                                generate your form. Once the form is ready, you
                                can choose to view, print or save it.
                            </p>
                        </ModalHeader>
                        <ModalBody>
                            <div className="flex flex-col gap-3">
                                {formData.map((data, index) => (
                                    <>
                                        <div
                                            key={`form-${index}`}
                                            className="flex items-center gap-3"
                                        >
                                            <PdfIcon
                                                fill="currentColor"
                                                width={28}
                                                height={28}
                                            />
                                            <div className="flex flex-col">
                                                <p className="w-56 truncate grow">
                                                    {data.form_number}
                                                </p>
                                                {/* <p className="text-sm text-default-500 max-w-56 truncate">
                                                    {data.serial}
                                                </p> */}
                                            </div>
                                            <BlobProvider
                                                document={
                                                    data.purchase_cost >
                                                        cost_threshold ||
                                                    data.purchase_cost ===
                                                        null ? (
                                                        <PropertyAcknowledgementReceipt
                                                            formData={[data]}
                                                        />
                                                    ) : (
                                                        <InventoryCustodianSlip
                                                            formData={[data]}
                                                        />
                                                    )
                                                }
                                            >
                                                {({
                                                    blob,
                                                    url,
                                                    loading,
                                                    error,
                                                }) => {
                                                    if (
                                                        loadingData ||
                                                        loading
                                                    ) {
                                                        return (
                                                            <Progress
                                                                label={
                                                                    loadingData
                                                                        ? "Preparing data..."
                                                                        : "Generating form..."
                                                                }
                                                                aria-label="Preparing form..."
                                                                size="sm"
                                                                isIndeterminate
                                                                color="success"
                                                                className="max-w-80"
                                                            />
                                                        );
                                                    } else {
                                                        return (
                                                            <div className="flex gap-3 items-center">
                                                                <Button
                                                                    size="sm"
                                                                    variant="light"
                                                                    color="default"
                                                                    startContent={
                                                                        <ViewIcon
                                                                            width={
                                                                                18
                                                                            }
                                                                            height={
                                                                                18
                                                                            }
                                                                        />
                                                                    }
                                                                    onPress={() =>
                                                                        window.open(
                                                                            url
                                                                        )
                                                                    }
                                                                >
                                                                    View
                                                                </Button>

                                                                <Divider
                                                                    orientation="vertical"
                                                                    className="h-5"
                                                                />

                                                                <Button
                                                                    size="sm"
                                                                    variant="light"
                                                                    color="default"
                                                                    startContent={
                                                                        <PrintIcon
                                                                            width={
                                                                                18
                                                                            }
                                                                            height={
                                                                                18
                                                                            }
                                                                        />
                                                                    }
                                                                    onPress={() =>
                                                                        printPDF(
                                                                            url
                                                                        )
                                                                    }
                                                                >
                                                                    Print
                                                                </Button>

                                                                <Divider
                                                                    orientation="vertical"
                                                                    className="h-5"
                                                                />

                                                                <Button
                                                                    size="sm"
                                                                    variant="light"
                                                                    color="default"
                                                                    startContent={
                                                                        <SaveIcon
                                                                            width={
                                                                                18
                                                                            }
                                                                            height={
                                                                                18
                                                                            }
                                                                        />
                                                                    }
                                                                    onPress={() => {
                                                                        // Create a download link programmatically
                                                                        const link =
                                                                            document.createElement(
                                                                                "a"
                                                                            );
                                                                        link.href =
                                                                            url;
                                                                        link.download =
                                                                            "PAR.pdf";
                                                                        link.click();
                                                                    }}
                                                                >
                                                                    Save
                                                                </Button>
                                                            </div>
                                                        );
                                                    }
                                                }}
                                            </BlobProvider>
                                        </div>
                                        <Divider />
                                    </>
                                ))}
                                <iframe
                                    ref={iframeRef}
                                    style={{ display: "none" }}
                                    title="PDF Print"
                                />
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <div className="flex gap-2 w-full justify-between py-4">
                                <Button
                                    color="default"
                                    variant="flat"
                                    onPress={() => setIsDialogOpen(false)}
                                >
                                    Close
                                </Button>
                                <div className="flex gap-2">
                                    <BlobProvider
                                        document={
                                            <PropertyAcknowledgementReceipt
                                                formData={formData}
                                            />
                                        }
                                    >
                                        {({ blob, url, loading, error }) => {
                                            // Do whatever you need with blob here
                                            return (
                                                <Button
                                                    color="primary"
                                                    variant="flat"
                                                    isLoading={loading}
                                                    startContent={
                                                        !loading && (
                                                            <ViewIcon
                                                                width={20}
                                                                height={20}
                                                                fill="currentColor"
                                                            />
                                                        )
                                                    }
                                                    onPress={() =>
                                                        window.open(url)
                                                    }
                                                >
                                                    View All
                                                </Button>
                                            );
                                        }}
                                    </BlobProvider>

                                    <BlobProvider
                                        document={
                                            <PropertyAcknowledgementReceipt
                                                formData={formData}
                                            />
                                        }
                                    >
                                        {({ blob, url, loading, error }) => {
                                            // Do whatever you need with blob here
                                            return (
                                                <Button
                                                    variant="flat"
                                                    color="primary"
                                                    isLoading={loading}
                                                    startContent={
                                                        !loading && (
                                                            <PrintIcon
                                                                width={20}
                                                                height={20}
                                                                fill="currentColor"
                                                            />
                                                        )
                                                    }
                                                    onPress={() =>
                                                        printPDF(url)
                                                    }
                                                >
                                                    Print All
                                                </Button>
                                            );
                                        }}
                                    </BlobProvider>

                                    <PDFDownloadLink
                                        document={
                                            <PropertyAcknowledgementReceipt
                                                formData={formData}
                                            />
                                        }
                                        fileName="PAR.pdf"
                                    >
                                        {({ blob, url, loading, error }) => {
                                            return (
                                                <Button
                                                    variant="flat"
                                                    color="primary"
                                                    isLoading={loading}
                                                    startContent={
                                                        !loading && (
                                                            <SaveIcon
                                                                width={20}
                                                                height={20}
                                                                fill="currentColor"
                                                            />
                                                        )
                                                    }
                                                >
                                                    Save All
                                                </Button>
                                            );
                                        }}
                                    </PDFDownloadLink>
                                </div>
                            </div>
                        </ModalFooter>
                    </>
                </ModalContent>
            </Modal>
        </>
    );
};

export default GenerationDialog;
