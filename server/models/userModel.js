import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Please add a name'],
        minlength: 3,
        maxlength: 50,
        trim: true
    },
    email: { 
        type: String, 
        required: [true, 'Please add an email'], 
        unique: true, 
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please add a valid email'],
        lowercase: true,
        trim: true
    },
    gender: { 
        type: String, 
        enum: ['Male', 'Female', 'Other'],
    },
    phone: {
        type: String,
        unique: false,
        trim: true,
        match: [/^[0-9]{10}$/, 'Please add a valid 10-digit phone number']
    },
    password: { 
        type: String, 
        required: [true, 'Please add a password'], 
        minlength: 6, 
        maxlength: 128,
        select: false 
    },
    role: { 
        type: String, 
        enum: ['user', 'admin'], 
        default: 'user' 
    },
    journeyStatus: {
        type: String,
        enum: ['Discovery', 'Awareness', 'Healing', 'Growth'],
        default: 'Discovery'
    },
    walletBalance: {
        type: Number,
        default: 0,
        min: 0
    },
    profileIsComplete: { 
        type: Boolean, 
        default: false 
    },
    isVerified: { 
        type: Boolean, 
        default: false 
    }
}, { timestamps: true });

export default mongoose.model('User', userSchema);