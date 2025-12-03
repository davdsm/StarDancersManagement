import { defineStore } from "pinia";
import { ref } from "vue";

export const useThemeStore = defineStore("theme", () => {
    const isDark = ref(false);

    function initTheme() {
        const storedTheme = localStorage.getItem("theme");
        if (
            storedTheme === "dark" ||
            (!storedTheme &&
                window.matchMedia("(prefers-color-scheme: dark)").matches)
        ) {
            isDark.value = true;
            document.documentElement.classList.add("dark");
        } else {
            isDark.value = false;
            document.documentElement.classList.remove("dark");
        }
    }

    function toggleTheme() {
        isDark.value = !isDark.value;
        if (isDark.value) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }

    return {
        isDark,
        initTheme,
        toggleTheme,
    };
});
