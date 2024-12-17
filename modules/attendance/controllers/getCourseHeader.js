import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getCourseDetail = async (req, res) => {
  try {
    const { sectionID } = req.params;
    if (!sectionID) {
      return res.status(400).json({ success: false, message: "No Section Id provided" });
    }

    const courseData = await prisma.section.findFirst({
      where: {
        id: Number(sectionID),
      },
      select: {
        id: true,
        day: true,
        start_time: true,
        end_time:true,
        course: {
          select: {
            code: true, 
            name: true,  
          },
        },
        professor: {
          select: {
            employee: {  
              select: {
                firstname: true, 
                lastname: true,
              },
            },
          },
        },
      },
    });

    if (!courseData) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }

    return res.status(200).json({
      success: true,
      data: courseData,
    });
  } catch (error) {
    console.error("Error fetching course data:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch course data",
    });
  }
};

export default getCourseDetail;
