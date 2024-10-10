import jwt from "jsonwebtoken";

const verifyAccessToken = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).send("Unauthorized access");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
      campus_email: decoded.campus_email,
      role: decoded.role,
    };
    next();
  } catch (error) {
    return res.status(403).send("Invalid token");
  }
};

export { verifyAccessToken };
