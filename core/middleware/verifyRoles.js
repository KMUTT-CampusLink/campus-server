const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.user?.role) return res.status(401).send("Unauthorized access");
    const isAllowed =
      [...allowedRoles].filter(
        (role) => role.toLowerCase() === req.user.role.toLowerCase()
      ).length > 0;
    if (!isAllowed) return res.status(401).send("Unauthorized access");
    next();
  };
};

export default verifyRoles;
