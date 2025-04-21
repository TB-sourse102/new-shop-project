import jwt from 'jsonwebtoken';
import { errorResponse } from '../utils/apiResponse.js';

export default (req, res, next) => {
  // 从Header获取token
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return errorResponse(res, 401, '请先登录');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    errorResponse(res, 401, '无效的Token');
  }
};