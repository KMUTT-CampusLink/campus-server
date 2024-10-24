export default function errorHandler(fn) {
  return async function (req, res, next) {
    try {
      await fn(req, res, next);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: `Internal server error: ${error.message}` });
    }
  };
}
