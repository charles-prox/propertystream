import React, { useState } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Divider,
} from "@nextui-org/react";
import { usePage } from "@inertiajs/react";
import { useForm } from "@inertiajs/react";
import { CloseIcon } from "@/Icons/AlertIcons/CloseIcon";
import { TVIcon } from "./Icons/TVIcon";
import { decodeHtmlEntities } from "@/utils/helpers";

const DetailsFormDialog = ({ isOpen, setIsDialogOpen, property }) => {
    const { properties, auth } = usePage().props;
    const [propertyIndex, setPropertyIndex] = useState(-1);
    const { data, setData, post, processing, errors, reset } = useForm({
        property_id: null,
        iac_no: "",
        pr_no: "",
        si_no: "",
        dr_no: "",
        po_no: "",
        iar_no: "",
        useful_time: "",
        remarks: "New",
    });

    const handleChange = (key, value) => {
        setData((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    const submit = (e) => {
        console.log("You just submitted the form.");
        console.log("data: " + JSON.stringify(data));
        e.preventDefault();
        errors.message = null;
        post(route("properties.details"));
    };

    React.useEffect(() => {
        if (property) {
            setData((prevState) => ({
                ...prevState,
                property_id: property,
                added_by: auth.user.hris_id,
            }));
            setPropertyIndex(
                properties.rows.findIndex(
                    (item) => parseInt(item.id) === parseInt(property)
                )
            );
        }
    }, [property]);

    return (
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
                <form onSubmit={submit}>
                    <ModalHeader className="flex flex-col gap-1">
                        Required Property Details
                        <p className="text-sm text-default-500 font-normal">
                            Some data are needed before we can generate the form
                            for this property.
                        </p>
                    </ModalHeader>
                    <ModalBody>
                        <div className="flex flex-col py-2 px-1 justify-between gap-3">
                            <div className="flex items-center gap-5">
                                <TVIcon
                                    width={28}
                                    height={28}
                                    fill="currentColor"
                                />
                                <div className="flex flex-col">
                                    <p className="px-2 text-md font-bold">
                                        {propertyIndex >= 0 &&
                                            decodeHtmlEntities(
                                                properties.rows[propertyIndex]
                                                    .name
                                            )}
                                    </p>
                                    <p className="px-2 text-sm text-default-500">
                                        {propertyIndex >= 0 &&
                                            properties.rows[propertyIndex]
                                                .serial}
                                    </p>
                                </div>
                            </div>

                            <Divider />
                            {Object.keys(data).map((key) => {
                                return (
                                    key !== "property_id" &&
                                    key !== "added_by" && (
                                        <div
                                            key={key}
                                            className="flex items-center gap-2 w-full flex-grow"
                                        >
                                            <Input
                                                name={key}
                                                labelPlacement="outside-left"
                                                label={
                                                    <>
                                                        <p className="flex-grow">
                                                            {key !==
                                                                "useful_time" &&
                                                            key !== "remarks"
                                                                ? key
                                                                      .replace(
                                                                          /_/g,
                                                                          " "
                                                                      )
                                                                      .toUpperCase()
                                                                      .replace(
                                                                          /\bno\b/gi,
                                                                          "number"
                                                                      )
                                                                : key
                                                                      .replace(
                                                                          /_/g,
                                                                          " "
                                                                      )
                                                                      .replace(
                                                                          /\b\w/g,
                                                                          (
                                                                              char
                                                                          ) =>
                                                                              char.toUpperCase()
                                                                      )}
                                                        </p>
                                                    </>
                                                }
                                                placeholder={`Enter ${
                                                    key !== "useful_time"
                                                        ? key
                                                              .replace(
                                                                  /_/g,
                                                                  " "
                                                              )
                                                              .toUpperCase()
                                                              .replace(
                                                                  /\bno\b/gi,
                                                                  "number"
                                                              )
                                                        : key.replace(/_/g, " ")
                                                }`}
                                                isRequired={key !== "remarks"}
                                                value={data[key]}
                                                onChange={(e) =>
                                                    handleChange(
                                                        key,
                                                        e.target.value
                                                    )
                                                }
                                                classNames={{
                                                    label: "flex items-center min-w-28",
                                                    mainWrapper: "w-full",
                                                }}
                                                isInvalid={
                                                    errors[key] ? true : false
                                                }
                                                errorMessage={errors[key]}
                                            />
                                        </div>
                                    )
                                );
                            })}
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            color="default"
                            variant="light"
                            onPress={() => setIsDialogOpen(false)}
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
                </form>
            </ModalContent>
        </Modal>
    );
};

export default DetailsFormDialog;
