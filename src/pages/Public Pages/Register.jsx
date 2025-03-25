import Input from "../../components/UI/Input.jsx";
import { emailValidation, passwordValidation, userValidation } from "../../utils/validations.js";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "axios";
import { notify } from "../../utils/notify.js";
import { HOME_PAGE } from "../../utils/routes.jsx";
import { useDispatch } from "react-redux";
import { registerUser } from "../../redux/slices/registerSlice.js";
import { loginUser } from "../../redux/slices/loginSlice.js";

const Register = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    // const users = useSelector((state) => state.register.users);

    const { register, handleSubmit, formState: { errors, isValid } } = useForm({ mode: "onBlur" });

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

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

    const user_register = async (data) => {
        const { username, email, password } = data;

        try {

            const response = await axios.get("http://localhost:4000/users");
            const myOldData = response.data;
            const existingUser = myOldData.find(
                user => user.username === username || user.email === email
            );

            if (existingUser) {
                console.log(existingUser);
                notify("User already exists!", "red");
                return;
            }

            const newUser = { username, email, password };


            await axios.post("http://localhost:4000/users", newUser);


            dispatch(registerUser(newUser));
            dispatch(loginUser(newUser));

            notify("Registration successful!", "green");


            setTimeout(() => {
                navigate(HOME_PAGE);
            }, 1000);
        } catch (err) {
            if (err.response) {

                notify(`Registration failed: ${err.response.data.message}`, "red");
            } else if (err.request) {

                notify("Network error. Please try again.", "red");
            } else {

                notify("Unexpected error occurred. Please try again.", "red");
            }
            console.error("Registration failed:", err);
        }
    };

    return (
        <div className="form-box register">
            <form onSubmit={handleSubmit(user_register)}>
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
                    <i className="bx bxs-user"></i>
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
                    <i className="bx bxs-envelope"></i>
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
                    <i className="bx bxs-lock-alt"></i>
                </div>

                <button type="submit" className="btn" disabled={!isValid}>
                    Register
                </button>
                <p>or register with social platforms</p>
                <div className="social-icons">
                    <a href="#"><i className="bx bxl-google"></i></a>
                    <a href="#"><i className="bx bxl-facebook"></i></a>
                    <a href="#"><i className="bx bxl-github"></i></a>
                    <a href="#"><i className="bx bxl-linkedin"></i></a>
                </div>
            </form>
        </div>
    );
};

export default Register;
