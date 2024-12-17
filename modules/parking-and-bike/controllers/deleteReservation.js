import prisma from "../../../core/db/prismaInstance.js";

const deleteReservation = async (req, res) => {
    const { reservation_id } = req.params;

    try {
        const deletedReservation = await prisma.parking_reservation.delete({
            where: {
                id: parseInt(reservation_id)
            },
        });

        res.json({
            message: "Reservation deleted successfully",
            deletedReservation
        });
    } catch (error) {
        console.error("Error deleting reservation:", error);
        res.status(500).json({ error: "Error deleting reservation" });
    }
};

export { deleteReservation };
