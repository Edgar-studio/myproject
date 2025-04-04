import Input from "../../components/UI/Input.jsx";
import { emailValidation, passwordValidation, userValidation } from "../../utils/validations.js";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { notify } from "../../utils/notify.js";
import { HOME_PAGE } from "../../utils/routes.jsx";
import { useDispatch } from "react-redux";
import { registerUser } from "../../redux/slices/registerSlice.js";
import { loginUser } from "../../redux/slices/loginSlice.js";
import emailjs from "@emailjs/browser";

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const { register, handleSubmit,
        formState: { errors, isValid } } = useForm({ mode: "all" });
    const [verificationCode, setVerificationCode] = useState("");
    const [generatedCode, setGeneratedCode] = useState(null);
    const [pendingUser, setPendingUser] = useState(null);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const emailFormRef = useRef();

    useEffect(() => {
        try {
            const savedUser = JSON.parse(localStorage.getItem("rememberMe"));
            if (savedUser) {
                setUsername(savedUser.username);
                setEmail(savedUser.email);
                setPassword(savedUser.password);
            }
        } catch (error) {
            console.error("Error loading saved user:", error);
        }
    }, []);

    const sendVerificationEmail = async (userData) => {
        setIsLoading(true);
        try {
            // Generate a 4-digit verification code
            const verificationCode = Math.floor(1000 + Math.random() * 9000);
            setGeneratedCode(verificationCode);

            const serviceId = 'service_agqd4hh';
            const templateId = 'template_8y054d2';
            const publicKey = '9KuZEP-lD9TJTaM0G';

            const templateParams = {
                name: userData.username,
                to: userData.email,
                random: verificationCode,
            };

            await emailjs.send(serviceId, templateId, templateParams, publicKey);
            notify('Verification code sent! Please check your email.', 'green');
            return true;
        } catch (error) {
            console.error('EmailJS error:', error);
            notify(`Failed to send verification code: ${error.text || error.message}`, 'red');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegistration = async (data) => {
        const { username, email, password } = data;
        setIsLoading(true);

        try {
            // Check if user already exists
            const response = await axios.get("http://localhost:4000/users");
            const existingUsers = response.data;
            const existingUser = existingUsers.find(
                user => user.username === username || user.email === email
            );

            if (existingUser) {
                notify("User already exists!", "red");
                return;
            }

            const newUser = { username, email, password };
            setPendingUser(newUser);

            const emailSent = await sendVerificationEmail(newUser);
            if (emailSent) {
                setShowVerificationModal(true);
            }
        } catch (err) {
            if (err.response) {
                notify(`Registration failed: ${err.response.data.message}`, "red");
            } else if (err.request) {
                notify("Network error. Please try again.", "red");
            } else {
                notify("Unexpected error occurred. Please try again.", "red");
            }
            console.error("Registration failed:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerificationSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (parseInt(verificationCode) === generatedCode) {
                const updatedUser = { ...pendingUser, verification: true };

                await axios.put(`http://localhost:4000/users/${pendingUser.email}`, updatedUser);

                dispatch(registerUser(updatedUser));
                dispatch(loginUser(updatedUser));

                notify("Registration successful!", "green");
                setShowVerificationModal(false);

                setTimeout(() => {
                    navigate(HOME_PAGE);
                }, 1500);
            } else {
                notify('Invalid verification code. Please try again.', 'red');
            }
        } catch (error) {
            notify('Error verifying your account. Please try again.', 'red');
            console.error("Verification error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="form-box register">
            {showVerificationModal ? (
                <div className="verification-modal">
                    <div className="verification-content">
                        <h2>Email Verification</h2>
                        <p>We have sent a verification code to {pendingUser?.email}.</p>
                        <form onSubmit={handleVerificationSubmit}>
                            <div className="input-box">
                                <input
                                    type="text"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    placeholder="Enter verification code"
                                    maxLength="4"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn"
                                disabled={isLoading}
                            >
                                {isLoading ? "Verifying..." : "Verify"}
                            </button>
                            <button
                                type="button"
                                className="btn secondary"
                                onClick={() => setShowVerificationModal(false)}
                            >
                                Cancel
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit(handleRegistration)}>
                    <h1>Registration</h1>
                    <div className="input-box">
                        <Input
                            name="username"
                            register={register}
                            type="text"
                            placeholder="Username"
                            defaultValue={username}
                            onChange={(e) => setUsername(e.target.value)}
                            validation={userValidation}
                            error={errors.username && errors.username.message}
                        />
                    </div>
                    <div className="input-box">
                        <Input
                            name="email"
                            register={register}
                            type="email"
                            placeholder="Email"
                            defaultValue={email}
                            onChange={(e) => setEmail(e.target.value)}
                            validation={emailValidation}
                            error={errors.email && errors.email.message}
                        />
                    </div>
                    <div className="input-box">
                        <Input
                            name="password"
                            register={register}
                            type="password"
                            placeholder="Password"
                            defaultValue={password}
                            onChange={(e) => setPassword(e.target.value)}
                            validation={passwordValidation}
                            error={errors.password && errors.password.message}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn"
                        disabled={!isValid || isLoading}
                    >
                        {isLoading ? "Processing..." : "Register"}
                    </button>
                    <p>or register with social platforms</p>
                    <div className="social-icons">
                        <a href="https://accounts.google.com" target="_blank" rel="noopener noreferrer">
                            <i className="bx bxl-google"></i>
                        </a>
                        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                            <i className="bx bxl-facebook"></i>
                        </a>
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                            <i className="bx bxl-github"></i>
                        </a>
                        <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                            <i className="bx bxl-linkedin"></i>
                        </a>
                    </div>

                </form>
            )}
        </div>
    );
};

export default Register;
