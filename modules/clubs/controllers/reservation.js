import prisma from "../../../core/db/prismaInstance.js"; // Import Prisma

export const reserveSeat = async (req, res) => {
  const { clubAnnouncementId, userId } = req.body;

  try {
    const announcement = await prisma.club_announcement.findUnique({
      where: { id: clubAnnouncementId },
      select: {
        title: true,
        price: true,
        reserved_seats: true,
        max_seats: true,
      },
    });

    if (!announcement) {
      return res
        .status(404)
        .json({ success: false, message: "Announcement not found" });
    }

    if (announcement.reserved_seats >= announcement.max_seats) {
      return res
        .status(400)
        .json({ success: false, message: "No seats available for this event" });
    }

    const { title, price } = announcement;

    if (!price || isNaN(parseFloat(price))) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Invalid price for the announcement",
        });
    }

    const issuedDate = new Date();
    const dueDate = new Date(issuedDate.getTime() + 24 * 60 * 60 * 1000); // Add 24 hours

    // Check if there is a cancelled invoice for this user and announcement
    let existingInvoice = await prisma.invoice.findFirst({
      where: {
        user_id: userId,
        title: `${title} Ticket Fee`,
        status: "Cancelled",
      },
    });

    if (existingInvoice) {
      // Update the cancelled invoice status to "Unpaid"
      existingInvoice = await prisma.invoice.update({
        where: { id: existingInvoice.id },
        data: { status: "Unpaid", due_date: dueDate },
      });
    } else {
      // Insert into invoice if no cancelled invoice exists
      existingInvoice = await prisma.invoice.create({
        data: {
          user_id: userId,
          issued_by: "Club",
          amount: parseFloat(price),
          due_date: dueDate,
          title: `${title} Ticket Fee`,
          status: "Unpaid",
        },
      });
    }

    // Insert into event_reservation
    const reservation = await prisma.event_reservation.create({
      data: {
        user_id: userId,
        club_announcement_id: clubAnnouncementId,
        invoice_id: existingInvoice.id,
      },
    });

    // Update reserved seats
    const updatedAnnouncement = await prisma.club_announcement.update({
      where: { id: clubAnnouncementId },
      data: {
        reserved_seats: {
          increment: 1,
        },
      },
    });

    console.log(updatedAnnouncement);

    res.status(200).json({
      success: true,
      message: "Reservation successful",
      data: { reservation, invoice: existingInvoice },
    });
  } catch (error) {
    console.error("Error reserving event:", error);
    res.status(500).json({ success: false, message: "Reservation failed" });
  }
};


export const getReservationStatus = async (req, res) => {
  const { clubAnnouncementId, userId } = req.body;

  try {
    const reservation = await prisma.event_reservation.findFirst({
      where: {
        user_id: userId,
        club_announcement_id: clubAnnouncementId,
      },
      include: {
        invoice: {
          select: { status: true, id: true },
        },
      },
    });

    if (!reservation) {
      return res.status(200).json({ success: true, status: "Unreserved" });
    }

    const invoiceStatus = reservation.invoice?.status || "Unreserved";
    const invoiceId = reservation.invoice?.id || null;
    res.status(200).json({ success: true, status: invoiceStatus, invoiceId });
  } catch (error) {
    console.error("Error fetching reservation status:", error);
    res.status(500).json({ success: false, message: "Failed to fetch status" });
  }
};

export const cancelReservation = async (req, res) => {
  const { reservationId } = req.body;

  try {
    const reservation = await prisma.event_reservation.findUnique({
      where: { id: reservationId },
      include: { club_announcement: true },
    });

    if (!reservation) {
      return res
        .status(404)
        .json({ success: false, message: "Reservation not found" });
    }

    // Decrement reserved seats
    await prisma.club_announcement.update({
      where: { id: reservation.club_announcement_id },
      data: {
        reserved_seats: {
          decrement: 1,
        },
      },
    });

    // Delete the reservation record
    await prisma.event_reservation.delete({
      where: { id: reservation.id },
    });

    res.status(200).json({
      success: true,
      message: "Reservation cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling reservation:", error);
    res.status(500).json({ success: false, message: "Failed to cancel" });
  }
};

export const getJoinedEvents = async (req, res) => {
  const { memberId } = req.params; // Correct parameter name
  console.log("Received memberId:", memberId); // Debug log

  if (!memberId) {
    return res.status(400).json({ success: false, message: "Member ID is required" });
  }

  try {
    let userId = null;

    // Check if the member is a student
    const student = await prisma.student.findUnique({
      where: { id: memberId }, // Use memberId as studentId
      select: { user_id: true },
    });

    if (student) {
      userId = student.user_id;
    } else {
      // If not a student, check if the member is an employee
      const employee = await prisma.employee.findUnique({
        where: { id: memberId }, // Use memberId as employeeId
        select: { user_id: true },
      });

      if (employee) {
        userId = employee.user_id;
      }
    }

    if (!userId) {
      return res.status(404).json({ success: false, message: "Member not found" });
    }

    // Fetch joined events using the user_id
    const events = await prisma.event_reservation.findMany({
      where: { user_id: userId },
      include: {
        club_announcement: {
          select: {
            id: true,
            title: true,
            date: true,
            location: true,
          },
        },
      },
    });

    if (!events || events.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    const joinedEvents = events.map((event) => ({
      id: event.club_announcement.id,
      title: event.club_announcement.title,
      date: event.club_announcement.date,
      location: event.club_announcement.location || "Not Specified",
    }));

    res.status(200).json({ success: true, data: joinedEvents });
  } catch (error) {
    console.error("Error fetching joined events:", error);
    res.status(500).json({ success: false, message: "Failed to fetch events" });
  }
};

export const getEventParticipants = async (req, res) => {
  const { id } = req.params; // Extract the announcement ID
  console.log(`Announcement ID: ${id}`);
  
  try {
    // Fetch participants with their invoices and user info
    const participants = await prisma.event_reservation.findMany({
      where: { club_announcement_id: parseInt(id) }, // Filter by announcement ID
      include: {
        invoice: {
          select: {
            status: true,
            created_at: true, // Select the created_at field to determine the latest invoice
          },
        },
        user: {
          include: {
            student: {
              select: { firstname: true, midname: true, lastname: true, id: true },
            },
            employee: {
              select: { firstname: true, midname: true, lastname: true, id: true },
            },
          },
        },
      },
    });

    console.log('Participants fetched:', participants);  // Log participants

    // Create a map to store the latest invoice per user
    const uniqueParticipants = new Map();

    participants.forEach((participant) => {
      // Get the user ID (either student or employee)
      const userId = participant.user?.student?.id || participant.user?.employee?.id;
      
      console.log(`Processing participant with userId: ${userId}`); // Log userId being processed

      // Check if the participant already exists in the map
      if (userId) {
        if (
          !uniqueParticipants.has(userId) || 
          participant.invoice.created_at > uniqueParticipants.get(userId).invoice.created_at
        ) {
          // Update the map with the latest invoice for each user
          uniqueParticipants.set(userId, participant);
        }
      }
    });

    console.log('Unique participants after filtering:', uniqueParticipants); // Log filtered data

    // Convert the map to an array of unique participants
    const filteredParticipants = Array.from(uniqueParticipants.values());

    if (filteredParticipants.length > 0) {
      // Send the response with filtered participants
      res.status(200).json({ data: filteredParticipants });
    } else {
      console.log('No participants found after filtering');
      res.status(404).json({ error: 'No participants found for this event.' });
    }

  } catch (error) {
    console.error("Error fetching participants:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
