import User from '../models/User.js'

// Middleware to check  if user is authenticated
export const protect = async (req, res, next) => {
  try {
    const auth = req.auth();
    const { userId } = auth;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
