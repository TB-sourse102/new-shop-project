export default (err, req, res, next) => {
  console.error('全局错误:', err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? '服务器错误' 
    : err.message;

  res.status(statusCode).json({
    success: false,
    message
  });
};