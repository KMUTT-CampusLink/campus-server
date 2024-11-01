import prisma from "../../../core/db/prismaInstance.js";

const postReservation = async (req, res) => {
    const { car_id, parking_slot_id } = req.body;

    try {
        const postReservation = await prisma.parking_reservation.create({
            data: {
                car_id,
                parking_slot_id
            },
        });

        res.json({
            message: 'Reservation created successfully!',
            reservation : postReservation
        });
    } catch (error) {
        console.error("Error reservation:", error);
        res.status(500).json({ error: "Error reservation" });
    }
};

export { postReservation };