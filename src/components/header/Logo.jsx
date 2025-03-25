import {useEffect, useState} from "react";
import {Link, useLocation} from "react-router-dom";
import {privateRoutes} from "../../utils/routes.jsx";
import axios from "axios";



const Logo = () => {
    const token = localStorage.getItem("token");
    const pathname = useLocation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userInfo, setUserInfo] = useState({})


    async function getUserInfo(){
        try {
            const response = await axios.get("http://localhost:4000/users");
            const users = response.data;
            const user = users.find(user => user.username === token);
            setUserInfo(user);

        }catch (error) {
            console.log(error);

        }
    }
useEffect(() => {

  getUserInfo()
},[])


    return (
        <div
            className="relative"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
        >
            <span>
                <img
                    className="bg-white rounded-full"
                    width='50px'
                    height='50px'
                    src={userInfo.img} alt=""/>
            </span>

            {token === "Admin1" && isDropdownOpen && (
                <ul className="absolute right-0  bg-gray-800 text-white rounded-md shadow-lg
                w-40 p-2 transition-opacity opacity-100">



                        {
                            privateRoutes.map(page => {
                                return page.type === "admin" && <li key={page.path}>
                                    <Link to={page.path} className={`text-xl ${pathname === page.path ? "text-black" : "text-white"}`}>
                                        {page.name}
                                    </Link>
                                </li>
                            })
                        }


                       </ul>




            )}
        </div>
    );
};

export default Logo;
