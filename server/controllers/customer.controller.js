import Customer from '../models/Customer.model.js';

// GET /api/customers
export const getCustomers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, status } = req.query;
    
    // Determine permissions
    const canReadAll = req.user.permissions.includes('customer:read_all');
    const canReadOwn = req.user.permissions.includes('customer:read_own');

    if (!canReadAll && !canReadOwn) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions to view customers.' });
    }

    const query = {};

    // Filter by own customers if user doesn't have read_all
    if (!canReadAll && canReadOwn) {
      query.assignedOfficer = req.user.id;
    }

    // Search filter
    if (search) {
      query.$or = [
        { fullName: { $regex: search.trim(), $options: 'i' } },
        { nic: { $regex: search.trim(), $options: 'i' } },
        { mobileNumber: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    // Status filter
    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const limitNum = parseInt(limit);

    const totalCount = await Customer.countDocuments(query);
    const customers = await Customer.find(query)
      .populate('assignedOfficer', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      customers,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limitNum),
        currentPage: parseInt(page),
        limit: limitNum
      }
    });
  } catch (error) { next(error); }
};

// GET /api/customers/:id
export const getCustomerById = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id)
      .populate('assignedOfficer', 'name email')
      .populate('createdBy', 'name email');
      
    if (!customer) return res.status(404).json({ message: 'Customer not found.' });

    // Enforce read_own permission boundary
    const canReadAll = req.user.permissions.includes('customer:read_all');
    if (!canReadAll && customer.assignedOfficer._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: You can only view your assigned customers.' });
    }

    res.status(200).json({ customer });
  } catch (error) { next(error); }
};

// POST /api/customers
export const createCustomer = async (req, res, next) => {
  try {
    const { nic } = req.body;
    
    // Basic validation for existing NIC
    const existing = await Customer.findOne({ nic: nic?.trim() });
    if (existing) {
      return res.status(409).json({ message: 'A customer with this NIC already exists.' });
    }

    const customer = await Customer.create({
      ...req.body,
      assignedOfficer: req.user.id, // Field Officer creating it is automatically assigned
      createdBy: req.user.id
    });

    res.status(201).json({ message: 'Customer created successfully.', customer });
  } catch (error) { next(error); }
};

// PUT /api/customers/:id
export const updateCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found.' });

    // Enforce read_own/update boundary
    const canReadAll = req.user.permissions.includes('customer:read_all');
    if (!canReadAll && customer.assignedOfficer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: You can only update your assigned customers.' });
    }

    // Check NIC collision if changing NIC
    if (req.body.nic && req.body.nic.trim() !== customer.nic) {
      const existing = await Customer.findOne({ nic: req.body.nic.trim() });
      if (existing) return res.status(409).json({ message: 'Another customer is already registered with this NIC.' });
    }

    Object.assign(customer, req.body);
    await customer.save();

    res.status(200).json({ message: 'Customer updated successfully.', customer });
  } catch (error) { next(error); }
};
