const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },  // e.g., 'acme', 'globex'
  name: { type: String, required: true },
  subscriptionPlan: { type: String, enum: ['free', 'pro'], default: 'free' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Tenant', tenantSchema);
