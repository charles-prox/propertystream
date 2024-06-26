import { Head } from "@inertiajs/react";
import { Card, CardBody, Button, Input } from "@nextui-org/react";
import { PinIcon } from "@/Icons/PinIcon";
import { UserCheckIcon } from "@/Icons/UserPageIcons/UserCheckIcon";
import { UserSpeakIcon } from "@/Icons/UserPageIcons/UserSpeakIcon";
import { UserBlockIcon } from "@/Icons/UserPageIcons/UserBlockIcon";

export default function Dashboard() {
    return (
        <div>
            <Head title="Home" />

            <div className="flex justify-between items-center w-full mb-2">
                <h1 className="text-4xl">Home</h1>
            </div>
            {/* Users Overview section */}
            <div>
                <div className="flex gap-2 items-center py-3">
                    <PinIcon />
                    <h2>Users Overview</h2>
                </div>
                <div className="flex flex-row justify-between w-full gap-4">
                    <Card shadow="sm" className="flex-1">
                        <CardBody className="p-8 flex flex-col">
                            <div className="flex">
                                <p className="flex-grow text-xl font-bold">
                                    Total Users
                                </p>
                                <div className="p-2 bg-secondary/60 rounded-full">
                                    <UserCheckIcon />
                                </div>
                            </div>
                            <div className="flex-grow">
                                <p className="text-5xl font-bold text-secondary">
                                    20
                                </p>
                                <p className="text-sm max-w-80">
                                    registered users including inactive users.
                                </p>
                            </div>
                        </CardBody>
                    </Card>
                    <Card shadow="sm" className="flex-1">
                        <CardBody className="p-8 flex flex-col">
                            <div className="flex">
                                <p className="flex-grow text-xl font-bold">
                                    Active Users
                                </p>
                                <div className="p-2 bg-success-200/80 rounded-full">
                                    <UserSpeakIcon />
                                </div>
                            </div>
                            <div className="flex-grow">
                                <p className="text-5xl font-bold text-success-600">
                                    12
                                </p>
                                <p className="text-sm">
                                    users actively using the system this month.
                                </p>
                            </div>
                        </CardBody>
                    </Card>
                    <Card shadow="sm" className="flex-1">
                        <CardBody className="p-8 flex flex-col">
                            <div className="flex">
                                <p className="flex-grow text-xl font-bold">
                                    Inactive Users
                                </p>
                                <div className="p-2 bg-danger-400/90 rounded-full">
                                    <UserBlockIcon />
                                </div>
                            </div>
                            <div className="flex-grow">
                                <p className="text-5xl font-bold text-danger">
                                    20
                                </p>
                                <p className="text-sm ">
                                    pending accounts, and accounts with
                                    problems.
                                </p>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}
