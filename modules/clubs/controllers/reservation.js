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

    // Insert into `invoice`
    const newInvoice = await prisma.invoice.create({
      data: {
        user_id: userId,
        issued_by: "Club",
        amount: parseFloat(price),
        due_date: dueDate,
        title: `${title} Ticket Fee`,
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
      data: { reservation, invoice: newInvoice },
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

// export const getJoinedEvents = async (req, res) => {
//   const { studentId } = req.params;

//   try {
//     // Fetch the user_id associated with the student_id
//     const student = await prisma.student.findUnique({
//       where: { id: studentId },
//       select: { user_id: true }, // Fetch only the user_id
//     });

//     if (!student) {
//       return res.status(404).json({ success: false, message: "Student not found" });
//     }

//     // Fetch joined events using the user_id
//     const events = await prisma.event_reservation.findMany({
//       where: {
//         user_id: student.user_id, // Use the user_id fetched from the student relation
//       },
//       include: {
//         club_announcement: {
//           select: {
//             id: true,
//             title: true,
//             date: true,
//             location: true,
//           },
//         },
//       },
//     });

//     if (!events || events.length === 0) {
//       return res.status(200).json({ success: true, data: [] });
//     }

//     const joinedEvents = events.map((event) => ({
//       id: event.club_announcement.id,
//       title: event.club_announcement.title,
//       date: event.club_announcement.date,
//       location: event.club_announcement.location || "Not Specified",
//     }));

//     res.status(200).json({ success: true, data: joinedEvents });
//   } catch (error) {
//     console.error("Error fetching joined events:", error);
//     res.status(500).json({ success: false, message: "Failed to fetch events" });
//   }
// };

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
