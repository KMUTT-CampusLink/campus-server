import prisma from "../../../core/db/prismaInstance.js"; // Import Prisma

// Reserve a seat for an announcement
// export const reserveSeat = async (req, res) => {
//   const { id } = req.params;

//   try {
//     // Fetch the announcement by ID
//     const announcement = await prisma.club_announcement.findUnique({
//       where: { id: parseInt(id) },
//     });

//     if (!announcement) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Announcement not found" });
//     }

//     // Check if there are available seats
//     if (announcement.reserved_seat >= announcement.max_seats) {
//       return res.status(400).json({
//         success: false,
//         message: "No seats available for reservation",
//       });
//     }

//     // Increment the reserved_seat count
//     const updatedAnnouncement = await prisma.club_announcement.update({
//       where: { id: parseInt(id) },
//       data: { reserved_seats: announcement.reserved_seats + 1 },
//     });

//     return res.status(200).json({
//       success: true,
//       message: "Seat reserved successfully",
//       data: { reserved_seats: updatedAnnouncement.reserved_seats },
//     });
//   } catch (error) {
//     console.error("Error reserving seat:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to reserve seat",
//       error: error.message,
//     });
//   }
// };
export const reserveSeat = async (req, res) => {
    const { clubAnnouncementId, userId } = req.body;

    try {
        const announcement = await prisma.club_announcement.findUnique({
            where: { id: clubAnnouncementId },
            select: {
              price: true,
              reserved_seats: true,
              max_seats: true,
            },
          });
      
          if (!announcement) {
            return res.status(404).json({ success: false, message: "Announcement not found" });
          }
      
          if (announcement.reserved_seats >= announcement.max_seats) {
            return res
              .status(400)
              .json({ success: false, message: "No seats available for this event" });
          }
      
          const { price } = announcement;
      
          if (!price || isNaN(parseFloat(price))) {
            return res
              .status(400)
              .json({ success: false, message: "Invalid price for the announcement" });
          }
      // Step 1: Insert into `invoice`
      const newInvoice = await prisma.invoice.create({
        data: {
          user_id: userId,
          issued_by: "Club",
          amount: parseFloat(price),
        },
      });
  
      // Step 2: Insert into `event_reservation`
      const reservation = await prisma.event_reservation.create({
        data: {
          user_id: userId,
          club_announcement_id: clubAnnouncementId,
          invoice_id: newInvoice.id,
        },
      });
  
      // Step 3: Update `reserved_seats` in `club_announcement`
      await prisma.club_announcement.update({
        where: { id: clubAnnouncementId },
        data: {
          reserved_seats: {
            increment: 1, // Increment reserved_seats by 1
          },
        },
      });
  
      res.status(200).json({
        success: true,
        message: "Reservation successful",
        data: { reservation, invoice: newInvoice },
      });
    } catch (error) {
      console.error("Error reserving event:", error);
      res.status(500).json({ success: false, message: "Reservation failed" });
    }
  };
  