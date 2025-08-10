// Function to Check Availability of Room
import Booking from './../models/Booking.js';
import Room from '../models/Room.js'

const checkAvailability = async ({ checkInDate, checkOutDate, room}) =>{
    try{
        const bookings = await Booking.find({
            room,
            checkInDate: {$lte: checkInDate},
            checkOutDate: {$gte: checkOutDate},
    })
        const isAvailable = bookings.length == 0
        return isAvailable
    }
    catch(error){
        console.log(error.message)
    }
}
// API to check availability of room
// POST /api/bookings/check-availability

export const checkAvailabilityAPI = async (req, res) =>{
    try{
        const { room, checkInDate, checkOutDate } = req.body
        const isAvailabe = await checkAvailability({checkInDate, checkOutDate, room})
        res.json({success: true, isAvailabe})
    }
        catch(error){
            res.json({success: false, message: error.message})       
    }
}

// API to create a new booking
// POST /api/bookings/book

export const createBooking = async (req, res) => {
    try{
        const user = req.user._id
        // Before Booking Check Availability

        const isAvailabe = await checkAvailability({
            checkInDate,
            checkOutDate,
            room
        })

        if(!isAvailabe){
            return res.json({success: false, message: "Room is not available"})
        }
        // Get totalPrice of room
        const roomData = await Room.findById(room).populate('hotel')
        let totalPrice = roomData.pricePerNight

        // Calculate totalPrice based on Nights
        const checkIn = new Date(checkInDate)
        const checkOut = new Date(checkOutDate)
        const timeDiff = checkOut.getTime() - checkIn.getTime()
        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24))

        totalPrice *= nights
        const booking = await Booking.create({
            user,
            room, 
            hotel: roomData.hotel._id,
            guests: +guests,
            checkInDate,
            checkOutDate,
            totalPrice,
        })
        res.json({success: true, message: "Booking Created Successfully"})
    }
    catch(error) {
        res.json({success: false, message: "Failed to create booking"})
    }
}

// API to get all bookings for a user

// GET /api/bookings/user

export const getUserBookings = async (req, res) => {
    try {
        const user = req.user._id;
        const bookings = await Booking.find({ user })
            .populate('room hotel')
            .sort({createdAt: -1})
        res.json({ success: true, bookings });
    } catch (error) {
        res.json({ success: false, message: "Failed to fetch bookings" });
    }
}

/**
 * API to get all bookings for a hotel
 * GET /api/bookings/hotel/:hotelId
 */
export const getHotelBookings = async (req, res) => {
    try {
        const hotel = await Hotel.findOne({owner: req.auth.userId})
        if(!hotel){
            return res.json({ success: false, message: "No Hotel found"})
        }
        const bookings = await Booking.find({hotel: hotel._id}).populate('room hotel user').sort({createdAt: -1})
        //Total Bookings
        const totalBookings = bookings.length
        // Total Revenue
        const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0) 

        res.json({ success: true, dashboardData: {totalBookings, totalRevenue, bookings} });
    } catch (error) {
        res.json({ success: false, message: "Failed to fetch hotel bookings" });
    }
}

