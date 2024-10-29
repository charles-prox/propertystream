import React from "react";
import { router, useForm, usePage } from "@inertiajs/react";
import {
    Button,
    Card,
    CardBody,
    Checkbox,
    Divider,
    Spacer,
} from "@nextui-org/react";
import PasswordInput from "@/Components/PasswordInput";
import Select from "@/Components/Select";
import Input from "@/Components/Input";
import Alert from "@/Components/Alert";
import { employmentStatus, userStatus } from "@/Utils/constants";
import { SaveIcon } from "./icons";

export const UserManagementForm = ({
    onSubmit,
    user,
    isSubmitting,
    onFormSubmitComplete,
}) => {
    const formRef = React.useRef(null);
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
        role: [],
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
        if (onSubmit && formRef.current) {
            formRef.current.requestSubmit(); // Trigger form submission safely
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

        action === "edit" &&
            post(route("users.update", user.id), {
                onFinish: () => {
                    onFormSubmitComplete();
                },
            });
    };

    return (
        <div className="pt-10">
            <form ref={formRef} onSubmit={submit}>
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
                                            label="User ID"
                                            labelPlacement="outside"
                                            placeholder="Enter your desired User ID"
                                            value={data.user_id}
                                            onChange={(e) =>
                                                setData(
                                                    "user_id",
                                                    e.target.value
                                                )
                                            }
                                            errorMessage={errors.user_id}
                                            maxWidthClass={"max-w-lg"}
                                            isRequired
                                        />
                                        <Input
                                            name="first_name"
                                            label="First Name"
                                            labelPlacement="outside"
                                            placeholder="Enter your first name"
                                            value={data.first_name}
                                            onChange={(e) =>
                                                setData(
                                                    "first_name",
                                                    e.target.value
                                                )
                                            }
                                            errorMessage={errors.first_name}
                                            maxWidthClass={"max-w-lg"}
                                            isRequired
                                        />
                                        <Input
                                            name="middle_name"
                                            label="Middle Name"
                                            labelPlacement="outside"
                                            placeholder="Enter your middle name"
                                            value={data.middle_name || ""}
                                            onChange={(e) =>
                                                setData(
                                                    "middle_name",
                                                    e.target.value
                                                )
                                            }
                                            errorMessage={errors.middle_name}
                                            maxWidthClass={"max-w-lg"}
                                        />
                                        <Input
                                            name="last_name"
                                            label="Last Name"
                                            labelPlacement="outside"
                                            placeholder="Enter your last name"
                                            value={data.last_name}
                                            onChange={(e) =>
                                                setData(
                                                    "last_name",
                                                    e.target.value
                                                )
                                            }
                                            errorMessage={errors.last_name}
                                            maxWidthClass={"max-w-lg"}
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
                                            name="email"
                                            label="Email"
                                            labelPlacement="outside"
                                            placeholder="Enter your email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData("email", e.target.value)
                                            }
                                            errorMessage={errors.email}
                                            maxWidthClass={"max-w-lg"}
                                            isRequired
                                        />
                                        <Input
                                            name="contact_no"
                                            label="Contact Number"
                                            labelPlacement="outside"
                                            placeholder="Enter your contact number"
                                            value={data.contact_no}
                                            onChange={(e) =>
                                                setData(
                                                    "contact_no",
                                                    e.target.value
                                                )
                                            }
                                            errorMessage={errors.contact_no}
                                            maxWidthClass={"max-w-lg"}
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
                                            label="HRIS ID"
                                            labelPlacement="outside"
                                            placeholder="Enter your HRIS ID"
                                            value={data.hris_id}
                                            onChange={(e) =>
                                                setData(
                                                    "hris_id",
                                                    e.target.value
                                                )
                                            }
                                            errorMessage={errors.hris_id}
                                            maxWidthClass={"max-w-lg"}
                                            isRequired
                                        />
                                        <Input
                                            name="position"
                                            label="Position"
                                            labelPlacement="outside"
                                            placeholder="Enter your current position"
                                            value={data.position}
                                            onChange={(e) =>
                                                setData(
                                                    "position",
                                                    e.target.value
                                                )
                                            }
                                            errorMessage={errors.position}
                                            maxWidthClass={"max-w-lg"}
                                            isRequired
                                        />
                                        <Select
                                            autocomplete={true}
                                            name="employment_status"
                                            label="Employment Status"
                                            labelPlacement="outside"
                                            placeholder="Current employment status"
                                            selectedKeys={
                                                data.employment_status ||
                                                user.employment_status
                                            }
                                            items={employmentStatus}
                                            keyField={"value"}
                                            labelField={"label"}
                                            menuTrigger="input"
                                            onSelectionChange={(key) => {
                                                setData(
                                                    "employment_status",
                                                    key
                                                );
                                            }}
                                            isClearable={false}
                                            errorMessage={
                                                errors.employment_status
                                            }
                                            maxWidthClass={"max-w-lg min-w-64"}
                                            isRequired
                                        />
                                        <Select
                                            autocomplete={true}
                                            name="office_id"
                                            label="Office"
                                            labelPlacement="outside"
                                            placeholder="Enter your office department/section/office"
                                            selectedKeys={
                                                data?.office_id.toString() ||
                                                user?.office_id.toString()
                                            }
                                            items={offices}
                                            keyField={"id"}
                                            labelField={"name"}
                                            menuTrigger="input"
                                            onSelectionChange={(key) => {
                                                setData("office_id", key);
                                            }}
                                            isClearable={false}
                                            errorMessage={errors.office_id}
                                            maxWidthClass={"max-w-lg min-w-64"}
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
                            <h2 className="text-md font-bold">Security</h2>
                            <p className="text-sm mx-w-">
                                Define default password for the user.
                            </p>
                        </div>
                        <div className="col-span-12 md:col-span-8">
                            <Card>
                                <CardBody className="p-0">
                                    <div className="flex flex-col gap-5 p-8">
                                        <Select
                                            name="account_status"
                                            label="User Status"
                                            labelPlacement="outside"
                                            placeholder="Set user status"
                                            selectedKeys={
                                                new Set([data.account_status])
                                            }
                                            items={userStatus}
                                            keyField={"key"}
                                            labelField={"label"}
                                            onSelectionChange={(key) => {
                                                setData(
                                                    "account_status",
                                                    Array.from(key)[0]
                                                );
                                            }}
                                            isClearable={false}
                                            errorMessage={errors.account_status}
                                            maxWidthClass={"max-w-lg min-w-64"}
                                            isRequired
                                        />
                                        <Select
                                            // autocomplete={true}
                                            name="role"
                                            label="User role"
                                            labelPlacement="outside"
                                            placeholder="Set user role"
                                            selectionMode="multiple"
                                            selectedKeys={new Set(data.role)}
                                            items={roles}
                                            keyField={"name"}
                                            labelField={"name"}
                                            onSelectionChange={(key) => {
                                                setData(
                                                    "role",
                                                    Array.from(key)
                                                );
                                            }}
                                            isClearable={false}
                                            errorMessage={errors.role}
                                            maxWidthClass={"max-w-lg min-w-64"}
                                            isRequired
                                        />

                                        {action === "edit" && (
                                            <Checkbox
                                                isSelected={
                                                    !!data.reset_password
                                                }
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
                                                            ? "Reset"
                                                            : "Set"
                                                    } Password`}
                                                    labelPlacement="outside"
                                                    placeholder={`Set user's ${
                                                        data.reset_password
                                                            ? "new"
                                                            : "default"
                                                    } password`}
                                                    value={data.password}
                                                    onChange={(e) =>
                                                        setData(
                                                            "password",
                                                            e.target.value
                                                        )
                                                    }
                                                    maxWidthClass={"max-w-lg"}
                                                    errorMessage={
                                                        errors.password_confirmation
                                                    }
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
                                                    maxWidthClass={"max-w-lg"}
                                                    onChange={(e) =>
                                                        setData(
                                                            "password_confirmation",
                                                            e.target.value
                                                        )
                                                    }
                                                    errorMessage={
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
