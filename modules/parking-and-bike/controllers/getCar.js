import prisma from "../../../core/db/prismaInstance.js";
import jwt from "jsonwebtoken";

const getCar = async (req, res) => {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // const user_id = decoded.id

    try {
        const verifiedCar = await prisma.verified_car.findFirst({
            where: {
                user_id: decoded.id,
                license_no: {
                    not: null, // Ensure license_no is not null
                },
            },
        });

        // Respond with true if a verified car with a license_no exists, otherwise false
        res.json({ verified: !!verifiedCar });
    } catch (error) {
        console.error("Error fetching car:", error);
        res.status(500).json({ error: "Error fetching car" });
    }
};

export { getCar };
