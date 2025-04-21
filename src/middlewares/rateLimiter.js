import rateLimit from 'express-rate-limit';

// 认证相关接口限制（登录/注册）
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 5,                   // 每个IP允许5次请求
  message: '尝试次数过多，请15分钟后再试',
  standardHeaders: true,    // 返回标准RateLimit-* headers
  legacyHeaders: false      // 禁用X-RateLimit-* headers
});