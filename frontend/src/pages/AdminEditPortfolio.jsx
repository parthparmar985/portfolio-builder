import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';

const AdminEditPortfolio = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const { userId } = useParams();
    
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
        if (!user || user.role !== 'admin') {
            navigate('/dashboard');
            return;
        }

        const fetchPortfolio = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get(`http://localhost:5000/api/admin/portfolio/${userId}`, config);
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
                console.error("Failed to fetch user portfolio", error);
            }
        };
        fetchPortfolio();
    }, [user, navigate, userId]);

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
            
            await axios.put(`http://localhost:5000/api/admin/portfolio/${userId}`, payload, config);
            navigate('/admin');
        } catch (error) {
            console.error("Error saving portfolio", error);
            alert("Failed to save portfolio.");
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '2rem auto' }}>
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ color: 'var(--primary-color)', margin: 0 }}>Admin Edit Portfolio</h2>
                    <button type="button" onClick={() => navigate('/admin')} className="btn-outline">Cancel</button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Short Bio</label>
                        <textarea name="bio" value={formData.bio} onChange={handleChange} rows="3" required placeholder="I am a full stack developer..."></textarea>
                    </div>
                    
                    <div className="form-group">
                        <label>Skills (comma separated)</label>
                        <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="React, Node.js, MongoDB" />
                    </div>

                    <div className="form-group">
                        <label>Experience (Years or Description)</label>
                        <input type="text" name="experience" value={formData.experience} onChange={handleChange} placeholder="2 years of experience at TechCorp" />
                    </div>

                    <h3 style={{ marginTop: '2rem', marginBottom: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>Social Links</h3>
                    
                    <div className="grid grid-cols-2">
                        <div className="form-group">
                            <label>GitHub URL</label>
                            <input type="text" name="github" value={formData.github} onChange={handleChange} placeholder="https://github.com/yourusername" />
                        </div>
                        <div className="form-group">
                            <label>LinkedIn URL</label>
                            <input type="text" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/yourusername" />
                        </div>
                    </div>

                    <h3 style={{ marginTop: '2rem', marginBottom: '1rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>Projects</h3>
                    {formData.projects.map((proj, i) => (
                        <div key={i} className="project-entry">
                            <div className="form-group">
                                <label>Project Title</label>
                                <input type="text" value={proj.title} onChange={e => handleProjectChange(i, 'title', e.target.value)} required />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea value={proj.description} onChange={e => handleProjectChange(i, 'description', e.target.value)} required rows="2"></textarea>
                            </div>
                            <div className="form-group">
                                <label>Link (optional)</label>
                                <input type="text" value={proj.link} onChange={e => handleProjectChange(i, 'link', e.target.value)} />
                            </div>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddProject} className="btn-outline" style={{ marginBottom: '2rem' }}>+ Add Project</button>
                    <br />
                    
                    <button type="submit" className="btn" style={{ width: '100%', padding: '1rem', fontSize: '1.25rem' }}>Update Portfolio</button>
                </form>
            </div>
        </div>
    );
};

export default AdminEditPortfolio;
