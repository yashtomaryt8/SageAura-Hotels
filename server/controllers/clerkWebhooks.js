import User from '../models/User.js'
import { Webhook } from 'svix'


const clerkWebhooks = async (req, res) => {
    try {
        // Create a Svix instance with the clerk webhook secret
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
       
        // Getting Headers
        const headers = {
            "svix-id": req.headers['svix-id'],
            "svix-timestamp": req.headers['svix-timestamp'],
            "svix-signature": req.headers['svix-signature']
        }

        // Verifying headers
        const payload = req.body.toString(); // raw string
        await whook.verify(payload, headers);

        // Getting Data from request body
        const { data, type } = JSON.parse(payload); 

        console.log("Received Clerk Webhook:", type, data);

        const userData = {
            _id: data.id,
            email: data.email_addresses[0].email_address,
            username: data.first_name + ' ' + data.last_name,
            image: data.profile_image_url,
        }

        // Switch case to handle different webhook events
        switch (type) {
            case 'user.created':{
                await User.create(userData);
                break;
            }

            case 'user.updated':{
                await User.findByIdAndUpdate(data.id, userData, { new: true, upsert: true})
                break;
            }
            case 'user.deleted':{
                await User.findByIdAndDelete(data.id);
                break;
            }
            default: {
                break;
            }
        }
        res.status(200).json({ success: true, message: 'Webhook processed successfully' });

    }
    catch (error) {
        console.error('Error processing Clerk webhook:', error);
        res.status(400).json({ success: false, message: 'Failed to process webhook' });
    }
}

export default clerkWebhooks;