//import validator from '../middlewares/validateMiddleware.js';
import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { hashPassword, comparePassword } from '../utils/auth.js';

export default {
  // 获取个人信息
  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) return errorResponse(res, 404, '用户不存在');
      delete user.password_hash;
      successResponse(res, user);
    } catch (error) {
      errorResponse(res, 500, '获取用户信息失败userController');
    }
  },

  // 更新个人信息
  updateProfile: async (req, res) => {
    try {
      const { username, email, phone } = req.body;
     // validator.profileValidation;
      const updatedUser = await User.update(req.user.id, {
        username,
        email,
        phone,      
      });
      successResponse(res, updatedUser);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return errorResponse(res, 400, '用户名或邮箱已被使用');
      }
      errorResponse(res, 500, '更新用户信息失败');
    }
  },

  // 修改密码
  changePassword: async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const user = await User.findById(req.user.id);
      
      // 验证旧密码
      const isValid = await comparePassword(oldPassword, user.password_hash);
      if (!isValid) return errorResponse(res, 401, '原密码错误');

      // 更新密码
      const hashedPassword = await hashPassword(newPassword);
      await User.updatePassword(req.user.id, hashedPassword);
      
      successResponse(res, null, '密码修改成功');
    } catch (error) {
      errorResponse(res, 500, '密码修改失败');
    }
  },

  // 新增上传头像方法
uploadAvatar: async (req, res) => {
  try {
    if (!req.file) {
      return errorResponse(res, 400, '请上传有效图片文件');
    }
    
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    const updatedUser = await User.update(req.user.id, { avatar_url: avatarUrl });
    
    successResponse(res, { avatar_url: updatedUser.avatar_url });
  } catch (error) {
    errorResponse(res, 500, '头像上传失败');
  }
}
};