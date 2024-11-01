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



// Submit a parking reservation
const submitReservation = async (req, res) => {
    try {
        const { car_id, building_id, floor_id, parking_slot_id } = req.body;

        const newReservation = await prisma.parking_reservation.create({
            data: {
                car_id,
                building_id,
                floor_id,
                parking_slot_id,
                status: 'reserved', // Assuming you use a status field
            },
        });

        res.json({
            message: 'Reservation created successfully!',
            reservation: newReservation,
        });
    } catch (error) {
        res.status(500).json({
            error: 'Failed to create reservation',
            details: error.message,
        });
    }
};

export { submitReservation };
