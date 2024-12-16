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
    // Extract the studentID from the request parameters
    const { studentID } = req.params;

    // Validate studentID
    if (!studentID) {
      return res.status(400).json({ error: "Student ID is required." });
    }

    // Fetch the section IDs associated with the student
    const courses = await prisma.$queryRaw`
      SELECT ed.section_id AS sectionId
      FROM enrollment_detail ed
      JOIN section s ON ed.section_id = s.id
      JOIN semester sem ON s.semester_id = sem.id
      JOIN course c ON s.course_code = c.code
      WHERE ed.student_id = ${studentID}`;

    console.log(courses);
    // Check if courses were found
    if (!courses || courses.length === 0) {
      return res
        .status(404)
        .json({ error: "No courses found for the student." });
    }

    // Extract section IDs into an array
    const sectionIds = courses.map((course) => course.sectionid);

    // Get the current date and time
    const currentDate = new Date();

    // Fetch all upcoming announcements for the student's sections
    const allUpcomingAnnouncements = await prisma.course_announcement.findMany({
      where: {
        section_id: { in: sectionIds }, // Filter by the list of section IDs
        end_date: {
          gte: currentDate, // Only include announcements with end_date >= current date
        },
      },
      orderBy: {
        end_date: "asc", // Sort by end_date in ascending order
      },
    });

    // Respond with the list of upcoming announcements
    res.status(200).json({
      message: "Upcoming announcements retrieved successfully",
      announcements: allUpcomingAnnouncements,
    });
  } catch (error) {
    console.error("Error retrieving upcoming announcements:", error);
    res.status(500).json({
      error: "An error occurred while fetching announcements.",
    });
  }
};
