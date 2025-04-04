import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/slices/loginSlice.js";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Input from "../../components/UI/Input.jsx";
import { emailValidation, passwordValidation } from "../../utils/validations.js";
import axios from "axios";
import emailjs from '@emailjs/browser';
import {notify} from "../../utils/notify.js";

const Login = () => {
    const dispatch = useDispatch();
    const { loading, error } = useSelector(state => state.login);

    const { register, handleSubmit, trigger, setValue, formState: { errors, isValid } } = useForm({ mode: 'onBlur' });
    const { register: register2FA, handleSubmit: handleSubmit2FA, formState: { errors: errors2FA } } = useForm({ mode: 'onBlur' });
    const { register: registerForgot, handleSubmit: handleSubmitForgot, formState: { errors: errorsForgot } } = useForm({ mode: 'onBlur' });

    const [rememberMe, setRememberMe] = useState(false);
    const [eye, setEye] = useState(false);
    const [eyeNew, setEyeNew] = useState(false);
    const [eyeConfirm, setEyeConfirm] = useState(false);
    const [inputType, setInputType] = useState('password');
    const [inputTypeNew, setInputTypeNew] = useState('password');
    const [inputTypeConfirm, setInputTypeConfirm] = useState('password');
    const [showVerification, setShowVerification] = useState(false);
    const [verificationSent, setVerificationSent] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [currentUserData, setCurrentUserData] = useState(null);
    const [verificationError, setVerificationError] = useState("");
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotPasswordStep, setForgotPasswordStep] = useState('email'); // email, verification, newPassword
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
    const [forgotPasswordError, setForgotPasswordError] = useState("");
    const [resetCodeSent, setResetCodeSent] = useState(false);
    const [resetCode, setResetCode] = useState("");
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isResettingPassword, setIsResettingPassword] = useState(false);

    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem('rememberMe'));
        if (savedUser) {
            setValue("email", savedUser.email);
            setValue("password", savedUser.password);
            setRememberMe(true);

            trigger(["email", "password"]);
        }
    }, [setValue, trigger]);

    const showPassword = () => {
        setEye(!eye);
        setInputType(prev => prev === 'password' ? 'text' : 'password');
    };

    const showNewPassword = () => {
        setEyeNew(!eyeNew);
        setInputTypeNew(prev => prev === 'password' ? 'text' : 'password');
    };

    const showConfirmPassword = () => {
        setEyeConfirm(!eyeConfirm);
        setInputTypeConfirm(prev => prev === 'password' ? 'text' : 'password');
    };

    const generateVerificationCode = () => {
        // Generate a 6 digit code
        return Math.floor(100000 + Math.random() * 900000).toString();
    };

    const sendVerificationEmail = async (email, code) => {
        try {
            const templateParams = {
                to: email,
                code: code,
            };

            await emailjs.send(
                'service_agqd4hh',
                'template_kwwvcen',
                templateParams,
                '9KuZEP-lD9TJTaM0G'
            );

            setVerificationSent(true);
        } catch (error) {
            console.error("Failed to send verification email:", error);
            setVerificationError("Failed to send verification code. Please try again.");
        }
    };

    const sendPasswordResetEmail = async (email, code) => {
        setResetCodeSent(false);
        try {
            const templateParams = {
                to: email,
                code: code,
                subject: "Password Reset Request"
            };

            await emailjs.send(
                'service_agqd4hh',
                'template_kwwvcen',
                templateParams,
                '9KuZEP-lD9TJTaM0G'
            );

            setResetCodeSent(true);
        } catch (error) {
            console.error("Failed to send password reset email:", error);
            setForgotPasswordError("Failed to send reset code. Please try again.");
        }
    };

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const onSubmit = async (data) => {
        setIsLoggingIn(true);
        try {
            const allUsers = await axios.get(`http://localhost:4000/users/`);
            const user = allUsers.data.find(
                user => user.email === data.email && user.password === data.password
            );

            // Add a deliberate delay of 1.5 seconds
            await delay(1500);

            if (!user) {
                setIsLoggingIn(false);
                return dispatch(loginUser({
                    email: data.email,
                    password: data.password,
                    rememberMe,
                    error: "Invalid email or password"
                }));
            }

            if (user.verification) {
                setCurrentUserData({ ...data, user });
                const code = generateVerificationCode();
                setVerificationCode(code);
                setShowVerification(true);

                await sendVerificationEmail(data.email, code);
            } else {
                dispatch(loginUser({
                    email: data.email,
                    password: data.password,
                    rememberMe,
                    userId: user.id,
                    username: user.username
                }));
            }
        } catch (error) {
            console.error("Login error:", error);
            dispatch(loginUser({
                email: data.email,
                password: data.password,
                rememberMe,
                error: "An error occurred. Please try again."
            }));
        } finally {
            setIsLoggingIn(false);
        }
    };

    const verifyCode = async (data) => {
        setIsLoggingIn(true);
        try {
            await delay(1500);

            if (data.verificationCode === verificationCode) {

                dispatch(loginUser({
                    email: currentUserData.email,
                    password: currentUserData.password,
                    rememberMe,
                    userId: currentUserData.user.id,
                    username: currentUserData.user.username
                }));
                setShowVerification(false);
            } else {

                setVerificationError("Invalid verification code. Please try again.");
            }
        } finally {
            setIsLoggingIn(false);
        }
    };

    const resendCode = async () => {
        if (!currentUserData || !currentUserData.email) return;

        setIsLoggingIn(true);
        try {
            const newCode = generateVerificationCode();
            setVerificationCode(newCode);
            setVerificationError("");

            await delay(1500);
            await sendVerificationEmail(currentUserData.email, newCode);
        } finally {
            setIsLoggingIn(false);
        }
    };

    const handleForgotPasswordClick = () => {
        setShowForgotPassword(true);
        setForgotPasswordStep('email');
        setForgotPasswordError("");
        setResetCodeSent(false);
    };

    const submitForgotPasswordEmail = async (data) => {
        setIsResettingPassword(true);
        try {
            const allUsers = await axios.get(`http://localhost:4000/users/`);
            const user = allUsers.data.find(user => user.email === data.forgotEmail);


            await delay(1500);

            if (!user) {
                setForgotPasswordError("No account found with this email address.");
                setIsResettingPassword(false);
                return;
            }

            const code = generateVerificationCode();
            setResetCode(code);
            setForgotPasswordEmail(data.forgotEmail);

            await sendPasswordResetEmail(data.forgotEmail, code);
            setForgotPasswordStep('verification');
        } catch (error) {
            console.error("Error during password reset request:", error);
            setForgotPasswordError("An error occurred. Please try again.");
        } finally {
            setIsResettingPassword(false);
        }
    };

    const verifyResetCode = async (data) => {
        setIsResettingPassword(true);
        try {

            await delay(1500);

            if (data.resetCode === resetCode) {
                setForgotPasswordStep('newPassword');
                setForgotPasswordError("");
            } else {
                setForgotPasswordError("Invalid verification code. Please try again.");
            }
        } finally {
            setIsResettingPassword(false);
        }
    };

    const resendResetCode = async () => {
        setIsResettingPassword(true);
        if (!forgotPasswordEmail) {
            setIsResettingPassword(false);
            return;
        }

        try {
            const newCode = generateVerificationCode();
            setResetCode(newCode);
            setForgotPasswordError("");


            await delay(1500);
            await sendPasswordResetEmail(forgotPasswordEmail, newCode);
        } finally {
            setIsResettingPassword(false);
        }
    };

    const saveNewPassword = async (data) => {
        setIsResettingPassword(true);
        try {
            if (data.newPassword !== data.confirmPassword) {
                setForgotPasswordError("Passwords do not match. Please try again.");
                setIsResettingPassword(false);
                return;
            }

            const allUsers = await axios.get(`http://localhost:4000/users/`);
            const user = allUsers.data.find(user => user.email === forgotPasswordEmail);

            // Add delay to show loading
            await delay(1500);

            if (!user) {
                setForgotPasswordError("User not found. Please try again.");
                setIsResettingPassword(false);
                return;
            }


            await axios.patch(`http://localhost:4000/users/${user.id}`, {
                password: data.newPassword
            });

            setShowForgotPassword(false);
            setForgotPasswordStep('email');
            setForgotPasswordError("");
            notify("Password has been successfully reset. You can now login with your new password.", "green");

        } catch (error) {
            console.error("Error resetting password:", error);
            setForgotPasswordError("Failed to reset password. Please try again.");
        } finally {
            setIsResettingPassword(false);
        }
    };

    return (
        <div className="form-box login">
            {showForgotPassword ? (
                <div className="forgot-password-modal">
                    <h2 className="text-xl font-bold mb-4">Reset Your Password</h2>

                    {forgotPasswordStep === 'email' && (
                        <form onSubmit={handleSubmitForgot(submitForgotPasswordEmail)}>
                            <div className="input-box">
                                <Input
                                    name="forgotEmail"
                                    register={registerForgot}
                                    type="email"
                                    placeholder="Enter your email"
                                    validation={emailValidation}
                                    error={errorsForgot.forgotEmail && errorsForgot.forgotEmail.message}
                                />
                            </div>
                            {forgotPasswordError && <p className="text-red-500 mb-4">{forgotPasswordError}</p>}
                            <div className="flex flex-col space-y-2">
                                <button type="submit" className="btn" disabled={isResettingPassword}>
                                    {isResettingPassword ? (
                                        <div className="flex justify-center items-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                                            <span>Sending code...</span>
                                        </div>
                                    ) : (
                                        "Send Reset Code"
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForgotPassword(false)}
                                    className="text-gray-500 hover:underline"
                                    disabled={isResettingPassword}
                                >
                                    Back to Login
                                </button>
                            </div>
                        </form>
                    )}

                    {forgotPasswordStep === 'verification' && (
                        <form onSubmit={handleSubmitForgot(verifyResetCode)}>
                            <p className="mb-4">Please enter the verification code sent to your email address.</p>
                            <div className="input-box">
                                <Input
                                    name="resetCode"
                                    register={registerForgot}
                                    type="text"
                                    placeholder="Enter verification code"
                                    validation={{ required: "Verification code is required" }}
                                    error={errorsForgot.resetCode && errorsForgot.resetCode.message}
                                />
                            </div>
                            {forgotPasswordError && <p className="text-red-500 mb-4">{forgotPasswordError}</p>}
                            <div className="flex flex-col space-y-2">
                                <button type="submit" className="btn" disabled={isResettingPassword}>
                                    {isResettingPassword ? (
                                        <div className="flex justify-center items-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                                            <span>Verifying...</span>
                                        </div>
                                    ) : (
                                        "Verify Code"
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={resendResetCode}
                                    className="text-blue-500 hover:underline"
                                    disabled={isResettingPassword}
                                >
                                    {isResettingPassword ? (
                                        <div className="flex justify-center items-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mr-2"></div>
                                            <span>Resending...</span>
                                        </div>
                                    ) : (
                                        "Resend Code"
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setForgotPasswordStep('email')}
                                    className="text-gray-500 hover:underline"
                                    disabled={isResettingPassword}
                                >
                                    Back
                                </button>
                            </div>
                        </form>
                    )}

                    {forgotPasswordStep === 'newPassword' && (
                        <form onSubmit={handleSubmitForgot(saveNewPassword)}>
                            <div className="input-box">
                                <div className='p-2 flex relative'>
                                    <Input
                                        name="newPassword"
                                        register={registerForgot}
                                        type={inputTypeNew}
                                        placeholder="New Password"
                                        validation={passwordValidation}
                                        error={errorsForgot.newPassword && errorsForgot.newPassword.message}
                                    />
                                    <span className="absolute flex justify-around items-center top-3 right-4 cursor-pointer"
                                          onClick={showNewPassword}>
                                        {eyeNew ? <FaEyeSlash size={25} /> : <FaEye size={25} />}
                                    </span>
                                </div>
                            </div>
                            <div className="input-box">
                                <div className='p-2 flex relative'>
                                    <Input
                                        name="confirmPassword"
                                        register={registerForgot}
                                        type={inputTypeConfirm}
                                        placeholder="Confirm New Password"
                                        validation={passwordValidation}
                                        error={errorsForgot.confirmPassword && errorsForgot.confirmPassword.message}
                                    />
                                    <span className="absolute flex justify-around items-center top-3 right-4 cursor-pointer"
                                          onClick={showConfirmPassword}>
                                        {eyeConfirm ? <FaEyeSlash size={25} /> : <FaEye size={25} />}
                                    </span>
                                </div>
                            </div>
                            {forgotPasswordError && <p className="text-red-500 mb-4">{forgotPasswordError}</p>}
                            <div className="flex flex-col space-y-2">
                                <button type="submit" className="btn" disabled={isResettingPassword}>
                                    {isResettingPassword ? (
                                        <div className="flex justify-center items-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                                            <span>Saving...</span>
                                        </div>
                                    ) : (
                                        "Save New Password"
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setForgotPasswordStep('verification')}
                                    className="text-gray-500 hover:underline"
                                    disabled={isResettingPassword}
                                >
                                    Back
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            ) : !showVerification ? (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <h1>Login</h1>
                    <div className="input-box">
                        <Input
                            name="email"
                            register={register}
                            type="email"
                            placeholder="Email"
                            validation={emailValidation}
                            error={errors.email && errors.email.message}
                        />
                    </div>
                    <div className="input-box">
                        <div className='p-2 flex relative'>
                            <Input
                                name="password"
                                register={register}
                                type={inputType}
                                placeholder="Password"
                                validation={passwordValidation}
                                error={errors.password && errors.password.message}
                            />
                            <span className="absolute flex justify-around items-center top-3 right-4 cursor-pointer"
                                  onClick={showPassword}>
                                {eye ? <FaEyeSlash size={25} /> : <FaEye size={25} />}
                            </span>
                        </div>
                    </div>
                    <div className="forgot-link">
                        <a href="#" onClick={handleForgotPasswordClick}>Forgot Password?</a>
                    </div>
                    <label className="flex items-center text-gray-600">
                        <input type="checkbox" className="mr-2 accent-blue-500"
                               checked={rememberMe}
                               onChange={e => setRememberMe(e.target.checked)}
                        />
                        Remember me
                    </label>
                    <button type="submit" className="btn" disabled={!isValid || isLoggingIn}>
                        {isLoggingIn ? (
                            <div className="flex justify-center items-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                                <span>Logging in...</span>
                            </div>
                        ) : (
                            "Login"
                        )}
                    </button>
                    {error && <p className="text-red-500">{error}</p>}
                </form>
            ) : (
                <div className="verification-modal">
                    <h2 className="text-xl font-bold mb-4">Two-Step Verification</h2>
                    <p className="mb-4">Please enter the verification code sent to your email address.</p>

                    {verificationSent ? (
                        <form onSubmit={handleSubmit2FA(verifyCode)}>
                            <div className="input-box">
                                <Input
                                    name="verificationCode"
                                    register={register2FA}
                                    type="text"
                                    placeholder="Enter verification code"
                                    validation={{ required: "Verification code is required" }}
                                    error={errors2FA.verificationCode && errors2FA.verificationCode.message}
                                />
                            </div>
                            {verificationError && <p className="text-red-500 mb-4">{verificationError}</p>}
                            <div className="flex flex-col space-y-2">
                                <button type="submit" className="btn" disabled={isLoggingIn}>
                                    {isLoggingIn ? (
                                        <div className="flex justify-center items-center">
                                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                                            <span>Verifying...</span>
                                        </div>
                                    ) : (
                                        "Verify"
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={resendCode}
                                    className="text-blue-500 hover:underline"
                                    disabled={isLoggingIn}
                                >
                                    {isLoggingIn ? (
                                        <div className="flex justify-center items-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mr-2"></div>
                                            <span>Resending...</span>
                                        </div>
                                    ) : (
                                        "Resend Code"
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowVerification(false)}
                                    className="text-gray-500 hover:underline"
                                    disabled={isLoggingIn}
                                >
                                    Back to Login
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="flex justify-center items-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                            <p className="ml-2">Sending verification code...</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Login;