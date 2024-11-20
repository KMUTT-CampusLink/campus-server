import prisma from "../../../core/db/prismaInstance.js";
import jwt from "jsonwebtoken";

const postHelp = async (req, res) => {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // const user_id = decoded.id
    
    const { user_name, user_email, user_content } = req.body;

    try {

        const help = await prisma.parking_help.create({
            data: {
                user_id: decoded.id,
                name: user_name,
                email: user_email,
                content: user_content
            }
        });

        console.log("Create help request successfully!");
        res.json(help);

    } catch (error) {
        console.error("Error processing help:", error);
        res.status(400).json({ error: "Error processing help" });
    }
};

export { postHelp };