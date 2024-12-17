import prisma from "../../../core/db/prismaInstance.js";

export const addLostAndFoundList = async (req, res) => {
    const {
        reporter_id,
        name,
        description,
        found_location,
        status,
        owner_id
    } = req.body;

    try {
        const getThailandTime = () => {
            const now = new Date();
            return new Date(now.getTime() + 7 * 60 * 60 * 1000); // Add 7 hours for ICT
        };
        const newLostAndFound = await prisma.lost_and_found.create({
            data: {
                reporter_id,
                name,
                description,
                found_location,
                status,
                owner_id,
                created_at: getThailandTime(), // Set current time as creation time
                updated_at: getThailandTime()  // Set current time as updated time
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
