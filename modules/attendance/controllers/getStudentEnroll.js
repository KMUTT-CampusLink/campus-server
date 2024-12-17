import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getEnrollStudent = async (req, res) => {
  try {
    const { sectionID } = req.params;
    if (!sectionID) {
      return res.status(400).json("No Section Id");
    }

    const enrollStudent = await prisma.enrollment_detail.findMany({
      where: {
          section_id: Number(sectionID),
      },
      select: {
        section_id: true,
          student: {
            select:{
              firstname: true,
              lastname: true,
              id: true,
            }
        }
      },
      orderBy:{
        student:{
          id: 'asc',
        }
      }
    });

    return res.status(200).json({
      success: true,
      data: enrollStudent,
    });
  } catch (error) {
    console.error("Error fetching attendance data:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch attendance data",
    });
  }
};

export default getEnrollStudent;