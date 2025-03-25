import {useNavigate, useParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import { FaSpinner } from 'react-icons/fa';
import {useEffect} from "react";
import {fetchFootballData} from "../../../redux/slices/footballSlice.js";
import {IoArrowBackCircle} from "react-icons/io5";

const FootballTeamDetails = () => {
    const { teamId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { teams, loading, error } = useSelector((state) => state.football);

    useEffect(() => {
        dispatch(fetchFootballData());
        console.log(teams)
    }, [dispatch]);

    const team = teams.find(t => t.id === teamId);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <FaSpinner className="animate-spin text-3xl text-gray-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full p-4 text-center text-red-500">
                <p>{error}</p>
            </div>
        );
    }

    if (!team) {
        return (
            <div className="text-center text-gray-500 h-screen flex items-center justify-center">
                Team not found
            </div>
        );
    }

    return (
        <div className="w-full p-6  min-h-screen flex justify-center ">
            <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl dark:bg-green-300 text-black ">
                <IoArrowBackCircle
                    className='absolute cursor-pointer text-5xl text-[#364153]'
                    onClick={()=>{
                        navigate(-1)
                    }}
                />

                <div className="flex flex-col items-center mb-6">
                    <img
                        src={team.image}
                        alt={team.name}
                        className="w-48 h-48 object-contain rounded-full border-4 border-blue-500 mb-4"
                    />
                    <h1 className="text-3xl font-bold text-blue-700">{team.name}</h1>
                    <p className="text-gray-600 text-xl">{team.league}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h2 className="text-xl font-semibold mb-3 text-blue-600">Team Information</h2>
                        <p><strong>Coach:</strong> {team.coach}</p>
                        <p><strong>Established:</strong> {team.established || 'N/A'}</p>
                        <p><strong>Home Stadium:</strong> {team.stadium || 'N/A'}</p>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-3 text-blue-600">Players</h2>
                        <ul className="list-disc list-inside">
                            {team.players.map((player, index) => (
                                <li key={index}>{player}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-3 text-blue-600">Next Match</h2>
                    <p><strong>Match Time:</strong> {team.matchTime}</p>
                </div>
            </div>
        </div>
    );
};

export default FootballTeamDetails;