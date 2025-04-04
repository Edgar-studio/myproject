import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { notify } from "../../../utils/notify.js";
import axios from "axios";

const AdminSettings = () => {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    const [apiKey, setApiKey] = useState("");
    const [password, setPassword] = useState("");
    const [notifications, setNotifications] = useState(true);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [userId, setUserId] = useState(""); // To store the current user ID
    const [isLoading, setIsLoading] = useState(false);

    // Մեկ անգամ կոմպոնենտը լոդ լինելուց կանչել դա
    useEffect(() => {
        // Get current user information from localStorage or another source
        const currentUserToken = localStorage.getItem("token"); // Default ID if not found

        // Fetch user's current verification status
        if (currentUserToken) {
            fetchUserVerificationStatus(currentUserToken);
        }
    }, []); // Empty dependency array means this runs once on mount

    // Թեման փոխելու համար առանձին useEffect
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

        document.body.className = theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-black";
    }, [theme]);

    const fetchUserVerificationStatus = async (token) => {
        try {
            const allUsers = await axios.get(`http://localhost:4000/users/`);
            const data = allUsers.data;

            const userInfo = data.find(user => user.username === token);
            if (userInfo) {
                setUserId(userInfo.id);
                if (userInfo.verification !== undefined) {
                    setNotifications(userInfo.verification);
                }
            }
        } catch (error) {
            console.error("Error fetching user verification status:", error);
            notify("Failed to load user settings", "error");
        }
    };

    const handleThemeChange = (e) => setTheme(e.target.value);
    const handleApiKeyChange = (e) => setApiKey(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handleNotificationsToggle = () => {
        setNotifications(!notifications);
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const updateUserVerification = async (e) => {
        e.preventDefault();
        if (!userId) {
            notify("User ID not found. Please log in again.", "error");
            return;
        }

        try {
            // Update the user's verification status in the db.json file
            const response = await axios.patch(`http://localhost:4000/users/${userId}`, {
                verification: notifications
            });

            if (response.status === 200) {
                notify("Settings successfully saved!");
                return true;
            } else {
                notify("Failed to save verification settings", "error");
                return false;
            }
        } catch (error) {
            console.error("Error updating verification status:", error);
            notify("Error updating verification status", "error");
            return false;
        }
    };

    // const saveSettings = async () => {
    //     // Կարևոր է։ Պետք է կանխել էջի թարմացումը
    //     // e.preventDefault();
    //
    //     setIsLoading(true);
    //
    //     try {
    //         // Save local settings
    //         localStorage.setItem("theme", theme);
    //         localStorage.setItem("apiKey", apiKey);
    //         if (password) {
    //             localStorage.setItem("password", password);
    //         }
    //
    //         // Update verification status in the database
    //         await updateUserVerification();
    //     } catch (error) {
    //         console.error("Error saving settings:", error);
    //         notify("Error saving settings", "error");
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    return (
        <form onSubmit={updateUserVerification} className="w-full p-6 min-h-screen text-black dark:text-white">
            <h1 className="text-2xl font-bold mb-4">Admin Settings</h1>

            <div className="mb-4 p-4 bg-white dark:bg-gray-800 shadow rounded">
                <h2 className="text-lg font-semibold mb-2">Theme Settings</h2>
                <select value={theme} onChange={handleThemeChange} className="p-2 border rounded bg-gray-100 dark:bg-gray-700 text-black dark:text-white">
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                </select>
            </div>

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

            <div className="mb-4 p-4 bg-white dark:bg-gray-800 shadow rounded">
                <h2 className="text-lg font-semibold mb-2">Security Settings</h2>
                <div className="relative">
                    <input
                        type={passwordVisible ? "text" : "password"}
                        value={password}
                        onChange={handlePasswordChange}
                        className="p-2 border rounded w-full bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                        placeholder="Change Admin Password"
                    />
                    <span
                        className="absolute top-3 right-3 cursor-pointer text-gray-500 dark:text-gray-300"
                        onClick={togglePasswordVisibility}
                    >
                        {passwordVisible ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                    </span>
                </div>
            </div>

            <div className="mb-4 p-4 bg-white dark:bg-gray-800 shadow rounded">
                <h2 className="text-lg font-semibold mb-2">Notifications</h2>
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={notifications}
                        onChange={handleNotificationsToggle}
                    />
                    <span>Enable 2-step verification</span>
                </label>
            </div>

            <div className="flex justify-end mt-6">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 cursor-pointer disabled:bg-blue-300"
                >
                    {isLoading ? "Saving..." : "Save"}
                </button>
            </div>
        </form>
    );
};

export default AdminSettings;