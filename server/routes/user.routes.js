import express from 'express';
const router = express.Router();

import { getUsers, getUser, createUser, updateUser, toggleUserStatus, resetUserPassword } from '../controllers/user.controller.js';
import verifyToken from '../middleware/verifyToken.js';
import checkPermission from '../middleware/checkPermission.js';

router.use(verifyToken);

router.get('/', checkPermission('user:read'), getUsers);
router.get('/:id', checkPermission('user:read'), getUser);
router.post('/', checkPermission('user:create'), createUser);
router.put('/:id', checkPermission('user:update'), updateUser);
router.patch('/:id/toggle-status', checkPermission('user:disable'), toggleUserStatus);
router.patch('/:id/reset-password', checkPermission('user:update'), resetUserPassword);

export default router;
