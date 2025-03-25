import React, { useState, useRef } from "react";
import emailjs from '@emailjs/browser';

const Contact = () => {
    const form = useRef();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name && email && message) {
            setLoading(true);

            // EmailJS configuration
            // Replace "YOUR_PUBLIC_KEY" with your actual EmailJS public key
            emailjs.sendForm('service_ecuvu9j', 'template_8y054d2', form.current, '9KuZEP-lD9TJTaM0G')
                .then((result) => {
                    setStatus("Thank you for reaching out! We will get back to you soon.");
                    setName("");
                    setEmail("");
                    setMessage("");
                    setLoading(false);
                    console.log('Email successfully sent!', result.text);
                }, (error) => {
                    setStatus("Failed to send message. Please try again later.");
                    setLoading(false);
                    console.log('Failed to send email:', error.text);
                });
        } else {
            setStatus("Please fill out all fields.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh] p-8 bg-gray-100 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-2xl w-full">
                <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
                    Contact Us
                </h1>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                    If you have any questions, concerns, or feedback, feel free to reach out to us. We're here to help!
                </p>
                <form ref={form} onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-lg text-gray-700 dark:text-gray-300 mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="user_name" // Important for EmailJS
                            className="w-full p-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg shadow-sm"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-lg text-gray-700 dark:text-gray-300 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="user_email" // Important for EmailJS
                            className="w-full p-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg shadow-sm"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="message" className="block text-lg text-gray-700 dark:text-gray-300 mb-2">
                            Message
                        </label>
                        <textarea
                            id="message"
                            name="message" // Important for EmailJS
                            className="w-full p-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg shadow-sm"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 ${loading ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-600'} text-white font-semibold rounded-lg shadow-md cursor-pointer`}
                    >
                        {loading ? "Sending..." : "Send Message"}
                    </button>
                </form>
                {status && (
                    <div
                        className={`mt-4 p-3 rounded-lg text-center ${
                            status.includes("Thank you") ? "bg-green-800 text-white" : "bg-red-200 text-red-800"
                        }`}
                    >
                        {status}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Contact;