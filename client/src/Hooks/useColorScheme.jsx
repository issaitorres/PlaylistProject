import { useEffect, useMemo, useState } from "react";
import { useMediaQuery } from "react-responsive";

const localStorageColorScheme =
    window?.localStorage?.colorScheme
        ?   JSON.parse(window?.localStorage?.colorScheme)
        :   true

window.localStorage.setItem("colorScheme", JSON.stringify(localStorageColorScheme))

export function useColorScheme() {

    // if user has dark mode set on their browser on computer, this should
    // handle that automatically
    const systemPrefersDark = useMediaQuery(
        {
            query: "(prefers-color-scheme: dark)",
        },
        undefined
    );

    const [isDark, setIsDark] = useState(localStorageColorScheme);
    const value = useMemo(
        () => (isDark === undefined ? !!systemPrefersDark : isDark),
        [isDark, systemPrefersDark]
    );

    useEffect(() => {
        if (value) {
            document.body.classList.add("dark");
        } else {
            document.body.classList.remove("dark");
        }
    }, [value]);

    return {
        isDark: value,
        setIsDark,
    };
}