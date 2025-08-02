import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
        unique: true // ✅ Prevent duplicate Clerk IDs
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true // ✅ Avoid duplicate emails
    },
    image: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'hotelOwner'],
        default: 'user'
    },
    recentSearchedCities: {
        type: [String],
        default: [] // ✅ prevents validation error
    },
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;
