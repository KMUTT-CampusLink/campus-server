import prisma from "../../../core/db/prismaInstance.js";

export const getLostAndFoundList = async (req, res) => {
    try {

        const lostAndFoundItems = await prisma.lost_and_found.findMany({
            orderBy: { created_at: 'desc' },
        });

        res.status(200).json({
            success: true,
            data: lostAndFoundItems,
        });
    } catch (error) {
        console.error('Error fetching lost and found list:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve lost and found list',
            error: error.message,
        });
    } finally {
        await prisma.$disconnect();
    }
};


