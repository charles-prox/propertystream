import React from "react";
import { Button, Tooltip } from "@nextui-org/react";
import { usePage, router } from "@inertiajs/react";
import { items } from "./items";

const NavItems = ({ sideNavState, animationOptions }) => {
    const { url } = usePage();

    return (
        <div className="flex flex-col gap-2 items-start w-full py-3">
            {items.map((item) => (
                <Tooltip
                    key={item.key}
                    isDisabled={sideNavState !== "collapse"}
                    showArrow={true}
                    content={item.label}
                    placement="right"
                    size="md"
                    color="default"
                    radius="sm"
                    classNames={{ content: "text-foreground" }}
                >
                    <Button
                        fullWidth
                        size="lg"
                        radius="sm"
                        variant={url.startsWith(item.url) ? "flat" : "light"}
                        color={"primary"}
                        startContent={item.icon(24, 24)}
                        isIconOnly={sideNavState === "collapse" ? true : false}
                        className={`
                            ${sideNavState !== "collapse" && "w-auto"} 
                            text-foreground 
                            gap-5 
                            w-full 
                            transition-width 
                            delay-${animationOptions.delay} 
                            duration-${animationOptions.duration}
                            justify-start
                            px-3
                        `}
                        disabled={url.startsWith(item.url)}
                        onClick={() => router.visit(item.url)}
                    >
                        {
                            <p
                                className={`
                                    ${
                                        sideNavState !== "collapse"
                                            ? "block"
                                            : "hidden"
                                    } 
                                    text-md 
                                    w-0 
                                `}
                            >
                                {item.label}
                            </p>
                        }
                    </Button>
                </Tooltip>
            ))}
        </div>
    );
};

export default NavItems;
