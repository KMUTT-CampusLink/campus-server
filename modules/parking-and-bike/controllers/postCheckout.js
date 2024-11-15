import prisma from "../../../core/db/prismaInstance.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const postCheckout = async (req, res) => {

    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: "Unauthorized access. Token is missing." });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return res.status(401).json({ error: "Unauthorized access. Invalid token." });
    }

    const { reservation_id, checkout_time } = req.body;

    try {
        const reservation = await prisma.parking_reservation.findUnique({
            where: { id: reservation_id },
            include: {
                verified_car: true,
                parking_slot: true
            }
        });

        // Check if reservation exists and belongs to the user
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

        const pay_due_date = new Date(checkoutTime.getTime() + 24 * 60 * 60 * 1000); // Due date 24 hours from checkout

        // Calculate overstay fees if applicable
        let over_hour = 0;
        let over_amount = 0;
        let totalAmount = 40; // Base amount when reserving
        let overtimeDetails = null;

        if (checkoutTime < reserve_time) {
            return res.status(400).json({ error: "Cannot check out before the reserved time." });
        } else if (checkoutTime > parking_until) {
            const over_time = checkoutTime - parking_until;
            over_hour = Math.ceil(over_time / (60 * 60 * 1000)); // Round up to the nearest hour
            over_amount = over_hour * 20; // 20 baht per hour
            totalAmount += over_amount; // Add overtime fees to total amount

            overtimeDetails = {
                over_hour,
                over_amount
            };
        }

        // Create an invoice for the parking
        await prisma.invoice.create({
            data: {
                user_id: reservation.verified_car.user_id,
                issued_by: "parking-and-bike",
                issued_date: checkoutTime,
                due_date: pay_due_date,
                amount: totalAmount,
                title: `Reservation 40 Baht + Over time ${over_hour} hours ${over_amount} Baht Total: ${totalAmount} Baht`
            }
        });

        // Update reservation and slot status
        await prisma.parking_reservation.update({
            where: { id: reservation_id },
            data: { status: 'Completed' }
        });

        await prisma.parking_slot.update({
            where: { id: reservation.parking_slot_id },
            data: { status: true }
        });

        // Send response
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
            totalAmount,
            pay_due_date
        });

    } catch (error) {
        console.error("Error processing checkout and invoice:", error);
        res.status(500).json({ error: "Error processing checkout and invoice" });
    }
};

export { postCheckout };
