import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, ChevronUp, LogOut } from "lucide-react";
import { logoutUser } from "../../redux/slices/loginSlice.js";
import { useDispatch } from "react-redux";

const DropdownMenu = ({ menu }) => {
    const dispatch = useDispatch();

    const { pathname } = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openType, setOpenType] = useState(null);

    const toggleMenu = (state) => {
        setIsMenuOpen(state);
        if (!state) setOpenType(null);
    };

    const toggleType = (type) => {
        setOpenType(type);
    };

    const groupedPages = menu.reduce((acc, page) => {
        if (page.type) {
            if (!acc[page.type]) {
                acc[page.type] = [];
            }
            acc[page.type].push(page);
        }
        return acc;
    }, {});

    return (
        <div
            className="relative z-10"
            onMouseEnter={() => toggleMenu(true)}
            onMouseLeave={() => toggleMenu(false)}
        >
            <button className="text-white text-lg font-semibold m-4 hover:text-blue-300 flex items-center">
                📌 Menu {isMenuOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {isMenuOpen && (
                <ul className="absolute top-full left-0 bg-blue-500 p-2 min-h-[50px] min-w-[120px] flex flex-col items-center justify-center gap-4 shadow-2xl rounded-lg">
                    {Object.keys(groupedPages).filter(type => type !== "admin")
                        .map((type) => (
                        <li
                            key={type}
                            onMouseEnter={() => toggleType(type)}
                            className="relative p-2 border-b border-white/20 last:border-none w-full h-[50px] flex justify-between items-start text-white cursor-pointer hover:text-blue-300"
                        >
                            {type}
                            {openType === type && (
                                <div
                                    className="absolute right-full top-0 mr-2 bg-green-500 text-white min-w-[120px] min-h-[50px] p-4 shadow-2xl rounded-lg flex flex-col justify-start items-start"
                                    onMouseEnter={() => toggleType(type)}
                                    onMouseLeave={() => toggleType(null)}
                                >
                                    <ul>
                                        {groupedPages[type].map((page) => (
                                            <li key={page.path} className="p-2 border-b border-white/20 w-full last:border-none">
                                                <Link
                                                    to={page.path}
                                                    className={`text-lg font-semibold ${
                                                        pathname === page.path ? "text-red-400" : "text-white"
                                                    } hover:text-yellow-300`}
                                                >
                                                    {page.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </li>
                    ))}
                    <button
                        onClick={() => dispatch(logoutUser())}
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-2 py-1 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 cursor-pointer"
                    >
                        <LogOut size={18} />
                        Log Out
                    </button>
                </ul>
            )}
        </div>
    );
};

export default DropdownMenu;