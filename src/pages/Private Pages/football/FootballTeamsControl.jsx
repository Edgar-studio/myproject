import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const FootballTeamsControl = () => {
    const [teams, setTeams] = useState([]);
    const [addTeam, setAddTeam] = useState('Add Team');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editTeamId, setEditTeamId] = useState(null);
    const [newTeam, setNewTeam] = useState({
        name: "",
        league: "",
        image: "",
    });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axios.get("http://localhost:4000/football-data");
                setTeams(response.data);
            } catch (error) {
                setError("Failed to fetch teams." + error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeams();
    }, []);

    const handleAddTeam = async () => {
        if (!newTeam.name || !newTeam.league || !newTeam.image) {
            alert("Please fill in all fields");
            return;
        }

        try {
            const response = await axios.post("http://localhost:4000/football-data", newTeam);
            setTeams([...teams, response.data]);
            setNewTeam({name: "", league: "", image: ""});
        } catch (error) {
            alert("Failed to add team" + error);
        }
    };

    const handleDeleteTeam = async (id) => {
        try {
            await axios.delete(`http://localhost:4000/football-data/${id}`);
            setTeams(teams.filter((team) => team.id !== id));
        } catch (error) {
            alert("Failed to delete team" + error);
        }
    };

    const handleSaveTeams = async (editTeamId) => {
        try {
            await axios.put(`http://localhost:4000/football-data/${editTeamId}`, newTeam);
        } catch (error) {
            setError("Failed to update team info" + error);
        }
    };

    const handleViewTeam = (id) => {
        navigate(`/footballdata/${id}`);
    };

    const handleEditTeam = (team) => {
        setAddTeam("Save")
        setNewTeam(team);
    };

    if (loading) return <p className="text-center text-xl dark:text-white">Loading teams...</p>;
    if (error) return <p className="text-center text-red-500 dark:text-red-400">{error}</p>;

    return (
        <div className="max-w-6xl mx-auto p-8 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-lg">
            <h2 className="text-4xl font-semibold text-center mb-8 text-blue-600 dark:text-blue-400">
                Football Teams
            </h2>

            <div className="mb-8 p-6 bg-white dark:bg-gray-700 rounded-xl shadow-md">
                <h3 className="text-2xl font-semibold text-center mb-6 text-gray-800 dark:text-white">
                    Add New Team
                </h3>
                <div className="flex flex-col md:flex-row gap-4">
                    <input
                        type="text"
                        className="border border-gray-300 p-3 rounded-md w-full md:w-1/3 text-lg bg-white dark:bg-gray-600 text-gray-800 dark:text-white"
                        placeholder="Team Name"
                        value={newTeam.name}
                        onChange={(e) => setNewTeam({...newTeam, name: e.target.value})}
                    />
                    <input
                        type="text"
                        className="border border-gray-300 p-3 rounded-md w-full md:w-1/3 text-lg bg-white dark:bg-gray-600 text-gray-800 dark:text-white"
                        placeholder="League"
                        value={newTeam.league}
                        onChange={(e) => setNewTeam({...newTeam, league: e.target.value})}
                    />
                    <input
                        type="text"
                        className="border border-gray-300 p-3 rounded-md w-full md:w-1/3 text-lg bg-white dark:bg-gray-600 text-gray-800 dark:text-white"
                        placeholder="Logo URL"
                        value={newTeam.image}
                        onChange={(e) => setNewTeam({...newTeam, image: e.target.value})}
                    />
                </div>
                <button
                    className="mt-6 py-3 px-6 bg-green-600 text-white font-semibold rounded-lg w-full md:w-1/3 mx-auto hover:bg-green-700 transition-all duration-300"
                    onClick={() => {
                        if (addTeam === "Add Team") {
                            handleAddTeam();
                        } else if (addTeam === "Save") {
                            handleSaveTeams(editTeamId);
                        }
                    }}
                >
                    {addTeam}
                </button>
            </div>

            {/* Teams List Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-700 rounded-lg shadow-md">
                    <thead className="bg-gradient-to-r from-blue-500 to-red-500 text-white">
                    <tr>
                        <th className="py-4 px-6">Logo</th>
                        <th className="py-4 px-6">Team Name</th>
                        <th className="py-4 px-6">League</th>
                        <th className="py-4 px-6">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {teams.map((team) => (
                        <tr
                            key={team.id}
                            className="border-b hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 text-black dark:text-white"
                        >
                            <td className="py-3 px-6">
                                <img
                                    src={team.image}
                                    alt={team.name}
                                    className="h-16 w-16 rounded-full mx-auto shadow-sm"
                                />
                            </td>
                            <td className="py-3 px-6 font-semibold">{team.name}</td>
                            <td className="py-3 px-6">{team.league}</td>
                            <td className="py-3 px-6 flex justify-center gap-4">
                                <button
                                    className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition-all duration-300"
                                    onClick={() => handleViewTeam(team.id)}
                                >
                                    View
                                </button>
                                <button
                                    className="bg-yellow-500 text-white px-5 py-2 rounded-lg hover:bg-yellow-600 transition-all duration-300"
                                    onClick={() => {
                                        setEditTeamId(team.id);
                                        console.log(editTeamId)
                                        handleEditTeam(team)
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition-all duration-300"
                                    onClick={() => handleDeleteTeam(team.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FootballTeamsControl;