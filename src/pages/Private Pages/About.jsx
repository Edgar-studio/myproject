import React from 'react';

const About = () => {
    return (
        <div className="flex justify-center items-center min-h-[80vh] p-8 bg-gray-100 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-2xl w-full">
                <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
                    About This Application
                </h1>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                    Welcome to the Football Stats app! Our mission is to provide fans with a detailed and interactive platform
                    to explore various football-related data, including team statistics, player information, and match results.
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                    This platform was designed with both casual fans and football enthusiasts in mind, making it easy to
                    access important football data, track the latest stats, and get insights on teams and players.
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                    With features like team management, stats tracking, and personalized dashboards, we aim to make football
                    analysis accessible and enjoyable for all levels of fans.
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300">
                    Thank you for visiting! If you have any questions or feedback, feel free to contact us through the
                    support page. We are constantly working to improve the app and add new features, so stay tuned for updates!
                </p>
            </div>
        </div>
    );
};

export default About;
