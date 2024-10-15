import prisma from "../../../core/db/prismaInstance.js";

export default async function studentController(req, res) {
  const { userId } = req.params;

  try {
    const student = await prisma.student.findFirst({
      where: { user_id: userId },
      include: {
        program_batch: {
          include: {
            degree: {
              include: {
                program: {
                  include: {
                    faculty: true, 
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!student) {
      return res.status(404).json({ error: "Student data not found" });
    }
    const response = {
      studentId: student.id,
      firstName: student.firstname,
      lastName: student.lastname,
      programName: student.program_batch.degree.program.name,
      facultyName: student.program_batch.degree.program.faculty.name,
    };
    res.json(response);
  } catch (error) {
    console.error("Error fetching student data:", error);
    res.status(500).json({ error: "Failed to fetch student data" });
  }
}
