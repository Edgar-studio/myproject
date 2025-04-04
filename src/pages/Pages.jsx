import { useEffect, useState } from 'react';
import { useRoutes } from "react-router-dom";
import { privateRoutes, publicRoutes } from "../utils/routes.jsx";
import VerticalSidebar from "../components/header/Navbar.jsx";

const Pages = () => {
    const [token, setToken] = useState(localStorage.getItem("token"));

    useEffect(() => {
        const handleStorageChange = () => {
            setToken(localStorage.getItem("token"));
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    const routes = useRoutes(token ? privateRoutes : publicRoutes);

    return (
        <div className="w-full min-h-[80vh] bg-white dark:bg-gray-950 text-white relative">
            {routes}

            <VerticalSidebar

            />
        </div>
    );
};

export default Pages;
