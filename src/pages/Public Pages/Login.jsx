import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/slices/loginSlice.js";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Input from "../../components/UI/Input.jsx";
import { emailValidation, passwordValidation } from "../../utils/validations.js";

const Login = () => {
    const dispatch = useDispatch();
    const { loading, error } = useSelector(state => state.login);

    const { register, handleSubmit, trigger, setValue, formState: { errors, isValid } } = useForm({ mode: 'onBlur' });

    const [rememberMe, setRememberMe] = useState(false);
    const [eye, setEye] = useState(false);
    const [inputType, setInputType] = useState('password');

    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem('rememberMe'));
        if (savedUser) {
            setValue("email", savedUser.email);
            setValue("password", savedUser.password);
            setRememberMe(true);

            // Trigger validation after setting default values
            trigger(["email", "password"]);
        }
    }, [setValue, trigger]);

    const showPassword = () => {
        setEye(!eye);
        setInputType(prev => prev === 'password' ? 'text' : 'password');
    };

    const onSubmit = (data) => {
        dispatch(loginUser({ email: data.email, password: data.password, rememberMe }));
    };

    return (
        <div className="form-box login">
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
                    <a href="#">Forgot Password?</a>
                </div>
                <label className="flex items-center text-gray-600">
                    <input type="checkbox" className="mr-2 accent-blue-500"
                           checked={rememberMe}
                           onChange={e => setRememberMe(e.target.checked)}
                    />
                    Remember me
                </label>
                <button type="submit" className="btn" disabled={!isValid || loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
                {error && <p className="text-red-500">{error}</p>}
            </form>
        </div>
    );
};

export default Login;