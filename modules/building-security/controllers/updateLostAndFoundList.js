import prisma from "../../../core/db/prismaInstance.js"; // Adjust path as needed

export const updateLostAndFoundList = async (req, res) => {
    const { id } = req.params; // Get the ID from the route parameters
    const { status } = req.body; // Get the new status from the request body

    try {
        const getThailandTime = () => {
            const now = new Date();
            return new Date(now.getTime() + 7 * 60 * 60 * 1000); // Add 7 hours for ICT
        };
        const updatedLostAndFound = await prisma.lost_and_found.update({
            where: { id: parseInt(id) }, // Ensure ID is an integer
            data: {
                status,
                updated_at: getThailandTime(), // Set updated_at to the current date and time
            },
        });

        // Send a success response
        res.status(200).json({
            success: true,
            data: updatedLostAndFound,
        });
    } catch (error) {
        // Handle errors, such as if the ID doesn't exist
        console.error("Error updating lost and found item status:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update lost and found item status",
            error: error.message,
        });
    } finally {
        // Disconnect the Prisma Client
        await prisma.$disconnect();
    }
};
