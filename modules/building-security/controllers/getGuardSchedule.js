import prisma from "../../../core/db/prismaInstance.js";

export const getGuardSchedule = async (req, res) => {
    try {
        // Fetching the guard schedule from the database without including relations
        const guardSchedules = await prisma.guard_schedule.findMany({
            orderBy: { created_at: 'desc' }, // You can change the field and order as needed
        });

        // Sending the response back with the fetched data
        res.status(200).json({
            success: true,
            data: guardSchedules,
        });
    } catch (error) {
        // Logging the error and sending a failure response
        console.error('Error fetching guard schedule:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve guard schedule',
            error: error.message,
        });
    } finally {
        // Disconnecting Prisma Client
        await prisma.$disconnect();
    }
};
