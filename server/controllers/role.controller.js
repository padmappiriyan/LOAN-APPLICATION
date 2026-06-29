import Role from '../models/Role.model.js';
import User from '../models/User.model.js';

// GET /api/roles
export const getRoles = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, status, startDate, endDate } = req.query;

    const query = {};

    // 1. Search text filter on name or description
    if (search) {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    // 2. Status filter
    if (status === 'Active') {
      query.isActive = true;
    } else if (status === 'Inactive') {
      query.isActive = false;
    }

    // 3. Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    // Count total matching roles
    const totalCount = await Role.countDocuments(query);

    // Aggregation pipeline to populate createdBy and calculate user count
    const roles = await Role.aggregate([
      { $match: query },
      { $sort: { isDefault: -1, createdAt: -1 } },
      { $skip: skip },
      { $limit: limitNum },
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'createdByDetails',
        }
      },
      {
        $unwind: {
          path: '$createdByDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: 'role',
          as: 'assignedUsers',
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          permissions: 1,
          isDefault: 1,
          isActive: 1,
          createdAt: 1,
          updatedAt: 1,
          createdBy: {
            _id: '$createdByDetails._id',
            name: '$createdByDetails.name',
            email: '$createdByDetails.email'
          },
          userCount: { $size: '$assignedUsers' }
        }
      }
    ]);

    res.status(200).json({
      roles,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limitNum),
        currentPage: parseInt(page),
        limit: limitNum
      }
    });
  } catch (error) { next(error); }
};

// GET /api/roles/:id
export const getRole = async (req, res, next) => {
  try {
    const role = await Role.findById(req.params.id).populate('createdBy', 'name email');
    if (!role) return res.status(404).json({ message: 'Role not found.' });
    
    // Count assigned users manually for detail view
    const userCount = await User.countDocuments({ role: role._id });
    
    res.status(200).json({ 
      role: {
        ...role.toObject(),
        userCount
      } 
    });
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
      isActive: true,
      createdBy: req.user.id,
    });

    res.status(201).json({ message: 'Role created successfully.', role });
  } catch (error) { next(error); }
};

// PUT /api/roles/:id
export const updateRole = async (req, res, next) => {
  try {
    const { name, description, permissions, isActive } = req.body;
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ message: 'Role not found.' });

    // Restrict changing status/isActive of default roles
    if (isActive !== undefined && isActive !== role.isActive) {
      if (role.isDefault) {
        return res.status(400).json({ message: 'Default system roles cannot be deactivated.' });
      }
      role.isActive = isActive;
    }

    if (name && name.trim() !== role.name) {
      if (role.isDefault) {
        return res.status(400).json({ message: 'Default system roles name cannot be changed.' });
      }
      const existing = await Role.findOne({ name: name.trim() });
      if (existing) return res.status(409).json({ message: 'A role with this name already exists.' });
      role.name = name.trim();
    }
    if (description !== undefined) role.description = description.trim();
    
    if (Array.isArray(permissions)) {
      if (role.isDefault) {
        return res.status(400).json({ message: 'Default system roles permissions cannot be changed.' });
      }
      role.permissions = permissions;
    }

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

    // Validation: Only deactivated/inactive roles can be deleted
    if (role.isActive) {
      return res.status(400).json({ message: 'Only inactive roles can be deleted. Please deactivate the role first.' });
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
