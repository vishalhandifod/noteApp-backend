const Tenant = require('../models/Tenant');

exports.upgradeTenant = async (req, res) => {
  try {
    // Only allow Admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required.' });
    }
    const { slug } = req.params;

    // Find the tenant by slug and update the plan
    const tenant = await Tenant.findOneAndUpdate(
      { slug },
      { $set: { subscriptionPlan: 'pro' } },
      { new: true }
    );
    if (!tenant) return res.status(404).json({ message: 'Tenant not found.' });

    res.json({ message: 'Tenant upgraded to Pro.', tenant });
  } catch (error) {
    console.error('Upgrade error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

exports.getTenant = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const tenant = await Tenant.findById(tenantId).select('-__v');
    if (!tenant) return res.status(404).json({ message: 'Tenant not found.' });
    res.json(tenant);
  } catch (error) {
    console.error('Get tenant error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};
