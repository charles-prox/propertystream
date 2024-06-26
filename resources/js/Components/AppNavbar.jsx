import { useMemo } from "react";
import { usePage, useForm } from "@inertiajs/react";
import { asset } from "@/utils";
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    User,
    Image,
    Button,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Navbar,
    Spacer,
} from "@nextui-org/react";
import { useTheme } from "@/ThemeProvider";
import { LogoutIcon } from "@/Icons/LogoutIcon";
import { UserIdIcon } from "@/Icons/InputIcons/UserIdIcon";
import { CaretDownIcon } from "@/Icons/CaretDownIcon";
import BellIcon from "@/Icons/BellIcon";
import SunIcon from "@/Icons/SunIcon";
import MoonIcon from "@/Icons/MoonIcon";
import { UserIcon } from "@/Icons/InputIcons/UserIcon";

const Logo = () => {
    return useMemo(
        () => (
            <Image
                width={45}
                alt="App logo"
                src={asset("charles-logo.png")}
                loading="lazy"
                removeWrapper
            />
        ),
        []
    );
};

const ThemeToggleIcon = () => {
    const theme = useTheme().theme;

    return useMemo(
        () => (theme === "light" ? <SunIcon /> : <MoonIcon />),
        [theme]
    );
};

const AppNavbar = () => {
    const { props, url } = usePage();
    const { post } = useForm();
    const { theme, toggleTheme } = useTheme();

    const submit = (e) => {
        e.preventDefault();
        post(route("logout"), { replace: true });
    };

    return useMemo(
        () => (
            <Navbar maxWidth="full" isBordered classNames={{ wrapper: "px-4" }}>
                <NavbarBrand>
                    {/* Change this section into your logo */}
                    <Logo />
                    <Spacer x="2" />
                    <div className="hidden sm:flex text-xl font-bold ">
                        Argus
                        <span className="text-teal-500 dark:text-indigo-500 text-2xl font-black">
                            X
                        </span>
                        Codes
                    </div>
                </NavbarBrand>
                <NavbarContent justify="end">
                    <NavbarItem>
                        <Dropdown showArrow>
                            <DropdownTrigger>
                                <Button
                                    disableAnimation
                                    className="inline-flex items-center rounded-md bg-transparent"
                                >
                                    <User
                                        name={props.auth?.user?.name}
                                        description={props.auth?.user?.position}
                                        avatarProps={{
                                            showFallback: true,
                                            src: asset("avatar1.jpg"),
                                            fallback: <UserIcon />,
                                        }}
                                    />
                                    <CaretDownIcon />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Static Actions">
                                <DropdownItem
                                    key="profile"
                                    href={route("profile.edit")}
                                    startContent={<UserIdIcon />}
                                    description="Update personal information and photo"
                                >
                                    Profile
                                </DropdownItem>
                                <DropdownItem
                                    key="notification"
                                    // href={route("profile.edit")}
                                    startContent={<BellIcon />}
                                    description="Show reminders and updates"
                                >
                                    Notifications
                                </DropdownItem>
                                <DropdownItem
                                    key="Theme"
                                    // href={route("profile.edit")}
                                    startContent={<ThemeToggleIcon />}
                                    description={
                                        props.auth && props.auth.user
                                            ? theme === "dark"
                                                ? "Change to light mode"
                                                : "Change to dark mode"
                                            : ""
                                    }
                                    onClick={() => toggleTheme()}
                                    showDivider
                                >
                                    Theme
                                </DropdownItem>
                                <DropdownItem
                                    key="logout"
                                    onClick={(e) => submit(e)}
                                    startContent={<LogoutIcon />}
                                >
                                    Log out
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </NavbarItem>
                </NavbarContent>
            </Navbar>
        ),
        [props, toggleTheme, theme]
    );
};

export default AppNavbar;
