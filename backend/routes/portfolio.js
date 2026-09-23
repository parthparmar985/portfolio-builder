const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');
const jwt = require('jsonwebtoken');

// Middleware to protect routes
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Get current user's portfolio
router.get('/my-portfolio', protect, async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ user: req.user.id });
        res.json(portfolio);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create or update portfolio
router.post('/my-portfolio', protect, async (req, res) => {
    try {
        const { bio, skills, projects, experience, socialLinks } = req.body;
        let portfolio = await Portfolio.findOne({ user: req.user.id });
        
        if (portfolio) {
            // Update
            portfolio.bio = bio;
            portfolio.skills = skills;
            portfolio.projects = projects;
            portfolio.experience = experience;
            portfolio.socialLinks = socialLinks;
            await portfolio.save();
        } else {
            // Create
            portfolio = await Portfolio.create({
                user: req.user.id, bio, skills, projects, experience, socialLinks
            });
        }
        res.json(portfolio);
    } catch (error) {
        if (error.name === 'ValidationError') {
            const message = Object.values(error.errors).map(val => val.message).join(', ');
            return res.status(400).json({ message });
        }
        res.status(500).json({ message: 'Server error' });
    }
});

// Get any public portfolio by userId
router.get('/user/:userId', async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ user: req.params.userId }).populate('user', 'name email');
        if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });
        res.json(portfolio);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
