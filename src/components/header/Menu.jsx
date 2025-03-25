

import {privateRoutes} from "../../utils/routes";
import {Link, useLocation} from "react-router-dom";

import PropTypes from "prop-types";

const ExampleMenu = ({menu}) => {

    const {pathname} = useLocation()


    return <ul className="flex gap-6 ">
        {
            menu.map(page => {
                return page.menu && page.type !== "admin" && <li key={page.path}>
                    <Link to={page.path} className={`text-xl ${pathname === page.path ? "text-black dark:text-green-600" : "text-white"}`}>
                        {page.name}
                    </Link>
                </li>
            })
        }

    </ul>
}

const Menu = () => {

    const token = localStorage.getItem('token')

    return (
        <nav>
            <ul className="flex gap-4">

                {

                    token && <ExampleMenu menu={privateRoutes}/>
                }
            </ul>
        </nav>
    );
};
ExampleMenu.propTypes = {
    menu: PropTypes.arrayOf(
        PropTypes.shape({
            path: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            menu: PropTypes.bool,
        })
    ).isRequired,
};
export default Menu;