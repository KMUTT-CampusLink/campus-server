import prisma from "../../../core/db/prismaInstance.js";
import jwt from "jsonwebtoken";

const postCheckout = async (req, res) => {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // const user_id = decoded.id
    const { reservation_id, checkout_time } = req.body;

    try {

        const unpaidInvoice = await prisma.invoice.findFirst({
            where: {
                user_id: decoded.id,
                status: "Unpaid",
            },
        });

        if (unpaidInvoice) {
            return res.status(403).json({ error: "Cannot make a new reservation due to unpaid invoices." });
        }

        const reservation = await prisma.parking_reservation.findUnique({
            where: { id: reservation_id },
            include: {
                verified_car: true,
                parking_slot: true
            }
        });

        if (!reservation) {
            return res.status(400).json({ error: `Reservation with ID ${reservation_id} does not exist.` });
        } else if (reservation.verified_car.user_id !== decoded.id) {
            return res.status(403).json({ error: "Unauthorized access. You do not own this reservation." });
        } else if (reservation.status !== 'Occupied') {
            return res.status(400).json({ error: "Cannot check out. The reservation status must be 'Occupied'." });
        }

        const reserve_time = new Date(reservation.reserve_time);
        const parking_until = new Date(reserve_time.getTime() + 4 * 60 * 60 * 1000); // 4 hours from reserve time

        const today = new Date();
        const [hours, minutes] = checkout_time.split(":").map(Number);
        today.setHours(hours, minutes, 0, 0);
        const checkoutTime = today;

        const due_date = new Date(checkoutTime);
        due_date.setFullYear(due_date.getFullYear() + 1); // เพิ่ม 1 ปีจาก checkoutTime

        let over_hour = 0;
        let over_amount = 0;
        let totalAmount = 40; // Base amount when reserving
        let overtimeDetails = null;

        if (checkoutTime < reserve_time) {
            return res.status(400).json({ error: "Cannot check out before the reserved time." });
        }

        else if (checkoutTime > parking_until) {
            const over_time = checkoutTime - parking_until;
            over_hour = Math.ceil(over_time / (60 * 60 * 1000)); // Round up to the nearest hour
            over_amount = over_hour * 20; // 20 baht per hour
            totalAmount += over_amount; // Add overtime fees to total amount

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
                due_date: due_date,
                amount: totalAmount,
                title: `Reservation 40 Baht + Over time ${over_hour} hours ${over_amount} Baht Total: ${totalAmount} Baht`
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
            user_id: decoded.id,
            car_id: reservation.verified_car.id,
            license_no: reservation.verified_car.license_no,
            reserve_time: reservation.reserve_time,
            parking_until: parking_until,
            checkout_at: checkoutTime,
            overtimeDetails,
            totalAmount
        });

    } catch (error) {
        console.error("Error processing checkout and invoice:", error);
        res.status(500).json({ error: "Error processing checkout and invoice" });
    }
};

export { postCheckout };
