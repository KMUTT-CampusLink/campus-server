import prisma from "../../../core/db/prismaInstance.js";

const postCheckout = async (req, res) => {
    const { reservation_id, checkout_time } = req.body;

    try {
        // const reservation = await prisma.parking_reservation.findUnique({   // select only we type
        //     where: { id: reservation_id },
        //     select: {
        //         reserve_time: true,
        //         verified_car: {
        //             select: {
        //                 user_id: true,
        //                 license_no: true
        //             }
        //         },
        //         parking_slot_id: true
                
        //     }
        // });

        const reservation = await prisma.parking_reservation.findUnique({ // use include to combine table. It will select * from every table
            where: { id: reservation_id },
            include: {
                verified_car: true,
                parking_slot: true
            }
        });
        

        if (!reservation) {
            return res.status(400).json({ error: `Reservation with ID ${reservation_id} does not exist.` });
        } else  if (reservation.status !== 'Occupied') {
            return res.status(400).json({ error: "Cannot check out. The reservation status must be 'Occupied'." });
        }

        const reserve_time = new Date(reservation.reserve_time);
        const parking_until = new Date(reserve_time.getTime() + 4 * 60 * 60 * 1000);

        const today = new Date();
        const [hours, minutes] = checkout_time.split(":").map(Number);
        today.setHours(hours, minutes, 0, 0);
        const checkoutTime = today; // change format from "21:00" to Date

        const pay_due_date = new Date(checkoutTime.getTime() + 24 * 60 * 60 * 1000);
        
        let over_hour = 0;
        let over_amount = 0;
        let allAmount = 40; // base amount when reserve
        let overtimeDetails = null;

        if(checkoutTime < reserve_time) {
            return res.status(400).json({ error: "Cannot check out before the reserved time. Are you crazy ror" });
        }   // if you wanna try to check out next day have to wait for tomorrow because use parameter Date() / today

        else if (checkoutTime > parking_until) {
            const over_time = checkoutTime - parking_until;
            over_hour = Math.ceil(over_time / (60 * 60 * 1000)); // Round up to nearest hour
            over_amount = over_hour * 20; // 20 baht per hour
            allAmount += over_amount; // add over_hours to reservation 40 bath

            overtimeDetails = {
                over_hour,
                over_amount
            };
        }

        await prisma.invoice.create({
            data: {
                user_id: reservation.verified_car.user_id,
                issued_by: "parking-and-bike",
                issued_date: checkoutTime,
                due_date: pay_due_date,
                amount: allAmount,
                title: `Reservation 40 Baht + Over time ${over_hour} hours ${over_amount} Baht Total: ${allAmount} Baht `
            }
        });

        await prisma.parking_reservation.update({
            where: { id: reservation_id },
            data: { status: 'Completed' }
        });

        await prisma.parking_slot.update({
            where: { id: reservation.parking_slot_id },
            data: { status: true }
        });

        res.json({
            message: 'Checkout and Invoice completed successfully!',
            reservation_id: reservation_id,
            license_no: reservation.verified_car.license_no,
            reserve_time: reservation.reserve_time,
            parking_until: parking_until,
            checkout_at: checkoutTime,
            overtimeDetails,
            Total: allAmount,
            pay_due_date

        });

    } catch (error) {
        console.error("Error processing checkout and invoice:", error);
        res.status(400).json({ error: "Error processing checkout and invoice" });
    }
};

export { postCheckout };