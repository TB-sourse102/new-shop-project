export const successResponse = (res, data, message = 'success') => {
  res.status(200).json({
    success: true,
    message,
    data
  });
};

export const errorResponse = (res, statusCode = 500, message = '服务器错误') => {
  res.status(statusCode).json({
    success: false,
    message
  });
};