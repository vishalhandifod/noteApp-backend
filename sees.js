require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Tenant = require('./models/Tenant');
const User = require('./models/User');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Clear existing tenants and users, optional:
    await Tenant.deleteMany({});
    await User.deleteMany({});

    // Create tenants
    const acme = new Tenant({ slug: 'acme', name: 'Acme Corporation' });
    const globex = new Tenant({ slug: 'globex', name: 'Globex Corporation' });
    await acme.save();
    await globex.save();


        // Hash password for all users
    const passwordHash = await bcrypt.hash('password', 10);

    // Create mandatory test users
    const users = [
      { email: 'admin@acme.test', role: 'admin', tenantId: acme._id, passwordHash },
      { email: 'user@acme.test', role: 'member', tenantId: acme._id, passwordHash },
      { email: 'admin@globex.test', role: 'admin', tenantId: globex._id, passwordHash },
      { email: 'user@globex.test', role: 'member', tenantId: globex._id, passwordHash },
    ];

    await User.insertMany(users);
    console.log('Seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seed();
