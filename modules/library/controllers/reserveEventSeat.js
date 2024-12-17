import prisma from "../../../core/db/prismaInstance.js";

const reserveEventSeat = async (req, res) => {
  const { library_event_id } = req.body;
  const user_id = req.user.id;
  const student_id = req.user.studentId;

  try {
    console.log("Received Request:", { user_id, student_id, library_event_id });

    // Step 1: Fetch the event
    const event = await prisma.library_event.findUnique({
      where: { id: library_event_id },
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const eventDay = new Date(event.event_date).toLocaleString("en-US", {
      weekday: "long",
    });
    const eventStartTime = event.event_date.toISOString().slice(11, 19); // HH:mm:ss
    const eventEndTime = new Date(
      new Date(event.event_date).getTime() + 2 * 60 * 60 * 1000 // Assuming 2 hours duration
    )
      .toISOString()
      .slice(11, 19);

    console.log(
      `Event Day: ${eventDay}\nEvent Start Time: ${eventStartTime} Event End Time: ${eventEndTime}`
    );

    // Step 2: Fetch sections where the student is enrolled and status is Active
    const userSections = await prisma.section.findMany({
      where: {
        day: eventDay, // Match the day of the event
        enrollment_detail: {
          some: {
            student_id: student_id,
            status: "Active",
          },
        },
      },
      select: {
        start_time: true,
        end_time: true,
      },
    });

    // Helper function to format the time
    const formatTime = (time) => {
      if (typeof time === "string") {
        return time.slice(0, 8); // Already a string, slice HH:mm:ss
      } else if (time instanceof Date) {
        return time.toISOString().slice(11, 19); // Convert Date object to HH:mm:ss
      }
      return "Invalid Time";
    };

    // Log user-enrolled sections in readable format
    const formattedSections = userSections.map((section) => ({
      start_time: formatTime(section.start_time),
      end_time: formatTime(section.end_time),
    }));

    console.log("User Enrolled Sections:", formattedSections);

    // Step 3: Check for time overlap
    const hasTimeOverlap = formattedSections.some((section) => {
      return (
        (eventStartTime >= section.start_time &&
          eventStartTime < section.end_time) ||
        (eventEndTime > section.start_time &&
          eventEndTime <= section.end_time) ||
        (eventStartTime <= section.start_time &&
          eventEndTime >= section.end_time)
      );
    });

    if (hasTimeOverlap) {
      return res
        .status(400)
        .json({ error: "Event time overlaps with your class schedule" });
    }

    // Step 4: Check seat availability
    if (event.reserve_seat >= event.total_seat) {
      return res
        .status(400)
        .json({ error: "No seats available for this event" });
    }

    // Step 5: Check if user already reserved a seat
    const existingReservation =
      await prisma.library_event_reservation.findFirst({
        where: {
          user_id,
          library_event_id,
        },
      });

    if (existingReservation) {
      return res
        .status(400)
        .json({ error: "You have already reserved a seat for this event" });
    }

    // Step 6: Reserve the seat
    await prisma.library_event_reservation.create({
      data: {
        user_id,
        library_event_id,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    // Step 7: Update the reserved seats count
    await prisma.library_event.update({
      where: { id: library_event_id },
      data: { reserve_seat: { increment: 1 } },
    });

    return res.status(200).json({ message: "Seat reserved successfully" });
  } catch (error) {
    console.error("Error reserving seat:", error);
    return res.status(500).json({ error: "Error reserving seat" });
  }
};

export { reserveEventSeat };
