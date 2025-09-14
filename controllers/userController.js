const User = require('../models/User');
const bcrypt = require('bcrypt');

const transporter = require('../utils/emailTranspoter');

exports.inviteUser = async (req, res) => {
  try {
    const { email, role } = req.body;
    if (!email || !role) {
      return res.status(400).json({ message: 'Email and role are required.' });
    }
    // if (role !== 'User') {
    //   return res.status(403).json({ message: 'Only member role is allowed for invites.' });
    // }

    const adminTenantId = req.user.tenantId;
    const adminEmail = req.user.email;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    const defaultPassword = 'password';
    const passwordHash = await bcrypt.hash(defaultPassword, 10);

    const newUser = new User({
      email,
      role,
      tenantId: adminTenantId,
      passwordHash,
    });

    await newUser.save();

    // Send email via Brevo SMTP
    const mailOptions = {
  from: `"Note app" <vishalhandifod111@gmail.com>`, // you can also use adminEmail if desired
  to: email,
  subject: 'You have been invited to join Our SaaS App',
  html: `
    <div style="font-family: Arial, sans-serif; line-height:1.5; color: #333;">
      <h2 style="color: #2C7BE5;">You’re invited to Our SaaS App!</h2>

      <p>Hello,</p>

      <p><strong>${adminEmail}</strong> has invited you to join Our SaaS App as a <strong>${role}</strong>.</p>

      <p>Your login email: <strong>${email}</strong></p>
      <p>Your temporary password: <strong>${defaultPassword}</strong></p>

      <p>Please login to the platform and change your password immediately for security.</p>

      <p style="text-align: center; margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL}/login" target="_blank" style="
          display: inline-block;
          padding: 12px 25px;
          background-color: #2C7BE5;
          color: white;
          font-weight: bold;
          border-radius: 6px;
          text-decoration: none;
        ">Login to Your Account</a>
      </p>

      <p>Welcome aboard!</p>

      <p>Best regards,<br/>The SaaS App Team</p>
    </div>
  `,
};


    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'User invited successfully and email sent.' });
  } catch (error) {
    console.error('Invite user error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};


exports.getHealth = (req, res) => {
  res.json({ status: 'ok', message: 'Server is running smoothly.' });
}