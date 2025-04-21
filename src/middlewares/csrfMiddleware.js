import csrf from 'csurf';

export const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    sameSite: 'strict', // 严格模式
    secure: process.env.NODE_ENV === 'production' // 生产环境启用HTTPS
  }
});