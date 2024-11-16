import prisma from "../../../core/db/prismaInstance.js";
import crypto from "crypto";
import zlib from "zlib";
import jwt from "jsonwebtoken";

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

const postReservation = async (req, res) => {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // const user_id = decoded.id

    const { parking_slot_id, reserve_time } = req.body;

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

        const verifiedCar = await prisma.verified_car.findFirst({
            where: { user_id: decoded.id }
        }); // Is there car id in verified_car
        
        const existingReservation = await prisma.parking_reservation.findFirst({
            where: {
                car_id: verifiedCar.id,
                status: {
                    in: ['Reserved', 'Occupied']
                }
            }
        }); // check 1 car 1 slot
        
        const slot = await prisma.parking_slot.findUnique({
            where: { id: parking_slot_id },
            include: {
                floor: {
                    include: {
                        building: true
                    }
                }
            }
        }); // Is there slot id in parking_slot

        const today = new Date();
        const [hours, minutes] = reserve_time.split(":").map(Number);
        today.setHours(hours, minutes, 0, 0); //set time hour and min from reserve_time
        
        const new_reserve_time = today;

        const end_of_day = new Date();
        end_of_day.setHours(23, 59, 59, 999);

        const expire_time = new Date(new_reserve_time.getTime() + 30 * 60000); // 10000 = 10 sec, 30 * 60000 = 30 min
        
        const current_time = new Date()

        if (new_reserve_time < current_time) {
            return res.status(400).json({ error: "Cannot make a reservation in the past." });
        // }else if (existingReservation) {
        //     return res.status(400).json({ error: `Car with ID ${verifiedCar.id} already has an active reservation.` }); // 1 car 1 slot
        }else if (!verifiedCar) {
            return res.status(400).json({ error: `Car with ID ${verifiedCar.id} is not verified.` });
        }else if (!slot) {
            return res.status(400).json({ error: `Parking slot with ID ${parking_slot_id} does not exist.` });
        } else if (!slot.status) {
            return res.status(400).json({ error: `Parking slot with ID ${parking_slot_id} is already reserved.` });
        }

        const postReservation = await prisma.parking_reservation.create({
            data: {
                car_id: verifiedCar.id,
                parking_slot_id,
                reserve_time: new_reserve_time
            },
        });

        await prisma.parking_slot.update({
            where: { id: parking_slot_id },
            data: { status: false }
        });

        const remainingTime = expire_time.getTime() - current_time.getTime();

        // console.log(`Reserve Time: ${new_reserve_time}`);
        // console.log(`Expire Time: ${expire_time}`);
        // console.log(`Current Time: ${current_time}`);
        // console.log(`Remaining Time: ${remainingTime}`);

        setTimeout(async () => { // setTimeout won't work while code error
            try {
                const reservationStatus = await prisma.parking_reservation.findUnique({
                    where: { id: postReservation.id },
                    select: { status: true }
                });

                if (reservationStatus.status == 'Reserved') {
                    await prisma.parking_reservation.update({
                        where: { id: postReservation.id },
                        data: { status: 'Expired' }
                    });

                    await prisma.parking_slot.update({
                        where: { id: parking_slot_id },
                        data: { status: true }
                    });

                    console.log(`Reservation id: ${postReservation.id} expired at: ${expire_time}`);
                } else {
                    console.log(`Reservation id: ${postReservation.id} has occupied or complete`);
                }
            } catch (error) {
                console.error("Error update expired reservation:", error);
            }
        }, remainingTime);

        console.log( "Reservation " + postReservation.id + " created successfully! ");
        console.log( "Reserve at: " + new_reserve_time + " Expire at: " + expire_time);

        const responseData = {
            reservation_id: postReservation.id,
            car_id: verifiedCar.id,
            slot_id: parking_slot_id
        };

        const encryptedData = encrypt(responseData);

        res.json({
            message: 'Reservation created successfully!',
            QRCode: encryptedData ,
            reservation_id: postReservation.id,
            user_id: decoded.id,
            car_id: verifiedCar.id,
            license_no: verifiedCar.license_no,
            building_name: slot.floor.building.name,
            floor_name: slot.floor.name,
            slot_name: slot.name,
            reserve_time: new_reserve_time,
            expire_time: expire_time
        });

    } catch (error) {
        console.error("Error creating reservation:", error);
        res.status(500).json({ error: "Error creating reservation" });
    }
};

export { postReservation };