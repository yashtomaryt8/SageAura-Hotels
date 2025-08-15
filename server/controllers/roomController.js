import Hotel from '../models/Hotel.js'
import {cloudinary} from '../configs/cloudinary.js'
import Room from '../models/Room.js'

// API to create a new room for a hotel
export const createRoom = async (req, res) => {
    try{
        const {roomType, pricePerNight, amenities} = req.body
        const hotel = await Hotel.findOne({owner: req.auth.userId})

        if(!hotel) return res.json({ success: false, message: "No Hotel Found"})

        // upload images to cloudinary 
        const uploadImages = req.files.map(async (file) => {
            const response = await cloudinary.uploader.upload(file.path)
            return response.secure_url
        })
        // Wait for all uploads to complete
        const images = await Promise.all(uploadImages)

        await Room.create({
            hotel: hotel._id,
            roomType,
            pricePerNight: +pricePerNight,
            amenities: JSON.parse(amenities),
            images,
        })
        res.json({success: true, message: "Room Created Successfully"})
    }
    catch(error){
        res.json({success: false, message: error.message})
    }
}
export const getRooms = async (req, res)=>{
    try{
        const rooms = await Room.find({isAvailabe: true}).populate({
            path: 'hotel',
            populate:{
                path: 'owner',
                select: 'image'
            }
        }).sort({createdAt: -1 })
        res.json({success: true, rooms})
    }
    catch(error){
        res.json({success: false, message: error.message})
    }
}
export const getOwnerRooms = async (req, res)=>{
    try{
        const hotelData = await Hotel({owner: req.auth.userId})
        const rooms = await Room.find({hotel: hotelData._id.toString()}).populate('hotel')
        res.json({success: true, rooms})
    }
    catch(error){
        res.json({success: false, message: error.message})
    }
}
export const toggleRoomAvailability = async (req, res)=>{
    try{
        const { roomId } = req.body
        const roomData = await Room.findById(roomId)
        roomData.isAvailabe = !roomData.isAvailabe
        await roomData.save()
        res.json({success: true, message: "Room availability updated"})
    }
    catch(error){
        res.json({success: false, message: error.message})
    }
}