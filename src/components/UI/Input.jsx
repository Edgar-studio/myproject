import React from "react";

const Input = ({ name, register, validation, error, label, className, ...props }) => {
    return (
        <div className="mb-4">
            {label && (
                <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <input
                id={name}
                {...props}
                {...register(name, validation)}
                className={`border-2 border-gray-300 w-64 rounded-xl h-9 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
            />
            {error && <p className="text-red-500 text-sm">{error.message || error}</p>}
        </div>
    );
};

export default Input;