import { useState } from "react";
import {Facebook, Instagram, Twitter, Youtube, Mail, Phone } from "lucide-react";
import {Link} from "react-router-dom";
import {ABOUT_PAGE, CONTACT_PAGE, PRIVACY_POLICY_PAGE} from "../../utils/routes.jsx";

const Footer = () => {


    return (
        <div className="w-full bg-gray-900 text-white relative">




            <div
                className={` max-h-[700px] w-full
                    opacity-100 py-6 gap-6
                 flex flex-wrap items-center justify-center`}
            >

                <p className="text-red-500 text-xl font-extrabold animate-pulse">
                    ⚡ FOOTBALL NEVER SLEEPS ⚡
                </p>

                {/* Social Icons */}
                <div className="mt-4 flex space-x-6">
                    <a href="https://www.facebook.com/your-facebook-link" className="text-gray-400 hover:text-blue-500 transition-all duration-300 scale-100 hover:scale-125">
                        <Facebook size={30} />
                    </a>
                    <a href="https://www.instagram.com/edgar.avakimyan/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500 transition-all duration-300 scale-100 hover:scale-125">
                        <Instagram size={30} />
                    </a>
                    <a href="https://twitter.com/your-twitter-link" className="text-gray-400 hover:text-blue-400 transition-all duration-300 scale-100 hover:scale-125">
                        <Twitter size={30} />
                    </a>
                    <a href="https://www.youtube.com/@Czecho-ArmenianMappings" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-600 transition-all duration-300 scale-100 hover:scale-125">
                        <Youtube size={30} />
                    </a>
                </div>

                <div className="mt-4 text-gray-400 text-center space-y-2">
                    <p className="flex items-center space-x-2">
                        <Mail size={20} className="text-red-500" />
                        <span><a href="mailto:support@football.com">support@football.com</a></span>
                    </p>
                    <p className="flex items-center space-x-2">
                        <Phone size={20} className="text-green-500" />
                        <span><a href="tel:+4733378901">+420 777 345 079</a></span>
                    </p>
                </div>

                <div className="mt-4 flex space-x-6 text-gray-400">
                    {/*this is my comment*/}

                    <Link
                        className="hover:text-blue-500 transition"
                        to={ABOUT_PAGE}>
                        About
                    </Link>
                    <Link
                        className="hover:text-blue-500 transition"
                        to={CONTACT_PAGE}>
                        Contact US
                    </Link>
                    <Link
                        className="hover:text-blue-500 transition"
                        to={PRIVACY_POLICY_PAGE}>
                        Privacy policy
                    </Link>
                </div>

                <p className="mt-4 text-gray-500">© 2025 Football. All rights reserved.</p>
            </div>
        </div>
    );
};

export default Footer;
