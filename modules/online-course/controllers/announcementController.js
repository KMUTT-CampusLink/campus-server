import prisma from "../../../core/db/prismaInstance.js";

export const createAnnouncement = async (req, res) => {

  try {
    // Extract data from the request body
    const { title, content, section_id, professor_id, start_date, end_date } =
      req.body;

    // Basic validation
    if (!title || !section_id || !professor_id) {
      return res
        .status(400)
        .json({ error: "Title, section_id, and professor_id are required." });
    }

    // Create the course announcement in the database
    const newAnnouncement = await prisma.course_announcement.create({
      data: {
        title,
        content,
        section_id,
        professor_id,
        start_date: start_date ? new Date(start_date) : null,
        end_date: end_date ? new Date(end_date) : null,
      },
    });

    // Respond with the created announcement
    res.status(201).json({
      message: "Course announcement created successfully",
      announcement: newAnnouncement,
    });
  } catch (error) {
    console.error("Error creating course announcement:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the announcement." });
  }
};

export const getUpComingAnnouncement = async (req, res) => {
  try {
    // Extract the sectionID from the request parameters
    const { sectionID } = req.params;

    // Validate sectionID
    if (!sectionID) {
      return res.status(400).json({ error: "Section ID is required." });
    }

    // Get the current date and time
    const currentDate = new Date();

    // Query the database for announcements whose end_date is greater than today
    const upcomingAnnouncements = await prisma.course_announcement.findMany({
      where: {
        section_id: parseInt(sectionID, 10),
        end_date: {
          gte: currentDate, // Filter announcements with end_date greater than or equal to today's date
        },
      },
      orderBy: {
        end_date: "asc", // Sort by end_date in ascending order
      },
    });

    // Respond with the list of upcoming announcements
    res.status(200).json({
      message: "Upcoming announcements retrieved successfully",
      announcements: upcomingAnnouncements,
    });
  } catch (error) {
    console.error("Error retrieving upcoming announcements:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching announcements." });
  }
};