import express from 'express';
import authController from '../controllers/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { authLimiter } from '../middlewares/rateLimiter.js'; // 导入限流中间件
import { csrfProtection } from '../middlewares/csrfMiddleware.js';

const router = express.Router();

// 注册
router.post('/register', authController.register);

// 登录
router.post('/login', authController.login);

// 应用在登录/注册路由
router.post('/register', authLimiter, authController.register);
router.post('/login', authLimiter, authController.login);

// 获取当前用户信息（需要认证）
router.get('/me', authMiddleware, authController.getMe);



// 在渲染页面时提供CSRF Token
router.get('/register', csrfProtection, (req, res) => {
  res.render('register', { csrfToken: req.csrfToken() });
});

export default router;