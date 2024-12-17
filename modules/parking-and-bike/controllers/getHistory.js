import prisma from "../../../core/db/prismaInstance.js";

const getHistory = async (req, res) => {
  const user = req.user;

  try {
    const reservations = await prisma.parking_reservation.findMany({
      where: {
        verified_car: {
          user_id: user.id
        },
      },
      include: {
        invoice: true
      },
    });

    // Check if there are no reservations
    if (!reservations || reservations.length === 0) {
      return res.status(200).json({
        message: "No history available for this user."
      });
    }

    const history = reservations.map(reservation => {
      const date = new Date(reservation.reserve_time);

      // Format date (e.g., 17 Sep 2024)
      const day = date.getDate();
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();
      const formattedDate = `${day} ${month} ${year}`;

      // Format time (e.g., 11:30 AM)
      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      const formattedTime = `${hours}:${minutes} ${ampm}`;

      return {
        reservation_id: reservation.id,
        car_id: reservation.car_id,
        parking_slot_id: reservation.parking_slot_id,
        status: reservation.status,
        reserve_date: formattedDate, // e.g., "17 Sep 2024"
        reserve_time: formattedTime, // e.g., "11:30 AM"
        amount: reservation.invoice ? reservation.invoice.amount : null
      };
    });

    res.status(200).json({
      message: "History fetched successfully.",
      user_id: user.id,
      history: history
    });

  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ error: "Error fetching history" });
  }
};

export { getHistory };  