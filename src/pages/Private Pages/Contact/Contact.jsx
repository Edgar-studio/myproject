import { useState, useRef } from "react";
import emailjs from '@emailjs/browser';
import {notify} from "../../../utils/notify.js";

const Contact = () => {
    const TO_EMAIL = 'edgaravakimyan7@gmail.com'
    const form = useRef();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(false);



    const handleSubmit = (e) => {
        e.preventDefault();
        // let random = Math.floor(Math.random() * 10000);
        const userEmail = form.current.querySelector('input[name="user_email"]').value;
        const userName = form.current.querySelector('input[name="user_name"]').value;
        const userMessage = form.current.querySelector('textarea[name="message"]').value;

        if (!userName || !userEmail || !userMessage) {
            notify('Please fill in all required fields');
            return;
        }

        const serviceId = 'service_ecuvu9j';
        const templateId = 'template_8y054d2';
        const publicKey = '9KuZEP-lD9TJTaM0G';

        const templateParams = {
            user: userEmail,
            name: userName,
            to: TO_EMAIL,
            email: userEmail,
            message: userMessage,
            // random: random,
        };
        console.log(templateParams)
        setLoading(true);

        emailjs.send(serviceId, templateId, templateParams, publicKey)
            .then(() => {
                notify('Message sent successfully!', 'green');
                form.current.reset();
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                console.error('EmailJS error:', error);
                notify(`Failed to send message: ${error.text || error.message}`, 'red');
            });
    };
    return (
        <div className="flex justify-center items-center min-h-[80vh] p-8 bg-gray-100 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-2xl w-full">
                <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
                    Contact Us
                </h1>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                    If you have any questions, concerns, or feedback, feel free to reach out to us. Were here to help!
                </p>
                <form ref={form} onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-lg text-gray-700 dark:text-gray-300 mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="user_name"
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
                            name="user_email"
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
                            name="message"
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

            </div>
        </div>
    );
};

export default Contact;
