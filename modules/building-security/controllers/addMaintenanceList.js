import prisma from "../../../core/db/prismaInstance.js";
export const addMaintenanceRequest = async (req, res) => {
    const {
        user_id,
        location,
        type,
        description,
        priority,
        status
    } = req.body;

    try {
        // Convert the current time to Thailand time
        const getThailandTime = () => {
            const now = new Date();
            return new Date(now.getTime() + 7 * 60 * 60 * 1000); // Add 7 hours for ICT
        };

        const newRequest = await prisma.maintenance_request.create({
            data: {
                user_id,
                location,
                type,
                description,
                priority,
                status,
                created_at: getThailandTime(),
                updated_at: getThailandTime(),
            },
        });

        res.status(201).json({
            success: true,
            data: newRequest,
        });
    } catch (error) {
        console.error("Error adding maintenance request:", error);
        res.status(500).json({
            success: false,
            message: "Failed to add maintenance request",
            error: error.message,
        });
    } finally {
        await prisma.$disconnect();
    }
};
