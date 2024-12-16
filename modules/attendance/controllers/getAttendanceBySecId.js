import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getAttendanceBySecId = async (req, res) => {
  try {
    const { sectionID } = req.params;
    if (!sectionID) {
      return res.status(400).json("No Section Id");
    }

    const attendanceData = await prisma.class_attendance.findMany({
      where: {
        section: {
          id: Number(sectionID),  // This should work correctly with the updated filter
        },
      },
      include: {
        student: true, 
        section: true,
      },
    });

    return res.status(200).json({
      success: true,
      data: attendanceData,
    });
  } catch (error) {
    console.error("Error fetching attendance data:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch attendance data",
    });
  }
};

export default getAttendanceBySecId;