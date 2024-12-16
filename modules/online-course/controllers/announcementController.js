import prisma from "../../../core/db/prismaInstance.js";

export const createAnnouncement = async (req, res) => {
  try {
    // Extract data from the request body
    const { title, content, section_id, emp_id, start_date, end_date } =
      req.body;

    // Basic validation
    if (!title || !section_id || !emp_id) {
      return res
        .status(400)
        .json({ error: "Title, section_id, and professor_id are required." });
    }

    const professorResult = await prisma.$queryRaw`
  SELECT id FROM professor WHERE emp_id = ${emp_id}`;

    // Extract professor_id from the result
    const professor_id = professorResult?.[0]?.id;

    // Create the course announcement in the database
    const newAnnouncement = await prisma.course_announcement.create({
      data: {
        title,
        content,
        section_id: section_id ? parseInt(section_id, 10) : null,
        professor_id: professor_id ? parseInt(professor_id, 10) : null,
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

export const deleteAnnouncement = async (req, res) => {
  try {
    // Extract empID and announcementID from the request parameters
    const { empID, announcementID } = req.body;

    console.log(req.body);

    console.log(empID, announcementID);
    // Basic validation
    if (!empID || !announcementID) {
      return res
        .status(400)
        .json({ error: "empID and announcementID are required." });
    }

    // Find the professor_id based on empID
    const professorResult = await prisma.$queryRaw`
      SELECT id FROM professor WHERE emp_id = ${empID}`;

    const professor_id = professorResult?.[0]?.id;

    if (!professor_id) {
      return res
        .status(404)
        .json({ error: "Professor not found with the given empID." });
    }

    // Delete the announcement by announcementID
    const deletedAnnouncement = await prisma.course_announcement.delete({
      where: {
        id: parseInt(announcementID, 10),
        professor_id: parseInt(professor_id, 10),  // Ensure the announcement belongs to the professor
      },
    });

    // Respond with a success message
    res.status(200).json({
      message: "Announcement deleted successfully.",
      announcement: deletedAnnouncement,
    });
  } catch (error) {
    console.error("Error deleting course announcement:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the announcement." });
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

export const getAnnouncementByProfessor = async (req, res) => {
  try {
    // Extract empID and sectionID from the request parameters
    const { empID, sectionID } = req.params;

    // Validate empID and sectionID
    if (!empID || !sectionID) {
      return res.status(400).json({ error: "empID and sectionID are required." });
    }

    // Fetch the professor's ID based on empID
    const professorResult = await prisma.$queryRaw`
      SELECT id FROM professor WHERE emp_id = ${empID}`;

    const professor_id = professorResult?.[0]?.id;

    if (!professor_id) {
      return res
        .status(404)
        .json({ error: "Professor not found with the given empID." });
    }

    // Get the current date and time
    const currentDate = new Date();

    // Fetch the upcoming announcement for the given section and professor
    const upcomingAnnouncement = await prisma.course_announcement.findMany({
      where: {
        section_id: parseInt(sectionID, 10),
        professor_id: parseInt(professor_id, 10),
        end_date: {
          gte: currentDate, // Only include announcements with end_date >= current date
        },
      },
      orderBy: {
        end_date: "asc", // Sort by end_date in ascending order
      },
    });

    if (!upcomingAnnouncement) {
      return res
        .status(404)
        .json({ error: "No upcoming announcement found for the given section and professor." });
    }

    // Respond with the upcoming announcement
    res.status(200).json({
      message: "Upcoming announcement retrieved successfully",
      announcement: upcomingAnnouncement,
    });
  } catch (error) {
    console.error("Error retrieving upcoming announcement:", error);
    res.status(500).json({
      error: "An error occurred while fetching the announcement.",
    });
  }
};


