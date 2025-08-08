import User from '../models/User.js'
import { Webhook } from 'svix';

const clerkWebhooks = async (req, res)=> {
    try{
        // Create Svix Instance with clerk webhook secret
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
        
        // Getting Headers
        const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    }

    //Verifying 
    await whook.verify(JSON.stringify(req.body), headers)

    // Getting Data from request body

    const {data, type} = req.body

    const userData = {
        _id: data.id,
        email: data.email_addresses?.[0]?.email_address || "theflash.tfbro@gmail.com",
        username: `${(data.first_name ?? "")} ${(data.last_name ?? "")}`.trim() || "No Name",
        image: data.image_url || "",
    }

    switch (type) {
      case "user.created":{
        await User.create(userData)
        break}
      case "user.updated":{
        await User.findByIdAndUpdate(data.id, userData, { new: true, upsert: true })
        break}
      case "user.deleted":{
        await User.findByIdAndDelete(data.id)
        break}
      default:
        console.log(" Unhandled event type:", type);
    }
    res.json({success: true, message: "Webhook Received"})

    }
     catch(error){
        console.log(error.message)
        res.status(500).json({ success: false, message: error.message });
    }
    
}

export default clerkWebhooks