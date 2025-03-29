import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UsersControl = () => {
    const [state, setState] = useState({
        users: [],
        loading: true,
        error: '',
        editUserId: null,
        editedUser: { username: '', email: '' }
    });

    const handleApiCall = async (method, url, data = null) => {
        try {
            const config = { method, url };
            if (data) config.data = data;
            return await axios(config);
        } catch (error) {
            throw error;
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await handleApiCall('get', "http://localhost:4000/users");
            setState(prev => ({ ...prev, users: response.data, loading: false }));
        } catch (err) {
            setState(prev => ({ ...prev, error: 'Failed to fetch users: ' + err.message, loading: false }));
        }
    };

    const blockUsers = async (id) => {
        try {
            const userToBlock = state.users.find(user => user.id === id);
            if (!userToBlock) return;

            const updatedUser = { ...userToBlock, blocked: !userToBlock.blocked };
            await handleApiCall('put', `http://localhost:4000/users/${id}`, updatedUser);

            setState(prev => ({
                ...prev,
                users: prev.users.map(user => user.id === id ? updatedUser : user)
            }));
        } catch (error) {
            setState(prev => ({ ...prev, error: "Failed to Block Users" }));
        }
    };

    const deleteUser = async (userId) => {
        try {
            await handleApiCall('delete', `http://localhost:4000/users/${userId}`);
            setState(prev => ({
                ...prev,
                users: prev.users.filter(user => user.id !== userId)
            }));
        } catch (err) {
            setState(prev => ({ ...prev, error: 'Failed to delete user: ' + err.message }));
        }
    };

    const handleEditChange = (e) => {
        setState(prev => ({
            ...prev,
            editedUser: { ...prev.editedUser, [e.target.name]: e.target.value }
        }));
    };

    const saveUserChanges = async () => {
        try {
            const updatedUser = { ...state.editedUser };
            await handleApiCall('put', `http://localhost:4000/users/${state.editUserId}`, updatedUser);

            setState(prev => ({
                ...prev,
                users: prev.users.map(user => user.id === prev.editUserId ? { ...user, ...updatedUser } : user),
                editUserId: null,
                editedUser: { username: '', email: '' }
            }));
        } catch (error) {
            setState(prev => ({ ...prev, error: "Failed to update user info" }));
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const { users, loading, error, editUserId, editedUser } = state;

    return (
        <div className="w-full p-6 min-h-screen bg-white dark:bg-gray-800">
            <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800 dark:text-white">
                User Management
            </h1>

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            {loading && <p className="text-center">Loading...</p>}

            {!loading && users.length === 0 ? (
                <p className="text-center text-gray-500">No users available.</p>
            ) : (
                <div className="overflow-x-auto shadow-lg rounded-lg bg-white dark:bg-gray-700">
                    <table className="w-full table-auto border-collapse border border-gray-300">
                        <thead className="bg-gradient-to-r from-blue-500 to-teal-500">
                        <tr>
                            {['ID', 'Username', 'Email', 'Blocked', 'Controls'].map((header) => (
                                <th key={header} className="border border-gray-300 p-4 text-white">
                                    {header}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="odd:bg-white even:bg-gray-100 hover:bg-gray-200 dark:odd:bg-gray-600 dark:even:bg-gray-700 dark:hover:bg-gray-600">
                                {['id', 'username', 'email'].map((field) => (
                                    <td key={field} className="border border-gray-300 p-4 text-gray-700 dark:text-gray-200">
                                        {user[field]}
                                    </td>
                                ))}
                                <td className="border border-gray-300 p-4 text-gray-700 dark:text-gray-200">
                                    {user.blocked ? "Yes" : "No"}
                                </td>
                                <td className="border border-gray-300 p-4 text-gray-700 dark:text-gray-200 space-x-2">
                                    <button
                                        onClick={() => deleteUser(user.id)}
                                        className="border border-black text-gray-800 dark:text-white p-1 rounded-3xl hover:shadow-xl hover:bg-red-600 hover:text-white"
                                    >
                                        Remove
                                    </button>
                                    <button
                                        onClick={() => blockUsers(user.id)}
                                        className="border border-black text-gray-800 dark:text-white p-1 rounded-3xl hover:shadow-xl hover:bg-red-600 hover:text-white"
                                    >
                                        {user.blocked ? "Unblock" : "Block"}
                                    </button>
                                    <button
                                        onClick={() => setState(prev => ({
                                            ...prev,
                                            editUserId: user.id,
                                            editedUser: { username: user.username, email: user.email }
                                        }))}
                                        className="border border-black text-gray-800 dark:text-white p-1 rounded-3xl hover:shadow-xl hover:bg-blue-600 hover:text-white"
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {editUserId && (
                <div className="mt-6 bg-white dark:bg-gray-700 p-4 shadow-lg rounded-lg">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Edit User</h2>
                    {['username', 'email'].map((field) => (
                        <div key={field} className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300 capitalize">{field}</label>
                            <input
                                type={field === 'email' ? 'email' : 'text'}
                                name={field}
                                value={editedUser[field]}
                                onChange={handleEditChange}
                                className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-600 dark:text-white"
                            />
                        </div>
                    ))}
                    <div className="flex space-x-2">
                        <button
                            onClick={saveUserChanges}
                            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
                        >
                            Save Changes
                        </button>
                        <button
                            onClick={() => setState(prev => ({ ...prev, editUserId: null }))}
                            className="bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersControl;