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

function formatDateTime(date) {
  // Format date: "17 Sep 2024"
  const day = date.getDate();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  const formattedDate = `${day} ${month} ${year}`;

  // Format time: "03:30 PM"
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const formattedTime = `${hours}:${minutes} ${ampm}`;

  return { formattedDate, formattedTime };
}

const getChecking = async (req, res) => {
  const user = req.user;

  try {
    const reservation = await prisma.parking_reservation.findFirst({
      where: {
        verified_car: {
          user_id: user.id,
        },
        OR: [
          { status: "Reserved" }, 
          { status: "Occupied" },
        ],
      },
      include: {
        verified_car: true,
        parking_slot: {
          include: {
            floor: {
              include: {
                building: true,
              },
            },
          },
        },
      },
    });

    if (!reservation) {
      return res.status(404).json({
        message: "No active reservations found.",
      });
    }

    const reserveTime = new Date(reservation.reserve_time);
    const parkingUntil = new Date(reserveTime.getTime() + 4 * 60 * 60 * 1000);
    const expireTime = new Date(reserveTime.getTime() + 30 * 60000);

    const { formattedDate: reserveDate, formattedTime: reserveFormattedTime } = formatDateTime(reserveTime);
    const { formattedTime: expireFormattedTime } = formatDateTime(expireTime);
    const { formattedTime: parkingUntilFormattedTime } = formatDateTime(parkingUntil);

    // Check-in case
    if (reservation.status === "Reserved") {
      const responseData = {
        reservation_id: reservation.id,
        status: reservation.status,
      };

      const encryptedData = encrypt(responseData);

      res.json({
        step: "checkin",
        message: "User is ready to check in",
        QRCode: encryptedData,
        reservation_id: reservation.id,
        user_id: user.id,
        car_id: reservation.verified_car.id,
        license_no: reservation.verified_car.license_no,
        building_name: reservation.parking_slot.floor.building.name,
        floor_name: reservation.parking_slot.floor.name,
        slot_name: reservation.parking_slot.name,
        reserve_date: reserveDate, // "17 Sep 2024"
        reserve_time: reserveFormattedTime, // "03:30 PM"
        expire_time: expireFormattedTime // "04:00 PM"
      });

      return;
    }

    // Check-out case
    else if (reservation.status === "Occupied") {
      const responseData = {
        reservation_id: reservation.id,
        car_id: reservation.car_id,
        status: reservation.status,
        slot_id: reservation.parking_slot.id,
      };

      const encryptedData = encrypt(responseData);

      res.json({
        step: "checkout",
        message: "User is ready to check out",
        QRCode: encryptedData,
        reservation_id: reservation.id,
        user_id: user.id,
        car_id: reservation.car_id,
        license_no: reservation.verified_car.license_no,
        building_name: reservation.parking_slot.floor.building.name,
        floor_name: reservation.parking_slot.floor.name,
        slot_name: reservation.parking_slot.name,
        reserve_date: reserveDate, // "17 Sep 2024"
        reserve_time: reserveFormattedTime, // "03:30 PM"
        parking_until: parkingUntilFormattedTime, // e.g., "07:30 PM"
      });

      return;
    }

    return res.status(400).json({
      message: "Invalid reservation status.",
    });

  } catch (error) {
    console.error("Error fetching checking status:", error);
    res.status(500).json({ error: "Error fetching checking status" });
  }
};

export { getChecking };