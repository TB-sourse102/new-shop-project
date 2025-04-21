import express from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import userController from '../controllers/userController.js';
import uploadMiddleware from '../middlewares/uploadMiddleware.js';
import { 
  profileValidation, 
  passwordValidation, 
  validateRequest 
} from '../middlewares/validateMiddleware.js';

const router = express.Router();

// 全局认证中间件
router.use(authMiddleware);

// 获取用户信息
router.get('/me', userController.getProfile);

// 更新用户信息（需验证）
router.put(
  '/me',
  profileValidation,    // 字段验证规则
  validateRequest,      // 验证结果处理
  userController.updateProfile
);

// 修改密码（需验证）
router.patch(
  '/password',
  passwordValidation,   // 密码验证规则
  validateRequest,      // 验证结果处理
  userController.changePassword
);

// 上传头像
router.post(
  '/avatar', 
  uploadMiddleware.single('avatar'), 
  userController.uploadAvatar
);

export default router;