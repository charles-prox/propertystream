import React from "react";
import { Modal, ModalContent, ModalBody, Button } from "@nextui-org/react";
import { WarningIcon } from "@/Components/Properties/Icons/WarningIcon";
import { CloseIcon } from "@/Icons/AlertIcons/CloseIcon";

export default function SelectionAlert({ isOpen, setIsAlertOpen }) {
    return (
        <Modal
            isOpen={isOpen}
            placement={"top"}
            backdrop="transparent"
            shadow="lg"
            closeButton={
                <Button
                    variant="flat"
                    isIconOnly
                    onPress={() => setIsAlertOpen(false)}
                >
                    <CloseIcon />
                </Button>
            }
            motionProps={{
                variants: {
                    enter: {
                        y: 0,
                        opacity: 1,
                        transition: {
                            duration: 0.3,
                            ease: "easeOut",
                        },
                    },
                    exit: {
                        y: -20,
                        opacity: 0,
                        transition: {
                            duration: 0.2,
                            ease: "easeIn",
                        },
                    },
                },
            }}
        >
            <ModalContent>
                <ModalBody>
                    <div className="flex gap-3 p-3">
                        {/* Alert Icon */}
                        <div>
                            <WarningIcon width={90} height={90} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">Oops!</h3>
                            <p className="text-default-500 text-sm">
                                We are unable to generate a
                                <span className="font-bold"> PAR</span> or
                                <span className="font-bold"> ICS</span> for a
                                property that has not been deployed.
                            </p>
                        </div>
                    </div>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
