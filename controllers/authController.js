const User = require('../models/User');
const Tenant = require('../models/Tenant');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { email, password, role, tenantSlug } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Email, password, and role are required' });
    }

    let tenant;
    if (role === 'admin') {
      if (!tenantSlug) {
        return res.status(400).json({ message: 'Tenant slug is required for admin registration' });
      }
      tenant = await Tenant.findOne({ slug: tenantSlug });
      if (!tenant) return res.status(400).json({ message: 'Tenant not found' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already in use' });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      passwordHash,
      role,
      tenantId: tenant ? tenant._id : null,
    });

    await user.save();

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email }).populate('tenantId');
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid credentials' });

    const payload = {
      userId: user._id,
      tenantId: user.tenantId ? user.tenantId._id : null,
      tenantSlug: user.tenantId ? user.tenantId.slug : null,
      role: user.role,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

    // Set token in httpOnly cookie, expires in 8 hours
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true in production
      maxAge: 8 * 60 * 60 * 1000, // 8 hours in milliseconds
      sameSite: 'lax',
    });

    // Optionally return success message or user info
    res.json({ message: 'Login successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const logout = (req, res) => {
  try {
    // Clear the cookie by setting it to empty and expiring immediately
    res.cookie('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(0),
      sameSite: 'lax',
    });

    // Send success response
    res.json({ message: 'Logout successful' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// authController.js
const getProfile = (req, res) => {
  // req.user is set by JWT middleware
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

  // Send necessary user info
  res.json({
    userId: req.user.userId,
    email: req.user.email,
    role: req.user.role,
    tenantId: req.user.tenantId,
    tenantSlug: req.user.tenantSlug,
  });
};


module.exports = {
  register,
  login,
  getProfile,
  logout
};
