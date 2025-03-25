import { useState, useEffect } from "react";

const AdminSettings = () => {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    const [apiKey, setApiKey] = useState("");
    const [password, setPassword] = useState("");
    const [notifications, setNotifications] = useState(true);

    useEffect(() => {
        const root = document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
            root.classList.remove("light");
        } else {
            root.classList.add("light");
            root.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    useEffect(() => {
        document.body.className = theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black";
    }, [theme]);

    const handleThemeChange = (e) => setTheme(e.target.value);
    const handleApiKeyChange = (e) => setApiKey(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handleNotificationsToggle = () => setNotifications(!notifications);

    return (
        <div className="w-full p-6 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Admin Settings</h1>

            {/* Theme Settings */}
            <div className="mb-4 p-4 bg-white dark:bg-gray-800 shadow rounded">
                <h2 className="text-lg font-semibold mb-2">Theme Settings</h2>
                <select value={theme} onChange={handleThemeChange} className="p-2 border rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white">
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                </select>
            </div>

            {/* API Key Management */}
            <div className="mb-4 p-4 bg-white dark:bg-gray-800 shadow rounded">
                <h2 className="text-lg font-semibold mb-2">API Key</h2>
                <input
                    type="text"
                    value={apiKey}
                    onChange={handleApiKeyChange}
                    className="p-2 border rounded w-full bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                    placeholder="Enter API Key"
                />
            </div>

            {/* Security Settings */}
            <div className="mb-4 p-4 bg-white dark:bg-gray-800 shadow rounded">
                <h2 className="text-lg font-semibold mb-2">Security Settings</h2>
                <input
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    className="p-2 border rounded w-full bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                    placeholder="Change Admin Password"
                />
            </div>

            {/* Notifications */}
            <div className="mb-4 p-4 bg-white dark:bg-gray-800 shadow rounded">
                <h2 className="text-lg font-semibold mb-2">Notifications</h2>
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={notifications}
                        onChange={handleNotificationsToggle}
                    />
                    <span>Enable Email Notifications</span>
                </label>
            </div>
        </div>
    );
};

export default AdminSettings;
