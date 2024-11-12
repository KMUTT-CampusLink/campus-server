import jwt from "jsonwebtoken";

export default async function validateRoles(req, res) {
    const token = req.cookies.token;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return res.status(200).json(decoded.role);
    } catch (error) {
        return res.status(403).send("Invalid token");
    }
}