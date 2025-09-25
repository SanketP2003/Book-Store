import { useState, useEffect } from 'react';
import { userService } from '../../services';
import { UserDto } from '../../types/api';
import Alert from '../../components/Alert';
import Loader from '@/components/Loader';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiX,
  HiCheck,
  HiOutlineUser,
  HiOutlineUserGroup,
  HiOutlineMail
} from 'react-icons/hi';

export default function UserManagement() {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<UserDto | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'USER',
    password: ''
  });

  // Load all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await userService.getAllUsers();
        setUsers(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load users');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search query
  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle create new user
  const handleCreateNew = () => {
    setEditingUser(null);
    setFormData({
      username: '',
      email: '',
      role: 'USER',
      password: ''
    });
    setShowModal(true);
  };

  // Handle edit user
  const handleEdit = (user: UserDto) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      role: user.role,
      password: '' // Don't set password when editing
    });
    setShowModal(true);
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Create new user
      if (!editingUser) {
        if (!formData.password) {
          setError('Password is required when creating a new user');
          setLoading(false);
          return;
        }

        const newUser = await userService.createUser({
          ...formData,
        });

        setUsers([...users, newUser]);
        setSuccessMessage(`User "${newUser.username}" created successfully!`);
      }
      // Update existing user
      else {
        const updatedUser = await userService.updateUser(editingUser.id, {
          ...formData,
          id: editingUser.id,
          // Only include password if it's provided
          password: formData.password || undefined
        });

        // Update users list
        setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
        setSuccessMessage(`User "${updatedUser.username}" updated successfully!`);
      }

      setShowModal(false);
      setError(null);

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      setError(err.message || 'Failed to save user');
      console.error('Error saving user:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete user
  const handleDelete = async (userId: number) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

    try {
      setLoading(true);
      await userService.deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
      setSuccessMessage('User deleted successfully!');

      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete user');
      console.error('Error deleting user:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="section-title">User Management</h2>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10 py-2"
            />
            <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text_secondary-light dark:text-text_secondary-dark" size={20} />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary flex items-center justify-center gap-2"
            onClick={handleCreateNew}
          >
            <HiOutlinePlus size={20} />
            <span>Add User</span>
          </motion.button>
        </div>
      </div>

      {/* Success and Error Messages */}
      {successMessage && (
        <Alert message={successMessage} type="success" onClose={() => setSuccessMessage(null)} />
      )}

      {error && (
        <Alert message={error} type="error" onClose={() => setError(null)} />
      )}

      {/* Users Table */}
      <div className="card overflow-hidden">
        {loading && users.length === 0 ? (
          <div className="flex justify-center items-center p-12">
            <Loader size="lg" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text_secondary-light dark:text-text_secondary-dark uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text_secondary-light dark:text-text_secondary-dark uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text_secondary-light dark:text-text_secondary-dark uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-text_secondary-light dark:text-text_secondary-dark uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-surface-dark divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-light/10 dark:bg-primary-dark/10 flex items-center justify-center">
                            {user.role === 'ADMIN' ? (
                              <HiOutlineUserGroup className="h-5 w-5 text-primary-light dark:text-primary-dark" />
                            ) : (
                              <HiOutlineUser className="h-5 w-5 text-secondary-light dark:text-secondary-dark" />
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-text_primary-light dark:text-text_primary-dark">{user.username}</div>
                            <div className="text-xs text-text_secondary-light dark:text-text_secondary-dark">ID: {user.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <HiOutlineMail className="h-4 w-4 text-text_secondary-light dark:text-text_secondary-dark mr-1" />
                          <span className="text-sm text-text_secondary-light dark:text-text_secondary-dark">{user.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          user.role === 'ADMIN' 
                            ? 'bg-primary-light/20 text-primary-light dark:bg-primary-dark/20 dark:text-primary-dark'
                            : 'bg-secondary-light/20 text-secondary-light dark:bg-secondary-dark/20 dark:text-secondary-dark'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEdit(user)}
                            className="text-primary-light dark:text-primary-dark hover:text-primary-light/80 dark:hover:text-primary-dark/80"
                          >
                            <HiOutlinePencilAlt size={18} />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(user.id)}
                            className="text-error-light dark:text-error-dark hover:text-error-light/80 dark:hover:text-error-dark/80"
                          >
                            <HiOutlineTrash size={18} />
                          </motion.button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-text_secondary-light dark:text-text_secondary-dark">
                      {searchQuery ? 'No users match your search.' : 'No users found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Form Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-surface-dark rounded-2xl shadow-xl max-w-lg w-full"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-display font-bold">
                  {editingUser ? `Edit User: ${editingUser.username}` : 'Create New User'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-text_secondary-light dark:text-text_secondary-dark hover:text-text_primary-light dark:hover:text-text_primary-dark"
                >
                  <HiX size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-text_secondary-light dark:text-text_secondary-dark mb-1">
                    Username *
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text_secondary-light dark:text-text_secondary-dark mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-text_secondary-light dark:text-text_secondary-dark mb-1">
                    Role *
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="input-field"
                    required
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-text_secondary-light dark:text-text_secondary-dark mb-1">
                    {editingUser ? 'Password (leave blank to keep current)' : 'Password *'}
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required={!editingUser}
                    className="input-field"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex items-center"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader size="sm" className="mr-2" /> Saving...
                      </>
                    ) : (
                      <>
                        <HiCheck className="mr-1" size={18} /> {editingUser ? 'Update User' : 'Create User'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
