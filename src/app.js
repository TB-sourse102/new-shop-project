import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productRoutes from './routes/products.js';
import errorHandler from './middlewares/errorHandler.js';
import categoryRoutes from './routes/categories.js';
import authRoutes from './routes/auth.js';
import cookieParser from 'cookie-parser';
import csrf from 'csurf';
import userRoutes from './routes/users.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;


// 在server.js中添加静态文件中间件（在路由前添加）
app.use(express.static('public'));

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // 必须先配置cookie解析
const csrfProtection = csrf({ cookie: true }); // 创建CSRF中间件实例

// 路由
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
// 添加认证路由
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);


// 错误处理
app.use(errorHandler);

// 启动服务器
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});