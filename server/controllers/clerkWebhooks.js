// clerkWebhooks.js
import dotenv from "dotenv";
dotenv.config();
import { Webhook } from "svix";
import User from "../models/User.js"; // Your Mongoose User model

export const clerkWebhooks = async (req, res) => {
  try {
    let evt;

    // If in development mode, skip Svix signature verification
    // if (process.env.LOCAL_TEST === "true") {
    //   console.log("⚠️ Dev mode: Skipping Svix signature verification");
    //   evt = req.body; // Trust the payload directly
    // } else {
      // ✅ Create Svix instance with Clerk webhook secret
      const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

      // ✅ Collect headers for verification
      const headers = {
        "svix-id": req.headers["svix-id"],
        "svix-timestamp": req.headers["svix-timestamp"],
        "svix-signature": req.headers["svix-signature"],
      };

      // ✅ Verify payload (throws error if signature invalid)
      const payloadString = JSON.stringify(req.body);
      evt = wh.verify(payloadString, headers);
      console.log("✅ Clerk Webhook Event Verified:", evt);
    // }

    // ✅ Example: Save user on `user.created`
    if (evt.type === "user.created") {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data;

      await User.create({
        clerkId: id,
        email: email_addresses[0]?.email_address,
        firstName: first_name,
        lastName: last_name,
        imageUrl: image_url,
      });

      console.log("✅ User stored in MongoDB");
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Webhook Error:", err.message);
    res.status(400).json({ error: err.message });
  }
};

export default clerkWebhooks;
