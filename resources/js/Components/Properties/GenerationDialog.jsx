import React from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Checkbox,
    Input,
    Link,
} from "@nextui-org/react";
import { CloseIcon } from "@/Icons/AlertIcons/CloseIcon";

const GenerationDialog = ({ isOpen, setIsDialogOpen }) => {
    return (
        <>
            <Modal
                isOpen={isOpen}
                placement={"top"}
                size="5xl"
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
                            Generate Form
                            <p className="text-sm text-default-500 font-normal">
                                Some data are needed before generating the form.
                            </p>
                        </ModalHeader>
                        <ModalBody>
                            <div className="flex py-2 px-1 justify-between">
                                <Checkbox
                                    classNames={{
                                        label: "text-small",
                                    }}
                                >
                                    Remember me
                                </Checkbox>
                                <Link color="primary" href="#" size="sm">
                                    Forgot password?
                                </Link>
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
                            <Button color="primary">Save</Button>
                        </ModalFooter>
                    </>
                </ModalContent>
            </Modal>
        </>
    );
};

export default GenerationDialog;
