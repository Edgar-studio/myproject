import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFootballData } from "../../../redux/slices/footballSlice.js";
import { FaSpinner, FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const FootballData = () => {
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [timer, setTimer] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = useRef(null);
    const dispatch = useDispatch();
    const { teams, loading, error } = useSelector((state) => state.football);

    useEffect(() => {
        dispatch(fetchFootballData());
    }, [dispatch]);

    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
        setTimeout(()=>{
            setTimer(!timer);
        }, 200)
    }, [isSearchOpen]);

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
        if (!isSearchOpen) {
            setTimeout(() => {
                if (searchInputRef.current) {
                    searchInputRef.current.focus();
                }
            }, 300);
        } else {
            setSearchQuery('');
        }
    };

    const filteredTeams = searchQuery.trim()
        ? teams.filter(team =>
            team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            team.league.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : teams;

    return (
        <div className="w-full p-6 min-h-screen">
            <div className="relative flex justify-center items-center mb-6 min-h-[50px]">
                {!isSearchOpen && (
                      <div className="flex items-center justify-center">
                          {timer &&    <div className="flex items-center justify-center">
                              <h1 className="text-3xl font-bold text-center text-blue-700">Football Teams</h1>
                              <button
                              onClick={toggleSearch}
                          className="ml-2 p-2 text-blue-700 hover:text-blue-900 focus:outline-none"
                          aria-label="Search teams"
                      >
                          <FaSearch />
                      </button>
                          </div>
                          }
                    </div>
                )}

                <div
                    className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ease-in-out ${
                        isSearchOpen
                            ? 'opacity-100 w-full transform translate-x-0'
                            : 'opacity-0 w-0 transform -translate-x-full'
                    }`}
                >
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search teams..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full max-w-md px-4 py-2 text-lg border border-blue-300 rounded-l-2xl
                         focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md shadow-blue-500"
                    />
                    <button
                        onClick={toggleSearch}
                        className="bg-blue-700 text-white h-full px-4 py-2 rounded-r-2xl hover:bg-blue-800
                         focus:outline-none"
                    >
                        Close
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center">
                    <FaSpinner className="animate-spin text-3xl text-gray-500" />
                </div>
            ) : error ? (
                <div className="w-full p-4 text-center text-red-500">
                    <p>{error}</p>
                </div>
            ) : filteredTeams.length === 0 ? (
                <p className="text-center text-gray-500">
                    {searchQuery ? "No teams match your search." : "No data available."}
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTeams.map((team) => (
                        <Link
                            to={`/footballdata/${team.id}`}
                            key={team.id}
                            className="relative bg-white shadow-lg rounded-lg p-4 cursor-pointer hover:shadow-xl transition-all border border-gray-300"
                        >
                            <div className="h-24 bg-gradient-to-r from-red-500 to-blue-500 rounded-t-lg"></div>
                            <div className="relative -mt-12 flex flex-col items-center">
                                <img src={team.image} alt={team.name}
                                     className="w-24 h-24 object-contain rounded-full border-4 border-white" />
                                <h2 className="text-xl font-semibold mt-4 text-center">{team.name}</h2>
                                <p className="text-gray-600 text-center">{team.league}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {selectedTeam && (
                <div className="fixed inset-0 flex justify-center items-center z-50">
                    <div
                        onClick={() => {setSelectedTeam(null)}}
                        className="absolute inset-0 bg-opacity-30 backdrop-blur-sm">
                    </div>
                    <div className="relative bg-white p-6 rounded-lg shadow-lg w-96 z-10">
                        <h2 className="text-2xl font-semibold mb-4 text-center">{selectedTeam.name}</h2>

                        <img src={selectedTeam.image} alt={selectedTeam.name}
                             className="w-32 h-32 object-contain rounded-full border-4 border-white mb-4" />
                        <p><strong>League:</strong> {selectedTeam.league}</p>
                        <p><strong>Coach:</strong> {selectedTeam.coach}</p>
                        <p><strong>Players:</strong> {selectedTeam.players.join(", ")}</p>
                        <p><strong>Match Time:</strong> {selectedTeam.matchTime}</p>
                        <button
                            onClick={() => setSelectedTeam(null)}
                            className="bg-red-500 text-white p-3 rounded-md shadow-lg hover:bg-red-600 hover:shadow-xl transition-colors duration-200 cursor-pointer w-full mt-4"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FootballData;