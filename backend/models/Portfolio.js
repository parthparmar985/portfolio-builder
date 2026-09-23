const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String }
});

const portfolioSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    bio: { type: String, required: true, maxlength: [20, 'Bio cannot exceed 20 characters'] },
    skills: { type: [String], default: [] },
    projects: { type: [projectSchema], default: [] },
    experience: { type: String },
    socialLinks: {
        github: { type: String },
        linkedin: { type: String },
        twitter: { type: String }
    }
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);
