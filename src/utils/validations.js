let emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
let passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
let usernameRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{1,}$/;

export const userValidation = {
    pattern: {
        value: usernameRegex,
        message: "Username must contain at least one letter and one number"
    },
    required: {
        value: true,
        message: "Username is required"
    }
};

export const emailValidation = {
    pattern: {
        value: emailRegex,
        message: "Invalid email format"
    },
    required: {
        value: true,
        message: "Email is required"
    }
};

export const passwordValidation = {
    pattern: {
        value: passwordRegex,
        message: "Password must include at least one number and one special character"
    },
    required: {
        value: true,
        message: "Password is required"
    },
    minLength: {
        value: 8,
        message: "Min 8 symbols"
    },
    maxLength: {
        value: 16,
        message: "Max 16 symbols"
    }
};
