import Role from '../models/Role.model.js';
import User from '../models/User.model.js';

// GET /api/roles
export const getRoles = async (req, res, next) => {
  try {
    const roles = await Role.find()
      .populate('createdBy', 'name email')
      .sort({ isDefault: -1, createdAt: -1 });
    res.status(200).json({ roles });
  } catch (error) { next(error); }
};

// GET /api/roles/:id
export const getRole = async (req, res, next) => {
  try {
    const role = await Role.findById(req.params.id).populate('createdBy', 'name email');
    if (!role) return res.status(404).json({ message: 'Role not found.' });
    res.status(200).json({ role });
  } catch (error) { next(error); }
};

// POST /api/roles
export const createRole = async (req, res, next) => {
  try {
    const { name, description, permissions } = req.body;

    if (!name || !Array.isArray(permissions)) {
      return res.status(400).json({ message: 'Role name and permissions array are required.' });
    }

    const existing = await Role.findOne({ name: name.trim() });
    if (existing) {
      return res.status(409).json({ message: 'A role with this name already exists.' });
    }

    const role = await Role.create({
      name: name.trim(),
      description: description?.trim() || '',
      permissions,
      isDefault: false,
      createdBy: req.user.id,
    });

    res.status(201).json({ message: 'Role created successfully.', role });
  } catch (error) { next(error); }
};

// PUT /api/roles/:id
export const updateRole = async (req, res, next) => {
  try {
    const { name, description, permissions } = req.body;
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ message: 'Role not found.' });

    if (name && name.trim() !== role.name) {
      const existing = await Role.findOne({ name: name.trim() });
      if (existing) return res.status(409).json({ message: 'A role with this name already exists.' });
      role.name = name.trim();
    }
    if (description !== undefined) role.description = description.trim();
    if (Array.isArray(permissions)) role.permissions = permissions;

    await role.save();
    res.status(200).json({ message: 'Role updated successfully.', role });
  } catch (error) { next(error); }
};

// DELETE /api/roles/:id
export const deleteRole = async (req, res, next) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ message: 'Role not found.' });

    if (role.isDefault) {
      return res.status(400).json({ message: 'Default system roles cannot be deleted.' });
    }

    const usersWithRole = await User.countDocuments({ role: role._id });
    if (usersWithRole > 0) {
      return res.status(400).json({
        message: `Cannot delete: ${usersWithRole} user(s) are assigned this role. Reassign them first.`,
      });
    }

    await role.deleteOne();
    res.status(200).json({ message: 'Role deleted successfully.' });
  } catch (error) { next(error); }
};
