```javascript
const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Portfolio = require('../models/Portfolio');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// ========================================
// ADMIN AUTHENTICATION MIDDLEWARE
// ========================================
const protectAdmin = async (req, res, next) => {
    try {
        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer ')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                message: 'Not authorized, token missing'
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'your_jwt_secret'
        );

        const user = await User.findById(decoded.id);

        if (!user || user.role !== 'admin') {
            return res.status(403).json({
                message: 'Admin access required'
            });
        }

        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json({
            message: 'Invalid or expired token'
        });
    }
};


// ========================================
// GET ADMIN DASHBOARD STATS
// GET /api/admin/stats
// ========================================
router.get('/stats', protectAdmin, async (req, res) => {
    try {
        // Total registered users
        const totalUsers = await User.countDocuments();

        // Total portfolios
        const totalPortfolios = await Portfolio.countDocuments();

        // Start of today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Start of tomorrow
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Users created today
        const recordsAddedToday = await User.countDocuments({
            createdAt: {
                $gte: today,
                $lt: tomorrow
            }
        });

        res.status(200).json({
            totalUsers,
            totalPortfolios,
            recordsAddedToday
        });

    } catch (error) {
        console.error('Dashboard stats error:', error);

        res.status(500).json({
            message: 'Failed to fetch dashboard statistics'
        });
    }
});


// ========================================
// CHANGE ADMIN PASSWORD
// PUT /api/admin/change-password
// ========================================
router.put('/change-password', protectAdmin, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: 'Please provide current and new passwords'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                message: 'New password must be at least 6 characters'
            });
        }

        const admin = await User.findById(req.user._id);

        const isMatch = await admin.matchPassword(currentPassword);

        if (!isMatch) {
            return res.status(400).json({
                message: 'Current password is incorrect'
            });
        }

        admin.password = newPassword;
        await admin.save();

        res.status(200).json({
            message: 'Password changed successfully'
        });

    } catch (error) {
        console.error('Change password error:', error);

        res.status(500).json({
            message: 'Failed to change password'
        });
    }
});


// ========================================
// GET ALL USERS WITH PAGINATION
// GET /api/admin/users?page=1&limit=5
// ========================================
router.get('/users', protectAdmin, async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const limit = Math.max(1, parseInt(req.query.limit, 10) || 5);

        const skip = (page - 1) * limit;

        const totalUsers = await User.countDocuments({
            role: { $ne: 'admin' }
        });

        const users = await User.find({
            role: { $ne: 'admin' }
        })
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            users,
            currentPage: page,
            totalPages: Math.ceil(totalUsers / limit),
            totalUsers
        });

    } catch (error) {
        console.error('Fetch users error:', error);

        res.status(500).json({
            message: 'Failed to fetch users'
        });
    }
});


// ========================================
// DELETE USER AND THEIR PORTFOLIO
// DELETE /api/admin/users/:id
// ========================================
router.delete('/users/:id', protectAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        if (user.role === 'admin') {
            return res.status(400).json({
                message: 'Admin account cannot be deleted here'
            });
        }

        await Portfolio.deleteMany({
            user: user._id
        });

        await user.deleteOne();

        res.status(200).json({
            message: 'User and associated portfolio deleted successfully'
        });

    } catch (error) {
        console.error('Delete user error:', error);

        res.status(500).json({
            message: 'Failed to delete user'
        });
    }
});


// ========================================
// GET A USER'S PORTFOLIO
// GET /api/admin/portfolio/:userId
// ========================================
router.get('/portfolio/:userId', protectAdmin, async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({
            user: req.params.userId
        });

        if (!portfolio) {
            return res.status(404).json({
                message: 'Portfolio not found'
            });
        }

        res.status(200).json(portfolio);

    } catch (error) {
        console.error('Fetch portfolio error:', error);

        res.status(500).json({
            message: 'Failed to fetch portfolio'
        });
    }
});


// ========================================
// UPDATE A USER'S PORTFOLIO
// PUT /api/admin/portfolio/:userId
// ========================================
router.put('/portfolio/:userId', protectAdmin, async (req, res) => {
    try {
        const portfolio = await Portfolio.findOneAndUpdate(
            { user: req.params.userId },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!portfolio) {
            return res.status(404).json({
                message: 'Portfolio not found'
            });
        }

        res.status(200).json({
            message: 'Portfolio updated successfully',
            portfolio
        });

    } catch (error) {
        console.error('Update portfolio error:', error);

        res.status(500).json({
            message: 'Failed to update portfolio'
        });
    }
});

module.exports = router;
```