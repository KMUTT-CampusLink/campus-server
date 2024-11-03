import prisma from "../../../core/db/prismaInstance.js";

const postReservation = async (req, res) => {
    const { car_id, parking_slot_id, reserve_time } = req.body;

    try {
        const slot = await prisma.parking_slot.findUnique({
            where: { id: parking_slot_id }
        });

        if (!slot) {
            return res.status(400).json({ error: `Parking slot with ID ${parking_slot_id} does not exist.` });
        } else if (!slot.status) {
            return res.status(400).json({ error: `Parking slot with ID ${parking_slot_id} is already reserved.` });
        }
        
        const reserve_date = new Date(reserve_time);
        const expire_time = new Date(reserve_date.getTime() + 30 * 60000);

        const postReservation = await prisma.parking_reservation.create({
            data: {
                car_id,
                parking_slot_id,
                reserve_time: reserve_date
            },
        });

        await prisma.parking_slot.update({
            where: { id: parking_slot_id },
            data: { status: false }
        });

        const currentTime = new Date();
        const remainingTime = expire_time.getTime() - currentTime.getTime();

        setTimeout(async () => {
            try {
                await prisma.parking_reservation.delete({
                    where: { id: postReservation.id }
                });

                await prisma.parking_slot.update({
                    where: { id: parking_slot_id },
                    data: { status: true }
                });

                console.log(`Reservation expired and deleted at ${expire_time}`);
            } catch (error) {
                console.error("Error deleting expired reservation:", error);
            }
        }, remainingTime);

        res.json({
            message: 'Reservation created successfully!',
            reservation: { 
                "car_id" : car_id,
                "parking_slot_id" : parking_slot_id,
                "reserve_time" : reserve_date,
                "expire_time" : expire_time
            }
        });
    } catch (error) {
        console.error("Error creating reservation:", error);
        res.status(500).json({ error: "Error creating reservation" });
    }
};

export { postReservation };