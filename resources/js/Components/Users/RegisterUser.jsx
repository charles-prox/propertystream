import { useEffect, useState } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Input,
    Autocomplete,
    AutocompleteItem,
    Select,
    SelectItem,
} from "@nextui-org/react";
import { useForm } from "@inertiajs/react";
import { useTheme } from "@/ThemeProvider";
import PasswordInput from "@/Components/PasswordInput";
import { employmentStatus } from "@/utils";
import Alert from "../Alert";

export default function RegisterUser() {
    const [offices, setOffices] = useState([]);
    const [roles, setRoles] = useState([]);
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const theme = useTheme().theme;
    const { data, setData, post, processing, errors, reset } = useForm({
        hris_id: "",
        user_id: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        position: "",
        contact_no: "",
        employment_status: "",
        office_id: "",
        role: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);

    // Get list of offices
    useEffect(() => {
        fetch(route("registration.get.offices&roles"))
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch offices");
                }
                return response.json();
            })
            .then((data) => {
                // console.log("data: " + JSON.stringify(data));
                setOffices(data.offices);
                setRoles(data.roles);
            })
            .catch((error) => {
                console.error("Error fetching offices: " + error.message);
            });
    }, []);

    const submit = (e) => {
        e.preventDefault();

        // fetch(route("register"),{method:"POST", body: JSON.stringify(data)});
        post(route("register"), {
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <>
            <Button onPress={onOpen} color="primary">
                Add new user
            </Button>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                className={`${theme} inset-y-10`}
                size="lg"
            >
                <ModalContent>
                    {(onClose) => (
                        <form onSubmit={submit}>
                            <ModalHeader className="text-foreground flex flex-col gap-1">
                                <h2>Add new user</h2>
                            </ModalHeader>
                            <ModalBody className="text-foreground flex flex- gap-4">
                                <Alert
                                    type={"info"}
                                    variant={"flat"}
                                    message={
                                        "The user will be added to the system with the provided details. Make sure to fill out all the required fields before submitting the form."
                                    }
                                    isCloseable={false}
                                />
                                <div className="flex gap-4">
                                    <Input
                                        name="hris_id"
                                        id="hris_id"
                                        label="HRIS ID"
                                        placeholder=" "
                                        variant="bordered"
                                        autoComplete="hris_id"
                                        value={data.hris_id}
                                        onChange={(e) =>
                                            setData("hris_id", e.target.value)
                                        }
                                        color={
                                            !!errors.hris_id
                                                ? "danger"
                                                : "default"
                                        }
                                        isInvalid={!!errors.hris_id}
                                        errorMessage={errors.hris_id}
                                        classNames={{
                                            label: "text-black text-default-400 font-bold",
                                        }}
                                        isRequired
                                    />
                                    <Input
                                        name="user_id"
                                        id="user_id"
                                        label="User ID"
                                        placeholder=" "
                                        variant="bordered"
                                        autoComplete="user_id"
                                        value={data.user_id}
                                        onChange={(e) =>
                                            setData("user_id", e.target.value)
                                        }
                                        color={
                                            !!errors.user_id
                                                ? "danger"
                                                : "default"
                                        }
                                        isInvalid={!!errors.user_id}
                                        errorMessage={errors.user_id}
                                        classNames={{
                                            label: "text-black text-default-400 font-bold",
                                        }}
                                        isRequired
                                    />
                                </div>
                                <div className="flex gap-4 ">
                                    <Autocomplete
                                        name="employment_status"
                                        id="employment_status"
                                        placeholder=" "
                                        defaultItems={employmentStatus}
                                        label="Employment Status"
                                        variant="bordered"
                                        classNames={{
                                            base: "text-black font-bold",
                                        }}
                                        isClearable={false}
                                        menuTrigger="input"
                                        onInputChange={(value) => {
                                            setData("employment_status", value);
                                        }}
                                        onKeyDown={(e) =>
                                            e.continuePropagation()
                                        } //to stop console error: console.js:213 stopPropagation is now the default behavior for events in React Spectrum. You can use continuePropagation() to revert this behavior.
                                        isRequired
                                        isInvalid={!!errors.employment_status}
                                        errorMessage={errors.employment_status}
                                    >
                                        {(empstat) => (
                                            <AutocompleteItem
                                                key={empstat.value}
                                            >
                                                {empstat.label}
                                            </AutocompleteItem>
                                        )}
                                    </Autocomplete>
                                </div>
                                <div className="flex gap-4 ">
                                    <Input
                                        name="position"
                                        id="position"
                                        label="Position"
                                        placeholder=" "
                                        variant="bordered"
                                        autoComplete="position"
                                        value={data.position}
                                        onChange={(e) =>
                                            setData("position", e.target.value)
                                        }
                                        color={
                                            !!errors.position
                                                ? "danger"
                                                : "default"
                                        }
                                        isInvalid={!!errors.position}
                                        errorMessage={errors.position}
                                        classNames={{
                                            label: "text-black text-default-400 font-bold",
                                        }}
                                        isRequired
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <Select
                                        variant="bordered"
                                        label="Office"
                                        placeholder=" "
                                        classNames={{
                                            label: "text-black text-default-400 font-bold",
                                            trigger: "border-neutral-500",
                                        }}
                                        isInvalid={!!errors.office_id}
                                        errorMessage={errors.office_id}
                                        onSelectionChange={(keys) => {
                                            setData(
                                                "office_id",
                                                keys.currentKey
                                            );
                                        }}
                                        isRequired
                                    >
                                        {offices.map((office) => (
                                            <SelectItem
                                                key={office.id}
                                                value={office.id}
                                            >
                                                {office.name}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                    <Select
                                        variant="bordered"
                                        label="Role"
                                        placeholder=" "
                                        classNames={{
                                            label: "text-black text-default-400 font-bold",
                                            trigger: "border-neutral-500",
                                        }}
                                        isInvalid={!!errors.role}
                                        errorMessage={errors.role}
                                        onSelectionChange={(keys) => {
                                            setData("role", keys.currentKey);
                                        }}
                                        isRequired
                                    >
                                        {roles.map((role) => (
                                            <SelectItem
                                                key={role.name}
                                                value={role.name}
                                            >
                                                {role.name
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    role.name.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                </div>
                                <div className="flex gap-4 ">
                                    <Input
                                        name="first_name"
                                        id="first_name"
                                        label="First Name"
                                        placeholder=" "
                                        variant="bordered"
                                        autoComplete="first_name"
                                        value={data.first_name}
                                        onChange={(e) =>
                                            setData(
                                                "first_name",
                                                e.target.value
                                            )
                                        }
                                        color={
                                            !!errors.first_name
                                                ? "danger"
                                                : "default"
                                        }
                                        isInvalid={!!errors.first_name}
                                        errorMessage={errors.first_name}
                                        classNames={{
                                            label: "text-black text-default-400 font-bold",
                                        }}
                                        isRequired
                                    />
                                    <Input
                                        name="middle_name"
                                        id="middle_name"
                                        label="Middle Name"
                                        placeholder=" "
                                        variant="bordered"
                                        autoComplete="middle_name"
                                        value={data.middle_name}
                                        onChange={(e) =>
                                            setData(
                                                "middle_name",
                                                e.target.value
                                            )
                                        }
                                        color={
                                            !!errors.middle_name
                                                ? "danger"
                                                : "default"
                                        }
                                        isInvalid={!!errors.middle_name}
                                        errorMessage={errors.middle_name}
                                        classNames={{
                                            label: "text-black text-default-400 font-bold",
                                        }}
                                    />
                                    <Input
                                        name="last_name"
                                        id="last_name"
                                        label="Last Name"
                                        placeholder=" "
                                        variant="bordered"
                                        autoComplete="last_name"
                                        value={data.last_name}
                                        onChange={(e) =>
                                            setData("last_name", e.target.value)
                                        }
                                        color={
                                            !!errors.last_name
                                                ? "danger"
                                                : "default"
                                        }
                                        isInvalid={!!errors.last_name}
                                        errorMessage={errors.last_name}
                                        classNames={{
                                            label: "text-black text-default-400 font-bold",
                                        }}
                                        isRequired
                                    />
                                </div>
                                <div className="flex gap-4 ">
                                    <Input
                                        type="email"
                                        label="Email"
                                        placeholder=" "
                                        name="email"
                                        id="email"
                                        variant="bordered"
                                        autoComplete="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        color={
                                            !!errors.email
                                                ? "danger"
                                                : "default"
                                        }
                                        isInvalid={!!errors.email}
                                        errorMessage={errors.email}
                                        classNames={{
                                            label: "text-black text-default-400 font-bold",
                                        }}
                                        isRequired
                                    />
                                    <Input
                                        label="Contact Number"
                                        placeholder=" "
                                        name="contact_no"
                                        id="contact_no"
                                        variant="bordered"
                                        autoComplete="contact_no"
                                        value={data.contact_no}
                                        onChange={(e) =>
                                            setData(
                                                "contact_no",
                                                e.target.value
                                            )
                                        }
                                        color={
                                            !!errors.contact_no
                                                ? "danger"
                                                : "default"
                                        }
                                        isInvalid={!!errors.contact_no}
                                        errorMessage={errors.contact_no}
                                        classNames={{
                                            label: "text-black text-default-400 font-bold",
                                        }}
                                        isRequired
                                    />
                                </div>

                                <div className="flex gap-4 ">
                                    <PasswordInput
                                        name="password"
                                        label="Password"
                                        value={data.password}
                                        setValue={(val) =>
                                            setData("password", val)
                                        }
                                        error={errors.password}
                                    />
                                    <PasswordInput
                                        name="password_confirmation"
                                        label="Confirm password"
                                        value={data.password_confirmation}
                                        setValue={(val) =>
                                            setData(
                                                "password_confirmation",
                                                val
                                            )
                                        }
                                        error={errors.password_confirmation}
                                    />
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="default"
                                    variant="flat"
                                    onPress={onClose}
                                >
                                    Close
                                </Button>

                                <Button
                                    color="primary"
                                    isLoading={processing}
                                    type="submit"
                                >
                                    Register
                                </Button>
                            </ModalFooter>
                        </form>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
