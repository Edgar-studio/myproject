import { useState, useEffect } from "react";

const FootballStats = () => {
    const [stats, setStats] = useState([]);

    useEffect(() => {
        // Simulating fetching data
        const fetchData = async () => {
            const fakeData = [
                { team: "Manchester United", gamesPlayed: 28, wins: 18, draws: 5, losses: 5 },
                { team: "Real Madrid", gamesPlayed: 27, wins: 20, draws: 4, losses: 3 },
                { team: "Bayern Munich", gamesPlayed: 26, wins: 22, draws: 2, losses: 2 },
            ];
            setStats(fakeData);
        };
        fetchData();
    }, []);

    return (
        <div className="w-full p-6 min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
            <h1 className="text-2xl font-bold mb-4">Football Statistics</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-800 shadow-md rounded">
                    <thead>
                    <tr className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white">
                        <th className="p-2">Team</th>
                        <th className="p-2">Games Played</th>
                        <th className="p-2">Wins</th>
                        <th className="p-2">Draws</th>
                        <th className="p-2">Losses</th>
                    </tr>
                    </thead>
                    <tbody>
                    {stats.map((team, index) => (
                        <tr key={index} className="border-t border-gray-300 dark:border-gray-600">
                            <td className="p-2">{team.team}</td>
                            <td className="p-2">{team.gamesPlayed}</td>
                            <td className="p-2">{team.wins}</td>
                            <td className="p-2">{team.draws}</td>
                            <td className="p-2">{team.losses}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FootballStats;