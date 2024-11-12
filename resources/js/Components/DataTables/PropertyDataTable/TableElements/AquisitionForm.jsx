import React from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    DatePicker,
} from "@nextui-org/react";
import { EditIcon } from "../icons";
import Input from "@/Components/Input";
import { useForm } from "@inertiajs/react";
import { parseDate } from "@internationalized/date";

export const AquisitionForm = ({ current, isUpdated }) => {
    const [date, setDate] = React.useState(parseDate(current.purchase_date));
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const { data, setData, post, processing, errors, reset } = useForm({
        id: current.property_id,
        purchase_cost: !!current.purchase_cost ? current.purchase_cost : null,
        purchase_date: current.purchase_date,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("acquisition.update"), {
            onSuccess: () => {
                onClose();
                isUpdated(true);
            },
        });
    };

    return (
        <>
            <Button
                size="sm"
                variant="light"
                onPress={() => {
                    isUpdated(false);
                    onOpen();
                }}
                startContent={
                    <EditIcon width={15} height={15} fill={"currentColor"} />
                }
            >
                Update
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top">
                <form onSubmit={submit}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">
                                    Update Acquisition Information
                                </ModalHeader>
                                <ModalBody>
                                    <Input
                                        name="supplier"
                                        label={"Supplier"}
                                        labelPlacement="outside"
                                        placeholder="New supplier"
                                        value={
                                            current.supplier || data.supplier
                                        }
                                        onChange={(e) =>
                                            setData("supplier", e.target.value)
                                        }
                                        errorMessage={errors.supplier}
                                        // isRequired
                                        isReadOnly={true}
                                        description={
                                            "You can't edit supplier name for now"
                                        }
                                    />
                                    <Input
                                        name="purchase_cost"
                                        label="Purchase Cost"
                                        labelPlacement="outside"
                                        placeholder="New purchase cost"
                                        value={data.purchase_cost}
                                        onChange={(e) =>
                                            setData(
                                                "purchase_cost",
                                                e.target.value
                                            )
                                        }
                                        errorMessage={errors.purchase_cost}
                                        isRequired
                                    />
                                    {/* 2014-12-01 */}
                                    <DatePicker
                                        label="Purchase Date"
                                        labelPlacement="outside"
                                        variant="bordered"
                                        value={date}
                                        onChange={(value) => {
                                            setDate(value);
                                            if (
                                                new Date(value) instanceof Date
                                            ) {
                                                // Convert to 'YYYY-MM-DD' format
                                                const formattedDate = `${
                                                    value.year
                                                }-${String(
                                                    value.month
                                                ).padStart(2, "0")}-${String(
                                                    value.day
                                                ).padStart(2, "0")}`;
                                                setData(
                                                    "purchase_date",
                                                    formattedDate
                                                );
                                            }
                                        }}
                                        dateInputClassNames={{
                                            label: "text-black dark:text-white/90 font-bold",
                                            inputWrapper: "!border-slate-400",
                                        }}
                                        isRequired
                                    />
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        color="danger"
                                        variant="light"
                                        onPress={onClose}
                                        isDisabled={processing}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        color="primary"
                                        type="submit"
                                        isLoading={processing}
                                    >
                                        Save
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </form>
            </Modal>
        </>
    );
};
