import prisma from "../../../core/db/prismaInstance.js";
import crypto from "crypto";

// Define encryption parameters
const ENCRYPTION_KEY = crypto.randomBytes(32); // 32 bytes for AES-256
const IV_LENGTH = 16; // AES block size

// Encrypt function
function encrypt(data) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`; // Return IV and encrypted data
}

const postReservation = async (req, res) => {
    const { car_id, parking_slot_id, reserve_time } = req.body;

    try {
        const slot = await prisma.parking_slot.findUnique({
            where: { id: parking_slot_id },
            include: {
                floor: {
                    include: {
                        building: true
                    }
                }
            }
        });

        const verifiedCar = await prisma.verified_car.findUnique({
            where: { id: car_id },
            select: { license_no: true }
        });

        if (!verifiedCar) {
            return res.status(400).json({ error: `Car with ID ${car_id} is not verified.` });
        }

        if (!slot) {
            return res.status(400).json({ error: `Parking slot with ID ${parking_slot_id} does not exist.` });
        } else if (!slot.status) {
            return res.status(400).json({ error: `Parking slot with ID ${parking_slot_id} is already reserved.` });
        }
        
        const current_time = new Date();
        const reserve_date = new Date(reserve_time);
        const max_reserve_date = new Date(current_time.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days after current_time
        const expire_time = new Date(reserve_date.getTime() + 30000); // 10000 = 10 sec, 30 * 60000 = 30 min

        if (reserve_date < current_time) {
            return res.status(400).json({ error: "Cannot make a reservation in the past." });
        } else if (reserve_date > max_reserve_date) {
            return res.status(400).json({ error: "Reservations cannot be made more than 7 days." });
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

        console.log( "Reservation id: " + postReservation.id + " created successfully! " + "And expire at: " + expire_time );

        const responseData = {
            license_no: verifiedCar.license_no,
            building_name: slot.floor.building.name,
            floor_name: slot.floor.name,
            slot_name: slot.name,
            reserve_time: reserve_date,
            expire_time: expire_time
        };

        const encryptedData = encrypt(responseData);

        res.json({
            message: 'Reservation created successfully!',
            encryptedData: encryptedData ,
            Reservation_id: postReservation.id,
            responseData
        });

    } catch (error) {
        console.error("Error creating reservation:", error);
        res.status(500).json({ error: "Error creating reservation" });
    }
};

export { postReservation };
