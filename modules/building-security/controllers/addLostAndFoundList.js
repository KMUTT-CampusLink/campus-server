import prisma from "../../../core/db/prismaInstance.js";
import { decodeToken } from "../middleware/jwt.js"

export const addLostAndFoundList = async (req, res) => {
    const token = req.cookies.token;
    const decode = decodeToken(token);
    console.log(decode);
    const {
        floor_id,
        description,
        status,
        owner_id
    } = req.body;

    try {
        const nameData = await prisma.student.findFirst({
            select: {
                firstname: true,
                lastname: true,
            },
            where: {
                user_id: decode.id,
            },
        }) || await prisma.employee.findFirst({
            select: {
                firstname: true,
                lastname: true,
            },
            where: {
                user_id: decode.id,
            },
        });
        const buildingId = await prisma.floor.findFirst({
            select: {
                building_id: true,
            },
            where: {
                id: floor_id,
            },
        })

        // Extract the name if found
        const name = nameData?.firstname+" "+nameData?.lastname || null;

        if (!name) {
            return res.status(404).json({
                success: false,
                message: "User not found in both student and employee records",
            });
        }

        const newLostAndFound = await prisma.lost_and_found.create({
            data: {
                reporter_id: decode.id,
                name: name,
                description,
                // found_location,
                status,
                owner_id,
                building_id: buildingId.building_id,
            },
        });

        res.status(201).json({
            success: true,
            data: newLostAndFound,
        });
    } catch (error) {
        console.error("Error adding lost and found item:", error);
        res.status(500).json({
            success: false,
            message: "Failed to add lost and found item",
            error: error.message,
        });
    } finally {
        await prisma.$disconnect();
    }
};
