import dotenv from 'dotenv';
dotenv.config();

import connectDB from '../config/db.js';
import User from '../models/User.model.js';
import Role from '../models/Role.model.js';
import { ALL_PERMISSIONS } from '../config/permissions.js';

const seed = async () => {
  try {
    await connectDB();
    console.log('\n Starting Smart Loans database seeder...\n');

    // ── Seed Super Admin Role ─────────────────────────────────
    let superAdminRole = await Role.findOne({ name: 'Super Admin' });
    if (!superAdminRole) {
      superAdminRole = await Role.create({
        name: 'Super Admin',
        description: 'Full system access — all permissions granted',
        permissions: ALL_PERMISSIONS,
        isDefault: true,
      });
      console.log(`  Role created:          ${superAdminRole.name} (${superAdminRole.permissions.length} permissions)`);
    } else {
      superAdminRole.permissions = ALL_PERMISSIONS;
      superAdminRole.isDefault = true;
      await superAdminRole.save();
      console.log(`    Role already exists:   Super Admin (permissions updated)`);
    }

    // ── Seed Super Admin User ─────────────────────────────────
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME || 'Super Admin';

    if (!adminEmail || !adminPassword) {
      console.error('\n ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env\n');
      process.exit(1);
    }

    const existingAdmin = await User.findOne({ email: adminEmail.toLowerCase() });
    if (!existingAdmin) {
      await User.create({
        name: adminName,
        email: adminEmail.toLowerCase(),
        password: adminPassword,
        role: superAdminRole._id,
        isActive: true,
        mustChangePassword: false,
        createdBy: null,
      });
      console.log(`\n   Super Admin created:   ${adminEmail}`);
    } else {
      console.log(`\n  Super Admin exists:    ${adminEmail}`);
    }

    console.log('\n Seeder completed successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('\n Seeder failed:', error.message);
    process.exit(1);
  }
};

seed();
