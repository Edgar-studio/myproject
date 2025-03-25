// Header.jsx
import DropdownMenu from "../UI/dropdown.jsx";
import { privateRoutes } from "../../utils/routes.jsx";
import Menu from "./Menu.jsx";
import Logo from "./Logo.jsx";
import {FiSun} from "react-icons/fi";
import {FaMoon} from "react-icons/fa";

import {useEffect, useState} from "react";


const Header = () => {
    const menu = privateRoutes.filter((route) => route.menu || route.type);

    const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('darkMode') === 'true');

    useEffect(() => {
        document.body.classList.toggle('dark', isDarkMode);
        localStorage.setItem('darkMode', isDarkMode);
    }, [isDarkMode]);

    return (
        <div className="w-full h-[10vh] bg-gray-700 flex items-center justify-between px-4
        dark:bg-black dark:text-white">
            <Menu />
            <DropdownMenu menu={menu} />
            <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="bg-transparent content-center rounded-full border-4 h-10 w-10
                border-gray-200 text-2xl hover:bg-gray-200 transition-all duration-300
                ease-in-out transform hover:scale-110 focus:outline-none shadow-lg"
            >
                {isDarkMode ? <FiSun size={18} className="cursor-pointer m-auto" /> :
                    <FaMoon size={18} className="cursor-pointer m-auto" />}
            </button>
            <div className="cursor-pointer">
                <Logo />
            </div>
        </div>
    );
};

export default Header;