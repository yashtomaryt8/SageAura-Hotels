// clerkWebhooks.js
import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    const payload = req.body.toString("utf8"); // raw body string
    await whook.verify(payload, headers);

    const { data, type } = JSON.parse(payload);

    const userData = {
      _id: data.id,
      email: data.email_addresses?.[0]?.email_address || "default@email.com",
      username: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim() || "No Name",
      image: data.image_url || "",
    };

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
        console.log("Unhandled event type:", type);
    }

    res.json({ success: true, message: "Webhook Received" });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ success: false, error: error.message });
  }
};

export default clerkWebhooks;
