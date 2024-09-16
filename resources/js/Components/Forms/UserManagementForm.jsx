import React from "react";
import PasswordInput from "./PasswordInput";
import { router, useForm, usePage } from "@inertiajs/react";
import {
    Autocomplete,
    AutocompleteItem,
    Button,
    Card,
    CardBody,
    Checkbox,
    Divider,
    Input,
    Spacer,
} from "@nextui-org/react";
import { employmentStatus } from "@/utils/constants";
import { SaveIcon } from "./icons";
import Alert from "../Alert";
import { toTitleCase } from "@/utils/helpers";

const userStatus = [
    {
        key: "active",
        label: "Active",
    },
    {
        key: "inactive",
        label: "Inactive",
    },
    {
        key: "pending",
        label: "Pending",
    },
];

export const UserManagementForm = ({ onSubmit, user, isSubmitting }) => {
    const userformRef = React.useRef(null);
    const { offices, roles, action } = usePage().props;
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
        email: "",
        password: "",
        password_confirmation: "",
        role: "",
        reset_password: false,
        account_status: "active",
    });

    React.useEffect(() => {
        if (user) {
            setData(user);
        }
    }, [user]);

    React.useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);

    React.useEffect(() => {
        isSubmitting(processing);
    }, [processing]);

    React.useEffect(() => {
        if (onSubmit) {
            if (formRef.current) {
                formRef.current.requestSubmit(); // Trigger form submission
            }
        }
    }, [onSubmit]);

    const submit = (e) => {
        e.preventDefault();

        action === "create" &&
            post(route("users.store"), {
                onSuccess: () => {
                    reset();
                },
            });

        action === "edit" && post(route("users.update", user.id));
    };

    return (
        <div className="pt-10">
            <form ref={userformRef} onSubmit={submit}>
                <div className="flex flex-col gap-10">
                    {Object.keys(errors).length !== 0 && (
                        <div>
                            <Alert
                                type={"error"}
                                title={"Error creating new user"}
                                message={
                                    "We encountered some issues while saving user details provided. Please check the highlighted fields for details."
                                }
                                variant={"flat"}
                            />
                        </div>
                    )}
                    <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-12 md:col-span-4">
                            <h2 className="text-md font-bold">
                                User Information
                            </h2>
                            <p className="text-sm mx-w-">
                                Provide Essential User Details.
                            </p>
                        </div>
                        <div className="col-span-12 md:col-span-8">
                            <Card>
                                <CardBody className="p-0">
                                    <div className="flex flex-col gap-5 p-8">
                                        <Input
                                            name="user_id"
                                            id="user_id"
                                            label="User ID"
                                            placeholder="Enter your desired User ID"
                                            labelPlacement="outside"
                                            variant="bordered"
                                            autoComplete="user_id"
                                            value={data.user_id}
                                            onChange={(e) =>
                                                setData(
                                                    "user_id",
                                                    e.target.value
                                                )
                                            }
                                            color={
                                                !!errors.user_id
                                                    ? "danger"
                                                    : "default"
                                            }
                                            isInvalid={!!errors.user_id}
                                            errorMessage={errors.user_id}
                                            classNames={{
                                                label: "text-black dark:text-white/90 font-bold",
                                                inputWrapper:
                                                    "border-slate-400",
                                                base: "max-w-lg",
                                            }}
                                            isRequired
                                        />
                                        <Input
                                            name="first_name"
                                            id="first_name"
                                            label="First Name"
                                            placeholder="Enter your first name"
                                            labelPlacement="outside"
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
                                                label: "text-black dark:text-white/90 font-bold",
                                                inputWrapper:
                                                    "border-slate-400",
                                                base: "max-w-lg",
                                            }}
                                            isRequired
                                        />
                                        <Input
                                            name="middle_name"
                                            id="middle_name"
                                            label="Middle Name"
                                            placeholder="Enter your middle name"
                                            labelPlacement="outside"
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
                                                label: "text-black dark:text-white/90 font-bold",
                                                inputWrapper:
                                                    "border-slate-400",
                                                base: "max-w-lg",
                                            }}
                                        />
                                        <Input
                                            name="last_name"
                                            id="last_name"
                                            label="Last Name"
                                            placeholder="Enter your last name"
                                            labelPlacement="outside"
                                            variant="bordered"
                                            autoComplete="last_name"
                                            value={data.last_name}
                                            onChange={(e) =>
                                                setData(
                                                    "last_name",
                                                    e.target.value
                                                )
                                            }
                                            color={
                                                !!errors.last_name
                                                    ? "danger"
                                                    : "default"
                                            }
                                            isInvalid={!!errors.last_name}
                                            errorMessage={errors.last_name}
                                            classNames={{
                                                label: "text-black dark:text-white/90 font-bold",
                                                inputWrapper:
                                                    "border-slate-400",
                                                base: "max-w-lg",
                                            }}
                                            isRequired
                                        />
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                    <Divider />
                    <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-12 md:col-span-4">
                            <h2 className="text-md font-bold">
                                Contact Information
                            </h2>
                            <p className="text-sm mx-w-">
                                Enter User's Contact Details.
                            </p>
                        </div>
                        <div className="col-span-12 md:col-span-8">
                            <Card>
                                <CardBody className="p-0">
                                    <div className="flex flex-col gap-5 p-8">
                                        <Input
                                            type="email"
                                            label="Email"
                                            name="email"
                                            id="email"
                                            placeholder="Enter your email"
                                            labelPlacement="outside"
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
                                                label: "text-black dark:text-white/90 font-bold",
                                                inputWrapper:
                                                    "border-slate-400",
                                                base: "max-w-lg",
                                            }}
                                            isRequired
                                        />
                                        <Input
                                            label="Contact Number"
                                            name="contact_no"
                                            id="contact_no"
                                            placeholder="Enter your contact number"
                                            labelPlacement="outside"
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
                                                label: "text-black dark:text-white/90 font-bold",
                                                inputWrapper:
                                                    "border-slate-400",
                                                base: "max-w-lg",
                                            }}
                                            isRequired
                                        />
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                    <Divider />
                    <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-12 md:col-span-4">
                            <h2 className="text-md font-bold">
                                Employment Details
                            </h2>
                            <p className="text-sm mx-w-">
                                Essential Employment Information.
                            </p>
                        </div>
                        <div className="col-span-12 md:col-span-8">
                            <Card>
                                <CardBody className="p-0">
                                    <div className="flex flex-col gap-5 p-8">
                                        <Input
                                            name="hris_id"
                                            id="hris_id"
                                            label="HRIS ID"
                                            labelPlacement="outside"
                                            placeholder="Enter your HRIS ID"
                                            variant="bordered"
                                            autoComplete="hris_id"
                                            value={data.hris_id}
                                            onChange={(e) =>
                                                setData(
                                                    "hris_id",
                                                    e.target.value
                                                )
                                            }
                                            color={
                                                !!errors.hris_id
                                                    ? "danger"
                                                    : "default"
                                            }
                                            isInvalid={!!errors.hris_id}
                                            errorMessage={errors.hris_id}
                                            classNames={{
                                                label: "text-black dark:text-white/90 font-bold",
                                                inputWrapper:
                                                    "border-slate-400",
                                                base: "max-w-lg",
                                            }}
                                            isRequired
                                        />

                                        <Input
                                            name="position"
                                            id="position"
                                            label="Position"
                                            placeholder="Enter your current position"
                                            labelPlacement="outside"
                                            variant="bordered"
                                            autoComplete="position"
                                            value={data.position}
                                            onChange={(e) =>
                                                setData(
                                                    "position",
                                                    e.target.value
                                                )
                                            }
                                            color={
                                                !!errors.position
                                                    ? "danger"
                                                    : "default"
                                            }
                                            isInvalid={!!errors.position}
                                            errorMessage={errors.position}
                                            classNames={{
                                                label: "text-black dark:text-white/90 font-bold",
                                                inputWrapper:
                                                    "border-slate-400",
                                                base: "max-w-lg",
                                            }}
                                            isRequired
                                        />
                                        <Autocomplete
                                            name="employment_status"
                                            id="employment_status"
                                            defaultItems={employmentStatus}
                                            defaultSelectedKey={
                                                data.employment_status
                                                    ? data.employment_status
                                                    : user.employment_status
                                            }
                                            label="Employment Status"
                                            placeholder="Current employment status"
                                            labelPlacement="outside"
                                            variant="bordered"
                                            inputProps={{
                                                classNames: {
                                                    label: "text-black dark:text-white/90 font-bold",
                                                    inputWrapper:
                                                        "border-slate-400",
                                                    base: "max-w-lg",
                                                },
                                            }}
                                            isClearable={false}
                                            className="min-w-64"
                                            menuTrigger="input"
                                            onSelectionChange={(key) => {
                                                // console.log("value: " + key);
                                                setData(
                                                    "employment_status",
                                                    key
                                                );
                                            }}
                                            onKeyDown={(e) =>
                                                e.continuePropagation()
                                            } //to stop console error: console.js:213 stopPropagation is now the default behavior for events in React Spectrum. You can use continuePropagation() to revert this behavior.
                                            isRequired
                                            isInvalid={
                                                !!errors.employment_status
                                            }
                                            errorMessage={
                                                errors.employment_status
                                            }
                                        >
                                            {(empstat) => (
                                                <AutocompleteItem
                                                    key={empstat.value}
                                                >
                                                    {empstat.label}
                                                </AutocompleteItem>
                                            )}
                                        </Autocomplete>

                                        <Autocomplete
                                            name="office_id"
                                            id="office_id"
                                            defaultItems={offices}
                                            defaultSelectedKey={
                                                data.office_id.toString() ||
                                                user.office_id.toString()
                                            }
                                            label="Office"
                                            placeholder="Enter your office department/section/office"
                                            labelPlacement="outside"
                                            variant="bordered"
                                            inputProps={{
                                                classNames: {
                                                    label: "text-black dark:text-white/90 font-bold",
                                                    inputWrapper:
                                                        "border-slate-400",
                                                    base: "max-w-lg",
                                                },
                                            }}
                                            isClearable={false}
                                            className="min-w-64"
                                            menuTrigger="input"
                                            onSelectionChange={(key) => {
                                                console.log("value: ", key);
                                                setData("office_id", key);
                                            }}
                                            onKeyDown={(e) =>
                                                e.continuePropagation()
                                            } //to stop console error: console.js:213 stopPropagation is now the default behavior for events in React Spectrum. You can use continuePropagation() to revert this behavior.
                                            isRequired
                                            isInvalid={!!errors.office_id}
                                            errorMessage={errors.office_id}
                                        >
                                            {(office) => (
                                                <AutocompleteItem
                                                    key={office.id}
                                                >
                                                    {office.name}
                                                </AutocompleteItem>
                                            )}
                                        </Autocomplete>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                    <Divider />
                    <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-12 md:col-span-4">
                            <h2 className="text-md font-bold">Security</h2>
                            <p className="text-sm mx-w-">
                                Define default password for the user.
                            </p>
                        </div>
                        <div className="col-span-12 md:col-span-8">
                            <Card>
                                <CardBody className="p-0">
                                    <div className="flex flex-col gap-5 p-8">
                                        <Autocomplete
                                            name="account_status"
                                            id="account_status"
                                            defaultItems={userStatus}
                                            label="User Status"
                                            placeholder="Set user status"
                                            labelPlacement="outside"
                                            variant="bordered"
                                            defaultSelectedKey={
                                                data.account_status ||
                                                user.account_status
                                            }
                                            inputProps={{
                                                classNames: {
                                                    label: "text-black dark:text-white/90 font-bold",
                                                    inputWrapper:
                                                        "border-slate-400",
                                                    base: "max-w-lg",
                                                },
                                            }}
                                            isClearable={false}
                                            className="min-w-64"
                                            menuTrigger="input"
                                            onSelectionChange={(key) => {
                                                setData("account_status", key);
                                            }}
                                            onKeyDown={(e) =>
                                                e.continuePropagation()
                                            } //to stop console error: console.js:213 stopPropagation is now the default behavior for events in React Spectrum. You can use continuePropagation() to revert this behavior.
                                            isRequired
                                            isInvalid={!!errors.account_status}
                                            errorMessage={errors.account_status}
                                        >
                                            {(status) => (
                                                <AutocompleteItem
                                                    key={status.key}
                                                >
                                                    {status.label}
                                                </AutocompleteItem>
                                            )}
                                        </Autocomplete>
                                        <Autocomplete
                                            name="role"
                                            id="role"
                                            defaultItems={roles}
                                            label="User role"
                                            placeholder="Select user role"
                                            labelPlacement="outside"
                                            variant="bordered"
                                            defaultSelectedKey={
                                                data.role[0] || user.role[0]
                                            }
                                            inputProps={{
                                                classNames: {
                                                    label: "text-black dark:text-white/90 font-bold",
                                                    inputWrapper:
                                                        "border-slate-400",
                                                    base: "max-w-lg",
                                                },
                                            }}
                                            isClearable={false}
                                            className="min-w-64"
                                            menuTrigger="input"
                                            onSelectionChange={(key) => {
                                                // console.log("value: " + key);
                                                setData("role", key);
                                            }}
                                            onKeyDown={(e) =>
                                                e.continuePropagation()
                                            } //to stop console error: console.js:213 stopPropagation is now the default behavior for events in React Spectrum. You can use continuePropagation() to revert this behavior.
                                            isRequired
                                            isInvalid={!!errors.role}
                                            errorMessage={errors.role}
                                        >
                                            {(role) => (
                                                <AutocompleteItem
                                                    key={role.name}
                                                >
                                                    {toTitleCase(role.name)}
                                                </AutocompleteItem>
                                            )}
                                        </Autocomplete>
                                        {action === "edit" && (
                                            <Checkbox
                                                isSelected={data.reset_password}
                                                onValueChange={(state) => {
                                                    setData(
                                                        "reset_password",
                                                        state
                                                    );
                                                }}
                                            >
                                                Reset user password?
                                            </Checkbox>
                                        )}
                                        {(action === "create" ||
                                            data.reset_password) && (
                                            <>
                                                <PasswordInput
                                                    name="password"
                                                    label={`${
                                                        data.reset_password
                                                            ? "Set"
                                                            : "Reset"
                                                    } Password`}
                                                    placeholder={`Set user's ${
                                                        data.reset_password
                                                            ? "new"
                                                            : "default"
                                                    } password`}
                                                    labelPlacement="outside"
                                                    maxWidth={"max-w-lg"}
                                                    value={data.password}
                                                    setValue={(val) =>
                                                        setData("password", val)
                                                    }
                                                    error={errors.password}
                                                />
                                                <PasswordInput
                                                    name="password_confirmation"
                                                    label={`Confirm ${
                                                        data.reset_password
                                                            ? "new"
                                                            : "default"
                                                    } password`}
                                                    placeholder={`Enter ${
                                                        data.reset_password
                                                            ? "new"
                                                            : "default"
                                                    } user password again`}
                                                    labelPlacement="outside"
                                                    value={
                                                        data.password_confirmation
                                                    }
                                                    maxWidth={"max-w-lg"}
                                                    setValue={(val) =>
                                                        setData(
                                                            "password_confirmation",
                                                            val
                                                        )
                                                    }
                                                    error={
                                                        errors.password_confirmation
                                                    }
                                                />
                                            </>
                                        )}
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                </div>
                <Spacer y={10} />
                <div className="flex flex-row-reverse gap-4">
                    <Button
                        color="primary"
                        startContent={
                            <SaveIcon
                                height={20}
                                width={20}
                                color={"currentColor"}
                            />
                        }
                        isLoading={processing}
                        type="submit"
                    >
                        Save user
                    </Button>
                    <Button
                        color="default"
                        onClick={() => router.get(route("users"))}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
};
