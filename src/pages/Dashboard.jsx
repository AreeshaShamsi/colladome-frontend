import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err.response?.data || err.message);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  // Delete a user by ID
  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('User deleted');
      fetchUsers();
    } catch (err) {
      console.error('Delete error:', err.response?.data || err.message);
      toast.error('Failed to delete user');
    }
  };

  // Update the selected user
  const handleUpdate = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/users/${editingUser._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('User updated');
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error('Update error:', err.response?.data || err.message);
      toast.error('Failed to update user');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>

      {loading ? (
        <p className="text-gray-600">Loading users...</p>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="flex justify-between items-center bg-white p-4 rounded shadow"
            >
              <div>
                <p className="font-medium">{user.email}</p>
                {user.createdAt && (
                  <p className="text-sm text-gray-500">
                    Created: {new Date(user.createdAt).toLocaleString()}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingUser(user);
                    setFormData({ email: user.email, password: '' });
                  }}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingUser && (
        <div className="mt-6 bg-white p-4 rounded shadow-md">
          <h2 className="text-lg font-semibold mb-2">
            Update: {editingUser.email}
          </h2>
          <div className="mb-2">
            <input
              type="email"
              placeholder="New email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="border px-3 py-2 rounded w-full mb-2"
            />
            <input
              type="password"
              placeholder="New password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="border px-3 py-2 rounded w-full"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Save
            </button>
            <button
              onClick={() => setEditingUser(null)}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
