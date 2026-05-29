/* THEME MANAGER - PARROQUIA SAN FRANCISCO DE ASÍS */

document.addEventListener("DOMContentLoaded", () => {
    const themeToggleBtn = document.getElementById("theme-toggle");
    
    // Check localStorage or system preference
    const savedTheme = localStorage.getItem("parroquia-theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    // Default to 'light' if not set, or 'dark' if system prefers
    let currentTheme = savedTheme || (systemPrefersDark ? "dark" : "light");
    
    // Apply initial theme
    setTheme(currentTheme);
    
    // Click Listener
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            currentTheme = currentTheme === "light" ? "dark" : "light";
            setTheme(currentTheme);
        });
    }
    
    function setTheme(theme) {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("parroquia-theme", theme);
        
        // Update SVG Icons in the button if necessary
        const themeIcon = document.getElementById("theme-icon");
        if (themeIcon) {
            if (theme === "dark") {
                // Show Sun icon for changing to light
                themeIcon.innerHTML = `
                    <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.01c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>
                `;
            } else {
                // Show Moon icon for changing to dark
                themeIcon.innerHTML = `
                    <path d="M12.3 22h-.1c-5.5 0-10-4.5-10-10 0-4.8 3.5-8.9 8.2-9.8.6-.1 1.2.3 1.3.9.1.6-.3 1.2-.9 1.3-3.3.7-5.6 3.6-5.6 7 0 3.9 3.2 7.1 7.1 7.1 3.1 0 5.8-2 6.7-4.9.2-.6.8-.9 1.4-.7.6.2.9.8.7 1.4C20.3 18.7 16.6 22 12.3 22z"/>
                `;
            }
        }
    }
});
