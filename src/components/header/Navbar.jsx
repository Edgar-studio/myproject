import { useState } from 'react';
import {
    Menu,
    Home,
    User,
    Package,
    MessageCircle,
    FileText,
    Shield,
    ShoppingCart,
    ArrowUp
} from 'lucide-react';
import {HOME_PAGE} from "../../utils/routes.jsx";
import {Link} from "react-router-dom";

export default function VerticalSidebar() {
    const [activeItem, setActiveItem] = useState(null);

    const menuItems = [
        { icon: <Menu size={24} />, label: 'Menu' },
        { icon: <User size={24} /> },
        { icon: <Home size={24}  />, src: HOME_PAGE},
        { icon: <Package size={24} />  },
        { icon: <MessageCircle size={24} /> },
        { icon: <FileText size={24} />},
        { icon: <Shield size={24} />, type: 'Admin1'},
        { icon: <ShoppingCart size={24} />},
        { icon: <ArrowUp size={24} />}
    ];

    const handleItemClick = (index) => {
        setActiveItem(activeItem === index ? null : index);
    };

    return (
        <div className="bg-gray-900 text-gray-100 w-16 flex flex-col items-center py-4
        absolute top-3 right-0
        ">
            {menuItems.map((item, index) => (
                <div key={index} className="relative w-full">
                    <button
                        className={`p-3 w-full flex justify-center relative ${
                            activeItem === index ? 'text-white' : 'text-gray-400 hover:text-gray-200'
                        }`}
                        onClick={() =>{
                            if (!item.src){
                                handleItemClick(index)
                            }
                        }}
                    >
                        {/* Active indicator */}
                        {activeItem === index && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
                        )}
                        {item.src ? <Link
                            onClick={()=>{
                                console.log(item.src);
                            }}
                            to={item.src}>{item.icon}</Link> :  <span>{item.icon}</span>}
                    </button>

                    {/* Dropdown content */}
                    {activeItem === index &&  (
                        <div className="absolute right-16 top-0 bg-gray-800 text-white p-4 rounded-md shadow-lg w-48 z-10">
                            <div className="font-medium text-lg mb-2">{item.label}</div>
                            <ul>
                                <li className="py-1 px-2 hover:bg-gray-700 rounded cursor-pointer"></li>
                            </ul>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}