import mongoose from "mongoose"

const roomSchema = new mongoose.Schema({
    hotel : {type: String, ref: 'Hotel', required: true},
    roomType : {type: String, required: true},
    pricePerNight : {type: Number, required: true},
    amenities : {type: Array, required: true},
    images: [{type: String}],
    isAvailabe: {type: Boolean, default: true},
    
}, {timestamps: true})


const room = mongoose.model("room", roomSchema)

export default room