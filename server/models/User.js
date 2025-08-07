import mongoose from "mongoose"

const UserSchema = mongoose.Schema({
    _id: { type: String, required: true },
    username: { type: String },
    email: { type: String },
    image: { type: String },
    role: { type: String, enum: ["user", "hotelOwner"], default: "user"},
    recentSearchedCities: [{type: String}]
}, {timestamps: true})

const User = mongoose.model("User", UserSchema)

export default User