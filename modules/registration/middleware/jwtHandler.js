import jwt from "jsonwebtoken";

const verifyAccessToken = (req, res, next) => {
  // request coming from server
  const authHeader = req.headers.Authorization || req.headers.authorization;

  // request coming from dialogflow cx
  const sessionId = null;

  const token =
    req.cookies.token ||
    (authHeader &&
      authHeader?.startsWith("Bearer ") &&
      authHeader.split(" ")[1]);
  if (!token) {
    return res.status(401).send("Unauthorized access");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.token = token;
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
