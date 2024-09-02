import defaultTheme from "tailwindcss/defaultTheme";
const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./vendor/laravel/jetstream/**/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.jsx",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ["Be Vietnam", ...defaultTheme.fontFamily.sans],
            },
        },
    },
    darkMode: "class",
    plugins: [
        nextui({
            themes: {
                light: {
                    colors: {
                        foreground: "#222831",
                        primary: { DEFAULT: "#14B8A6", foreground: "#FFF" },
                        secondary: { DEFAULT: "#006FEE", foreground: "#000" },
                        danger: { DEFAULT: "#FF3131", foreground: "#FFF" },
                        info: { DEFAULT: "#005BC4", foreground: "#000" },
                    },
                },
                dark: {
                    colors: {
                        background: "#1E293B",
                        foreground: "#E6E6E6",
                        primary: { DEFAULT: "#6366F1", foreground: "#FFF" },
                        secondary: { DEFAULT: "#006FEE", foreground: "#000" },
                        danger: "#FF3131",
                        info: { DEFAULT: "#005BC4", foreground: "#000" },
                    },
                },
            },
        }),
    ],
};
