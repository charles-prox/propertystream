import { Button } from "@nextui-org/react";
import { HomeIcon } from "@/Icons/SidebarIcons/HomeIcon";
import { FolderIcon } from "@/Icons/SidebarIcons/FolderIcon";
import { UsersIcon } from "@/Icons/SidebarIcons/UsersIcon";
import { ArrowRightIcon } from "@/Icons/ArrowRightIcon";
import SidebarMenu from "./SidebarMenu";
import { useSidebarViewState } from "@/SidebarViewStateProvider";

const items = [
    {
        key: "home",
        label: "Home",
        icon: (w, h) => <HomeIcon width={w} height={h} />,
        url: "/",
    },
    {
        key: "reports",
        label: "Reports",
        icon: (w, h) => <FolderIcon width={w} height={h} />,
        url: "/reports",
    },
    {
        key: "users",
        label: "Users",
        icon: (w, h) => <UsersIcon width={w} height={h} />,
        url: "/users",
    },
];

const SidebarNav = () => {
    const { sidebarView, toggleSidebarView } = useSidebarViewState();

    return (
        <div
            className={`
                flex-none 
                ${sidebarView === "collapse" ? "w-16" : "w-52"} 
                rounded-none 
                p-2 
                border-r-1 
                border-slate-400/30
                transition-all 
                delay-150 
                duration-100 
                overflow-hidden
                h-[calc(100vh-4rem)]
                fixed
                left-0 top-[4rem]
            `}
        >
            <div className="flex flex-col justify-between h-full">
                <div className="flex-grow">
                    <SidebarMenu items={items} sidebarView={sidebarView} />
                </div>
                <div className="text-right my-3">
                    <Button
                        size="md"
                        radius="lg"
                        color="primary"
                        isIconOnly
                        onClick={toggleSidebarView}
                    >
                        <ArrowRightIcon
                            className={`
                                ${sidebarView !== "collapse" && "-rotate-180"} 
                                transition-all 
                                transform
                            `}
                            width="20px"
                            height="20px"
                        />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SidebarNav;
