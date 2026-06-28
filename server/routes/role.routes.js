import express from 'express';
const router = express.Router();

import { getRoles, getRole, createRole, updateRole, deleteRole } from '../controllers/role.controller.js';
import verifyToken from '../middleware/verifyToken.js';
import checkPermission from '../middleware/checkPermission.js';

router.use(verifyToken);

router.get('/', checkPermission('role:read'), getRoles);
router.get('/:id', checkPermission('role:read'), getRole);
router.post('/', checkPermission('role:create'), createRole);
router.put('/:id', checkPermission('role:update'), updateRole);
router.delete('/:id', checkPermission('role:delete'), deleteRole);

export default router;
