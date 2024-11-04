import prisma from "../../../core/db/prismaInstance.js";

const deleteReservation = async (req, res) => {
    const { reservation_id } = req.params;

    try {
        //find id and to get parking_slot_id
        const reservation = await prisma.parking_reservation.findUnique({
            where: {
                id: parseInt(reservation_id),
            },
        });

        if (!reservation) {
            return res.status(404).json({ error: `Reservation with ID ${reservation_id} does not exist.` });
        }

        const { parking_slot_id } = reservation;
        
        const deletedReservation = await prisma.parking_reservation.delete({
            where: {
                id: parseInt(reservation_id)
            },
        });

        await prisma.parking_slot.update({
            where: { id: parking_slot_id },
            data: { status: true }
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

// to delete by Admin
