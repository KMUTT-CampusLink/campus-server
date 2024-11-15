import prisma from "../../../core/db/prismaInstance.js";
import jwt from "jsonwebtoken";

const postRegisterCar = async (req, res) => {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // const user_id = decoded.id

    const { name, license_no } = req.body;

    try {
        const existingCar = await prisma.verified_car.findFirst({
            where: {
                OR: [
                    { user_id: decoded.id },
                    { license_no: license_no }
                ]
            }
        });

        if (existingCar) {
            if (existingCar.user_id === decoded.id) {
                return res.status(400).json({ error: "Each user can only register one car." });
            }
            if (existingCar.license_no === license_no) {
                return res.status(400).json({ error: "This license number is already registered." });
            }
        }

        const car = await prisma.verified_car.create({
            data: {
                user_id: decoded.id,
                license_no: license_no
            }
        });

        res.json({
            message: 'Register Car successfully!',
            user_id: decoded.id,
            name: name,
            car_id: car.car_id,
            license_no: license_no
        });

    } catch (error) {
        console.error("Error processing register car:", error);
        res.status(500).json({ error: "Error processing register car" });
    }
};

export { postRegisterCar };