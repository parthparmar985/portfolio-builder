const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Admin Auth Middleware
const protectAdmin = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
            req.user = decoded;
            if (req.user.role === 'admin') {
                next();
            } else {
                res.status(403).json({ message: 'Not authorized as admin' });
            }
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Get stats
router.get('/stats', protectAdmin, async (req, res) => {
    try {
        const usersCount = await User.countDocuments();
        const portfoliosCount = await Portfolio.countDocuments();
        res.json({ totalUsers: usersCount, totalPortfolios: portfoliosCount });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Change admin password
router.put('/change-password', protectAdmin, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);
        if (user && (await user.matchPassword(currentPassword))) {
            user.password = newPassword;
            await user.save();
            res.json({ message: 'Password updated successfully' });
        } else {
            res.status(401).json({ message: 'Invalid current password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all users
router.get('/users', protectAdmin, async (req, res) => {
    try {
        if (req.query.page && req.query.limit) {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const total = await User.countDocuments();
            const users = await User.find().select('-password').skip(skip).limit(limit);
            
            return res.json({
                users,
                totalPages: Math.ceil(total / limit),
                currentPage: page
            });
        }
        
        // Fallback for non-paginated requests if frontend isn't passing parameters
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete user and associated portfolio
router.delete('/users/:id', protectAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user && user.role !== 'admin') {
            await User.findByIdAndDelete(req.params.id);
            await Portfolio.findOneAndDelete({ user: req.params.id });
            res.json({ message: 'User deleted' });
        } else {
            res.status(400).json({ message: 'Cannot delete admin or user not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get user portfolio (Admin)
router.get('/portfolio/:userId', protectAdmin, async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ user: req.params.userId });
        if (!portfolio) return res.status(200).json(null); // return null if no portfolio yet
        res.json(portfolio);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update or Create user portfolio (Admin)
router.put('/portfolio/:userId', protectAdmin, async (req, res) => {
    try {
        const { bio, skills, projects, experience, socialLinks } = req.body;
        let portfolio = await Portfolio.findOne({ user: req.params.userId });
        
        if (portfolio) {
            portfolio.bio = bio;
            portfolio.skills = skills;
            portfolio.projects = projects;
            portfolio.experience = experience;
            portfolio.socialLinks = socialLinks;
            await portfolio.save();
        } else {
            portfolio = await Portfolio.create({
                user: req.params.userId, bio, skills, projects, experience, socialLinks
            });
        }
        res.json(portfolio);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
