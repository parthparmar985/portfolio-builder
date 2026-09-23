const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Import routes
const authRoutes = require('./routes/auth');
const portfolioRoutes = require('./routes/portfolio');
const adminRoutes = require('./routes/admin');
const User = require('./models/User');

app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    res.send('Portfolio Builder API');
});

// Connect DB and seed admin
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfolio_builder').then(async () => {
    console.log('MongoDB Connected');
    // Seed admin
    const adminExists = await User.findOne({ email: 'admin@admin.com' });
    if (!adminExists) {
        await User.create({
            name: 'System Admin',
            email: 'admin@admin.com',
            password: 'admin123',
            role: 'admin'
        });
        console.log('Default admin seeded.');
    }
}).catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
