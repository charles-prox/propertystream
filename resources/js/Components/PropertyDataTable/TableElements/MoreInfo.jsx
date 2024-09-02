import {
    Button,
    Chip,
    Divider,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Spacer,
    Tooltip,
    useDisclosure,
} from "@nextui-org/react";
import React from "react";
import {
    AcquiredIcon,
    InfoIcon,
    TVIcon,
    UserInfoIcon,
    UserWarningIcon,
} from "../icons";
import { decodeHtmlEntities } from "@/utils/helpers";
import { useTheme } from "@/ThemeProvider";

const statusColorMap = {
    deployed: "success",
    deployable: "warning",
    pending: "danger",
    "For Repair": "danger",
    "For Disposal": "danger",
};

const MoreInfo = ({ item }) => {
    const { theme } = useTheme();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <div className="relative flex items-center">
            <Tooltip content="More info">
                <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    radius="lg"
                    className="text-lg text-default-400 "
                    onPress={onOpen}
                >
                    <InfoIcon width={25} height={25} color={"#005BC4"} />
                </Button>
            </Tooltip>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="top-center"
                size="2xl"
                className={`${theme} text-foreground`}
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Property Overview</ModalHeader>
                            <ModalBody>
                                <div className="flex gap-10">
                                    <p className="font-medium ">Status: </p>
                                    <Spacer x={5} />
                                    <div className="text-default-600 text-sm">
                                        <Chip
                                            color={
                                                statusColorMap[
                                                    item.status_label
                                                        .status_meta
                                                ]
                                            }
                                            size="sm"
                                            variant="shadow"
                                            className="capitalize"
                                        >
                                            {item.status_label.status_meta}
                                        </Chip>
                                    </div>
                                </div>

                                <div className="mt-5 ">
                                    {/* Property specifications */}
                                    <div className="flex flex-col gap-1">
                                        <div className="flex flex-row gap-3">
                                            <div>
                                                <TVIcon
                                                    width={28}
                                                    height={28}
                                                    fill={"currentColor"}
                                                />
                                            </div>
                                            <div className="flex-grow">
                                                <h5 className="mb-4 font-bold">
                                                    Property specifications
                                                </h5>
                                                <div className="flex">
                                                    <p className="font-medium w-60 text-sm">
                                                        Property name
                                                    </p>
                                                    <p className="text-default-600 text-sm">
                                                        {item.name
                                                            ? decodeHtmlEntities(
                                                                  item.name
                                                              )
                                                            : "---"}
                                                    </p>
                                                </div>
                                                <div className="flex">
                                                    <p className="font-medium w-60 text-sm">
                                                        Serial number
                                                    </p>
                                                    <p className="text-default-600 text-sm capitalize">
                                                        {item.serial
                                                            ? item.serial
                                                            : "---"}
                                                    </p>
                                                </div>
                                                <div className="flex">
                                                    <p className="font-medium w-60 text-sm">
                                                        Asset Tag
                                                    </p>
                                                    <p className="text-default-600 text-sm capitalize">
                                                        {item.asset_tag
                                                            ? item.asset_tag
                                                            : "---"}
                                                    </p>
                                                </div>
                                                <div className="flex">
                                                    <p className="font-medium w-60 text-sm">
                                                        Category
                                                    </p>
                                                    <p className="text-default-600 text-sm capitalize">
                                                        {item.category
                                                            ? item.category.name
                                                            : "---"}
                                                    </p>
                                                </div>
                                                <div className="flex">
                                                    <p className="font-medium w-60 text-sm">
                                                        Model
                                                    </p>
                                                    <p className="text-default-600 text-sm capitalize">
                                                        {item.model
                                                            ? item.model.name
                                                            : "---"}
                                                    </p>
                                                </div>
                                                <div className="flex">
                                                    <p className="font-medium w-60 text-sm">
                                                        Manufacturer
                                                    </p>
                                                    <p className="text-default-600 text-sm capitalize">
                                                        {item.manufacturer
                                                            ? item.manufacturer
                                                                  .name
                                                            : "---"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <Spacer y={8} />
                                    <Divider />
                                    <Spacer y={7} />
                                    {/* End-user information */}
                                    <div className="flex flex-col gap-1 ">
                                        <div className="flex flex-row gap-3">
                                            <div>
                                                <UserInfoIcon />
                                            </div>
                                            <div className="flex-grow">
                                                <h5 className="mb-4 font-bold">
                                                    End-user information
                                                </h5>
                                                {item.assigned_to ? (
                                                    <>
                                                        <div className="flex">
                                                            <p className="font-medium w-60 text-sm">
                                                                Assigned to
                                                            </p>
                                                            <p className="text-default-600 text-sm">
                                                                {
                                                                    item
                                                                        .assigned_to
                                                                        .name
                                                                }
                                                            </p>
                                                        </div>
                                                        {item.assigned_to
                                                            .employee_number && (
                                                            <div className="flex">
                                                                <p className="font-medium w-60 text-sm">
                                                                    ID number
                                                                </p>
                                                                <p className="text-default-600 text-sm capitalize">
                                                                    {
                                                                        item
                                                                            .assigned_to
                                                                            .employee_number
                                                                    }
                                                                </p>
                                                            </div>
                                                        )}
                                                        <div className="flex">
                                                            <p className="font-medium w-60 text-sm">
                                                                Address
                                                            </p>
                                                            <p className="text-default-600 text-sm capitalize">
                                                                {item.location
                                                                    ? item
                                                                          .location
                                                                          .name
                                                                    : "---"}
                                                            </p>
                                                        </div>
                                                        <div className="flex">
                                                            <p className="font-medium w-60 text-sm">
                                                                Company
                                                            </p>
                                                            <p className="text-default-600 text-sm capitalize">
                                                                {item.company
                                                                    ? item
                                                                          .company
                                                                          .name
                                                                    : "---"}
                                                            </p>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="flex justify-center">
                                                        <UserWarningIcon
                                                            width={30}
                                                            height={30}
                                                            fill="#9ca3af"
                                                        />
                                                        <Spacer x={5} />
                                                        <h5 className="text-default-600">
                                                            Pending deployment
                                                            to a user
                                                        </h5>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <Spacer y={8} />
                                    <Divider />
                                    <Spacer y={7} />
                                    {/* End-user information */}
                                    <div className="flex flex-col gap-1 ">
                                        <div className="flex flex-row gap-3">
                                            <div>
                                                <AcquiredIcon />
                                            </div>
                                            <div className="flex-grow">
                                                <h5 className="mb-4 font-bold">
                                                    Acquisition information
                                                </h5>
                                                <div className="flex">
                                                    <p className="font-medium w-60 text-sm">
                                                        Supplier
                                                    </p>
                                                    <p className="text-default-600 text-sm">
                                                        {item.supplier
                                                            ? item.supplier.name
                                                            : "Unknown"}
                                                    </p>
                                                </div>
                                                <div className="flex">
                                                    <p className="font-medium w-60 text-sm">
                                                        Cost
                                                    </p>
                                                    <p className="text-default-600 text-sm capitalize">
                                                        {item.purchase_cost
                                                            ? parseFloat(
                                                                  item.purchase_cost
                                                              ).toLocaleString()
                                                            : "---"}
                                                    </p>
                                                </div>
                                                <div className="flex">
                                                    <p className="font-medium w-60 text-sm">
                                                        Purchase date
                                                    </p>
                                                    <p className="text-default-600 text-sm capitalize">
                                                        {item.purchase_date
                                                            ? item.purchase_date
                                                                  .date
                                                            : "---"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    variant="flat"
                                    onPress={onClose}
                                >
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
};

export default MoreInfo;
