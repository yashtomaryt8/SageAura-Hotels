import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    const { userId } = req.auth(); // call it
    // console.log('Auth object:', req.auth());

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const user = await User.findById(userId); // _id = Clerk userId
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Protect middleware error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
