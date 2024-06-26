import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [
        laravel({
            input: "resources/js/app.jsx",
            refresh: true,
        }),
        react(),
    ],
    define: {
        // By default, Vite doesn't include shims for NodeJS/
        // necessary for use-dark-mode
        global: {},
    },
});
