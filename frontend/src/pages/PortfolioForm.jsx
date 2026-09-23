import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const PortfolioForm = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        bio: '',
        skills: '',
        experience: '',
        github: '',
        linkedin: '',
        twitter: '',
        projects: []
    });

    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('http://localhost:5000/api/portfolio/my-portfolio', config);
                if (data) {
                    setFormData({
                        bio: data.bio || '',
                        skills: data.skills ? data.skills.join(', ') : '',
                        experience: data.experience || '',
                        github: data.socialLinks?.github || '',
                        linkedin: data.socialLinks?.linkedin || '',
                        twitter: data.socialLinks?.twitter || '',
                        projects: data.projects || []
                    });
                }
            } catch (error) {
                // Ignore if not found
            }
        };
        fetchPortfolio();
    }, [user]);

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddProject = () => {
        setFormData(prev => ({
            ...prev,
            projects: [...prev.projects, { title: '', description: '', link: '' }]
        }));
    };

    const handleProjectChange = (index, field, value) => {
        const updatedProjects = [...formData.projects];
        updatedProjects[index][field] = value;
        setFormData({ ...formData, projects: updatedProjects });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            
            const payload = {
                bio: formData.bio,
                skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
                experience: formData.experience,
                socialLinks: {
                    github: formData.github,
                    linkedin: formData.linkedin,
                    twitter: formData.twitter
                },
                projects: formData.projects
            };
            
            await axios.post('http://localhost:5000/api/portfolio/my-portfolio', payload, config);
            navigate('/dashboard');
        } catch (error) {
            console.error("Error saving portfolio", error);
            alert(error.response?.data?.message || "Failed to save portfolio.");
        }
    };

    return (
        <div className="page-wrapper" style={{ maxWidth: '1000px', margin: '3rem auto' }}>
            <div className="glass-card" style={{ padding: '3.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 className="gradient-text gradient-primary" style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Portfolio Details</h2>
                    <p className="text-muted" style={{ fontSize: '1.1rem' }}>Broaden your professional presence. Fill out the details below.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-6">
                        <label>Short Bio</label>
                        <textarea name="bio" value={formData.bio} onChange={handleChange} rows="4" required placeholder="I am a full stack developer..." style={{ fontSize: '1.05rem', padding: '1rem 1.5rem' }}></textarea>
                    </div>
                    
                    <div className="grid grid-cols-2 mb-6" style={{ gap: '2.5rem' }}>
                        <div className="form-group">
                            <label>Skills (comma separated)</label>
                            <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="React, Node.js, MongoDB" style={{ fontSize: '1.05rem', padding: '1rem 1.5rem' }} />
                        </div>

                        <div className="form-group">
                            <label>Experience (Years or Description)</label>
                            <input type="text" name="experience" value={formData.experience} onChange={handleChange} placeholder="2 years of experience at TechCorp" style={{ fontSize: '1.05rem', padding: '1rem 1.5rem' }} />
                        </div>
                    </div>

                    <div style={{ marginTop: '3.5rem', padding: '2rem', background: 'rgba(255,255,255,0.4)', borderRadius: '1rem', border: '1px solid rgba(226,232,240,0.8)' }}>
                        <h3 className="gradient-text gradient-secondary" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Social Links</h3>
                        
                        <div className="grid grid-cols-2" style={{ gap: '2.5rem' }}>
                            <div className="form-group mb-1">
                                <label>GitHub URL</label>
                                <input type="url" name="github" value={formData.github} onChange={handleChange} placeholder="https://github.com/yourusername" style={{ fontSize: '1.05rem', padding: '1rem 1.5rem' }} />
                            </div>
                            <div className="form-group mb-1">
                                <label>LinkedIn URL</label>
                                <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/yourusername" style={{ fontSize: '1.05rem', padding: '1rem 1.5rem' }} />
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '3.5rem' }}>
                        <h3 className="gradient-text gradient-primary" style={{ fontSize: '1.75rem', marginBottom: '1.5rem' }}>Projects</h3>
                        {formData.projects.map((proj, i) => (
                            <div key={i} className="project-entry" style={{ padding: '2rem', marginBottom: '2rem', borderRadius: '1rem', background: 'rgba(255,255,255,0.7)' }}>
                                <h4 style={{ margin: '0 0 1.5rem 0', color: 'var(--primary-color)', fontSize: '1.1rem' }}>Project #{i + 1}</h4>
                                <div className="grid grid-cols-2" style={{ gap: '2rem' }}>
                                    <div className="form-group mb-4">
                                        <label>Project Title</label>
                                        <input type="text" value={proj.title} onChange={e => handleProjectChange(i, 'title', e.target.value)} required style={{ padding: '0.85rem 1.25rem' }} />
                                    </div>
                                    <div className="form-group mb-4">
                                        <label>Live Link (optional)</label>
                                        <input type="url" value={proj.link} onChange={e => handleProjectChange(i, 'link', e.target.value)} style={{ padding: '0.85rem 1.25rem' }} />
                                    </div>
                                </div>
                                <div className="form-group mb-1">
                                    <label>Description</label>
                                    <textarea value={proj.description} onChange={e => handleProjectChange(i, 'description', e.target.value)} required rows="3" style={{ padding: '0.85rem 1.25rem' }}></textarea>
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={handleAddProject} className="btn-outline" style={{ display: 'block', margin: '0 auto 3rem auto', padding: '0.8rem 2rem', fontSize: '1rem', borderStyle: 'dashed', borderWidth: '2px' }}>+ Add Another Project</button>
                    </div>
                    
                    <button type="submit" className="btn hover-lift" style={{ width: '100%', padding: '1.2rem', fontSize: '1.25rem', marginTop: '1rem' }}>Save & Publish Portfolio</button>
                </form>
            </div>
        </div>
    );
};

export default PortfolioForm;
