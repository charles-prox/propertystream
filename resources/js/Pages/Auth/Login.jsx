import { useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import LoginLayout from "@/Layouts/AuthLayout";
import { Input, Checkbox, Button } from "@nextui-org/react";
import PasswordInput from "@/Components/PasswordInput";
import Alert from "@/Components/Alert";
import { UserIdIcon } from "@/Icons/InputIcons/UserIdIcon";

export default function Login({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        id: "",
        password: "",
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        errors.message = null;
        post(route("login"), { replace: true });
    };

    return (
        <LoginLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 font-medium text-sm text-green-600">
                    {status}
                </div>
            )}

            {errors.message && (
                <Alert
                    title="Login failed."
                    type="error"
                    message={errors.message}
                    variant={"flat"}
                />
            )}

            <form onSubmit={submit}>
                <div>
                    <Input
                        label="HRIS ID or User ID"
                        name="id"
                        id="id"
                        placeholder="Enter your HRIS ID or User ID"
                        variant="bordered"
                        autoComplete="id"
                        value={data.id}
                        onChange={(e) => setData("id", e.target.value)}
                        // color={!!errors.message ? "danger" : "default"}
                        // isInvalid={!!errors.message}
                        classNames={{
                            label: "text-black dark:text-white/90 font-bold",
                            inputWrapper: "border-slate-400",
                        }}
                        startContent={<UserIdIcon />}
                        isRequired
                    />
                </div>

                <div className="mt-5">
                    <PasswordInput
                        name="password"
                        label="Password"
                        placeholder="Enter your password"
                        value={data.password}
                        setValue={(val) => setData("password", val)}
                        error={errors.password}
                    />
                </div>

                <div className="block mt-4">
                    <Checkbox
                        defaultValue={data.remember}
                        name="remember"
                        checked={data.remember}
                        onChange={(e) => setData("remember", e.target.checked)}
                        size="sm"
                    >
                        Remember me
                    </Checkbox>
                </div>

                <div className="flex items-center justify-end mt-4">
                    <Link
                        href={route("register")}
                        className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Not yet registered?
                    </Link>

                    <Button
                        className="ms-4"
                        color="primary"
                        isLoading={processing}
                        type="submit"
                    >
                        Log in
                    </Button>
                </div>
            </form>
        </LoginLayout>
    );
}
