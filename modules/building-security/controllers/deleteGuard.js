import prisma from "../../../core/db/prismaInstance.js";

export const deleteGuard = async (req, res) => {
    try {
        const { id } = req.params; // Extract `id` from the request parameters

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Guard ID is required.",
            });
        }

        // Ensure the ID is parsed as an integer
        const deletedGuard = await prisma.guard_schedule.delete({
            where: {
                id: parseInt(id, 10), // Parse the ID as a base-10 integer
            },
        });

        res.status(200).json({
            success: true,
            message: "Guard deleted successfully.",
            deletedGuard,
        });
    } catch (error) {
        console.error("Error deleting guard:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete the guard.",
            error: error.message,
        });
    }
};
