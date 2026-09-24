const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '30d' });
};

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email,age, password } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({ name, email, age, password });
        if (user) {
            res.status(201).json({
                _id: user._id, name: user.name, email: user.email, age: user.age, role: user.role,
                token: generateToken(user._id, user.role)
            });
        }
    } catch (error) {
        console.error("Register Error: ", error);
        res.status(500).json({ message: 'Server error', details: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id, name: user.name, email: user.email,  role: user.role,
                token: generateToken(user._id, user.role)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get profile
router.get('/profile', async (req, res) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
            const user = await User.findById(decoded.id).select('-password');
            if (!user) return res.status(401).json({ message: 'Not authorized' });
            res.json(user);
        } else {
            res.status(401).json({ message: 'No token found' });
        }
    } catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
});

module.exports = router;
