import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
    const { user } = useContext(AuthContext);

    return (
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Welcome to Portfolio Builder</h1>
            <p style={{ fontSize: '1.25rem', color: '#4b5563', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
                Create a stunning portfolio in minutes. Showcase your skills, projects, and experience to the world with a clean and modern design.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                {user ? (
                    <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="btn" style={{ padding: '0.75rem 2rem', fontSize: '1.125rem' }}>
                        Go to Dashboard
                    </Link>
                ) : (
                    <>
                        <Link to="/register" className="btn" style={{ padding: '0.75rem 2rem', fontSize: '1.125rem' }}>Get Started</Link>
                        <Link to="/login" className="btn-outline" style={{ padding: '0.75rem 2rem', fontSize: '1.125rem', marginLeft: '1rem' }}>Login</Link>
                    </>
                )}
            </div>
            
            <div className="grid grid-cols-2" style={{ marginTop: '5rem', textAlign: 'left' }}>
                <div className="card">
                    <h2 style={{ color: 'var(--primary-color)' }}>Simple to Use</h2>
                    <p>Just fill in your details, skills, and projects in a simple form. We'll handle the design.</p>
                </div>
                <div className="card">
                    <h2 style={{ color: 'var(--primary-color)' }}>Beautiful Design</h2>
                    <p>Your generated portfolio will look professional, minimal, and fully responsive across all devices.</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
