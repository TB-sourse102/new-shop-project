import { body } from 'express-validator';
import { validationResult } from 'express-validator';

export const profileValidation = [
  body('username')
    .trim()
    .isLength({ min: 3 })
    .withMessage('用户名至少3个字符'),
  body('email')
    .isEmail()
    .withMessage('邮箱格式不正确'),
  body('phone')
    .optional()
    .matches(/^1[3-9]\d{9}$/)
    .withMessage('手机号格式不正确')
];

export const passwordValidation = [
  body('oldPassword')
    .isLength({ min: 6 })
    .withMessage('原密码不能为空'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('新密码至少8位')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)/)
    .withMessage('密码需包含字母和数字')
];

//确保 validateMiddleware.js 包含结果处理
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};