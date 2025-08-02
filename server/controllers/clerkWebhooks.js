import getRawBody from "raw-body";
import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
  try {
    //  Read raw body (important for Vercel)
    const rawBody = (await getRawBody(req)).toString();

    //  Headers for svix verification
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // Verify using Clerk secret
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    const evt = await whook.verify(rawBody, headers);

    const { data, type } = evt;
    console.log(" Clerk Webhook Received:", type, data);

    // Prepare user data safely
    const userData = {
      _id: data.id,
      email: data.email_addresses?.[0]?.email_address || "no-email",
      username: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
      image: data.profile_image_url || "",
    };

    //  Handle event types
    switch (type) {
      case "user.created":
        await User.create(userData);
        break;
      case "user.updated":
        await User.findByIdAndUpdate(data.id, userData, { new: true, upsert: true });
        break;
      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        break;
      default:
        console.log(" Unhandled event type:", type);
    }

    res.status(200).json({ success: true, message: "Webhook processed successfully" });
  } catch (error) {
    console.error(" Webhook Error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export default clerkWebhooks;
