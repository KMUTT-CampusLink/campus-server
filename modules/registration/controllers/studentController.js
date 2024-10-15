import prisma from "../../../core/db/prismaInstance.js";

export default async function studentController(req, res) {
  const { userId } = req.params;

  try {
    const result = await prisma.$queryRaw`
      SELECT 
        s.id AS studentId,
        s.firstname AS firstName,
        s.lastname AS lastName,
        p.name AS programName,
        f.name AS facultyName
      FROM 
        student s
      JOIN 
        program_batch pb ON s.program_batch_id = pb.id
      JOIN 
        degree d ON pb.degree_id = d.id
      JOIN 
        program p ON d.program_id = p.id
      JOIN 
        faculty f ON p.faculty_id = f.id
      WHERE 
        s.user_id = CAST(${userId} AS UUID);
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: "Student data not found" });
    }

    const student = result[0];  // Get the first result from the query
    res.json(student);
  } catch (error) {
    console.error("Error fetching student data:", error);
    res.status(500).json({ error: "Failed to fetch student data" });
  }
}