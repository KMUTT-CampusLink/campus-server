import prisma from "../../../core/db/prismaInstance.js";
import crypto from "crypto";
import zlib from "zlib";

const ENCRYPTION_KEY = crypto.randomBytes(32);
const IV_LENGTH = 16;

function encrypt(data) {
    const compressedData = zlib.deflateSync(JSON.stringify(data));
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    const encrypted = Buffer.concat([
        cipher.update(compressedData),
        cipher.final()
    ]);
    return `${iv.toString('base64')}:${encrypted.toString('base64')}`;
}

const postCheckin = async (req, res) => {
    const user = req.user
    const { reservation_id, checkin_time } = req.body;

    try {

        const unpaidInvoice = await prisma.invoice.findFirst({
            where: {
                user_id: user.id,
                status: "Unpaid",
            },
        });

        if (unpaidInvoice) {
            return res.status(403).json({ error: "Cannot make a new reservation due to unpaid invoices." });
        }
        
        const reservation = await prisma.parking_reservation.findUnique({
            where: { id: reservation_id },
            include: {
                parking_slot: {
                    include: {
                        floor: {
                            include: {
                                building: true
                            }
                        }
                    }
                },
                verified_car: true
            }
        });

        if (!reservation) {
            return res.status(400).json({ error: `Reservation with ID ${reservation_id} does not exist.` });
        } else if (reservation.verified_car.user_id !== user.id) {
            return res.status(403).json({ error: "Unauthorized access. You do not own this reservation." });
        } else if (reservation.status !== 'Reserved') {
            return res.status(400).json({ error: "Cannot check in. The reservation status must be 'Reserved'." });
        }

        const reserve_time = new Date(reservation.reserve_time);
        const parking_until = new Date(reservation.reserve_time.getTime() + 4 * 60 * 60 * 1000); // 4 hours from reserve time
        const expire_time = new Date(reserve_time.getTime() + 30 * 60000); // 30 minutes from reserve time

        const today = new Date();
        const [hours, minutes] = checkin_time.split(":").map(Number);
        today.setHours(hours, minutes, 0, 0);
        const checkinTime = today;

        if (checkinTime < reserve_time) {
            return res.status(400).json({ error: "Cannot check in before the reserved time." });
        } else if (checkinTime > expire_time) {
            return res.status(400).json({ error: "Cannot check in after 30 minutes from the reserve time." });
        }

        await prisma.parking_reservation.update({
            where: { id: reservation_id },
            data: { status: 'Occupied' }
        });

        const responseData = {
            reservation_id: reservation_id,
            car_id: reservation.car_id,
            slot_id: reservation.parking_slot_id
        };
        const encryptedData = encrypt(responseData);

        res.json({
            message: 'QR Checkout created successfully!',
            QRCode: encryptedData,
            reservation_id: reservation_id,
            user_id: user.id,
            car_id: reservation.car_id,
            license_no: reservation.verified_car.license_no,
            building_name: reservation.parking_slot.floor.building.name,
            floor_name: reservation.parking_slot.floor.name,
            slot_name: reservation.parking_slot.name,
            reserve_time: reserve_time,
            parking_until: parking_until,
            checkin_at: checkinTime
        });

    } catch (error) {
        console.error("Error processing QR checkout:", error);
        res.status(500).json({ error: "Error processing QR checkout" });
    }
};

export { postCheckin };
