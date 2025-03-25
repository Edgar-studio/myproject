import React, {useState} from 'react';
import "./log_reg_style.css"
import Login from "./Login.jsx";
import Register from "./Register.jsx";

const LogReg = () => {

    const [isActive, setIsActive] = useState(false);

    // Ռեգիստրացիայի կոճակի հեդլեր
    const handleRegisterClick = () => {
        setIsActive(true);

    };

    // Մուտքի կոճակի հեդլեր
    const handleLoginClick = () => {
        setIsActive(false);

    };


    return (
        <div className="h-[100vh] flex justify-center items-center">
            <div className={`container ${isActive ? "active" : ""}`}>

                   <Login/>

                    <Register />

                    <div className="toggle-box">
                        <div className="toggle-panel toggle-left">
                            <h1>Hello, Welcome!</h1>
                            <p>Don't have an account?</p>
                            <button className="btn register-btn"
                                    onClick={() => {
                                        handleRegisterClick();
                                    }}
                            >Register
                            </button>
                        </div>

                        <div className="toggle-panel toggle-right">
                            <h1>Welcome Back!</h1>
                            <p>Already have an account?</p>
                            <button className="btn login-btn"
                                    onClick={() => {
                                        handleLoginClick()
                                    }}
                            >Login
                            </button>
                        </div>
                    </div>
                </div>

        </div>
    )
        ;
};

export default LogReg;