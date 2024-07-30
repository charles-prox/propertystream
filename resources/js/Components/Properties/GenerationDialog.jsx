import React from "react";
import { router, usePage } from "@inertiajs/react";
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
import { PDFDownloadLink } from "@react-pdf/renderer";
import { CloseIcon } from "@/Icons/AlertIcons/CloseIcon";
import { PdfIcon } from "./Icons/PdfIcon";
import { SaveIcon } from "./Icons/SaveIcon";
import { PrintIcon } from "./Icons/PrintIcon";
import { ViewIcon } from "./Icons/ViewIcon";
import PropertyAcknowledgementReceipt from "@/Forms/PropertyAcknowledgementReceipt";

const GenerationDialog = ({ isOpen, setIsDialogOpen, selected }) => {
    const { properties } = usePage().props;
    const [value, setValue] = React.useState(0);
    const [loadingPdf, setLoadingPdf] = React.useState(false);

    React.useEffect(() => {
        if (isOpen) {
            setLoadingPdf(true);
            router.post(route("properties.selected"), {
                preserveState: true, // Ensure state is preserved
                onSuccess: (page) => {
                    console.log(
                        "page.props.selectedDetails: " +
                            JSON.stringify(page.props.selectedDetails)
                    );
                    console.log(
                        "page.props.response: " +
                            JSON.stringify(page.props.response)
                    );
                },
                onError: (errors) => {
                    // Handle errors if needed
                    console.error("Error fetching property details:", errors);
                },
                onFinish: () => {
                    setLoadingPdf(false);
                },
                only: ["selectedDetails"],
            });
        }
    }, [isOpen]);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setValue((v) => (v >= 100 ? 0 : v + 10));
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <Modal
                isOpen={isOpen}
                placement={"top"}
                size="xl"
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
                                can choose to print or save it.
                            </p>
                        </ModalHeader>
                        <ModalBody>
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3">
                                    <PdfIcon width={28} height={28} />
                                    <p className="max-w-48 truncate grow">
                                        Xitrix pc 1
                                    </p>
                                    {loadingPdf ? (
                                        <Progress
                                            label="Generating form..."
                                            aria-label="Generating form..."
                                            size="sm"
                                            value={value}
                                            color="success"
                                            showValueLabel={true}
                                            className="max-w-64"
                                        />
                                    ) : (
                                        <div className="flex gap-3 items-center">
                                            <Button
                                                size="sm"
                                                variant="light"
                                                color="default"
                                                startContent={
                                                    <PrintIcon
                                                        width={18}
                                                        height={18}
                                                    />
                                                }
                                            >
                                                Print
                                            </Button>
                                            <Divider
                                                orientation="vertical"
                                                className="h-5"
                                            />
                                            <PDFDownloadLink
                                                document={
                                                    <PropertyAcknowledgementReceipt
                                                        properties={properties}
                                                    />
                                                }
                                                fileName="PAR.pdf"
                                            >
                                                {({
                                                    blob,
                                                    url,
                                                    loading,
                                                    error,
                                                }) => {
                                                    // setLoadingPdf(loading);
                                                    return (
                                                        <Button
                                                            size="sm"
                                                            variant="light"
                                                            color="default"
                                                            isLoading={loading}
                                                            startContent={
                                                                <SaveIcon
                                                                    width={18}
                                                                    height={18}
                                                                />
                                                            }
                                                        >
                                                            Save
                                                        </Button>
                                                    );
                                                }}
                                            </PDFDownloadLink>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    <PdfIcon width={28} height={28} />
                                    <p className="max-w-48 truncate grow">
                                        Xitrix pc 1
                                    </p>
                                    <div className="flex gap-3 items-center">
                                        <Button
                                            size="sm"
                                            variant="light"
                                            color="default"
                                            startContent={
                                                <ViewIcon
                                                    width={18}
                                                    height={18}
                                                />
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
                                                    width={18}
                                                    height={18}
                                                />
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
                                                    width={18}
                                                    height={18}
                                                />
                                            }
                                        >
                                            Save
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <div className="flex gap-2 w-full justify-between py-4">
                                <Button color="default" variant="flat">
                                    Close
                                </Button>
                                <div className="flex gap-2">
                                    <Button
                                        color="secondary"
                                        variant="flat"
                                        startContent={
                                            <PrintIcon width={20} height={20} />
                                        }
                                    >
                                        Print All
                                    </Button>

                                    <Button
                                        color="secondary"
                                        variant="flat"
                                        startContent={
                                            <SaveIcon width={20} height={20} />
                                        }
                                    >
                                        Save All
                                    </Button>
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
