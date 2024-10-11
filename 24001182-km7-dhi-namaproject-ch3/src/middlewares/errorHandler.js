const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Terjadi kesalahan. Silakan coba lagi nanti.",
  });
};

const NotFoundURLHandler = (req, res, next) => {
  res.status(404).json({ success: false, message: " URL not found" });
};
module.exports = {errorHandler, NotFoundURLHandler};
