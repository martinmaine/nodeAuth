import express from 'express';
import { register, login, modifyPassword, deleteUser } from '../controllers/authController';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/modify-password', modifyPassword);
router.post('/delete-user', deleteUser);

export default router;