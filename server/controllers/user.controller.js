import User from '../models/User.model.js';
import Role from '../models/Role.model.js';

// GET /api/users
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .populate('role', 'name')
      .populate('createdBy', 'name')
      .select('-password')
      .sort({ createdAt: -1 });
    res.status(200).json({ users });
  } catch (error) { next(error); }
};

// GET /api/users/:id
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('role', 'name permissions')
      .populate('createdBy', 'name')
      .select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.status(200).json({ user });
  } catch (error) { next(error); }
};

// POST /api/users
export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, roleId } = req.body;

    if (!name || !email || !password || !roleId) {
      return res.status(400).json({ message: 'Name, email, password, and role are all required.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters.' });
    }

    const role = await Role.findById(roleId);
    if (!role) return res.status(404).json({ message: 'Selected role not found.' });

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) return res.status(409).json({ message: 'A user with this email already exists.' });

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: roleId,
      mustChangePassword: true,
      createdBy: req.user.id,
    });

    const populated = await User.findById(user._id)
      .populate('role', 'name')
      .select('-password');

    res.status(201).json({
      message: 'User created successfully. Share these credentials with the user — they will be required to change their password on first login.',
      user: populated,
    });
  } catch (error) { next(error); }
};

// PUT /api/users/:id
export const updateUser = async (req, res, next) => {
  try {
    const { name, roleId } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    if (name) user.name = name.trim();
    if (roleId) {
      const role = await Role.findById(roleId);
      if (!role) return res.status(404).json({ message: 'Selected role not found.' });
      user.role = roleId;
    }

    await user.save({ validateBeforeSave: false });
    const updated = await User.findById(user._id).populate('role', 'name').select('-password');
    res.status(200).json({ message: 'User updated successfully.', user: updated });
  } catch (error) { next(error); }
};

// PATCH /api/users/:id/toggle-status
export const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });

    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ message: 'You cannot disable your own account.' });
    }

    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      message: `User ${user.isActive ? 'enabled' : 'disabled'} successfully.`,
      user: { id: user._id, name: user.name, isActive: user.isActive },
    });
  } catch (error) { next(error); }
};

// PATCH /api/users/:id/reset-password
export const resetUserPassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters.' });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    user.password = newPassword;
    user.mustChangePassword = true;
    await user.save();

    res.status(200).json({
      message: 'User password reset successfully. They will be required to change it on next login.',
    });
  } catch (error) { next(error); }
};
