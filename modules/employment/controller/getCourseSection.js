import prisma from "../../../core/db/prismaInstance.js";

const getCourseSection = async (req, res) => {
  const { code } = req.params;

  try {
    if (!code) {
      return res.status(400).json({ error: "Course Code is required." });
    }

    // Check if the course exists
    const existingCourse = await prisma.course.findUnique({
      where: { code },
    });

    if (!existingCourse) {
      return res.status(404).json({ error: "Course not found." });
    }

    // Fetch professors and sections related to the course code
    const data = await prisma.section.findMany({
      where: {
        course_code: code, // Filter sections by course_code
      },
      select: {
        id: true,
        name: true,
        day: true,
        start_time: true,
        end_time: true,
        room: {
          select: {
            name: true,
          },
        },
        course: {
          select: {
            name: true,
            code: true,
          },
        },
        professor: {
          select: {
            employee: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
              },
            },
          },
        },
      },
    });
    const formatTime24Hour = (dateTime) => {
      const date = new Date(dateTime);
      const hours = String(date.getUTCHours()).padStart(2, "0");
      const minutes = String(date.getUTCMinutes()).padStart(2, "0");
      return `${hours}:${minutes}`;
    };

    // Format start_time and end_time for all sections
    const formattedData = data.map((section) => ({
      ...section,
      start_time: formatTime24Hour(section.start_time),
      end_time: formatTime24Hour(section.end_time),
    }));

    res.json(formattedData);
  } catch (error) {
    console.error("Error fetching course sections:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default getCourseSection;
