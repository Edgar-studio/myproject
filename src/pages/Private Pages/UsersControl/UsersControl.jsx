import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UsersControl = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editUserId, setEditUserId] = useState(null);
    const [editedUser, setEditedUser] = useState({ username: '', email: '' });

    const blockUsers = async (id) => {
        try {
            const userToBlock = users.find((user) => user.id === id);
            if (!userToBlock) return;

            const updatedUser = { ...userToBlock, blocked: !userToBlock.blocked };
            await axios.put(`http://localhost:4000/users/${id}`, updatedUser);

            setUsers(users.map(user => user.id === id ? updatedUser : user));
        } catch (error) {
            setError("Failed to Block Users");
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:4000/users");
            setUsers(response.data);
        } catch (err) {
            setError('Failed to fetch users: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteUser = async (userId) => {
        try {
            await axios.delete(`http://localhost:4000/users/${userId}`);
            setUsers(users.filter(user => user.id !== userId));
        } catch (err) {
            setError('Failed to delete user: ' + err.message);
        }
    };

    const handleEditChange = (e) => {
        setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
    };

    const saveUserChanges = async () => {
        try {
            const updatedUser = { ...editedUser };
            await axios.put(`http://localhost:4000/users/${editUserId}`, updatedUser);
            setUsers(users.map(user => user.id === editUserId ? { ...user, ...updatedUser } : user));
            setEditUserId(null);
            setEditedUser({ username: '', email: '' });
        } catch (error) {
            setError("Failed to update user info");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="w-full p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">User Management</h1>
            {users.length === 0 ? (
                <p className="text-center text-gray-500">No users available.</p>
            ) : (
                <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
                    <table className="w-full table-auto border-collapse border border-gray-300">
                        <thead className="bg-gradient-to-r from-blue-500 to-teal-500">
                        <tr>
                            <th className="border border-gray-300 p-4 text-white">ID</th>
                            <th className="border border-gray-300 p-4 text-white">Username</th>
                            <th className="border border-gray-300 p-4 text-white">Email</th>
                            <th className="border border-gray-300 p-4 text-white">Blocked</th>
                            <th className="border border-gray-300 p-4 text-white">Controls</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="odd:bg-white even:bg-gray-100 hover:bg-gray-200">
                                <td className="border border-gray-300 p-4 text-gray-700">{user.id}</td>
                                <td className="border border-gray-300 p-4 text-gray-700">{user.username}</td>
                                <td className="border border-gray-300 p-4 text-gray-700">{user.email}</td>
                                <td className="border border-gray-300 p-4 text-gray-700">{user.blocked ? "Yes" : "No"}</td>
                                <td className="border border-gray-300 p-4 text-gray-700">
                                    <button
                                        onClick={() => deleteUser(user.id)}
                                        className="border border-gray-600 text-gray-800 p-1 rounded-3xl hover:shadow-xl hover:bg-red-600"
                                    >
                                        Remove User
                                    </button>
                                    <button
                                        onClick={() => blockUsers(user.id)}
                                        className="ml-2 border border-gray-600 text-gray-800 p-1 rounded-3xl hover:shadow-xl hover:bg-red-600">
                                        {user.blocked ? "Unblock User" : "Block User"}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditUserId(user.id);
                                            setEditedUser({ username: user.username, email: user.email });
                                        }}
                                        className="ml-2 border border-gray-600 text-gray-800 p-1 rounded-3xl hover:shadow-xl hover:bg-blue-600"
                                    >
                                        Edit User
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {editUserId && (
                <div className="mt-6 bg-white p-4 shadow-lg rounded-lg">
                    <h2 className="text-2xl font-semibold mb-4">Edit User</h2>
                    <div className="mb-4">
                        <label className="block text-gray-700">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={editedUser.username}
                            onChange={handleEditChange}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={editedUser.email}
                            onChange={handleEditChange}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <button
                        onClick={saveUserChanges}
                        className="bg-blue-500 text-white p-2 rounded-lg"
                    >
                        Save Changes
                    </button>
                    <button
                        onClick={() => setEditUserId(null)}
                        className="ml-2 bg-gray-500 text-white p-2 rounded-lg"
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

export default UsersControl;
