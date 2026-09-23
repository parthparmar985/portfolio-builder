import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
    const { user } = useContext(AuthContext);
    const [portfolio, setPortfolio] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('http://localhost:5000/api/portfolio/my-portfolio', config);
                setPortfolio(data);
            } catch (error) {
                console.error("No portfolio found or error");
            }
            setLoading(false);
        };
        if (user) fetchPortfolio();
    }, [user]);

    if (loading) return <div className="text-center my-2">Loading...</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
            <h1 style={{ marginBottom: '2rem' }}>Dashboard</h1>
            <div className="card">
                <h2>Welcome, {user?.name}!</h2>
                <p style={{ color: '#4b5563', marginBottom: '1.5rem' }}>
                    {portfolio ? "You have already created a portfolio. You can edit it or view it." : "You haven't created a portfolio yet. Get started now!"}
                </p>
                
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link to="/create-portfolio" className="btn">
                        {portfolio ? 'Edit Portfolio Details' : 'Create My Portfolio'}
                    </Link>
                    {portfolio && (
                        <Link to={`/portfolio/${user._id}`} className="btn" style={{ background: '#10b981' }}>
                            View Generated Portfolio
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
