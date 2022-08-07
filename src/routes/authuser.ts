import { Router } from 'express';
import { editUserInfo, refreshAvatar, getCurrentUser } from '../controllers/users';

const router = Router();

router.patch('/me', editUserInfo);
router.patch('/me/avatar', refreshAvatar);
router.get('/me', getCurrentUser);

export default router;
