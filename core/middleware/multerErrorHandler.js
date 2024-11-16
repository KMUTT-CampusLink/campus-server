export default function (err, req, res, next) {
  if (err) {
    res.status(400).send("Upload failed");
  } else {
    next();
  }
}
