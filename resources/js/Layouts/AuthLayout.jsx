import { Card, CardBody, CardHeader, Image } from "@nextui-org/react";
import { usePage } from "@inertiajs/react";
import { asset } from "@/utils";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

export default function AuthLayout({ children }) {
    const { component } = usePage();
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center bg-gray-100">
            <Card
                className={`w-full max-w-full px-6 py-4 bg-white overflow-hidden ${
                    component === "Auth/Login" ? "sm:max-w-md" : "sm:max-w-4xl"
                }`}
            >
                <CardHeader className="block gap-3">
                    <div className="flex items-center justify-center mb-5 sm:mb-2">
                        <Image
                            width={100}
                            alt="App logo"
                            src={asset("charles-logo.png")}
                        />
                    </div>
                    <h1 className="text-2xl mb-2">
                        Welcome to&nbsp;
                        <span className="text-primary-500 font-extrabold">
                            {appName}.
                        </span>
                    </h1>
                    <p className="text-sm">
                        {component.includes("Register")
                            ? "You need register as a system administrator."
                            : "Please login using your registered account."}
                    </p>
                </CardHeader>
                <CardBody>{children}</CardBody>
            </Card>
        </div>
    );
}
