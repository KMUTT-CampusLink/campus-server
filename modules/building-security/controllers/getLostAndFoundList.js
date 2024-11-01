import prisma from "../../../core/db/prismaInstance.js";

// Define getLostAndFoundList function
export const getLostAndFoundList = async (req, res) => {
    try {
        // Query the LostAndFound table for all records
        const lostAndFoundItems = await prisma.lost_and_found.findMany({
            orderBy: { created_at: 'desc' }, // Optionally order by dateReported
        });

        // Send the retrieved list as JSON
        res.status(200).json({
            success: true,
            data: lostAndFoundItems,
        });
    } catch (error) {
        // Handle any errors
        console.error('Error fetching lost and found list:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve lost and found list',
            error: error.message,
        });
    } finally {
        // Disconnect the Prisma Client
        await prisma.$disconnect();
    }
};


