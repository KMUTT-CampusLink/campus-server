import prisma from "../../../core/db/prismaInstance.js";
import jwt from "jsonwebtoken";

const postRegisterCar = async (req, res) => {
    // ตรวจสอบ Token
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: "Unauthorized access. Token is missing." });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return res.status(401).json({ error: "Unauthorized access. Invalid token." });
    }

    const { name, license_no } = req.body;

    try {
        // ตรวจสอบว่าผู้ใช้มีรถลงทะเบียนอยู่แล้วหรือไม่
        const existingCar = await prisma.verified_car.findFirst({
            where: {
                OR: [
                    { user_id: decoded.id },
                    { license_no: license_no }
                ]
            }
        });

        if (existingCar) {
            // ตรวจสอบว่า user มีรถลงทะเบียนอยู่แล้วหรือไม่
            if (existingCar.user_id === decoded.id) {
                return res.status(400).json({ error: "Each user can only register one car." });
            }
            // ตรวจสอบว่า license_no มีอยู่แล้วหรือไม่
            if (existingCar.license_no === license_no) {
                return res.status(400).json({ error: "This license number is already registered." });
            }
        }

        // หากผ่านการตรวจสอบ สร้างรถใหม่
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