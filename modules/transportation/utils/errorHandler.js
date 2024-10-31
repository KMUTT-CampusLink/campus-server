const errorHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    if (err.code) {
      res.status(err.code).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
};

export default errorHandler;
