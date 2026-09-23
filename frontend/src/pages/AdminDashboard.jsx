import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [stats, setStats] = useState({ totalUsers: 0, totalPortfolios: 0 });
    const [usersList, setUsersList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
    const [msg, setMsg] = useState('');

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/login');
            return;
        }

        const fetchStats = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data: statsData } = await axios.get('http://localhost:5000/api/admin/stats', config);
                setStats(statsData);
            } catch (error) {
                console.error("Failed to fetch admin stats", error);
            }
        };
        fetchStats();
    }, [user, navigate]);

    useEffect(() => {
        if (!user || user.role !== 'admin') return;

        const fetchUsers = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data: usersData } = await axios.get(`http://localhost:5000/api/admin/users?page=${currentPage}&limit=5`, config);
                setUsersList(usersData.users || []);
                setTotalPages(usersData.totalPages || 1);
            } catch (error) {
                console.error("Failed to fetch users", error);
            }
        };
        fetchUsers();
    }, [user, currentPage]);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.put('http://localhost:5000/api/admin/change-password', passwords, config);
            setMsg({ type: 'success', text: data.message });
            setPasswords({ currentPassword: '', newPassword: '' });
        } catch (error) {
            setMsg({ type: 'error', text: error.response?.data?.message || 'Failed to update password' });
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm("Are you sure you want to delete this user and their entire portfolio? This cannot be undone.")) {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, config);
                
                const { data: usersData } = await axios.get(`http://localhost:5000/api/admin/users?page=${currentPage}&limit=5`, config);
                setUsersList(usersData.users || []);
                setTotalPages(usersData.totalPages || 1);

                setStats(prev => ({ ...prev, totalUsers: prev.totalUsers - 1 }));
            } catch (error) {
                alert(error.response?.data?.message || "Error deleting user");
            }
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '2rem auto' }}>
            <h1 style={{ marginBottom: '2rem' }}>Admin Dashboard</h1>
            
            <div className="grid grid-cols-2" style={{ marginBottom: '3rem' }}>
                <div className="stats-card">
                    <h3>{stats.totalUsers}</h3>
                    <p style={{ margin: 0, opacity: 0.9 }}>Total Registered Users</p>
                </div>
                <div className="stats-card" style={{ background: '#059669', color: 'white', borderColor: '#059669' }}>
                    <h3 style={{color: 'white'}}>{stats.totalPortfolios}</h3>
                    <p style={{ margin: 0, opacity: 0.9 }}>Total Portfolios Created</p>
                </div>
            </div>

            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <h2 style={{ padding: '1.5rem', margin: 0, borderBottom: '1px solid var(--border-color)' }}>Manage Users</h2>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: '#f9fafb', borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Name</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Email</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: '600' }}>Role</th>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: '600', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usersList.map((u) => (
                                <tr key={u._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '1rem 1.5rem' }}>{u.name}</td>
                                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{u.email}</td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <span style={{ 
                                            background: u.role === 'admin' ? '#fee2e2' : '#e0e7ff',
                                            color: u.role === 'admin' ? '#991b1b' : '#3730a3',
                                            padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.875rem' 
                                        }}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                        {u.role !== 'admin' && (
                                            <>
                                                <button onClick={() => navigate(`/admin/edit-portfolio/${u._id}`)} className="btn-outline" style={{ padding: '0.4rem 0.75rem', fontSize: '0.875rem' }}>Edit Portfolio</button>
                                                <button onClick={() => handleDeleteUser(u._id)} className="btn" style={{ background: '#ef4444', padding: '0.4rem 0.75rem', fontSize: '0.875rem' }}>Delete</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {usersList.length === 0 && (
                                <tr>
                                    <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No users found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)' }}>
                    <button 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                        disabled={currentPage === 1}
                        className="btn-outline"
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.875rem' }}
                    >
                        Previous
                    </button>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="btn-outline"
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.875rem' }}
                    >
                        Next
                    </button>
                </div>
            </div>

            <div className="card">
                <h2>Change Admin Password</h2>
                {msg.text && (
                    <div style={{ 
                        padding: '1rem', 
                        marginBottom: '1rem', 
                        borderRadius: '0.375rem',
                        background: msg.type === 'success' ? '#d1fae5' : '#fee2e2',
                        color: msg.type === 'success' ? '#065f46' : '#991b1b'
                    }}>
                        {msg.text}
                    </div>
                )}
                <form onSubmit={handlePasswordChange}>
                    <div className="form-group">
                        <label>Current Password</label>
                        <input type="password" value={passwords.currentPassword} onChange={e => setPasswords({...passwords, currentPassword: e.target.value})} required />
                    </div>
                    <div className="form-group">
                        <label>New Password</label>
                        <input type="password" value={passwords.newPassword} onChange={e => setPasswords({...passwords, newPassword: e.target.value})} required />
                    </div>
                    <button type="submit" className="btn mt-1">Update Password</button>
                </form>
            </div>
        </div>
    );
};

export default AdminDashboard;
