// import prisma from "../../../core/db/prismaInstance.js";

// const postReservation = async (req, res) => {
//     const { car_id, parking_slot_id, reserve_time } = req.body;

//     try {
//         const postReservation = await prisma.parking_reservation.create({
//             data: {
//                 car_id,
//                 parking_slot_id,
//                 reserve_time
//             },
//         });
//         await prisma.parking_slot.update({
//             where: { id: parking_slot_id },
//             data: { status: false }
//         });

//         res.json({
//             message: 'Reservation created successfully!',
//             reservation : postReservation
//         });
//     } catch (error) {
//         console.error("Error reservation:", error);
//         res.status(500).json({ error: "Error reservation" });
//     }
// };

// export { postReservation };

//just reserve



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
        
        const current_time = new Date();
        const reserve_date = new Date(reserve_time);
        const expire_time = new Date(reserve_date.getTime() + 30000); // 10000 = 10 sec, 30 * 60000 = 30 min

        if (reserve_date < current_time) {
            return res.status(400).json({ error: "Cannot make a reservation in the past." });
        }

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

        const remainingTime = expire_time.getTime() - current_time.getTime();

        // console.log(`Reserve Time: ${reserve_date}`);
        // console.log(`Expire Time: ${expire_time}`);
        // console.log(`Current Time: ${current_time}`);
        // console.log(`Remaining Time: ${remainingTime}`);

        setTimeout(async () => { // setTimeout won't work while code error
            try {
                await prisma.parking_reservation.delete({
                    where: { id: postReservation.id }
                });

                await prisma.parking_slot.update({
                    where: { id: parking_slot_id },
                    data: { status: true }
                });

                console.log(`Reservation id: ${postReservation.id} expired and deleted at: ${expire_time}`);
            } catch (error) {
                console.error("Error deleting expired reservation:", error);
            }
        }, remainingTime);

        console.log("Reservation id: " + postReservation.id + " created successfully!");
        
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


// reserve and delete expired reservation

// {
//     "car_id": 1,
//     "parking_slot_id": 1006,
//     "reserve_time": "2024-11-21T23:03:00"
// }
