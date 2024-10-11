const successResponse = (res, data, status = 200) => {
  res.status(status).json({
    success: true,
    data,
  });
};

// not used now
// const errorResponse = (res, message, status = 400) => {
//   res.status(status).json({
//     success: false,
//     message,
//   });
// };

module.exports = {
  successResponse,
};
