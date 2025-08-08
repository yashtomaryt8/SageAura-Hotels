import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Get Clerk signature headers
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // Raw body string
    const payload = req.body.toString("utf8");

    // Verify signature
    await whook.verify(payload, headers);

    // Parse JSON after verification
    const { data, type } = JSON.parse(payload);

    // Prepare user data for MongoDB
    const userData = {
      _id: data.id,
      email:
        data.email_addresses?.[0]?.email_address ||
        "default@example.com", // fallback if Clerk doesn't send email
      username:
        `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim() || "No Name",
      image:
        data.profile_image_url || data.image_url || "",
    };

    // Handle event types
    switch (type) {
      case "user.created":
        await User.create(userData);
        console.log("✅ User created:", userData);
        break;

      case "user.updated":
        await User.findByIdAndUpdate(data.id, userData, {
          new: true,
          upsert: true,
        });
        console.log("✅ User updated:", userData);
        break;

      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        console.log("🗑 User deleted:", data.id);
        break;

      default:
        console.log("⚠ Unhandled event type:", type);
    }

    res.json({ success: true, message: "Webhook Received" });
  } catch (error) {
    console.error("❌ Webhook Error:", error.message);
    res.status(400).json({ success: false, error: error.message });
  }
};

export default clerkWebhooks;
