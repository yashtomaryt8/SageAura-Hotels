import { clerkClient } from "@clerk/clerk-sdk-node";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const { userId } = req.auth();
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    let user = await User.findById(userId);

    if (!user) {
      const clerkUser = await clerkClient.users.getUser(userId);

      user = new User({
        _id: clerkUser.id, // matches your schema
        username: clerkUser.username || clerkUser.firstName || "Guest",
        image: clerkUser.imageUrl, // Clerk profile image
        email: clerkUser.emailAddresses[0]?.emailAddress
      });

      await user.save();
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("ensureUserInDB error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
