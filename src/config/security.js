import helmet from 'helmet';

export default (app) => {
  // 设置安全相关的HTTP头
  app.use(helmet());
  
  // 限流配置（示例使用express-rate-limit）
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15分钟
      max: 100 // 每个IP限制100次请求
    })
  );
};