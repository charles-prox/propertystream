import React from "react";
import { DashboardIcon, FolderIcon, PropertyIcon, UsersIcon } from "../icons";

export const items = [
    {
        key: "dashboard",
        label: "Dashboard",
        icon: (w, h) => <DashboardIcon width={w} height={h} />,
        url: "/dashboard",
    },
    {
        key: "users",
        label: "Users",
        icon: (w, h) => <UsersIcon width={w} height={h} />,
        url: "/users",
    },
    {
        key: "properties",
        label: "Properties",
        icon: (w, h) => <PropertyIcon width={w} height={h} />,
        url: "/properties",
    },
    {
        key: "reports",
        label: "Reports",
        icon: (w, h) => <FolderIcon width={w} height={h} />,
        url: "/reports",
    },
];
