import prisma from "../../../core/db/prismaInstance.js"; // Import Prisma

export const getAllAnnouncements = async (req, res) => {
    try {
        const announcements = await prisma.club_announcement.findMany({
        select: {
            id: true,
            title: true,
            content: true,
            club: {
            select: {
                name: true,
            },
            },
        },
        });
        return res.status(200).json({ success: true, data: announcements });
    } catch (error) {
        console.error("Failed to fetch announcements:", error);
        return res
        .status(500)
        .json({ success: false, message: "Failed to fetch announcements" });
    }
    };

// Get announcement by ClubID
export const getAnnouncementsByClubId = async (req, res) => {
  const { clubId } = req.params;

  try{
    const announcements = await prisma.club_announcement.findMany({
      where: {
        club_id: parseInt(clubId),
      },
      orderBy: { is_pinned: "desc"},
      select: {
        id: true,
        title: true,
        content: true,
        date: true,
        start_time: true,
        end_time: true,
        location: true,
        is_pinned: true,
        max_seats: true,
        reserved_seats: true,
        price: true,
        club: {
          select: {
            name: true,
          },
        },
      },
    });
    return res.status(200).json({ success: true, data: announcements });
  } catch (error) {
    console.error("Failed to fetch announcements:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch announcements" });
  }
};

export const getAnnouncementPriceById = async (req, res) => {
  const { announcementId } = req.params;

  try {
    // Fetch the announcement with the specific ID
    const announcement = await prisma.club_announcement.findUnique({
      where: { id: parseInt(announcementId) },
      select: {
        id: true,
        price: true,
      },
    });

    // Handle case where announcement is not found
    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    // Return the price of the announcement
    return res.status(200).json({
      success: true,
      data: { price: announcement.price },
    });
  } catch (error) {
    console.error("Failed to fetch announcement price:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch announcement price",
    });
  }
};

export const createAnnouncement = async (req, res) => {
  const { announcementTitle, announcementContent, eventDate, eventTimeFrom, eventTimeTo, eventPlace, seats, ticketAmount } = req.body;
  const { clubId } = req.params;
  console.log("Raw request body:", req.body);
  
  //const memberId = 1003;
  //console.log("Data:", data);
  const startDateTime = `${eventDate} ${eventTimeFrom}:00`;
  const endDateTime = `${eventDate} ${eventTimeTo}:00`;

  // Debugging logs
  console.log("Inserting DateTime as:", { startDateTime, endDateTime });

  console.log("Received data:", {
    announcementTitle,
    announcementContent,
    eventDate,
    eventPlace,
    seats,
    ticketAmount,
  });

  try {
    const data = await prisma.club_member.findFirst({
      where: {
        club_id: parseInt(clubId),
        is_admin: true,   
      },
      select: {
        id: true,
      },
    });
    console.log("Data:", data);
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Admin not found for the specified club.",
      });
    }
    const newAnnouncement = await prisma.$executeRaw`
      INSERT INTO club_announcement (title, content, date, start_time, end_time, location, max_seats, price, club_id, member_id)
      VALUES (${announcementTitle}, ${announcementContent}, ${eventDate}::date, ${startDateTime}::timestamp, ${endDateTime}::timestamp, ${eventPlace}, ${parseInt(seats)}, ${parseFloat(ticketAmount)}, ${parseInt(clubId)}, ${data.id});
    `;
    return res.status(201).json({
      success: true,
      message: "Announcement created successfully.",
      data: newAnnouncement,
    });
  } catch (error) {
    console.error("Error creating announcement:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while creating the announcement.",
      error: error.message,
    });
  }
};

// Toggle pin status for an announcement
export const toggleAnnouncementPin = async (req, res) => {
  const { id } = req.params;

  try {
      const announcement = await prisma.club_announcement.findUnique({
          where: { id: parseInt(id) },
      });

      if (!announcement) {
          return res.status(404).json({ success: false, message: "Announcement not found" });
      }

      const updatedAnnouncement = await prisma.club_announcement.update({
          where: { id: parseInt(id) },
          data: { is_pinned: !announcement.is_pinned },
      });

      return res.status(200).json({ success: true, data: updatedAnnouncement });
  } catch (error) {
      console.error("Error toggling announcement pin status:", error);
      return res.status(500).json({ success: false, message: "Failed to toggle announcement pin status" });
  }
};

// Delete an announcement
// export const deleteAnnouncement = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const announcement = await prisma.club_announcement.findUnique({
//       where: { id: parseInt(id) },
//     });

//     if (!announcement) {
//       return res.status(404).json({ success: false, message: "Announcement not found" });
//     }

//     await prisma.club_announcement.delete({
//       where: { id: parseInt(id) },
//     });

//     return res.status(200).json({ success: true, message: "Announcement deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting announcement:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to delete announcement",
//       error: error.message,
//     });
//   }
// };

export const deleteAnnouncement = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the announcement exists
    const announcement = await prisma.club_announcement.findUnique({
      where: { id: parseInt(id) },
    });

    if (!announcement) {
      return res.status(404).json({ success: false, message: "Announcement not found" });
    }

    // Step 1: Fetch related event_reservations for this announcement
    const reservations = await prisma.event_reservation.findMany({
      where: { club_announcement_id: parseInt(id) },
      select: { invoice_id: true },
    });

    // Step 4: Delete the announcement itself
    await prisma.club_announcement.delete({
      where: { id: parseInt(id) },
    });

    // Step 3: Delete related event_reservations
    await prisma.event_reservation.deleteMany({
      where: { club_announcement_id: parseInt(id) },
    });

     // Step 2: Delete related invoices
     const invoiceIds = reservations.map(res => res.invoice_id).filter(id => id); // Remove nulls
     if (invoiceIds.length > 0) {
       await prisma.invoice.deleteMany({
         where: { id: { in: invoiceIds } },
       });
     }

    return res.status(200).json({ success: true, message: "Announcement and related data deleted successfully" });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete announcement",
      error: error.message,
    });
  }
};


// Update an announcement
export const updateAnnouncement = async (req, res) => {
  const {id} = req.params;
  console.log("Received ID:", id);
  const {
    title,
    content,
    date,
    start_time = "00:00",
    end_time = "00:00",
    location,
    max_seats,
    price,
  } = req.body;
  
  console.log("Received Data:", { title, content, date, start_time, end_time, location, max_seats, price });

  const startDateTime = `${date} ${start_time}:00`;
  const endDateTime = `${date} ${end_time}:00`;

  try {
    const existingAnnouncement = await prisma.$queryRaw`
      SELECT id FROM club_announcement WHERE id = ${parseInt(id)};
    `;

    if(!existingAnnouncement.length) {
      return res.status(404).json({ success: false, message: "Announcement not found" });
    }

    await prisma.$executeRaw`
      UPDATE club_announcement
      SET 
        title = ${title},
        content = ${content},
        date = ${date}::date,
        start_time = ${startDateTime}::timestamp,
        end_time = ${endDateTime}::timestamp,
        location = ${location},
        max_seats = ${parseInt(max_seats)},
        price = ${parseFloat(price)}
      WHERE id = ${parseInt(id)}
    `;

    const updatedAnnouncement = await prisma.$queryRaw`
      SELECT * FROM club_announcement WHERE id = ${parseInt(id)};
    `;

    return res.status(200).json({ success: true, message: "Event updated successfully", data: updatedAnnouncement[0] });
  } catch (error) {
    console.error("Error updating announcement:", error);
    return res.status(500).json({ success: false, message: "Failed to update event", error: error.message });
  }
};