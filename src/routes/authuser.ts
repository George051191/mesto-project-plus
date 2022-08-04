import { Router } from 'express';
import { editUserInfo, refreshAvatar } from '../controllers/users';

const router = Router();

router.patch('/me', editUserInfo);
router.patch('/me/avatar', refreshAvatar);

export default router;
