import React, { useState, useCallback, useMemo, useEffect } from "react";
import ThemeContext from "@/Contexts/ThemeContext";

const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        const initialTheme = localStorage.getItem("theme");
        return initialTheme || "light";
    });

    const toggleTheme = useCallback(() => {
        setTheme((prevTheme) => {
            const newTheme = prevTheme === "light" ? "dark" : "light";
            localStorage.setItem("theme", newTheme);
            return newTheme;
        });
    }, []);

    const contextValue = useMemo(
        () => ({ theme, toggleTheme }),
        [theme, toggleTheme]
    );

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme && savedTheme !== theme) {
            setTheme(savedTheme);
        }
    }, []);

    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;
