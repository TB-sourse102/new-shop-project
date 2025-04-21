import User from '../models/User.js';
import { generateToken, comparePassword } from '../utils/auth.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export default {
  // 用户注册
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      // 在注册控制器中添加
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
if (!passwordRegex.test(password)) {
  return errorResponse(res, 400, '密码需至少8位，包含字母和数字');
}

      // 验证必填字段
      if (!username || !email || !password) {
        return errorResponse(res, 400, '请填写所有必填字段');
      }

      // 检查用户名/邮箱是否已存在
      const existUser = await User.findByUsername(username);
      if (existUser) return errorResponse(res, 400, '用户名或邮箱已存在');

      // 创建用户
      const user = await User.create({ username, email, password });
      const token = generateToken(user);

      // 隐藏敏感信息
      delete user.password_hash;

      successResponse(res, { user, token }, '注册成功', 201);
    } catch (error) {
      errorResponse(res, 500, '注册失败');
    }
  },

  // 用户登录
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      // 查找用户
      const user = await User.findByUsername(username);
      if (!user) return errorResponse(res, 401, '用户名或密码错误');

      // 验证密码
      const isValid = await comparePassword(password, user.password_hash);
      if (!isValid) return errorResponse(res, 401, '用户名或密码错误');

      // 生成Token
      const token = generateToken(user);
      delete user.password_hash;

      successResponse(res, { user, token });
    } catch (error) {
      errorResponse(res, 500, '登录失败');
    }
  },

  // 获取当前用户信息
  getMe: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) return errorResponse(res, 404, '用户不存在');
      delete user.password_hash;
      successResponse(res, user);
    } catch (error) {
      errorResponse(res, 500, '获取用户信息失败');
    }
  }


};


