import express from 'express';
const router = express.Router();

import { 
  getCustomers, 
  getCustomerById, 
  createCustomer, 
  updateCustomer 
} from '../controllers/customer.controller.js';

import verifyToken from '../middleware/verifyToken.js';
import checkPermission from '../middleware/checkPermission.js';

// All routes require authentication
router.use(verifyToken);

// GET /api/customers handles both read_all and read_own internally in the controller
router.get('/', getCustomers);

// GET /api/customers/:id handles both read_all and read_own internally in the controller
router.get('/:id', getCustomerById);

router.post('/', checkPermission('customer:create'), createCustomer);
router.put('/:id', checkPermission('customer:update'), updateCustomer);

export default router;
