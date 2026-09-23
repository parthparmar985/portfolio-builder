import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
    const { user } = useContext(AuthContext);

    return (
        <div style={{ textAlign: 'center', marginTop: '5rem', marginBottom: '4rem' }}>
            <h1 className="gradient-text gradient-primary" style={{ fontSize: '4.5rem', fontWeight: '800', letterSpacing: '-1.5px', marginBottom: '1.5rem', lineHeight: '1.2' }}>
                Craft Your Digital Legacy
            </h1>
            <p style={{ fontSize: '1.35rem', color: 'var(--text-muted)', marginBottom: '3.5rem', maxWidth: '650px', margin: '0 auto 3.5rem auto', lineHeight: '1.7' }}>
                Build a stunning, professional portfolio in minutes. Showcase your skills, experiences, and projects with a premium dark aesthetic.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
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
