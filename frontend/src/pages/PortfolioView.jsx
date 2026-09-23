import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PortfolioView = () => {
    const { userId } = useParams();
    const [portfolio, setPortfolio] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);
    const printRef = useRef();

    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/portfolio/user/${userId}`);
                setPortfolio(data);
            } catch (error) {
                console.error("Portfolio not found");
            }
            setLoading(false);
        };
        fetchPortfolio();
    }, [userId]);

    const handleDownloadPdf = async () => {
        const element = printRef.current;
        if (!element) return;
        
        setIsDownloading(true);
        try {
            // Apply a temporary style class or config if needed for render
            const canvas = await html2canvas(element, {
                scale: 2, // Higher density for sharper PDF
                useCORS: true, 
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/png');
            
            // A4 Aspect ratio dimension calculation
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            let heightLeft = pdfHeight;
            let position = 0;
            const pageHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - pdfHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`${portfolio.user?.name || 'Portfolio'}_Resume.pdf`);
        } catch (error) {
            console.error("Failed to generate PDF", error);
            alert("Failed to download PDF. Please try again.");
        }
        setIsDownloading(false);
    };

    if (loading) return (
        <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <span style={{ fontSize: '1.25rem', color: '#64748b' }}>Loading Portfolio...</span>
        </div>
    );
    
    if (!portfolio) return (
        <div className="text-center" style={{ marginTop: '5rem' }}>
            <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#0f172a' }}>Portfolio Not Found</h3>
            <Link to="/" className="btn">Go Home</Link>
        </div>
    );

    return (
        <div style={{ background: 'var(--bg-gradient)', minHeight: '100vh', padding: '3rem 1rem 5rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            {/* Top Action Bar */}
            <div style={{ width: '100%', maxWidth: '900px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <Link to="/" style={{ color: '#4f46e5', fontWeight: '600', textDecoration: 'none' }}>&larr; Back to Platform</Link>
                <button 
                    onClick={handleDownloadPdf} 
                    className="btn" 
                    disabled={isDownloading}
                    style={{ background: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    {isDownloading ? 'Generating PDF...' : '📄 Download PDF'}
                </button>
            </div>

            {/* Resume / Portfolio Container (A4-like constraint) */}
            <div 
                ref={printRef}
                style={{
                    background: '#ffffff',
                    width: '100%',
                    maxWidth: '900px', // A4-ish width mapping
                    minHeight: '1120px', 
                    padding: '4rem 5rem',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    borderRadius: '8px', 
                    color: '#1e293b'
                }}>
                
                {/* Header Section */}
                <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: '800', margin: '0 0 0.5rem 0', color: '#0f172a', letterSpacing: '-0.02em' }}>
                        {portfolio.user?.name}
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: '#64748b', maxWidth: '600px', margin: '0 auto 1.5rem auto', lineHeight: '1.6' }}>
                        {portfolio.bio}
                    </p>
                    
                    {portfolio.socialLinks && (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
                            {portfolio.socialLinks.github && (
                                <a href={portfolio.socialLinks.github} target="_blank" rel="noreferrer" style={{ color: '#4f46e5', fontWeight: '600' }}>GitHub</a>
                            )}
                            {portfolio.socialLinks.linkedin && (
                                <a href={portfolio.socialLinks.linkedin} target="_blank" rel="noreferrer" style={{ color: '#4f46e5', fontWeight: '600' }}>LinkedIn</a>
                            )}
                            {portfolio.socialLinks.twitter && (
                                <a href={portfolio.socialLinks.twitter} target="_blank" rel="noreferrer" style={{ color: '#4f46e5', fontWeight: '600' }}>Twitter</a>
                            )}
                        </div>
                    )}
                </div>

                <hr style={{ border: 'none', borderTop: '2px solid #f1f5f9', margin: '3rem 0' }} />

                {/* Content Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 2fr', gap: '4rem' }}>
                    
                    {/* Left Column (Skills & Experience) */}
                    <div>
                        <div style={{ marginBottom: '3rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '1.25rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>Skills</h2>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {portfolio.skills.map((skill, index) => (
                                    <span key={index} style={{ background: '#f1f5f9', color: '#334155', padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.9rem', fontWeight: '600' }}>
                                        {skill}
                                    </span>
                                ))}
                                {portfolio.skills.length === 0 && <span style={{ color: '#94a3b8' }}>None provided</span>}
                            </div>
                        </div>

                        {portfolio.experience && (
                            <div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '1.25rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>Experience</h2>
                                <p style={{ fontSize: '1rem', color: '#475569', lineHeight: '1.6' }}>{portfolio.experience}</p>
                            </div>
                        )}
                    </div>

                    {/* Right Column (Projects) */}
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0f172a', marginBottom: '1.25rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>Projects & Work</h2>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            {portfolio.projects.map((proj, idx) => (
                                <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '1.5rem', borderRadius: '8px' }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', margin: '0 0 0.5rem 0' }}>{proj.title}</h3>
                                    <p style={{ margin: '0 0 1rem 0', color: '#475569', lineHeight: '1.6', fontSize: '0.95rem' }}>{proj.description}</p>
                                    {proj.link && (
                                        <a href={proj.link} target="_blank" rel="noreferrer" style={{ color: '#4f46e5', fontWeight: '600', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center' }}>
                                            View Project &rarr;
                                        </a>
                                    )}
                                </div>
                            ))}
                            {portfolio.projects.length === 0 && <p style={{ color: '#94a3b8' }}>No projects showcased yet.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PortfolioView;
